import { WxData } from "../schema/response";

interface AtmosStatus {
    current_a: number;
    status: 1 | 2 | 3;
    message: string;
}

// 標準気圧 (hPa)
const STANDARD_PRESSURE = 1013.25;

// 気圧データから天気痛リスクを判断する
export function createAtmosStatus(wdata: WxData, hours: number = 12): AtmosStatus {
    // 指定時間分のデータを取得
    const srfData = wdata.srf.slice(0, hours);

    if (srfData.length === 0) {
        return {
            current_a: 0,
            status: 2,
            message: "気圧データがないため、判断できません。"
        };
    }

    // 有効な気圧データのみ抽出（欠測値-9999を除外）
    const validArpress = srfData.filter(d => d.arpress !== -9999).map(d => d.arpress);

    if (validArpress.length === 0) {
        return {
            current_a: 0,
            status: 2,
            message: "気圧データが取得できませんでした。"
        };
    }

    // 現在の気圧（最初のデータ）
    const currentPressure = validArpress[0];

    // 気圧の統計
    const minPressure = Math.min(...validArpress);
    const maxPressure = Math.max(...validArpress);

    // 気圧変化量を計算（最初と最後の差、または最大変動幅）
    const pressureChange = validArpress.length > 1
        ? validArpress[validArpress.length - 1] - validArpress[0]
        : 0;
    const pressureRange = maxPressure - minPressure;

    // 判断ロジック
    // status 3: 影響が大きい（低気圧または急激な変化）
    if (currentPressure < 1000) {
        return {
            current_a: Math.round(currentPressure * 100) / 100,
            status: 3,
            message: "気圧がかなり低い状態です。頭痛やめまいなどの症状が出やすい状況です。無理をせずお過ごしください。"
        };
    }

    if (pressureRange >= 10) {
        return {
            current_a: Math.round(currentPressure * 100) / 100,
            status: 3,
            message: "気圧の変動が大きい予報です。天気痛の症状が出やすい状況です。体調管理にご注意ください。"
        };
    }

    if (pressureChange <= -8) {
        return {
            current_a: Math.round(currentPressure * 100) / 100,
            status: 3,
            message: "気圧が急激に下がる予報です。頭痛や関節痛などの症状にご注意ください。"
        };
    }

    // status 2: 注意が必要（やや低気圧または中程度の変化）
    if (currentPressure < 1006) {
        return {
            current_a: Math.round(currentPressure * 100) / 100,
            status: 2,
            message: "気圧がやや低めです。体調に変化を感じたら、早めに休息をとってください。"
        };
    }

    if (pressureRange >= 6 || pressureChange <= -5) {
        return {
            current_a: Math.round(currentPressure * 100) / 100,
            status: 2,
            message: "気圧に変化がある予報です。天気痛をお持ちの方は体調の変化にご注意ください。"
        };
    }

    if (currentPressure < 1010) {
        return {
            current_a: Math.round(currentPressure * 100) / 100,
            status: 2,
            message: "気圧は平均よりやや低めです。敏感な方は軽い不調を感じる可能性があります。"
        };
    }

    // status 1: 影響が少ない（高気圧・安定）
    if (currentPressure >= STANDARD_PRESSURE && pressureRange < 4) {
        return {
            current_a: Math.round(currentPressure * 100) / 100,
            status: 1,
            message: "気圧は安定しており、高気圧に覆われています。天気痛の心配は少ないでしょう。"
        };
    }

    return {
        current_a: Math.round(currentPressure * 100) / 100,
        status: 1,
        message: "気圧は安定しています。快適にお過ごしいただけそうです。"
    };
}

import { WxData } from "../schema/response";

interface LaundryStatus {
    status: 1 | 2 | 3;
    message: string;
}

// 気象データから洗濯物を干していいかどうかを判断する
export function createLaundryStatus(wdata: WxData, hours: number = 12): LaundryStatus {
    // 指定時間分のデータを取得
    const srfData = wdata.srf.slice(0, hours);

    if (srfData.length === 0) {
        return {
            status: 2,
            message: "気象データがないため、判断できません。"
        };
    }

    // 有効なデータのみ抽出（欠測値を除外）
    const validPrec = srfData.filter(d => d.prec !== -9999).map(d => d.prec);
    const validRhum = srfData.filter(d => d.rhum !== -99).map(d => d.rhum);
    const validWndspd = srfData.filter(d => d.wndspd !== -9999).map(d => d.wndspd);
    const validWx = srfData.filter(d => d.wx !== -9999).map(d => d.wx);

    // 統計値を計算
    const totalPrec = validPrec.length > 0 ? validPrec.reduce((a, b) => a + b, 0) : 0;
    const maxPrec = validPrec.length > 0 ? Math.max(...validPrec) : 0;
    const avgRhum = validRhum.length > 0 ? validRhum.reduce((a, b) => a + b, 0) / validRhum.length : 50;
    const avgWndspd = validWndspd.length > 0 ? validWndspd.reduce((a, b) => a + b, 0) / validWndspd.length : 0;

    // 雨・雪の天気コードがあるかチェック（300系=雨、400系=雪、850系=大雨、950系=大雪）
    const hasRainOrSnow = validWx.some(wx => {
        const category = Math.floor(wx / 100);
        return category === 3 || category === 4 || category === 8 || category === 9;
    });

    // 判断ロジック
    // status 3: 干すことができない
    if (maxPrec >= 1 || hasRainOrSnow) {
        return {
            status: 3,
            message: "雨や雪が予想されるため、洗濯物を干すのは避けてください。"
        };
    }

    if (avgRhum >= 80) {
        return {
            status: 3,
            message: "湿度が高いため、洗濯物が乾きにくい状況です。室内干しをおすすめします。"
        };
    }

    // status 2: 注意が必要
    if (totalPrec > 0 && totalPrec < 1) {
        return {
            status: 2,
            message: "弱い雨の可能性があります。様子を見ながら干してください。"
        };
    }

    if (avgRhum >= 70) {
        return {
            status: 2,
            message: "湿度がやや高めです。乾くまでに時間がかかる可能性があります。"
        };
    }

    if (avgWndspd < 1 && avgRhum >= 60) {
        return {
            status: 2,
            message: "風が弱く湿度もあるため、乾きにくい可能性があります。"
        };
    }

    // status 1: 干すことができる
    if (avgRhum < 50 && avgWndspd >= 3) {
        return {
            status: 1,
            message: "洗濯日和です。カラッと乾きそうです。"
        };
    }

    if (avgRhum < 60 && avgWndspd >= 2) {
        return {
            status: 1,
            message: "洗濯物を干すのに適した天気です。"
        };
    }

    return {
        status: 1,
        message: "洗濯物を干すことができます。"
    };
}

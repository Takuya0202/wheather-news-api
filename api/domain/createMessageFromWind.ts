import { WxData } from "../schema/response";

// 風速からその日の風のメッセージを生成する
export function createMessageFromWind(wdata: WxData, hours: number = 12): string {
    // 指定時間分のデータを取得
    const srfData = wdata.srf.slice(0, hours);

    if (srfData.length === 0) {
        return "風速データがありません";
    }

    // 有効な風速データのみ抽出（欠測値-9999を除外）
    const validWindSpeed = srfData.filter(d => d.wndspd !== -9999).map(d => d.wndspd);

    if (validWindSpeed.length === 0) {
        return "風速データが取得できませんでした";
    }

    // 平均風速と最大風速を計算
    const avgWindSpeed = validWindSpeed.reduce((a, b) => a + b, 0) / validWindSpeed.length;
    const maxWindSpeed = Math.max(...validWindSpeed);

    // 風速に基づいてメッセージを生成
    if (avgWindSpeed < 3) {
        return "風は穏やかで、過ごしやすい一日になりそうです。";
    } else if (avgWindSpeed < 5) {
        return "そよ風程度の風が吹く予報です。心地よく過ごせるでしょう。";
    } else if (avgWindSpeed < 8) {
        return "やや風がある予報です。帽子や軽いものが飛ばされないようご注意ください。";
    } else if (avgWindSpeed < 10) {
        return "風が強めの予報です。傘をさすのが難しくなることがあります。";
    } else if (avgWindSpeed < 15) {
        return "強風が予想されます。外出時は十分ご注意ください。飛来物にもお気をつけください。";
    } else {
        return "非常に強い風が予想されます。不要な外出は控え、安全を確保してください。";
    }
}
import { WxData } from "../schema/response";

// 相対湿度からその日の湿度のメッセージを生成する
export function createMessageFromHumidity(wdata: WxData, hours: number = 12): string {
    // 指定時間分のデータを取得
    const srfData = wdata.srf.slice(0, hours);

    if (srfData.length === 0) {
        return "湿度データがありません";
    }

    // 有効な湿度データのみ抽出（欠測値-99を除外）
    const validHumidity = srfData.filter(d => d.rhum !== -99).map(d => d.rhum);

    if (validHumidity.length === 0) {
        return "湿度データが取得できませんでした";
    }

    // 平均湿度を計算
    const avgHumidity = validHumidity.reduce((a, b) => a + b, 0) / validHumidity.length;

    // 湿度に基づいてメッセージを生成
    if (avgHumidity < 30) {
        return "非常に乾燥した状態が予想されます。こまめな水分補給と保湿対策をおすすめします。";
    } else if (avgHumidity < 40) {
        return "空気が乾燥しています。肌や喉の乾燥にご注意ください。";
    } else if (avgHumidity < 60) {
        return "快適な湿度です。過ごしやすい一日になりそうです。";
    } else if (avgHumidity < 70) {
        return "やや湿度が高めです。蒸し暑さを感じることがあるかもしれません。";
    } else if (avgHumidity < 80) {
        return "湿度が高く蒸し暑い状態が予想されます。通気性の良い服装でお出かけください。";
    } else {
        return "非常に湿度が高く、不快に感じやすい状態です。熱中症にも十分ご注意ください。";
    }
}
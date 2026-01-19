import { WxData } from "../schema/response";

interface ClothesSuggestion {
    summary: string;
    details: string[];
}

export function generateClothesSuggestion(wdata: WxData, hours: number = 12): ClothesSuggestion {
    // 指定時間分のデータを取得
    const srfData = wdata.srf.slice(0, hours);

    if (srfData.length === 0) {
        return {
            summary: "気象データがありません",
            details: [],
        };
    }

    // 有効なデータのみ抽出（欠測値を除外）
    const validTemps = srfData.filter(d => d.temp !== -9999).map(d => d.temp);
    const validFeelTemps = srfData.filter(d => d.feeltmp !== -9999).map(d => d.feeltmp);
    const validPrec = srfData.filter(d => d.prec !== -9999).map(d => d.prec);
    const validWndspd = srfData.filter(d => d.wndspd !== -9999).map(d => d.wndspd);

    // 気温の統計
    const minTemp = validTemps.length > 0 ? Math.min(...validTemps) : 0;
    const maxTemp = validTemps.length > 0 ? Math.max(...validTemps) : 0;
    const avgFeelTemp = validFeelTemps.length > 0
        ? validFeelTemps.reduce((a, b) => a + b, 0) / validFeelTemps.length
        : 0;

    // 降水・風のチェック
    const totalPrec = validPrec.reduce((a, b) => a + b, 0);
    const maxWndspd = validWndspd.length > 0 ? Math.max(...validWndspd) : 0;
    const rainExpected = totalPrec > 0.5;
    const windWarning = maxWndspd >= 8; // 8m/s以上で強風

    // 提案を生成
    const details: string[] = [];
    let summary = "";

    // 気温に基づく服装提案
    if (avgFeelTemp < 5) {
        summary = "かなり冷え込む予報のため、しっかりとした防寒対策が必要です。";
        details.push("厚手のコートやダウンジャケットの着用をおすすめします");
        details.push("マフラー、手袋、ニット帽などの防寒小物を忘れずに");
        details.push("ヒートテックなどの保温性の高いインナーを着用すると効果的です");
    } else if (avgFeelTemp < 10) {
        summary = "寒さが予想されるため、暖かい服装でお出かけください。";
        details.push("コートやジャケットの着用が必要です");
        details.push("セーターやカーディガンで重ね着をすると安心です");
    } else if (avgFeelTemp < 15) {
        summary = "肌寒さを感じる気温のため、上着があると安心です。";
        details.push("薄手のジャケットやカーディガンをお持ちください");
        details.push("長袖シャツでの外出がおすすめです");
    } else if (avgFeelTemp < 22) {
        summary = "過ごしやすい気温ですが、気温の変化に備えた服装を。";
        details.push("長袖または薄手の羽織りで快適に過ごせます");
        details.push("朝晩と日中の気温差にご注意ください");
    } else if (avgFeelTemp < 28) {
        summary = "暖かい気温のため、軽装でお過ごしいただけます。";
        details.push("半袖や薄手の服装で快適に過ごせます");
        details.push("日差しが強い場合は帽子や日焼け対策をお忘れなく");
    } else {
        summary = "かなり暑くなる予報のため、涼しい服装と暑さ対策を。";
        details.push("通気性の良い素材の服を選びましょう");
        details.push("こまめな水分補給を心がけてください");
        details.push("帽子や日傘で直射日光を避けることをおすすめします");
    }

    // 雨の提案
    if (rainExpected) {
        if (totalPrec > 10) {
            details.push("まとまった雨が予想されるため、しっかりした雨具をお持ちください");
        } else {
            details.push("雨の可能性があるため、折りたたみ傘があると安心です");
        }
    }

    // 風の提案
    if (windWarning) {
        details.push("風が強くなる予報のため、飛ばされにくい服装を心がけてください");
        if (avgFeelTemp < 15) {
            details.push("風により体感温度がさらに下がる可能性があります");
        }
    }

    // 気温差の警告
    if (maxTemp - minTemp >= 10) {
        details.push("気温差が大きいため、脱ぎ着しやすい服装がおすすめです");
    }

    return {
        summary,
        details,
    };
}
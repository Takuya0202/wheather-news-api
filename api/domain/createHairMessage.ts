import { WxData } from "../schema/response";

interface HairStatus {
    message: string;
}

// 気象データからヘアスタイルに関するメッセージを生成する
export function createHairMessage(wdata: WxData, hours: number = 12): HairStatus {
    // 指定時間分のデータを取得
    const srfData = wdata.srf.slice(0, hours);

    if (srfData.length === 0) {
        return {
            message: "気象データがないため、判断できません。"
        };
    }

    // 有効なデータのみ抽出（欠測値を除外）
    const validRhum = srfData.filter(d => d.rhum !== -99).map(d => d.rhum);
    const validWndspd = srfData.filter(d => d.wndspd !== -9999).map(d => d.wndspd);
    const validPrec = srfData.filter(d => d.prec !== -9999).map(d => d.prec);

    // 統計値を計算
    const avgRhum = validRhum.length > 0 ? validRhum.reduce((a, b) => a + b, 0) / validRhum.length : 50;
    const maxWndspd = validWndspd.length > 0 ? Math.max(...validWndspd) : 0;
    const avgWndspd = validWndspd.length > 0 ? validWndspd.reduce((a, b) => a + b, 0) / validWndspd.length : 0;
    const totalPrec = validPrec.length > 0 ? validPrec.reduce((a, b) => a + b, 0) : 0;
    const maxPrec = validPrec.length > 0 ? Math.max(...validPrec) : 0;

    // 優先度順に判断

    // 1. 強風の場合（最優先）
    if (maxWndspd >= 10) {
        return {
            message: "本日は風が大変強いため、前髪やヘアスタイルが乱れやすい状況です。ヘアピンやスプレーでしっかり固定することをおすすめします。"
        };
    }

    // 2. 雨が予想される場合
    if (maxPrec >= 5) {
        return {
            message: "雨が予想されるため、髪が濡れて崩れやすい状況です。帽子や傘でカバーするか、崩れにくいヘアスタイルがおすすめです。"
        };
    }

    if (totalPrec > 0) {
        return {
            message: "雨の可能性があるため、ヘアスタイルが崩れやすい状況です。スタイリング剤で仕上げると安心です。"
        };
    }

    // 3. 高湿度の場合（くせ毛・広がり）
    if (avgRhum >= 80) {
        return {
            message: "湿度がとても高いため、髪が広がりやすくくせ毛が出やすい状況です。ヘアオイルやまとめ髪がおすすめです。"
        };
    }

    if (avgRhum >= 70) {
        return {
            message: "湿度が高めのため、髪が広がりやすい状況です。ストレートヘアの方はスタイリング剤で対策を。"
        };
    }

    // 4. 低湿度の場合（静電気）
    if (avgRhum < 30) {
        return {
            message: "空気がとても乾燥しているため、静電気で髪が広がりやすい状況です。ヘアオイルやミストで保湿すると効果的です。"
        };
    }

    if (avgRhum < 40) {
        return {
            message: "乾燥気味のため、静電気が起きやすい状況です。ブラッシング前にミストを使うと落ち着きます。"
        };
    }

    // 5. やや強い風の場合
    if (avgWndspd >= 5) {
        return {
            message: "やや風があるため、前髪やサイドの髪が乱れやすい状況です。軽めのスタイリング剤がおすすめです。"
        };
    }

    // 6. 良好な条件
    if (avgRhum >= 40 && avgRhum <= 60 && avgWndspd < 3) {
        return {
            message: "本日はヘアスタイルを楽しむのに最適な天気です。お好みのスタイルでお出かけください。"
        };
    }

    return {
        message: "本日は特に髪への影響は少ない天気です。いつも通りのスタイリングで大丈夫です。"
    };
}

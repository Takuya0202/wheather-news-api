// 現在の降水量からメッセージを生成する
export function createMessageFromCurrentRain(currentPrec: number): string {
    if (currentPrec === -9999) {
        return "降水量データが取得できませんでした";
    }

    if (currentPrec === 0) {
        return "雨は降っていません。";
    } else if (currentPrec < 1) {
        return "ごく弱い雨が降っています。";
    } else if (currentPrec < 5) {
        return "小雨が降っています。";
    } else if (currentPrec < 10) {
        return "雨が降っています。";
    } else if (currentPrec < 20) {
        return "やや強い雨が降っています。";
    } else if (currentPrec < 30) {
        return "強い雨が降っています。";
    } else if (currentPrec < 50) {
        return "激しい雨が降っています。";
    } else {
        return "非常に激しい雨が降っています。";
    }
}

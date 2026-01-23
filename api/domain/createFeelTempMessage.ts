// 体感インデックスからメッセージを生成する
export function createFeelTempMessage(feelidx: number): string {
    if (feelidx === -99) {
        return "データが取得できませんでした";
    }

    if (feelidx <= 1) {
        return "極寒";
    } else if (feelidx <= 2) {
        return "とても寒い";
    } else if (feelidx <= 3) {
        return "寒い";
    } else if (feelidx <= 4) {
        return "やや寒い";
    } else if (feelidx <= 5) {
        return "快適";
    } else if (feelidx <= 6) {
        return "やや暑い";
    } else if (feelidx <= 7) {
        return "暑い";
    } else if (feelidx <= 8) {
        return "蒸し暑い";
    } else if (feelidx <= 9) {
        return "とても暑い";
    } else {
        return "猛暑";
    }
}

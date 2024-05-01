export function shortenLongTitle(title) {
    if (title.length > 35) {
        return title.substring(0, 35) + "...";
    }
    return title
}
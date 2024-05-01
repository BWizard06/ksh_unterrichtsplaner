export function shortenFileString(string) {
    let lastDot = string.lastIndexOf(".");
    let StringafterDot = string.substring(lastDot);
    return string.substring(0, 10) + "..." + StringafterDot;
}
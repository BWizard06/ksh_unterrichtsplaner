/**
 * function to shorten the filename
 * so that it doesn't take up too much space
 * on the single view of a lesson
 * @param {*} string 
 * @returns a shortened filename with the first 10 characters and the file extension
 */
export function shortenFileString(string) {
    let lastDot = string.lastIndexOf(".");
    let StringafterDot = string.substring(lastDot);
    return string.substring(0, 10) + "..." + StringafterDot;
}
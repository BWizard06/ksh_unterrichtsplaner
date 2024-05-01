/**
 * shortens the title of an event if it is too long
 * so that it isn't displayed in full length
 * and the user doesn't have to scroll to see the whole title
 * @param {*} title 
 * @returns the shortened title or the original title if it is already short
 */
export function shortenLongTitle(title) {
    if (title.length > 35) {
        return title.substring(0, 35) + "...";
    }
    return title
}
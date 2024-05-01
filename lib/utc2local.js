/**
 * Convert UTC time to local time
 * because prisma saves the time automatically in UTC
 * @param {*} string 
 * @returns the local time
 */
export function utc2Local(string){
    let date = new Date(string)
    date.setHours(date.getHours() + 2)
    return date.toISOString()
}

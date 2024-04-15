export function utc2Local(string){
    let date = new Date(string)
    date.setHours(date.getHours() + 2)
    return date.toISOString()
}

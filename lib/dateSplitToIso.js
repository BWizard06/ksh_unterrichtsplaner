/**
 * a function that is used in the date-time-local input field
 * and that takes a date and a time
 * so that the format of these input fields can be converted to the ISO date format
 * and be sent to the database
 * @param {*} date 
 * @param {*} time 
 * @returns string in the ISO date format
 */
export function dateSplitToIso(date, time) {
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}T${time}:00`;
};
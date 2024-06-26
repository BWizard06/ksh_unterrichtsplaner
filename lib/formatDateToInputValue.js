/**
 * Format a date string to a date input value
 * so that the data that is fetched from the database (ISO 8601 format)
 * can be displayed in the input fields
 * in the correct format (yyyy-mm-ddThh:mm)
 * @param {*} dateStr 
 * @returns 
 */
export function formatDateToInputValue (dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours() - 2;
    const minutes = date.getMinutes();

    const formattedYear = year.toString();
    const formattedMonth = (month < 10 ? "0" : "") + month;
    const formattedDay = (day < 10 ? "0" : "") + day;
    const formattedHours = (hours < 10 ? "0" : "") + hours;
    const formattedMinutes = (minutes < 10 ? "0" : "") + minutes;

    return `${formattedYear}-${formattedMonth}-${formattedDay}T${formattedHours}:${formattedMinutes}`;
};

export function dateSplitToIso(date, time) {
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}T${time}:00`;
};
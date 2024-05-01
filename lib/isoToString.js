export function isoToString(isoString){
    let dateString = isoString.split("T")[0];
    let year = dateString.split("-")[0];
    let month = dateString.split("-")[1];
    let day = dateString.split("-")[2];

    let time = isoString.substring(isoString.indexOf("T") + 1).split(":")[0];
    let hour = isoString.substring(isoString.indexOf("T") + 1).split(":")[1];

    dateString = day + "." + month + "." + year + ", um " + time + ":" + hour;
    return dateString;
}
"use client";
import readXlsxFile from "read-excel-file";

/**
 * function to read the excel file
 * and return the data in a format
 * that can be used to create events
 * @param {*} file
 * @returns an array of objects with the event data
*/
export async function ExcelReader(file) {
    const schema = {
        Ganztag: { prop: "allDay", type: String, required: false },
        Startdatum: { prop: "startdate", type: String, required: true },
        Enddatum: { prop: "enddate", type: String, required: true },
        Startzeit: { prop: "starttime", type: String, required: false },
        Endzeit: { prop: "endtime", type: String, required: false },
        Titel: { prop: "title", type: String, required: true },
        Ort: { prop: "location", type: String, required: false },
    };

    /**
     * Convert the date from the format dd.mm.yyyy to yyyy-mm-dd
     * so that it can be used in the Date object
     * and later be converted to the ISO date format
     * @param {*} dateString 
     * @returns 
     */
    function convertDate(dateString) {
        const parts = dateString.split('.');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    try {
        const { rows } = await readXlsxFile(file, {
            schema,
            transformData: (data) => data.slice(3),
        });

        const mappedRows = rows.map((row) => {
            let startDateTime, endDateTime;

            if (row.allDay === "*") {
                startDateTime = new Date(convertDate(row.startdate) + "T00:00:00").toISOString();
                endDateTime = new Date(convertDate(row.enddate) + "T23:59:59").toISOString();
            } else {
                console.log('Startdate:' + row.startdate + 'T' + row.starttime + ':00');
                startDateTime = new Date(
                    convertDate(row.startdate) + "T" + row.starttime + ":00"
                ).toISOString();
                endDateTime = new Date(
                    convertDate(row.enddate) + "T" + row.endtime + ":00"
                ).toISOString();
            }

            return {
                title: row.title,
                start_time: startDateTime,
                end_time: endDateTime,
                location: row.location,
            };
        });

        console.log(mappedRows);

        return mappedRows;
    } catch (error) {
        console.error(error);
        throw new Error("Fehler beim Lesen der Excel-Datei");
    }
}

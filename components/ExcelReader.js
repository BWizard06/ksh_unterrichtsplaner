'use client'
import React from "react";
import readXlsxFile from "read-excel-file";

export default function ExcelReader() {
    const schema = {
        'Ganztag': {
            prop: 'allDay',
            type: String,
            required: false
        },
        'Startdatum': {
            prop: 'startdate',
            type: String,
            required: true
        },
        'Enddatum': {
            prop: 'enddate',
            type: String,
            required: true
        },
        'Startzeit': {
            prop: 'starttime',
            type: String,
            required: false
        },
        'Endzeit': {
            prop: 'endtime',
            type: String,
            required: false
        },
        'Titel': {
            prop: 'title',
            type: String,
            required: true
        },
        'Ort': {
            prop: 'location',
            type: String,
            required: false
        }};
        
        const handleChange = (e) => {
            const file = e.target.files[0];
            readXlsxFile(file, { schema, 
            transformData: (data) => {
                return data.slice(3);
            }})
                .then(({ rows }) => {
                    const mappedRows = rows.map(row => ({
                        allDay: row.allDay,
                        startdate: row.startdate,
                        enddate: row.enddate,
                        starttime: row.starttime,
                        endtime: row.endtime,
                        title: row.title,
                        location: row.location
                    }));
                    console.log(mappedRows);
                    })
                    .catch((error) => {
                        console.log(error);
                });
        }

    return (
        <div>
            <input type="file" onChange={handleChange} />
        </div>
    );
}
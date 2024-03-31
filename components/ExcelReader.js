'use client'
import axios from "axios";
import React from "react";
import readXlsxFile from "read-excel-file";


export default function ExcelReader(e, file) {
    e.preventDefault();
    
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
            readXlsxFile(file, { schema, 
            transformData: (data) => {
                return data.slice(3);
            }})
                .then(({ rows }) => {
                    const mappedRows = rows.map(row => {
                        let startDateTime, endDateTime;
                        
                        if (row.allDay == '*'){
                            startDateTime = new Date(row.startdate + 'T00:00:00').toISOString();
                            endDateTime = new Date(row.enddate + 'T23:59:59').toISOString();
                        } else{
                            startDateTime = new Date(row.startdate + 'T' + row.starttime).toISOString();
                            endDateTime = new Date(row.enddate + 'T' + row.endtime).toISOString();
                        }

                        return {
                            title: row.title,
                            start: startDateTime,
                            end: endDateTime,
                            location: row.location,
                        }
                    });
                    console.log(mappedRows);
                    })
                    .catch((error) => {
                        console.log(error);
                });
        }
}
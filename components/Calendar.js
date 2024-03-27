"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import dE from "@fullcalendar/core/locales/de";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Calendar() {
    useEffect(() => {
        axios
            .get("/api/teacher/getByName", {
                params: {
                username: "andreProbst",
                },
            })
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <main className="flex flex-col items-center justify-between p-5">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="timeGridWeek"
                customButtons={{
                    terminimport: {
                        text: "Terminimport",
                        click: function () {
                            window.location.href = "../terminimport";
                        },
                    },
                    lessoninput: {
                        text: "Lektion eintragen",
                        click: function () {
                            window.location.href = "../lessoninput";
                        },
                    },
                }}
                headerToolbar={{
                    start: "terminimport lessoninput",
                    center: "prev today next",
                    end: "dayGridMonth timeGridWeek",
                }}
                slotMinTime={"06:00:00"}
                slotMaxTime={"22:00:00"}
                contentHeight={"auto"}
                locale={dE}
                weekNumbers={true}
                weekNumberCalculation={"ISO"}
                firstDay={1}
                stickyHeaderDates={true}
                aspectRatio={2}
                events={[
                    {
                        title: "Nachprüfung",
                        startTime: "16:15",
                        endTime: "17:00",
                        daysOfWeek: [5],
                        color: "red",
                    },
                ]}
                allDaySlot={false}
            />
        </main>
    );
}

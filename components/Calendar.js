"use client";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import dE from "@fullcalendar/core/locales/de";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Calendar() {
    const [teacherData, setTeacherData] = useState(); // [
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        axios
            .get("/api/teacher/getByName", {
                params: {
                    username: "andreProbst",
                },
            })
            .then(function (response) {
                setTeacherData(response.data);
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                setIsLoading(false);
            });
    }, []);

    const splitIsoTime = (isoTime) => {
        return isoTime.split("T")[1].split(":").slice(0, 2).join(":");
    };
    const splitIsoDate = (isoDate) => {
        return isoDate.split("T")[0];
    };

    return (
        <main className="flex flex-col items-center justify-between p-5">
            {isLoading ? (
                <div>is loading</div>
                
            ) : (
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    customButtons={{
                        terminimport: {
                            text: "Terminimport",
                            click: function () {
                                window.location.href = "/terminimport";
                            },
                        },
                        lessoninput: {
                            text: "Lektion eintragen",
                            click: function () {
                                window.location.href = "/lessoninput";
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
                    editable={true}
                    selectable={true}
                    weekNumbers={true}
                    weekNumberCalculation={"ISO"}
                    firstDay={1}
                    eventClick={(info) => {
                        console.log(info);
                    }}
                    stickyHeaderDates={true}
                    aspectRatio={2}
                    events={[
                        teacherData && teacherData.lessons.length > 0
                            ? {
                                  title: teacherData.lessons[1].title,
                                  startTime: "16:15",
                                  endTime: "17:00",
                                  daysOfWeek: [5],
                                  color: "red",
                              }
                            : {},
                    ]}
                    allDaySlot={false}
                />
            )}
        </main>
    );
}

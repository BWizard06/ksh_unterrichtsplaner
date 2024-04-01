"use client";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import dE from "@fullcalendar/core/locales/de";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PulseLoader from "react-spinners/PulseLoader";

export default function Calendar() {
    const [teacherData, setTeacherData] = useState();
    const [lessons, setLessons] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        axios
            .get("/api/teacher/getByName", {
                params: {
                    username: "andreProbst",
                },
            })
            .then((response) => {
                setTeacherData(response.data);
                setLessons(response.data.lessons);
                setAppointments(response.data.appointments);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);

    const getColorLessonType = (lessonType) => {
        if (lessonType == "pruefung") {
            return "#c70000";
        } else if (lessonType == "frei") {
            return "#30cb00";
        } else if (lessonType == "normal") {
            return "#020300";
        }
    };

    return (
        <main className="flex flex-col items-center justify-between p-5">
            {isLoading ? (
                <div className="flex justify-center items-center h-screen w-screen">
                    <PulseLoader
                        color={"#3c3ffa"}
                        loading={isLoading}
                        size={30}
                    />
                </div>
            ) : (
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    customButtons={{
                        terminimport: {
                            text: "Termin eintragen",
                            click: function () {
                                window.location.href = "/appointment";
                            },
                        },
                        lessoninput: {
                            text: "Lektion eintragen",
                            click: function () {
                                window.location.href = "/lesson";
                            },
                        },
                    }}
                    headerToolbar={{
                        start: "terminimport lessoninput",
                        center: "prev today next title",
                        end: "dayGridMonth timeGridWeek",
                    }}
                    slotMinTime={"06:00:00"}
                    timeZone="Europe/Zurich"
                    slotMaxTime={"22:00:00"}
                    contentHeight={"auto"}
                    locale={dE}
                    weekNumbers={true}
                    weekNumberCalculation={"ISO"}
                    firstDay={1}
                    editable={true}
                    eventStartEditable={false}
                    eventResizableFromStart={false}
                    eventResizableFromEnd={false}
                    droppable={false}
                    eventClick={(info) => {
                        info.event.extendedProps.type == "lesson"
                            ? router.push(`/lesson/${info.event.id}`)
                            : router.push(`/appointment/${info.event.id}`);
                    }}
                    stickyHeaderDates={true}
                    aspectRatio={2}
                    events={
                        teacherData &&
                        teacherData.lessons &&
                        teacherData.lessons.length > 0
                            ? [
                                  ...lessons.map((lesson) => ({
                                      id: lesson.id,
                                      title: lesson.title,
                                      start: lesson.start_time,
                                      end: lesson.end_time,
                                      color: getColorLessonType(
                                          lesson.lesson_type
                                      ),
                                      type: "lesson",
                                  })),
                                  ...appointments.map((appointment) => ({
                                      id: appointment.id,
                                      title: appointment.title,
                                      start: appointment.start_time,
                                      end: appointment.end_time,
                                      color: "#3c3ffa",
                                      type: "appointment",
                                  })),
                                  {
                                      daysOfWeek: [0, 6],
                                      display: "background",
                                      color: "green",
                                      allDay: true,
                                    },
                                    {
                                        daysOfWeek: [5],
                                        display: "background",
                                        color: "red",
                                        start: '16:15',
                                        end: '17:00',
                                        title: 'Nachprüfung'
                                    }
                              ]
                            : [
                                {
                                    daysOfWeek: [0, 6],
                                    display: "background",
                                    color: "green",
                                    allDay: true,
                                },
                                {
                                    daysOfWeek: [5],
                                    display: "background",
                                    color: "red",
                                    start: '16:15',
                                    end: '17:00',
                                    title: 'Nachprüfung'
                                }

                            ]
                    }
                    allDaySlot={false}
                />
            )}
        </main>
    );
}

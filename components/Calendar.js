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
import LogoutBtn from "./LogoutBtn";
import "@/app/globals.css";

/**
 * the main component that displays the calendar and the events
 * for the user that is logged in
 * @returns a jsx element that is a calendar with the events
 */
export default function Calendar() {
    const [teacherData, setTeacherData] = useState();
    const [lessons, setLessons] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState();
    const [role, setRole] = useState();
    const [username, setUsername] = useState();
    const [studentClass, setStudentClass] = useState();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/");
        }

        axios
            .post("/api/verifyToken", { token })
            .then((response) => {
                if (response.data.valid) {
                    setToken(response.data);
                    setRole(response.data.role);
                    setUsername(response.data.username);
                    if (response.data.role === "teacher") {
                        axios
                            .get("/api/teacher/getByName", {
                                params: {
                                    username: response.data.username,
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
                    } else {
                        axios
                            .get("/api/student/getByName", {
                                params: {
                                    username: response.data.username,
                                },
                            })
                            .then((response) => {
                                axios
                                    .get("/api/class/getById", {
                                        params: {
                                            id: response.data.classId,
                                        },
                                    })
                                    .then((response) => {
                                        setLessons(response.data.lessons);
                                        setIsLoading(false);
                                    });
                            })
                            .catch((error) => {
                                console.log(error);
                                setIsLoading(false);
                            });
                    }
                } else {
                    router.push("/");
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    router.push("/");
                } else {
                    console.error("Fehler beim Überprüfen des Tokens:", error);
                }
            });
    }, []);

    useEffect(() => {
        console.log("Role", role);
    }, [role]);

    const getColorLessonType = (lessonType) => {
        if (lessonType == "pruefung") {
            return "#c70000";
        } else if (lessonType == "frei") {
            return "#30cb00";
        } else if (lessonType == "normal") {
            return "#020300";
        }
    };

    useEffect(() => {
        console.log("lessons", lessons);
    }, [lessons]);

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
                <div>
                    <div className="flex items-center justify-between w-full mb-2">        
                        <h1 className="subtitle ml-4">Kalender für: {username}</h1>
                        <LogoutBtn />
                    </div>
                    <FullCalendar
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                        ]}
                        initialView="timeGridWeek"
                        customButtons={{
                            terminimport: {
                                text: "Termin eintragen",
                                click: function () {
                                    router.push("/appointment");
                                },
                            },
                            lessoninput: {
                                text: "Lektion eintragen",
                                click: function () {
                                    router.push("/lesson");
                                },
                            },
                            homework: {
                                text: "Hausaufgaben anzeigen",
                                click: function () {
                                    router.push("/homework");
                                },
                            },
                        }}
                        headerToolbar={
                            role === "teacher"
                                ? {
                                      start: "terminimport lessoninput",
                                      center: "prev today next title",
                                      end: "dayGridMonth timeGridWeek",
                                  }
                                : {
                                      start: "homework",
                                      center: "prev today next title",
                                      end: "dayGridMonth timeGridWeek",
                                  }
                        }
                        timeZone={"locale"}
                        contentHeight={"auto"}
                        locale={dE}
                        weekNumbers={true}
                        weekNumberCalculation={"ISO"}
                        slotEventOverlap={false}
                        firstDay={1}
                        eventClick={(info) => {
                            info.event.extendedProps.type == "lesson"
                                ? router.push(`/lesson/${info.event.id}`)
                                : router.push(`/appointment/${info.event.id}`);
                        }}
                        stickyHeaderDates={true}
                        aspectRatio={2}
                        eventMaxStack={2}
                        eventOrder={"title"}
                        events={[
                            ...lessons.map((lesson) => ({
                                id: lesson.id,
                                title: lesson.title,
                                start: lesson.start_time,
                                end: lesson.end_time,
                                color: getColorLessonType(lesson.lesson_type),
                                type: "lesson",
                            })),
                            ...appointments.map((appointment) => ({
                                id: appointment.id,
                                title: appointment.title,
                                start: appointment.start_time,
                                end: appointment.end_time,
                                color: appointment.imported ? "#88dff7": "#3c3ffa",
                                type: "appointment",
                                textColor: appointment.imported ? "#000000" : "#ffffff",
                                
                            })),
                            {
                                daysOfWeek: [0, 6],
                                display: "background",
                                color: "#30cb00",
                                allDay: true,
                                className: 'wochenende'
                            },
                            {
                                daysOfWeek: [5],
                                color: "#c70000",
                                startTime: "16:15",
                                endTime: "17:00",
                                title: "Nachprüfung",
                                allDay: false,
                                className: 'nachpruefung'
                            },
                        ]}
                        allDaySlot={false}
                    />
                </div>
            )}
        </main>
    );
}

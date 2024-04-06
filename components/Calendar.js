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
    const [token, setToken] = useState();
    const [role, setRole] = useState();
    const [username, setUsername] = useState();
    const [studentClass, setStudentClass] = useState();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
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
                    router.push("/login");
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    router.push("/login");
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
                    eventClick={(info) => {
                        info.event.extendedProps.type == "lesson"
                            ? router.push(`/lesson/${info.event.id}`)
                            : router.push(`/appointment/${info.event.id}`);
                    }}
                    stickyHeaderDates={true}
                    aspectRatio={2}
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
                            color: "#3c3ffa",
                            type: "appointment",
                        })),
                        {
                            daysOfWeek: [0, 6],
                            display: "background",
                            color: "#30cb00",
                            allDay: true,
                        },
                        {
                            daysOfWeek: [5],
                            color: "#c70000",
                            startTime: "16:15",
                            endTime: "17:00",
                            title: "Nachprüfung",
                            allDay: false,
                        },
                    ]}
                    allDaySlot={false}
                />
            )}
        </main>
    );
}

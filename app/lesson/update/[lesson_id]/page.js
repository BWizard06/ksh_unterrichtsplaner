"use client";

import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import BackBtn from "@/components/BackBtn";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { utc2Local } from "@/lib/utc2local";

export default function LessonUpdate() {
    const searchParams = useParams();
    const lesson_id = searchParams.lesson_id;
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [requestedClass, setRequestedClass] = useState();
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");
    const [homework, setHomework] = useState();
    const [classId, setClassId] = useState();
    const [room, setRoom] = useState();
    const [lessonType, setLessonType] = useState();
    const [lessonGoals, setLessonGoals] = useState();
    const [teacherNotes, setTeacherNotes] = useState();
    const [studentNotes, setStudentNotes] = useState();
    const [subject, setSubject] = useState();
    const [files, setFiles] = useState();
    const [fileVisibility, setFileVisibility] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [teacherData, setTeacherData] = useState();
    const [token, setToken] = useState();
    const [role, setRole] = useState();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/");
        }

        axios.post("/api/verifyToken", { token }).then((response) => {
            if (response.data.valid) {
                setToken(response.data);
                setRole(response.data.role);
                if (response.data.role === "student") {
                    router.push("/calendar");
                    setIsLoading(false);
                    return;
                } else {
                    axios
                        .get("/api/lesson/getById", {
                            params: {
                                id: lesson_id,
                            },
                        })
                        .then((response) => {
                            setTitle(response.data.title);
                            setStartTime(
                                formatDateToInputValue(response.data.start_time)
                            );
                            setEndTime(
                                formatDateToInputValue(response.data.end_time)
                            );
                            setClassId(response.data.classId);
                            setLocation(response.data.location);
                            setHomework(response.data.homework);
                            setLessonGoals(response.data.lesson_goals);
                            setRoom(response.data.room);
                            setLessonType(response.data.lesson_type);
                            setSubject(response.data.subject);
                            setTeacherNotes(response.data.private_notes);
                            setStudentNotes(response.data.public_notes);
                            setIsLoading(false);
                            setFiles(response.data.files);
                        })
                        .catch((error) => {
                            console.log(error);
                            setIsLoading(false);
                        });

                    axios
                        .get("/api/teacher/getByName", {
                            params: {
                                username: response.data.username,
                            },
                        })
                        .then((response) => {
                            setTeacherData(response.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            }
        });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        axios
            .put("/api/lesson/update", {
                id: lesson_id,
                teacherId: token.id,
                title: title,
                start_time: utc2Local(startTime),
                end_time: utc2Local(endTime),
                location: location,
                homework: homework,
                classId: classId,
                room: room,
                lesson_type: lessonType,
                lesson_goals: lessonGoals,
                private_notes: teacherNotes,
                public_notes: studentNotes,
                subject: subject,
            })
            .then((response) => {
                console.log(response);
                toast({
                    title: "Lektion aktualisiert",
                    description: "Die Lektion wurde erfolgreich aktualisiert.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                router.back();
            })
            .catch((error) => {
                console.log(error);
                toast({
                    title: "Fehler beim Bearbeiten der Lektion",
                    description: "Fehler" + error.response.data.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            });
    };

    const dateSplitToIso = (date, time) => {
        const [year, month, day] = date.split("-");
        return `${year}-${month}-${day}T${time}:00`;
    };

    useEffect(() => {
        axios
            .get("/api/class/getById", {
                params: {
                    id: classId,
                },
            })
            .then((response) => {
                setRequestedClass(response.data.name);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [classId]);

    const formatDateToInputValue = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours() - 2;
        const minutes = date.getMinutes();

        const formattedYear = year.toString();
        const formattedMonth = (month < 10 ? "0" : "") + month;
        const formattedDay = (day < 10 ? "0" : "") + day;
        const formattedHours = (hours < 10 ? "0" : "") + hours;
        const formattedMinutes = (minutes < 10 ? "0" : "") + minutes;

        return `${formattedYear}-${formattedMonth}-${formattedDay}T${formattedHours}:${formattedMinutes}`;
    };

    useEffect(() => {
        console.log("teachernotes", teacherNotes);
    }, [teacherNotes]);

    return (
        <main className="flex items-center justify-center text-center min-h-screen w-full">
            {isLoading ? (
                <Loader isLoading={isLoading} />
            ) : (
                <div className="flex items-center justify-center text-center min-h-screen">
                    <div className="w-full space-y-2">
                        <div className="flex justify-center items-center">
                            <BackBtn />
                            <h1 className="title">
                                Lektion {title} bearbeiten
                            </h1>
                        </div>

                        <div
                            id="lessoninput"
                            className="flex flex-col justify-center items-center inputForm"
                        >
                            <form>
                                <div id="general" className="space-x-3 mt-4">
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={title}
                                        required
                                        className="w-auto"
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />
                                    <input
                                        type="text"
                                        id="fach"
                                        name="fach"
                                        value={subject}
                                        required
                                        className="w-24"
                                        onChange={(e) =>
                                            setSubject(e.target.value)
                                        }
                                    />
                                    <select
                                        onChange={(e) =>
                                            setRequestedClass(e.target.value)
                                        }
                                    >
                                        {teacherData &&
                                        teacherData.classTeacher &&
                                        teacherData.classTeacher.length > 0 ? (
                                            teacherData.classTeacher.map(
                                                (teacherClass) => (
                                                    <option
                                                        value={
                                                            teacherClass.class
                                                                .name
                                                        }
                                                        selected={
                                                            classId ==
                                                            teacherClass.class
                                                                .id
                                                                ? true
                                                                : false
                                                        }
                                                    >
                                                        {
                                                            teacherClass.class
                                                                .name
                                                        }
                                                    </option>
                                                )
                                            )
                                        ) : (
                                            <option value="Keine Klassen gefunden">
                                                Keine Klassen gefunden
                                            </option>
                                        )}
                                    </select>
                                    <input
                                        type="text"
                                        id="room"
                                        name="room"
                                        value={room}
                                        required
                                        className="w-24"
                                        onChange={(e) =>
                                            setRoom(e.target.value)
                                        }
                                    />
                                    <select
                                        id="lektionsart"
                                        name="lektionsart"
                                        required
                                        className="w-auto"
                                        onChange={(e) =>
                                            setLessonType(e.target.value)
                                        }
                                    >
                                        <option
                                            value="normal"
                                            selected={
                                                lessonType == "normal"
                                                    ? true
                                                    : false
                                            }
                                        >
                                            Normale Lektion
                                        </option>
                                        <option
                                            value="pruefung"
                                            selected={
                                                lessonType == "pruefung"
                                                    ? true
                                                    : false
                                            }
                                        >
                                            Prüfung
                                        </option>
                                        <option
                                            value="frei"
                                            selected={
                                                lessonType == "frei"
                                                    ? true
                                                    : false
                                            }
                                        >
                                            Frei
                                        </option>
                                    </select>
                                </div>

                                <div id="time" className="mt-5 space-x-3">
                                    <label
                                        htmlFor="start"
                                        className="text-black"
                                    >
                                        Von:
                                    </label>
                                    <input
                                        id="start"
                                        type="datetime-local"
                                        required
                                        min={"07:00"}
                                        max={"22:00"}
                                        step={900}
                                        value={startTime}
                                        onChange={(e) =>
                                            setStartTime(
                                                dateSplitToIso(
                                                    e.target.value.split(
                                                        "T"
                                                    )[0],
                                                    e.target.value.split("T")[1]
                                                )
                                            )
                                        }
                                    />
                                    <label htmlFor="end" className="text-black">
                                        Bis:
                                    </label>
                                    <input
                                        id="end"
                                        type="datetime-local"
                                        required
                                        min={"07:00"}
                                        max={"22:00"}
                                        step={900}
                                        value={endTime}
                                        onChange={(e) =>
                                            setEndTime(
                                                dateSplitToIso(
                                                    e.target.value.split(
                                                        "T"
                                                    )[0],
                                                    e.target.value.split("T")[1]
                                                )
                                            )
                                        }
                                    />
                                </div>

                                <div>
                                    <textarea
                                        id="homework"
                                        name="homework"
                                        placeholder="Hausaufgaben"
                                        className="mt-8"
                                        value={homework}
                                        onChange={(e) =>
                                            setHomework(e.target.value)
                                        }
                                    />
                                </div>

                                <div id="goals" className="mt-6">
                                    <textarea
                                        id="goals"
                                        name="goals"
                                        placeholder="Lernziele der Lektion"
                                        value={lessonGoals}
                                        onChange={(e) =>
                                            setLessonGoals(e.target.value)
                                        }
                                    ></textarea>
                                </div>

                                <div id="notesTeacher" className="mt-6">
                                    <textarea
                                        id="teacherNotes"
                                        name="teacherNotes"
                                        value={teacherNotes === null ? '' : `${teacherNotes}`}
                                        placeholder={ teacherNotes === null ? "Ihre Notizen" : ""}
                                        onChange={(e) =>
                                            setTeacherNotes(e.target.value)
                                        }
                                    />
                                </div>

                                <div id="notesStudent" className="mt-6">
                                    <textarea
                                        id="studentNotes"
                                        name="studentNotes"
                                        value={studentNotes}
                                        placeholder="Notizen für SuS"
                                        onChange={(e) =>
                                            setStudentNotes(e.target.value)
                                        }
                                    />
                                </div>

                                <div id="saveLessonInput" className="mt-6">
                                    <input
                                        type="submit"
                                        value="Lektion aktualisieren"
                                        onClick={handleSubmit}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

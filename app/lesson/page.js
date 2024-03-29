"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { useToast } from "@/components/ui/use-toast";

export default function LessionInput() {
    const [subject, setSubject] = useState();
    const [lessonId, setLessonId] = useState();
    const [title, setTitle] = useState();
    const [requestedClass, setRequestedClass] = useState();
    const [classId, setClassId] = useState();
    const [room, setRoom] = useState();
    const [lessonType, setLessonType] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [homework, setHomework] = useState();
    const [lessonGoals, setLessonGoals] = useState();
    const [teacherNotes, setTeacherNotes] = useState();
    const [studentNotes, setStudentNotes] = useState();
    const [files, setFiles] = useState();
    const [fileVisibility, setFileVisibility] = useState(false);
    const [teacherData, setTeacherData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [recurrence, setRecurrence] = useState();
    const { toast } = useToast();

    useEffect(() => {
        axios
            .get("/api/teacher/getByName", {
                params: {
                    username: "andreProbst",
                },
            })
            .then((response) => {
                setTeacherData(response.data);
                setIsLoading(false);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (requestedClass) {
            axios
                .get(`/api/class/getByName?name=${requestedClass}`)
                .then((response) => {
                    setClassId(response.data.id);
                    console.log(response.data.id);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [requestedClass]);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("initial start:" + startTime);
        console.log("initial end:" + endTime);

        let lessonStartTime = new Date(startTime);
        let lessonEndTime = new Date(endTime);

        for (let i = 0; i <= recurrence; i++) {
            console.log("start:" + lessonStartTime);
            console.log("end:" + lessonEndTime);
            const lessonData = {
                classId,
                teacherId: "65f35c82a3625a11fa36b61e",
                title,
                start_time: new Date(lessonStartTime).toISOString(),
                end_time: new Date(lessonEndTime).toISOString(),
                lesson_type: lessonType,
                lesson_goals: lessonGoals,
                homework,
                room,
                subject,
                public_notes: studentNotes,
                private_notes: teacherNotes,
            };

            try {
                axios
                    .post("/api/lesson/create", lessonData)
                    .then((response) => {
                        console.log(response);
                        const createdLessonId = response.data.id;
                        toast({
                            title: "Lektion erstellt",
                            description: "Die Lektion wurde erfolgreich erstellt.",
                            variant: "success",
                        })

                        if (!createdLessonId) {
                            console.error(
                                "Keine gültige Lektions-ID erhalten."
                            );
                            return;
                        }

                        lessonStartTime.setDate(lessonStartTime.getDate() + 7);
                        lessonEndTime.setDate(lessonEndTime.getDate() + 7);

                        if (files) {
                            for (let i = 0; i < files.length; i++) {
                                const formData = new FormData();
                                formData.append("file", files[i]);
                                formData.append(
                                    "json",
                                    JSON.stringify({
                                        lessonId: createdLessonId,
                                        visibility: fileVisibility,
                                    })
                                );
                                axios
                                    .post("/api/file/create", formData, {
                                        headers: {
                                            "Content-Type":
                                                "multipart/form-data",
                                        },
                                    })
                                    .then((response) => {
                                        console.log(response);
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }
                        }
                    })
                .catch((error) => {
                    toast({
                        title: "Fehler beim Erstellen der Lektion",
                        description: "Es ist ein Fehler beim Erstellen der Lektion aufgetreten.",
                        variant: "destructive",
                    })
                    console.log(error)
                })
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        console.log("lessonId:" + lessonId);
    }, [lessonId]);

    const dateSplitToIso = (date, time) => {
        const [year, month, day] = date.split("-");
        return `${year}-${month}-${day}T${time}:00`;
    };
    return (
        <main>
            {isLoading ? (
                <div className="flex justify-center items-center h-screen w-screen">
                    <PulseLoader
                        color={"#3c3ffa"}
                        loading={isLoading}
                        size={30}
                    />
                </div>
            ) : (
                <div className="flex items-center justify-center text-center min-h-screen">
                    <div className="w-full space-y-2">
                        <h1 className="text-3xl font-extrabold text-sky-300">
                            Lektion erfassen
                        </h1>

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
                                        placeholder="Titel"
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
                                        placeholder="Fach"
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
                                        <option
                                            value="deafult"
                                            selected
                                            disabled
                                        >
                                            Klasse auswählen
                                        </option>

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
                                        placeholder="Zimmer"
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
                                            value="default"
                                            selected
                                            disabled
                                        >
                                            Lektionsart auswählen
                                        </option>
                                        <option value="normal">
                                            Normale Lektion
                                        </option>
                                        <option value="pruefung">
                                            Prüfung
                                        </option>
                                        <option value="frei">Frei</option>
                                    </select>
                                </div>

                                <div id="time" className="mt-5 space-x-3">
                                    <label
                                        htmlFor="start"
                                        className="text-sky-500"
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
                                    <label
                                        htmlFor="end"
                                        className="text-sky-500"
                                    >
                                        Bis:
                                    </label>
                                    <input
                                        id="end"
                                        type="datetime-local"
                                        required
                                        min={"07:00"}
                                        max={"22:00"}
                                        step={900}
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
                                    <input
                                        id="recurrence"
                                        type="number"
                                        onChange={(e) =>
                                            setRecurrence(e.target.value)
                                        }
                                        placeholder="Anzahl Wochen"
                                        min="0"
                                    />
                                    <label htmlFor="recurrence">
                                        Wochen wiederholen
                                    </label>
                                </div>

                                <div>
                                    <textarea
                                        id="homework"
                                        name="homework"
                                        placeholder="Hausaufgaben"
                                        className="mt-8"
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
                                        onChange={(e) =>
                                            setLessonGoals(e.target.value)
                                        }
                                    ></textarea>
                                </div>

                                <div id="notesTeacher" className="mt-6">
                                    <textarea
                                        id="teacherNotes"
                                        name="teacherNotes"
                                        placeholder="Ihre Notizen"
                                        onChange={(e) =>
                                            setTeacherNotes(e.target.value)
                                        }
                                    />
                                </div>

                                <div id="notesStudent" className="mt-6">
                                    <textarea
                                        id="studentNotes"
                                        name="studentNotes"
                                        placeholder="Notizen für SuS"
                                        onChange={(e) =>
                                            setStudentNotes(e.target.value)
                                        }
                                    />
                                </div>

                                <div id="files" className="mt-6">
                                    <input
                                        id="file"
                                        type="file"
                                        name="files"
                                        onChange={(e) =>
                                            setFiles(e.target.files)
                                        }
                                        multiple
                                    />
                                    <input
                                        id="fileVisibility"
                                        type="checkbox"
                                        className="mr-1"
                                        onChange={(e) =>
                                            setFileVisibility(e.target.checked)
                                        }
                                    />
                                    <label htmlFor="fileVisibility">
                                        Sichtbar für Schüler
                                    </label>
                                </div>

                                <div id="saveLessonInput" className="mt-6">
                                    <input
                                        type="submit"
                                        value="Lektion erfassen"
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
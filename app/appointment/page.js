"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import ExcelReader from "@/components/ExcelReader";
import BackToCalendar from "@/components/BackToCalendar";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";

export default function appointmentInput() {
    const [title, setTitle] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [notes, setNotes] = useState();
    const [file, setFile] = useState(null);
    const [location, setLocation] = useState();
    const { toast } = useToast();
    const [teacherData, setTeacherData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState();
    const [role, setRole] = useState();
    const router = useRouter();

    const handleSubmit = (event) => {
        event.preventDefault();

        axios
            .post("/api/appointment/create", {
                teacherId: "65f35c82a3625a11fa36b61e",
                title: title,
                start_time: startTime,
                end_time: endTime,
                notes: notes,
                location: location,
            })
            .then((response) => {
                console.log(response);
                toast({
                    title: "Termin erstellt",
                    description: "Der Termin wurde erfolgreich erstellt.",
                    variant: "success",
                });
            })
            .catch((error) => {
                console.log(error);
                toast({
                    title: "Fehler beim Erstellen des Termins",
                    description: "Fehler: " + error.response.data.message,
                    variant: "destructive",
                });
            });
    };

    function handleFileChange(e) {
        setFile(e.target.files[0]);
    }

    const dateSplitToIso = (date, time) => {
        const [year, month, day] = date.split("-");
        return `${year}-${month}-${day}T${time}:00`;
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        axios
            .post("/api/verifyToken", { token })
            .then((response) => {
                if (response.data.valid) {
                    setToken(response.data);
                    setRole(response.data.role);
                }
                if (response.data.role === "student") {
                    router.push("/calendar");
                } else {
                    axios
                        .get("/api/teacher/getByName", {
                            params: {
                                username: response.data.username,
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
                <div className="flex items-center justify-center text-center min-h-screen w-full">
                    <div className="space-y-2">
                        <BackToCalendar />
                        <h1 className="title">Termin erfassen</h1>

                        <div
                            id="appointmentInput"
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
                                        onChange={(event) =>
                                            setTitle(event.target.value)
                                        }
                                    />
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

                                <div id="location" className="mt-5">
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        placeholder="Ort"
                                        onChange={(event) =>
                                            setLocation(event.target.value)
                                        }
                                    />
                                </div>

                                <div id="notes" className="mt-6">
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        placeholder="Ihre Notizen"
                                        onChange={(event) =>
                                            setNotes(event.target.value)
                                        }
                                    />
                                </div>

                                <div id="saveAppointment" className="mt-6">
                                    <input
                                        type="submit"
                                        value="Termin erfassen"
                                        className="mt-6"
                                        onClick={handleSubmit}
                                    />
                                </div>
                            </form>

                            <div className="flex flex-col items-center justify-center">
                                <h2 className="text-xl font-bold mt-16 mb-5">
                                    Oder von Excel einlesen lassen
                                </h2>
                                <form className="inputForm flex flex-col space-y-3 justify-center items-center">
                                    <input
                                        type="file"
                                        accept=".xlsx"
                                        id="file"
                                        name="file"
                                        required
                                    />
                                    <input
                                        type="submit"
                                        value="Einlesen"
                                        className="justify-center items-center flex"
                                        onClick={(e) =>
                                            ExcelReader(e, handleFileChange(e))
                                        }
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

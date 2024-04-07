"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ExcelReader } from "@/lib/excelreader";
import BackBtn from "@/components/BackBtn";
import { useRouter } from "next/navigation";
import { PulseLoader } from "react-spinners";
import { utc2Local } from "@/lib/utc2local";

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
    const [excelFile, setExcelFile] = useState();
    const [token, setToken] = useState();
    const [role, setRole] = useState();
    const [excelData, setExcelData] = useState();
    const router = useRouter();

    const handleSubmit = (event) => {
        event.preventDefault();

        let appointmentStartTime = new Date(startTime);
        let appointmentEndTime = new Date(endTime);

        axios
            .post("/api/appointment/create", {
                teacherId: teacherData.id,
                title: title,
                start_time: utc2Local(appointmentStartTime),
                end_time: utc2Local(appointmentEndTime),
                notes: notes,
                location: location,
                imported: false,
            })
            .then((response) => {
                console.log(response);
                toast({
                    title: "Termin erstellt",
                    description: "Der Termin wurde erfolgreich erstellt.",
                    variant: "success",
                    duration: 5000,
                });
            })
            .catch((error) => {
                console.log(error);
                toast({
                    title: "Fehler beim Erstellen des Termins",
                    description: "Fehler: " + error.response.data.message,
                    variant: "destructive",
                    duration: 5000,
                });
            });
    };

    async function handleExcelSubmit(e) {
        e.preventDefault();
        if (!excelFile) {
            toast({
                title: "Keine Datei ausgewählt",
                description: "Bitte wähle zuerst eine Excel-Datei aus.",
                variant: "warning",
                duration: 5000,
            });
            return;
        }

        try {
            const appointments = await ExcelReader(excelFile);
            for (const appointment of appointments) {
                await axios
                    .post("/api/appointment/create", {
                        teacherId: teacherData.id,
                        imported: true,
                        ...appointment,
                    })
                    .then((response) => {
                        console.log(response);
                    });
            }
            toast({
                title: "Termine erstellt",
                description:
                    "Alle Termine wurden erfolgreich aus der Excel-Datei erstellt.",
                variant: "success",
                duration: 5000,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Fehler beim Einlesen der Excel-Datei",
                description: error.toString(),
                variant: "error",
                duration: 5000,
            });
        }
    }

    useEffect(() => {
        console.log("Starttime" + startTime);
    }, [startTime]);

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

    useEffect(() => {
        console.log(excelData);
        console.log(excelFile);
    }, [excelData, excelFile]);

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
                        <BackBtn destination="calendar" />
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
                                <h2 className="subtitle mt-16 mb-5">
                                    Oder von Excel einlesen lassen
                                </h2>
                                <form
                                    onSubmit={handleExcelSubmit}
                                    className="inputForm flex flex-col space-y-3 justify-center items-center"
                                >
                                    <input
                                        type="file"
                                        accept=".xlsx"
                                        id="file"
                                        name="file"
                                        required
                                        onChange={(e) =>
                                            setExcelFile(e.target.files[0])
                                        }
                                    />
                                    <input
                                        type="submit"
                                        value="Einlesen"
                                        className="justify-center items-center flex"
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

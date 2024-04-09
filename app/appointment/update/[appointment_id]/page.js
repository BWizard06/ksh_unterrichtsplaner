"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import BackBtn from "@/components/BackBtn";
import { useRouter } from "next/navigation";
import { utc2Local } from "@/lib/utc2local";

export default function ApppointmentUpdate() {
    const searchParams = useParams();
    const appointment_id = searchParams.appointment_id;
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState();
    const [role, setRole] = useState();
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
                    if (response.data.role === "student") {
                        router.push("/calendar");
                        setIsLoading(false);
                        return;
                    } else {
                        axios
                            .get("/api/appointment/getById", {
                                params: {
                                    id: appointment_id,
                                },
                            })
                            .then((response) => {
                                setTitle(response.data.title);
                                setStartTime(
                                    formatDateToInputValue(
                                        response.data.start_time
                                    )
                                );
                                setEndTime(
                                    formatDateToInputValue(
                                        response.data.end_time
                                    )
                                );
                                setLocation(response.data.location);
                                setNotes(response.data.notes);
                                setIsLoading(false);
                            })
                            .catch((error) => {
                                console.log(error);
                                setIsLoading(false);
                            });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        console.log("token", token);
    }, [token]);

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

    const formatDateToInputValue2 = (dateStr) => {
        // Wandeln Sie das Datum in ein für den datetime-local input akzeptables Format um
        const date = new Date(dateStr);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Korrektur der Zeitzone
        return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm Format
    };

    useEffect(() => {
        console.log("Starttime" + startTime);
    }, [startTime]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .put("/api/appointment/update", {
                id: appointment_id,
                teacherId: token.id,
                title: title,
                start_time: startTime + ":00.000Z",
                end_time: endTime + ":00.000Z",
                location: location,
                notes: notes,
            })
            .then((response) => {
                router.back();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        console.log("startTime", startTime);
        console.log("endTime", endTime);
    }, [startTime, endTime]);

    const dateSplitToIso = (date, time) => {
        const [year, month, day] = date.split("-");
        return `${year}-${month}-${day}T${time}:00`;
    };

    return (
        <main>
            <div className="flex items-center justify-center text-center min-h-screen w-full">
                {isLoading ? (
                    <Loader isLoading={isLoading} />
                ) : (
                    <div className="space-y-2">
                        <BackBtn />
                        <h1 className="title">Termin bearbeiten</h1>

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
                                        value={title}
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
                                        value={startTime}
                                        step={900}
                                        onChange={(e) =>
                                            setStartTime(e.target.value)
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
                                            setEndTime(e.target.value)
                                        }
                                    />
                                </div>

                                <div id="location" className="mt-5">
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={
                                            location === null
                                                ? ""
                                                : `${location}`
                                        }
                                        placeholder={
                                            location === null ? "Ort" : ""
                                        }
                                        onChange={(event) =>
                                            setLocation(event.target.value)
                                        }
                                    />
                                </div>

                                <div id="notes" className="mt-6">
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={notes === null ? "" : `${notes}`}
                                        placeholder={
                                            notes === null ? "Ihre Notizen" : ""
                                        }
                                        onChange={(event) =>
                                            setNotes(event.target.value)
                                        }
                                    />
                                </div>

                                <div id="saveAppointment" className="mt-6">
                                    <input
                                        type="submit"
                                        value="Termin aktualisieren"
                                        className="mt-6"
                                        onClick={handleSubmit}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

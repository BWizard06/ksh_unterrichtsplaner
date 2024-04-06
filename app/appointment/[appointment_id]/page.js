"use client";

import React, { use } from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import BackToCalendar from "@/components/BackToCalendar";
import TrashBinIcon from "@/components/TrashBinIcon";
import ShareLinkIcon from "@/components/ShareLinkIcon";
import EditPenIcon from "@/components/EditPenIcon";
import ReactMarkdown from "react-markdown";
const { useRouter } = require("next/navigation");

export default function AppointmentDetail() {
    const searchParams = useParams();
    const appointment_id = searchParams.appointment_id;
    const [appointment, setAppointment] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState();
    const router = useRouter();

    const deleteAppointment = (id) => {
        axios
            .delete("/api/appointment/delete", {
                params: {
                    id: id,
                },
            })
            .then((response) => {
                console.log(response);
                router.push("/calendar");
            })
            .catch((error) => {
                console.log(error);
            });
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
                    
                }
                if (response.data.role === "student") {
                    router.push("/calendar");
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    router.push("/login");
                } else {
                    console.error("Fehler beim Überprüfen des Tokens:", error);
                }
            });

        axios
            .get("/api/appointment/getById", {
                params: {
                    id: appointment_id,
                },
            })
            .then((response) => {
                console.log(response);
                setIsLoading(false);
                setAppointment(response.data);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        console.log("token", token);
    }, [token]);

    const isoToString = (isoString) => {
        let dateString = isoString.split("T")[0];
        let year = dateString.split("-")[0];
        let month = dateString.split("-")[1];
        let day = dateString.split("-")[2];

        let time = isoString
            .substring(isoString.indexOf("T") + 1)
            .split(":")[0];
        let hour = isoString
            .substring(isoString.indexOf("T") + 1)
            .split(":")[1];

        dateString =
            day + "." + month + "." + year + ", um " + time + ":" + hour;
        return dateString;
    };

    return (
        <main className="flex flex-col items-center justify-between">
            {isLoading ? (
                <div className="flex justify-center items-center h-screen w-screen">
                    <PulseLoader
                        color={"#3c3ffa"}
                        loading={isLoading}
                        size={30}
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center min-h-screen">
                    <div className="w-full space-x-2">
                        <div className="flex items-center justify-center">
                            <BackToCalendar />
                            <h1 className="title">{appointment.title}</h1>
                            <TrashBinIcon />
                            <ShareLinkIcon />
                            <EditPenIcon />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl">
                            <span className="subtitle">Datum: </span> Vom{" "}
                            {isoToString(appointment.start_time)} bis{" "}
                            {isoToString(appointment.end_time)}
                        </p>
                        <p className="text-2xl">
                            <span className="subtitle">Ort: </span>
                            {appointment.location}
                        </p>
                    </div>

                    {appointment.notes ? (
                        <div className="mt-12">
                            <p className="subtitle">Notizen</p>
                            <ReactMarkdown>{appointment.notes}</ReactMarkdown>
                        </div>
                    ) : (
                        <p className="subtitle mt-12">
                            Keine Notizen eingetragen!
                        </p>
                    )}
                </div>
            )}
        </main>
    );
}

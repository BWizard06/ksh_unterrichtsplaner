"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import ReactMarkdown from "react-markdown";
import ArrowLeftRectangle from "@/components/ArrowLeftRectangle";
import TrashBinIcon from "@/components/TrashBinIcon";
import ShareLinkIcon from "@/components/ShareLinkIcon";
import EditPenIcon from "@/components/EditPenIcon";
import "@/app/globals.css";
import { useRouter } from "next/navigation";

export default function LessonDetail() {
    const searchParams = useParams();
    const lesson_id = searchParams.lesson_id;
    const [lesson, setLesson] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState();
    const router = useRouter();
    const [visibleFiles, setVisibleFiles] = useState([]);

    const exportFile = (file) => {
        fetch(`/api/file/getBinaryById?id=${file.id}`)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${file.file_name}`;
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) =>
                console.error("Fehler beim Exportieren der Dateien", error)
            );
    };

    function shortenString(string) {
        let lastDot = string.lastIndexOf(".");
        let StringafterDot = string.substring(lastDot);
        return string.substring(0, 10) + "..." + StringafterDot;
    }

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
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    router.push("/login");
                } else {
                    console.error("Fehler beim Überprüfen des Tokens:", error);
                }
            });

        axios
            .get("/api/lesson/getById", {
                params: {
                    id: lesson_id,
                },
            })
            .then((response) => {
                console.log(response);
                setIsLoading(false);
                setLesson(response.data);
                const visibleFiles = response.data.files.filter(
                    (file) => file.visibility
                );
                setVisibleFiles(visibleFiles);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        console.log("token", token);
    }, [token]);

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
                            <ArrowLeftRectangle />
                            <h1 className="title">{lesson.title}</h1>
                            <TrashBinIcon />
                            <ShareLinkIcon />
                            <EditPenIcon />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl m-[4.5px]">
                            <span className="subtitle">Fach: </span>
                            {lesson.subject}
                        </p>
                        <p className="text-2xl">
                            <span className="subtitle">Klasse: </span>
                            {lesson.class.name}
                        </p>
                        <p className="text-2xl">
                            <span className="subtitle">Lektionstyp: </span>
                            {lesson.lesson_type}
                        </p>
                        <p className="text-2xl">
                            <span className="subtitle">Lektionsstart: </span>
                            {isoToString(lesson.start_time)}
                        </p>
                        <p className="text-2xl">
                            <span className="subtitle">Lektionsende: </span>
                            {isoToString(lesson.end_time)}
                        </p>
                        <p className="text-2xl">
                            <span className="subtitle">Zimmer: </span>
                            {lesson.room}
                        </p>
                        {token.role === "teacher" ? (
                            <div className="text-2xl flex-row">
                                <span className="subtitle">Files: </span>
                                {lesson.files.map((file) => (
                                    <button
                                        key={file.id}
                                        className="bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-700 focus:outline-none border-none rounded-xl text-white text-sm cursor-pointer px-2 py-1 m-1"
                                        onClick={() => exportFile(file)}
                                    >
                                        {shortenString(file.file_name)}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            visibleFiles.length > 0 && (
                                <div className="text-2xl flex-row">
                                    <span className="subtitle">Files: </span>
                                    {visibleFiles.map((file) => (
                                        <button
                                            key={file.id}
                                            className="bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-700 focus:outline-none border-none rounded-xl text-white text-sm cursor-pointer px-2 py-1 m-1"
                                            onClick={() => exportFile(file)}
                                        >
                                            {shortenString(file.file_name)}
                                        </button>
                                    ))}
                                </div>
                            )
                        )}
                    </div>

                    {lesson.lesson_goals ? (
                        <div className="mt-12">
                            <p className="subtitle">Lektionsziele</p>
                            <ReactMarkdown>{lesson.lesson_goals}</ReactMarkdown>
                        </div>
                    ) : (
                        <p className="subtitle mt-12">
                            Keine Lektionsziele eingetragen!
                        </p>
                    )}

                    {lesson.public_notes ? (
                        <div className="mt-12">
                            <p className="subtitle">Notizen für Schüler</p>
                            <ReactMarkdown>{lesson.public_notes}</ReactMarkdown>
                        </div>
                    ) : (
                        <p className="subtitle mt-12">
                            Keine Notizen eingetragen!
                        </p>
                    )}

                    {token.role === "teacher" && lesson.private_notes && (
                        <div className="mt-12">
                            <p className="subtitle">Notizen für Lehrer</p>
                            <ReactMarkdown>
                                {lesson.private_notes}
                            </ReactMarkdown>
                        </div>
                    )}

                    {lesson.homework ? (
                        <div className="mt-12">
                            <p className="subtitle">Hausaufgaben</p>
                            <ReactMarkdown>{lesson.homework}</ReactMarkdown>
                        </div>
                    ) : (
                        <p className="subtitle mt-12">
                            Keine Hausaufgaben eingetragen!
                        </p>
                    )}
                </div>
            )}
        </main>
    );
}

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
import "@/app/splendor.min.css";


export default function LessonDetail() {
    const searchParams = useParams();
    const lesson_id = searchParams.lesson_id;
    const [lesson, setLesson] = useState();
    const [isLoading, setIsLoading] = useState(true);

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

    const isoToString = (isoString) =>{
        let dateString = isoString.split('T')[0]
        let year = dateString.split('-')[0]
        let month = dateString.split('-')[1]
        let day = dateString.split('-')[2]

        let time = isoString.substring(isoString.indexOf('T') + 1).split(':')[0]
        let hour = isoString.substring(isoString.indexOf('T') + 1).split(':')[1]

        dateString = day+'.'+month+'.'+year+', um '+time+':'+hour
        return dateString
    }


    useEffect(() => {
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
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);

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
                            <h1 className="title">
                                {lesson.title}
                            </h1>
                            <TrashBinIcon />
                            <ShareLinkIcon />
                            <EditPenIcon />
                        </div>
                    
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl m-[4.5px]"><span className="subtitle">Fach: </span>{lesson.subject}</p>
                        <p className="text-2xl"><span className="subtitle">Klasse: </span>{lesson.class.name}</p>
                        <p className="text-2xl"><span className="subtitle">Lektionstyp: </span>{lesson.lesson_type}</p>
                        <p className="text-2xl"><span className="subtitle">Datum: </span> Vom {isoToString(lesson.start_time)} bis {isoToString(lesson.end_time)}</p>
                        <p className="text-2xl"><span className="subtitle">Zimmer: </span>{lesson.room}</p>
                    </div>
                    
                    {lesson.lesson_goals ? (
                        <div className="mt-12">
                            <p className="subtitle">Lektionsziele</p>
                            <ReactMarkdown>{lesson.lesson_goals}</ReactMarkdown>
                        </div>
                        ):(
                        <p className="subtitle mt-12">Keine Lektionsziele eingetragen!</p>
                        )}
                    
                    {lesson.public_notes ? (
                        <div className="mt-12">
                            <p className="subtitle">Notizen</p>
                            <ReactMarkdown>{lesson.public_notes}</ReactMarkdown>
                        </div>
                    ):(
                        <p className="subtitle mt-12">Keine Notizen eingetragen!</p>
                    )}

                    {lesson.homework ? (
                        <div className="mt-12">
                            <p className="subtitle">Hausaufgaben</p>
                            <ReactMarkdown>{lesson.homework}</ReactMarkdown>
                        </div>
                    ):(
                        <p className="subtitle mt-12">Keine Hausaufgaben eingetragen!</p>
                    )}
                    
                    {lesson.files.map((file) => (
                        <div key={file.id} className="flex items-center justify-center">
                            <button
                                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => exportFile(file)}
                            >
                                {file.file_name}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

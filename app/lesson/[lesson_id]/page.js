"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import ReactMarkdown from "react-markdown";
import { PencilSquareIcon, TrashIcon, ShareIcon } from "@heroicons/react/24/outline";
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
    });

    return (
        <div>
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
                    <div className="space-y-2 bg-indigo-300/10 max-w-max p-10 rounded-xl">
                        <div className="flex items-center justify-left mb-5">
                            <PencilSquareIcon className='w-12 h-12 mr-3' stroke='blue' onClick={(e)=>console.log('aa')} />
                            <TrashIcon className='w-12 h-12 mr-3 hover:cursor-pointer' stroke='red' />
                            <ShareIcon className='w-12 h-12' />
                        </div>
                        <div className="flex items-center justify-center m-3">
                            <h1 className="text-3xl font-extrabold text-sky-300 m-3">
                                {lesson.title}
                            </h1>
                        </div>
                        <ReactMarkdown>{lesson.public_notes}</ReactMarkdown>
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
                </div>
            )}
        </div>
    );
}

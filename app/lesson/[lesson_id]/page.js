"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { marked } from 'marked';
import 'github-markdown-css';


export default function LessonDetail() {
    const searchParams = useParams();
    const lesson_id = searchParams.lesson_id;
    const [lesson, setLesson] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const getMarkdownText = (text) => {
        const rawMarkup = marked(text);
        return {__html: rawMarkup};
    };

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
                <div>
                    <h1 className="text-3xl font-extrabold text-sky-300">
                        {lesson.title}
                    </h1>
                    <div
                        className="markdown-body"
                        dangerouslySetInnerHTML={getMarkdownText(lesson.homework)}
                    />
                </div>
            )}
        </div>
    );
}

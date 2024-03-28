"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function LessonDetail() {
    const searchParams = useParams();
    const lesson_id = searchParams.lesson_id;
    const [lesson, setLesson] = useState();
    const [isLoading, setIsLoading] = useState(true);

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

    return <div>{isLoading ? <div>Loading...</div> : lesson.title}</div>;
}

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import BackBtn from "@/components/BackBtn";

export default function Homework() {
    const [homework, setHomework] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState();
    const [role, setRole] = useState();
    const [username, setUsername] = useState();
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
                    setUsername(response.data.username);
                    if (response.data.role === "teacher") {
                        router.push("/calendar");
                        setIsLoading(false);
                        return;
                    } else {
                        axios
                            .get("/api/student/getByName", {
                                params: {
                                    username: response.data.username,
                                },
                            })
                            .then((response) => {
                                axios
                                    .get("/api/class/getById", {
                                        params: {
                                            id: response.data.classId,
                                        },
                                    })
                                    .then((response) => {
                                        setLessons(response.data.lessons);
                                        setIsLoading(false);
                                    });
                            })
                            .catch((error) => {
                                console.log(error);
                                setIsLoading(false);
                            });
                    }
                } else {
                    router.push("/login");
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
        const newHomework = lessons
            .map((lesson) => {
                return {
                    dueDate: lesson.start_time,
                    homework: lesson.homework,
                    subject: lesson.subject,
                    id: lesson.id,
                    name: lesson.title,
                };
            })
            .filter((hw) => hw.homework != null);

        setHomework(newHomework);
        console.log("lessons: ", lessons);
    }, [lessons]);

    useEffect(() => {
        console.log("homework: ", homework);
    }, [homework]);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            {isLoading ? (
                <Loader isLoading={isLoading} />
            ) : (
                <div className="w-full max-w-4xl p-5">
                    <h1 className="title text-center mb-10">
                        Hausaufgaben für {username}
                    </h1>
                    <BackBtn destination="calendar" />
                    {homework.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Fälligkeitsdatum
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Hausaufgabe
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Fach
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Lektion
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {homework.map((hw, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(
                                                        hw.dueDate
                                                    ).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {hw.homework}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {hw.subject}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div
                                                    className="text-sm text-gray-900 underline cursor-pointer"
                                                    onClick={() => {
                                                        router.push(
                                                            `/lesson/${hw.id}`
                                                        );
                                                    }}
                                                >
                                                    {hw.name}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-xl">
                            Keine Hausaufgaben gefunden.
                        </p>
                    )}
                </div>
            )}
        </main>
    );
}

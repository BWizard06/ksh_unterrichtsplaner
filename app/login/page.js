"use client";

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [userType, setUserType] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [availableClasses, setAvailableClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const router = useRouter()

    useEffect(() => {
        axios.get("/api/class/getAll").then((response) => {
            setAvailableClasses(response.data);
        });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (userType === "Student") {
            axios
                .post("/api/student/login", {
                    username,
                })
                .then((response) => {
                    const { token } = response.data;
                    localStorage.setItem("token", token);
                    router.push('/calendar')
                });
        } else {
            axios
                .post("/api/teacher/login", {
                    username,
                    password,
                })
                .then((response) => {
                    const { token } = response.data;
                    localStorage.setItem("token", token);
                    router.push('/calendar')
                });
        }
    };

    useEffect(() => {
        console.log("Selected Class", selectedClass);
    }, [selectedClass]);

    return (
        <main className="flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full space-y-8">
                {!userType ? (
                    <div className="space-y-16 flex justify-center">
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Anmelden als ...
                        </h2>
                        <div className="flex-row justify-center items-center absolute space-y-5">
                            <button
                                onClick={() => setUserType("Teacher")}
                                className="useTeacherBtn"
                            >
                                Lehrer
                            </button>
                            <button
                                onClick={() => setUserType("Student")}
                                className="useStudentBtn"
                            >
                                Schüler
                            </button>
                        </div>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6">
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Anmelden als{" "}
                            {userType === "Teacher" ? "Lehrer" : "Schüler"}
                        </h2>
                        {userType === "Teacher" && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Benutzername"
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Passwort"
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        )}
                        {userType === "Student" && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Benutzername"
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleSubmit}
                        >
                            Anmelden
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}

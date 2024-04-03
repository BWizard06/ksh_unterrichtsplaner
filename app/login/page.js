"use client";

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LoginPage() {
    const [userType, setUserType] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [availableClasses, setAvailableClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

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
                });
        }
    };

    useEffect(() => {
        console.log("Selected Class", selectedClass);
    }, [selectedClass]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full space-y-8">
                {!userType ? (
                    <div className="space-y-4">
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Anmelden als
                        </h2>
                        <button
                            onClick={() => setUserType("Teacher")}
                            className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Lehrer
                        </button>
                        <button
                            onClick={() => setUserType("Student")}
                            className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                            Schüler
                        </button>
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
        </div>
    );
}

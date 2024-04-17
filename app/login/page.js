"use client";

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import BackBtn from "@/components/BackBtn";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
    const [userType, setUserType] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [availableClasses, setAvailableClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const {toast} = useToast()
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
                })
                .catch((error)=>{
                    toast({
                        title: "Login fehlgeschlagen",
                        description: `Error: ${error.response.data.message}` ,
                        variant: "destructive",
                        duration: 5000,
                    });
                })
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
                })
                .catch((error)=>{
                    toast({
                        title: "Login fehlgeschlagen",
                        description: `Error: ${error.response.data.message}` ,
                        variant: "destructive",
                        duration: 5000,
                    });
                });
        }
    };

    useEffect(() => {
        console.log("Selected Class", selectedClass);
    }, [selectedClass]);

    return (
        <main className="flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full space-y-8">
                <BackBtn destination='/'/>
                {!userType ? (
                    <div className="space-y-16 flex justify-center">
                        <div className="flex justify-center items-center">
                            <h2 className="title">
                                Anmelden als ...
                            </h2>
                        </div>
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
                        <h2 className="title text-center">
                            Anmelden als{" "}
                            {userType === "Teacher" ? "Lehrer" : "Schüler"}
                        </h2>
                        {userType === "Teacher" && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Benutzername"
                                    className="registerInputField rounded-t-md"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Passwort"
                                    className="registerInputField rounded-b-md"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        )}
                        {userType === "Student" && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Benutzername"
                                    className="registerInputField rounded-md"
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </div>
                        )}
                        <div className="flex justify-center items-center">
                            <button
                                type="submit"
                                className="loginRegisterBtn"
                                onClick={handleSubmit}
                            >
                                Anmelden
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}

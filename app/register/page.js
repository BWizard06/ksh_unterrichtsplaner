"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import axios from "axios";

export default function Login() {
    const [userType, setUserType] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [teacherClasses, setTeacherClasses] = useState([]);
    const [numberOfClasses, setNumberOfClasses] = useState(0);
    const [classIds, setClassIds] = useState([]);
    const [availableClasses, setAvailableClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const router = useRouter();

    useEffect(() => {
        axios.get("/api/class/getAll").then((response) => {
            setAvailableClasses(response.data);
        });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (userType === "Student") {
            axios
                .post("/api/student/create", {
                    classId: selectedClass,
                    username,
                })
                .then((response) => {
                    const {token} = response.data;
                    localStorage.setItem("token", token);
                });
        } else {
            const createdClasses = await Promise.all(
                teacherClasses.map((teacherClass) =>
                    axios
                        .post("/api/class/create", { name: teacherClass })
                        .then((response) => response.data.id)
                )
            );
            setClassIds(createdClasses);

            axios
                .post("/api/teacher/create", {
                    username,
                    password,
                    email,
                    classIds: createdClasses,
                })
                .then((response) => {
                    const { token } = response.data;
                    const { username } = jwt.decode(token);
                    localStorage.setItem("token", token);
                    localStorage.setItem("username", username);
                    router.push("/calendar");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        console.log("Class Ids", classIds);
    }, [classIds]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {!userType ? (
                    <div className="space-y-4">
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
                    <>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Registrieren als{" "}
                            {userType === "Teacher" ? "Lehrer" : "Schüler"}
                        </h2>
                        {userType === "Teacher" && (
                            <div>
                                <div className="rounded-md shadow-sm -space-y-px">
                                    <input
                                        type="text"
                                        placeholder="Benutzername"
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />
                                    <input
                                        type="password"
                                        placeholder="Passwort"
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                    <input
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        type="number"
                                        placeholder="Anzahl Klassen"
                                        onChange={(e) =>
                                            setNumberOfClasses(e.target.value)
                                        }
                                    />
                                    {numberOfClasses > 0 && (
                                        <div>
                                            {Array.from({
                                                length: numberOfClasses,
                                            }).map((_, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    placeholder={`Klassenname ${
                                                        index + 1
                                                    }`}
                                                    onChange={(e) => {
                                                        const newClasses = [
                                                            ...teacherClasses,
                                                        ];
                                                        newClasses[index] =
                                                            e.target.value;
                                                        setTeacherClasses(
                                                            newClasses
                                                        );
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="text-red-500 text-center mt-2">
                                            {error}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={handleSubmit}
                                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Anmelden
                                        </button>
                                    </div>
                                </div>
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
                                <select
                                    placeholder="Klassenname"
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    onChange={(e) =>
                                        setSelectedClass(e.target.value)
                                    }
                                >
                                    <option value="deafult" selected disabled>
                                        Klasse auswählen
                                    </option>
                                    {availableClasses &&
                                    availableClasses.length > 0 ? (
                                        availableClasses.map((classItem) => (
                                            <option
                                                key={classItem.id}
                                                value={classItem.id}
                                            >
                                                {classItem.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="Keine Klassen gefunden">
                                            Keine Klassen gefunden
                                        </option>
                                    )}
                                </select>
                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={handleSubmit}
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Anmelden
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

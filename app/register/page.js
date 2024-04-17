"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import axios from "axios";
import BackBtn from "@/components/BackBtn";
import { useToast } from "@/components/ui/use-toast";


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
    const [isEintragenChecked, setIsEintragenChecked] = useState(false);
    const [selectedClass, setSelectedClass] = useState([]);
    const {toast} = useToast()
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
                    const { token } = response.data;
                    localStorage.setItem("token", token);
                    router.push("/calendar");
                })
                .catch((error)=>{
                    toast({
                        title: "Registrieren fehlgeschlagen",
                        description: `Error: ${error.response.data.error}` ,
                        variant: "destructive",
                        duration: 5000,
                    });
                });
        } else {
            const createdClasses = await Promise.all(
                teacherClasses.map((teacherClass) =>
                    axios
                        .post("/api/class/create", { name: teacherClass })
                        .then((response) => response.data.id)
                )
            );
            const allClassIds = [...createdClasses, ...selectedClass];

            axios
                .post("/api/teacher/create", {
                    username,
                    password,
                    email,
                    classIds: allClassIds,
                })
                .then((response) => {
                    const { token } = response.data;
                    const { username } = jwt.decode(token);
                    localStorage.setItem("token", token);
                    localStorage.setItem("username", username);
                    router.push("/calendar");
                })
                .catch((error)=>{
                    toast({
                        title: "Registrieren fehlgeschlagen",
                        description: `Error: ${error.response.data.error}` ,
                        variant: "destructive",
                        duration: 5000,
                    });
                });
        }
    };
    useEffect(() => {
        console.log("teacher classes", teacherClasses);
    }, [teacherClasses]);

    useEffect(() => {
        console.log("Class Ids", classIds);
    }, [classIds]);

    return (
        <main className="flex items-center justify-center min-h-screen w-full">
            <div className="space-y-8">
                <BackBtn destination="/" />
                {!userType ? (
                    <div className="space-y-16 flex justify-center">
                        <h2 className="title">Registrieren als ...</h2>
                        <div className="flex-row absolute justify-center items-center space-y-5">
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
                    <>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Registrieren als{" "}
                            {userType === "Teacher" ? "Lehrer" : "Schüler"}
                        </h2>
                        {userType === "Teacher" && (
                            <div>
                                <div className="rounded-md -space-y-px">
                                    <input
                                        type="text"
                                        placeholder="Benutzername"
                                        className="registerInputField rounded-t-md"
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />
                                    <input
                                        type="password"
                                        placeholder="Passwort"
                                        className="registerInputField"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="registerInputField"
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                    <select
                                        placeholder="Klassen auswählen"
                                        className="registerInputField"
                                        onChange={(e) =>
                                            setSelectedClass(() =>
                                                setSelectedClass(
                                                    Array.from(
                                                        e.target
                                                            .selectedOptions,
                                                        (option) => option.value
                                                    )
                                                )
                                            )
                                        }
                                        multiple
                                    >
                                        <option
                                            value="deafult"
                                            selected
                                            disabled
                                        >
                                            Klasse auswählen
                                        </option>
                                        {availableClasses &&
                                        availableClasses.length > 0 ? (
                                            availableClasses.map(
                                                (classItem) => (
                                                    <option
                                                        key={classItem.id}
                                                        value={classItem.id}
                                                    >
                                                        {classItem.name}
                                                    </option>
                                                )
                                            )
                                        ) : (
                                            <option
                                                value="Keine Klassen gefunden"
                                                disabled
                                            >
                                                Keine Klassen gefunden
                                            </option>
                                        )}
                                    </select>
                                    <div className="space-x-4 items-center flex justify-center">
                                        <label>Neue Klassen eintragen?</label>
                                        <input
                                            id="eintragen"
                                            type="checkbox"
                                            className="cursor-pointer pt-10"
                                            onChange={(e) =>
                                                setIsEintragenChecked(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </div>
                                    {isEintragenChecked && (
                                        <>
                                            <input
                                                className="rounded-b-md registerInputField"
                                                type="number"
                                                placeholder="Anzahl Klassen"
                                                onChange={(e) =>
                                                    setNumberOfClasses(
                                                        e.target.value
                                                    )
                                                }
                                                min={0}
                                            />
                                            {numberOfClasses > 0 && (
                                                <div className="grid grid-cols-2">
                                                    {Array.from({
                                                        length: numberOfClasses,
                                                    }).map((_, index) => (
                                                        <input
                                                            key={index}
                                                            type="text"
                                                            placeholder={`Klassenname ${
                                                                index + 1
                                                            }`}
                                                            className="rounded-md w-1/2 registerInputField"
                                                            onChange={(e) => {
                                                                const newClasses =
                                                                    [
                                                                        ...teacherClasses,
                                                                    ];
                                                                newClasses[
                                                                    index
                                                                ] =
                                                                    e.target.value;
                                                                setTeacherClasses(
                                                                    newClasses
                                                                );
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {error && (
                                        <div className="text-red-500 text-center mt-2">
                                            {error}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-center mt-20">
                                        <button
                                            onClick={handleSubmit}
                                            className="loginRegisterBtn mt-[24px]"
                                        >
                                            Registrieren
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
                                    className="registerInputField rounded-t-md"
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                                <select
                                    placeholder="Klassenname"
                                    className="registerInputField rounded-b-md"
                                    onChange={(e) =>
                                        setSelectedClass(e.target.value)
                                    }
                                    required
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
                                        className="loginRegisterBtn mt-[24px]"
                                    >
                                        Registrieren
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

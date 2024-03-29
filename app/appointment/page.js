'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";


export default function appointmentInput(){
    const [title, setTitle] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [notes, setNotes] = useState();
    const {toast} = useToast();

    const handleSubmit = (event) => {
        event.preventDefault();

        axios
            .post("/api/appointment/create", {
                teacherId: "65f35c82a3625a11fa36b61e",
                title: title,
                start_time: startTime,
                end_time: endTime,
                notes: notes,
            })
            .then((response) => {
                console.log(response);
                toast({
                    title: "Termin erstellt",
                    description: "Der Termin wurde erfolgreich erstellt.",
                    variant: "success",
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const dateSplitToIso = (date, time) => {
        const [year, month, day] = date.split("-");
        return `${year}-${month}-${day}T${time}:00`;
    };


    return (
        <div className="flex items-center justify-center text-center min-h-screen w-full">
            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-sky-300">
                    Termin erfassen
                </h1>

                <div id="appointmentInput" className="flex flex-col justify-center items-center inputForm">
                    <form>
                        <div id="general" className="space-x-3 mt-4">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Titel"
                                required
                                className="w-auto"
                                onChange={(event) => setTitle(event.target.value)}
                            />
                        </div>

                        <div id="time" className="mt-5 space-x-3">
                            <label
                                htmlFor="start"
                                className="text-sky-500"
                            >
                                Von:
                            </label>
                            <input
                                id="start"
                                type="datetime-local"
                                required
                                min={"07:00"}
                                max={"22:00"}
                                step={900}
                                onChange={(e) =>
                                    setStartTime(
                                        dateSplitToIso(
                                            e.target.value.split(
                                                "T"
                                            )[0],
                                            e.target.value.split("T")[1]
                                        )
                                    )
                                }
                            />
                            <label
                                htmlFor="end"
                                className="text-sky-500"
                            >
                                Bis:
                            </label>
                            <input
                                id="end"
                                type="datetime-local"
                                required
                                min={"07:00"}
                                max={"22:00"}
                                step={900}
                                onChange={(e) =>
                                    setEndTime(
                                        dateSplitToIso(
                                            e.target.value.split(
                                                "T"
                                            )[0],
                                            e.target.value.split("T")[1]
                                        )
                                    )
                                }
                            />
                        </div>

                        <div id="notes" className="mt-8">
                            <textarea
                                id="notes"
                                name="notes"
                                placeholder="Ihre Notizen"
                                onChange={(event) =>setNotes(event.target.value)}
                            />
                        </div>

                        <div id="saveAppointment" className="mt-6">
                            <input
                                type="submit"
                                value="Termin erfassen"
                                className="mt-6"
                                onClick={handleSubmit}
                            />
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
    )
}
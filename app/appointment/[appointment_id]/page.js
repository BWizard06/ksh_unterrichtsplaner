"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";

export default function LessonDetail() {
    const searchParams = useParams();
    const appointment_id = searchParams.appointment_id;
    const [appointment, setAppointment] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/api/appointment/getById", {
                params: {
                    id: appointment_id,
                },
            })
            .then((response) => {
                console.log(response);
                setIsLoading(false);
                setAppointment(response.data);
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
                appointment.title
            )}
        </div>
    );
}

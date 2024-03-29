"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
const {useRouter} = require('next/navigation')



export default function AppointmentDetail() {
    const searchParams = useParams();
    const appointment_id = searchParams.appointment_id;
    const [appointment, setAppointment] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter()

    const deleteAppointment = (id) => {
        axios
            .delete("/api/appointment/delete", {
                params: {
                    id: id,
                },
            })
            .then((response) => {
                console.log(response);
                router.push('/calendar');
            })
            .catch((error) => {
                console.log(error);
            });
    }

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
    }, []);

    const isoToString = (isoString) =>{
        let dateString = isoString.split('T')[0]
        let year = dateString.split('-')[0]
        let month = dateString.split('-')[1]
        let day = dateString.split('-')[2]

        let time = isoString.substring(isoString.indexOf('T') + 1).split(':')[0]
        let hour = isoString.substring(isoString.indexOf('T') + 1).split(':')[1]

        dateString = day+'.'+month+'.'+year+', um '+time+':'+hour
        return dateString
    }

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
                <div className="flex items-center justify-center text-center min-h-screen w-full">
                    <div className="space-y-2 bg-indigo-300/10 max-w-max p-10 rounded-xl">
                        <div className="flex items-center justify-left mb-5">
                            <PencilSquareIcon className='w-12 h-12 mr-3' stroke='blue'/>
                            <TrashIcon 
                                className='w-12 h-12 hover:cursor-pointer' 
                                stroke='red' 
                                onClick={() => deleteAppointment(appointment.id)}
                            />
                        </div>
                        <div className='flex items-center justify-center'>
                            <h1 className='text-3xl font-extrabold text-sky-300'>{appointment.title}</h1>
                        </div>
                        <div className="flex items-center justify-center">  
                            <h2 className="text-xl font-bold text-sky-300 mt-6 mb-12">{isoToString(appointment.start_time)} bis {isoToString(appointment.end_time)}</h2>
                        </div>
                        <ReactMarkdown className="markdown-body">{appointment.notes}</ReactMarkdown>                   
                    </div>
                </div>
            )}
        </div>
    );
}

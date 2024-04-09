import React from "react";
import { PulseLoader } from "react-spinners";

export default function Loader({isLoading}) {
    return (
        <div className='flex justify-center items-center min-h-screen w-screen'>
            <PulseLoader color='#3c3ffa' size={30} loading={isLoading} />
        </div>
    )
}
import React from "react";
import { PulseLoader } from "react-spinners";

/**
 * a loading spinner component
 * so that it won't have to be written multiple times.
 * Loading animation should make the user feel like the app is working
 * and not frozen.
 * @param {*} isLoading 
 * @returns a jsx element that is a loading spinner
 */
export default function Loader({isLoading}) {
    return (
        <div className='flex justify-center items-center min-h-screen w-screen'>
            <PulseLoader color='#3c3ffa' size={30} loading={isLoading} />
        </div>
    )
}
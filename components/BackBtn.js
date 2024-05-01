import React from "react";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

/**
 * a custom back button that can be given any destination
 * so that the user won't have to use the browser back button
 * and run into any issues when adding / updating events
 * @param {*} destination 
 * @returns a jsx element that is a back button
 */
export default function BackBtn({ destination }) {
    const router = useRouter();
    return (
        <ArrowUturnLeftIcon 
            className='w-10 h-10 hover:cursor-pointer absolute left-6 top-0 mt-6'
            {...destination ? { onClick: () => router.push(`/${destination}`) } : { onClick: () => router.back() }}
        />
    )
}
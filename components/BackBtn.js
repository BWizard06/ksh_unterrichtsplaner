import React from "react";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";


export default function BackBtn({ destination }) {
    const router = useRouter();
    return (
        <ArrowUturnLeftIcon 
            className='w-10 h-10 hover:cursor-pointer absolute left-6 top-0 mt-6'
            onClick={()=>{router.back()}}
        />
    )
}
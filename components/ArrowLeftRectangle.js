import React from "react";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";


export default function ArrowLeftRectangle() {
    const router = useRouter();
    return (
        <ArrowLeftStartOnRectangleIcon 
            className="w-10 h-10 hover:cursor-pointer absolute left-32" 
                onClick={()=>{router.push('/calendar')}}/>
    )
}
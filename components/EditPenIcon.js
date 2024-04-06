import React from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function EditPenIcon({onClick}) {
    return (
        <PencilSquareIcon 
            className='w-10 h-10 hover:cursor-pointer right-96 absolute'
            stroke="blue"
            onClick={onClick}
        />
    )
}
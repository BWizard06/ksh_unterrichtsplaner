import React from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

/**
 * a pencil icon that can be clicked to edit an event
 * @param {*} onClick 
 * @returns a jsx element that is a pencil icon
 */
export default function EditPenIcon({onClick}) {
    return (
        <PencilSquareIcon 
            className='w-10 h-10 hover:cursor-pointer right-96'
            stroke="blue"
            onClick={onClick}
        />
    )
}
import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

/**
 * a trash bin icon that can be clicked to delete an event
 * @param {*} onClick 
 * @returns a jsx element that is a trash bin icon
 */
export default function TrashBinIcon({onClick}) {
    return (
        <TrashIcon
            className="w-10 h-10 hover:cursor-pointer right-64"
            stroke="red"
            onClick={onClick}
        />
    );
}

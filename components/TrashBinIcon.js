import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function TrashBinIcon({onClick}) {
    return (
        <TrashIcon
            className="w-10 h-10 hover:cursor-pointer right-64 absolute"
            stroke="red"
            onClick={onClick}
        />
    );
}

import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function TrashBinIcon() {
    const router = useRouter();
    
    return (
        <TrashIcon 
            className='w-10 h-10 hover:cursor-pointer right-64 absolute' 
            stroke='red'
            onClick={() => {
                router.push("/calendar")
            }}
        />
    )
}
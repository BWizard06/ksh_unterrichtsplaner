import React from "react";
import { ShareIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function ShareLinkIcon() {
    const router = useRouter();
    
    return (
        <ShareIcon 
            className='w-10 h-10 hover:cursor-pointer right-80 absolute'
            onClick={() => {
                let url = navigator.clipboard.writeText(window.location.href)
                console.log('Link kopiert:' + url)
            }}
        />
    )
}
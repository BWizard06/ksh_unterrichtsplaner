import React from "react";
import { ShareIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/components/ui/use-toast";

/**
 * a share link icon that can be clicked to copy the current url
 * @returns a jsx element that is a share link icon
 
 */
export default function ShareLinkIcon() {
    const { toast } = useToast();
    
    return (
        <ShareIcon 
            className='w-10 h-10 hover:cursor-pointer right-80'
            onClick={() => {
                let url = navigator.clipboard.writeText(window.location.href)
                console.log('Link kopiert:' + url)
                toast({
                    title: 'Link kopiert',
                    description: 'Der Link wurde in die Zwischenablage kopiert',
                    variant: 'default',
                    duration: 5000,
                })
            }}
        />
    )
}
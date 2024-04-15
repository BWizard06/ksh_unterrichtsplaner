import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftStartOnRectangleIcon} from '@heroicons/react/24/outline';

export default function LogoutBtn() {
    const router = useRouter();
    return (
        <ArrowLeftStartOnRectangleIcon 
            className='w-10 h-10 hover:cursor-pointer left-6 top-0'
            onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                router.push("/");
            }}
        />
    )
}
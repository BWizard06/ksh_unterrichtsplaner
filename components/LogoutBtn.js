import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftStartOnRectangleIcon} from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";

export default function LogoutBtn() {
    const router = useRouter();
    return (
        <Button
            className="flex items-center justify-center right-0"
            onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                router.push("/");
            }}
            variant='destructive'
        >
            <ArrowLeftStartOnRectangleIcon className="w-6 h-6 text-white" />
            Logout
        </Button>
    )
}

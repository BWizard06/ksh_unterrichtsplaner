import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftStartOnRectangleIcon} from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";

/**
 * a logout button that removes the token and username from local storage
 * and redirects the user to the login page
 * @returns a jsx element that is a logout button
 */
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

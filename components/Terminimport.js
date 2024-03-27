import React from "react";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";

const Terminimport = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <form className="flex flex-col mt-4">
            <div className="relative flex items-center">
                <ArrowUpOnSquareIcon className="h-12 w-6 absolute mt-1" />
                <input
                id="terminimport"
                type="file"
                placeholder="Terminimport"
                required
                className="rounded-md p-2 pl-7"
                />
            </div>
            <input
                type="submit"
                value="Importieren"
                className="bg-gradient-to-b from-slate-300 via-gray-400 to-neutral-500 rounded-md p-2 mt-8 cursor-pointer"
            />
            </form>
        </div>
    );
    }

export default Terminimport;
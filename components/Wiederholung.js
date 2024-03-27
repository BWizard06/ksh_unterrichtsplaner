'use client'
import React, { useState } from "@heroicons/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const Wiederholung = () => {
    const [isVisible, setIsExpanded] = useState(false);
    return (
        <div className="flex flex-col items-center justify-between p-5">
            <button onClick={() => setIsExpanded(!isVisible)} className="flex items-center justify-center">
                <ArrowPathIcon className="h-6 w-6" />
                <span className="ml-2">Wiederholung</span>
            </button>
            {isVisible && (
                <div className="flex flex-col items-center justify-between p-5">
                    <p>Wiederholung</p>
                </div>
            )}
        </div>
    );
}

export default Wiederholung;
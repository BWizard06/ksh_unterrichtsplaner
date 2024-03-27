'use client';
import React from "react";
import {EyeSlashIcon, EyeIcon} from '@heroicons/react/24/outline';
import {useState} from "react";

const PasswordInput = () => {
    const [slashed, setSlashed] = useState(true);
    return (
        <>
            <input id="password" type={slashed ? "password" : "text"} placeholder="Passwort" required className="rounded-md p-2 pl-7 mt-4" />
            {slashed ? <EyeSlashIcon className="h-12 w-6 absolute mt-4" onClick={() => setSlashed(false)} /> : <EyeIcon className="h-12 w-6 absolute mt-4" onClick={() => setSlashed(true)} />}
        </>

    );
};

export default PasswordInput;
'use client';
import React from "react";
import {EyeSlashIcon, EyeIcon} from '@heroicons/react/24/outline';
import {useState} from "react";
import {input} from '@nextui-org/react';

const PasswordInput = () => {
    const [slashed, setSlashed] = useState(true);
    return (
        <Input
            placeholder='Passwort'
            startContent={
                <button className=''
            }
        />

    );
};

export default PasswordInput;
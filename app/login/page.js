import { EnvelopeIcon } from '@heroicons/react/20/solid';
import PasswordInput from '@/components/PasswordInput';
import React from 'react';

export default function LoginPage(){
    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <div className="bg-gradient-to-b from-slate-300 via-gray-400 to-neutral-500 p-20 rounded-md font-bold text-2xl">
                    <h1 className="flex justify-center text-4xl pb-9">Login</h1>
                    <form className="flex flex-col mt-4">
                        <div className="relative flex items-center">
                            <EnvelopeIcon className="h-12 w-6 absolute mt-1" />
                            <input id="email" type="email" placeholder="E-Mail" required className="rounded-md p-2 pl-7" />
                        </div>
                        <div className="relative flex items-center">
                            <PasswordInput />
                        </div>
                        <input type="submit" value="Login" className="bg-gradient-to-b from-slate-300 via-gray-400 to-neutral-500 rounded-md p-2 mt-8 cursor-pointer" />
                    </form>
                </div>
            </div>
        </>
    );
};
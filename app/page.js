"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import TypewriterEffect from '@/components/TypeWriter'

export default function Home() {
    const router = useRouter();
    return (
        <main className="flex flex-col h-screen space-x-20 items-center justify-center">
            <span className='title'><TypewriterEffect /></span>
            <div className="flex flex-col items-center ">
                
                <div className="w-48">
                    <div className="relative group cursor-pointer">
                        <div className="absolute rounded-full -inset-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 blur opacity-35 group-hover:opacity-100 duration-500"></div>
                        <div
                            className="relative px-12 py-6 bg-white rounded-full leading-none flex items-center justify-center group-hover:bg-black duration-1000"
                            onClick={() => router.push("/login")}
                        >
                            <p className="text-black group-hover:text-white duration-300 font-bold">
                                Anmelden
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-48 mt-8">
                    <div className="relative group cursor-pointer">
                        <div className="absolute rounded-full -inset-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 blur opacity-35 group-hover:opacity-100 duration-500"></div>
                        <div
                            className="relative px-12 py-6 bg-white rounded-full leading-none flex items-center justify-center group-hover:bg-black duration-1000"
                            onClick={() => router.push("/register")}
                        >
                            <p className="text-black group-hover:text-white duration-300 font-bold">
                                Registrieren
                            </p>
                        </div>
                    </div>
                </div>
                
            </div>
        </main>
    );
}

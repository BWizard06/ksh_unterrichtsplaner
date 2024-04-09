"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import TypewriterEffect from '@/components/TypeWriterEffect'

export default function Home() {
    const router = useRouter();
    return (
        <main className="flex flex-col h-screen space-x-20 items-center justify-center">
            <div className="flex flex-col items-center">
                <span className='title'><TypewriterEffect wordArray='Unterrichtsplaner' /></span>

                <div className="w-48 mt-20">
                    <div className="relative group cursor-pointer">
                        <div className="gradientDiv"></div>
                        <div className="buttonDiv" onClick={() => router.push("/login")} >
                            <p className="text-black group-hover:text-white duration-300 font-bold">
                                Anmelden
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-48 mt-8">
                    <div className="relative group cursor-pointer">
                        <div className="gradientDiv"></div>
                        <div className="buttonDiv" onClick={() => router.push("/register")}>
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

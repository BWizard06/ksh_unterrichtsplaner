"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
        <div className="flex flex-row items-center ">
            <div className="max-w-max mx-auto">
                <div className="relative group cursor-pointer">
                    <div className="absolute rounded-full -inset-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 blur opacity-35 group-hover:opacity-100 duration-500"></div>
                    <div
                        className="relative px-12 py-6 bg-white rounded-full leading-none flex items-center justify-center space-x-6 group-hover:bg-black duration-1000"
                        onClick={() => router.push("/login")}
                    >
                        <p className="text-black group-hover:text-white duration-300 font-bold">
                            Anmelden
                        </p>
                    </div>
                </div>
            </div>
            <div className="max-w-max mx-auto">
                <div className="relative group cursor-pointer">
                    <div className="absolute rounded-full -inset-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 blur opacity-35 group-hover:opacity-100 duration-500"></div>
                    <div
                        className="relative px-12 py-6 bg-white rounded-full leading-none flex items-center justify-center space-x-6 group-hover:bg-black duration-1000"
                        onClick={() => router.push("/register")}
                    >
                        <p className="text-black group-hover:text-white duration-300 font-bold">
                            Registrieren
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

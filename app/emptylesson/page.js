import React from "react";
import Image from "next/image";
import plus from "@/public/plus.png";

export default function EmptyLessonPage(){
    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <div className="bg-gradient-to-b from-slate-300 via-gray-400 to-neutral-500 p-20 rounded-md font-bold text-2xl">
                    <h2 className="flex justify-center">Sie haben noch keine Lektionen</h2>
                    <button className="flex items-center mt-4 bg-gradient-to-b from-emerald-500 to-emerald-900 hover:from-green-400 hover:via-green-600 hover:to-green-900 text-white font-bold py-2 px-4 rounded">
                        <Image
                            src={plus}
                            alt="plus"
                            width={25}
                            height={25}
                            className="inline mr-3 "
                            />
                        JETZT LEKTION EINTRAGEN!
                    </button>
                </div>
            </div>
        </>
    );
};
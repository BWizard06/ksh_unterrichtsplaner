import React from 'react';


export default function LoginPage(){
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full space-y-2">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-sky-300"> Anmelden </h2>
                <form>
                    <div className='rounded-xl space-y-2 '>

                        <input
                            type='text'
                            placeholder='Benutzername'
                            className='appearance-none w-full shadow-inner px-3 py-2 border rounded-lg border-indigo-300 placeholder-sky-300 text-blue-700  focus:outline-none focus:ring-2 focus:ring-blue-400/50'
                        />

                        <input
                            type='password'
                            placeholder='Passwort'
                            className='appearance-none w-full shadow-inner px-3 py-2 border rounded-lg border-indigo-300 placeholder-sky-300 text-blue-00 focus:outline-none focus:ring-2 focus:ring-blue-400/50'
                        />
                        
                        <input 
                            type='submit' 
                            value='Anmelden'
                            className="relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:bg-sky-800 focus:ring-2 focus:ring-blue-400/50"
                        />
                        
                    </div>
                </form>
            </div>
        </div>
    );
};
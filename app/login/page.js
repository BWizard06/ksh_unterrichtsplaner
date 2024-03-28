import React from 'react';


export default function LoginPage(){
    return (
        <div className="flex items-center justify-center bg-blue-200/50 min-h-screen">
            <div className="max-w-md w-full space-y-2">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-sky-300"> Anmelden </h2>
                <form>
                    <div className='rounded-xl space-y-2 '>

                        <input
                            type='email'
                            placeholder='Email'
                            className='appearance-none w-full shadow-inner px-3 py-2 border border-gray-300 placeholder-sky-300 text-blue-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                        />

                        <input
                            type='password'
                            placeholder='Passwort'
                            className='appearance-none w-full shadow-inner px-3 py-2 border border-gray-300 placeholder-sky-300 text-blue-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                        />
                        
                        <input 
                            type='submit' 
                            value='Anmelden'
                            className="relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:ring-2 focus:ring-blue-400/50"
                        />
                        
                    </div>
                </form>
            </div>
        </div>
    );
};
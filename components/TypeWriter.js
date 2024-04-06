import React, { useState } from 'react'
import { Typewriter } from 'react-simple-typewriter'

export default function TypewriterEffect () {
    const [showCursor, ] 
    return (
        <div className='flex items-center justify-center'>
        <Typewriter 
            words={['KSH-Unterrichtsplanner']}
            typeSpeed={70}
            delaySpeed={200}
            cursor
            cursorStyle={'|'}
            deleteSpeed={0}
            loop={true}
            stopCursor={true}

        />
        </div>
    )
}

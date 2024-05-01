import { Typewriter } from 'react-simple-typewriter'

/**
 * a typewriter effect that can be used to display text.
 * has no real purpose other than for aesthetics
 * @param {*} wordArray 
 * @returns a jsx element that is a typewriter effect
 */
export default function TypewriterEffect ({ wordArray }) {
    return (
        <Typewriter 
            words={[`${wordArray}`]}
            typeSpeed={70}
            delaySpeed={200}
            deleteSpeed={0}
            loop={1}
        />
    )
}

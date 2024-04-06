import { Typewriter } from 'react-simple-typewriter'

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

import monetaAnimation from "@/assets/lottie/Moneta/data.json"
import carouselAnimation from "@/assets/lottie/Karousel/data.json"
import startAnimation from "@/assets/lottie/Start/data.json"
import {LottieOptions, LottieRefCurrentProps, useLottie} from 'lottie-react'
import {useEffect, useRef, useState} from 'react'

interface ICard {
    from: number
    to: number
    ref: {View: React.ReactElement} & LottieRefCurrentProps
    isWin: boolean
}

const countText = {
    0: 'попыток',
    1: 'попытка',
    2: 'попытки',
    3: 'попыток'
}

const Carousel = () => {
    const [isReady, setIsReady] = useState(false)
    const [isStarted, setIsStarted] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [currentFrame, setCurrentFrame] = useState(0)
    const [card, setCard] = useState<ICard | null>(null)
    const [count, setCount] = useState(3)
    const [isLose, setIsLose] = useState(false)

    const barabanSoundRef = useRef<HTMLAudioElement>(null)
    const startSoundRef = useRef<HTMLAudioElement>(null)
    const loseSoundRef = useRef<HTMLAudioElement>(null)
    const winSoundRef = useRef<HTMLAudioElement>(null)
    const btnSoundRef = useRef<HTMLAudioElement>(null)

    const startOptions: LottieOptions = {
        loop: false,
        autoplay: true,
        animationData: startAnimation,
        assetsPath: '/lottie/Start/images/',
    }
    const carouselOptions: LottieOptions = {
        loop: true,
        autoplay: false,
        animationData: carouselAnimation,
        assetsPath: '/lottie/Karousel/images/',
        hidden: true,
    }
    const monetaOptions: LottieOptions = {
        loop: false,
        autoplay: false,
        animationData: monetaAnimation,
        assetsPath: '/lottie/Moneta/images/',
        hidden: true
    }

    const startRef = useLottie(startOptions)
    const carouselRef = useLottie(carouselOptions)
    const monetaRef = useLottie(monetaOptions)

    const cards: ICard[] = [
        {from: 36, to: 60, ref: monetaRef, isWin: false},
        // {from: 65, to: 79, ref: monetaRef, isWin: true},
    ]

    const startSound = () => {
        startSoundRef.current?.play()
        setTimeout(() => {
            barabanSoundRef.current?.play()
        }, 200)
    }

    const handleReset = () => {
        if (startRef.animationContainerRef.current && carouselRef.animationContainerRef.current) {
            startRef.animationContainerRef.current.hidden = false
            carouselRef.animationContainerRef.current.hidden = true
        }
        if (card?.ref.animationContainerRef.current) {
            card.ref.animationContainerRef.current.hidden = true
        }
        setCount(3)
        setIsLose(false)
        setIsReady(false)
        setCard(null)
        carouselRef.stop()
        startRef.stop()
        startRef.play()
    }

    const handleWin = () => {
        winSoundRef.current?.play()
        setTimeout(handleReset, 10000)
    }

    const handleLose = () => {
        loseSoundRef.current?.play()
        setIsLose(true)
        setCount(prev => prev - 1)
        if (count === 1) {
            setTimeout(handleReset, 10000)
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "1") {
            console.log({isStarted, card, isSelected, isReady, count, isWin: card?.isWin, currentFrame})
            if (isStarted && !card || isSelected || !isReady || count === 0 || card?.isWin) {
                return
            }

            if (!isStarted) {
                setIsStarted(true)
                startSound()
                carouselRef.play()
                // carouselRef.setSpeed(0.1)
                setIsLose(false)
                if (carouselRef.animationContainerRef.current) {
                    carouselRef.animationContainerRef.current.hidden = false
                }
                if (card?.ref.animationContainerRef.current) {
                    card.ref.animationContainerRef.current.hidden = true
                    card.ref.stop()
                }
                return
            }

            setIsSelected(true)
        }
    }

    const handleEnterFrame = (e: any) => {
        setCurrentFrame(Number.parseInt(e.currentTime))
        setCard(cards.find(
            (frame) => currentFrame >= frame.from && currentFrame <= frame.to
        ) || null)
        // console.log({currentFrame, card, isSelected})

        if (
            isSelected && card &&
            currentFrame === card.to &&
            carouselRef.animationContainerRef.current &&
            card.ref.animationContainerRef.current &&
            barabanSoundRef.current
        ) {
            setIsStarted(false)
            setIsSelected(false)
            barabanSoundRef.current.pause()
            barabanSoundRef.current.currentTime = 0
            carouselRef.pause()
            carouselRef.animationContainerRef.current.hidden = true
            card.ref.animationContainerRef.current.hidden = false
            card.ref.stop()
            card.ref.play()
            card.isWin ? handleWin() : handleLose()
        }
    }

    const handleComplete = () => {
        setIsReady(true)
        if (startRef.animationContainerRef.current && carouselRef.animationContainerRef.current) {
            startRef.animationContainerRef.current.hidden = true
            carouselRef.animationContainerRef.current.hidden = false
        }
    }

    useEffect(() => {
        const carouselAnimation = carouselRef.animationItem
        window.addEventListener("keydown", handleKeyDown)
        carouselAnimation?.addEventListener('enterFrame', handleEnterFrame)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            carouselAnimation?.removeEventListener('enterFrame', handleEnterFrame)
        }
    }, [carouselRef]);

    useEffect(() => {
        const startAnimation = startRef.animationItem
        startAnimation?.addEventListener('complete', handleComplete)

        return () => {
            startAnimation?.removeEventListener('complete', handleComplete)
        }
    }, [startRef])

    return (
        <section className='relative w-screen h-screen bg-[url("/images/Gradient_v05_00000.png")] bg-cover'>
            <div className='absolute top-0 left-0 w-screen h-screen flex justify-between'>
                <div className='w-[15%] h-full backdrop-blur z-10'></div>
                <div className='w-[15%] h-full backdrop-blur z-10'></div>
            </div>

            {isLose &&
                (<div className='absolute left-0 bottom-[170px] w-full text-center z-10 text-[100px] font-semibold'>
                    Осталось {count} {countText[count as keyof typeof countText]}
                </div>)
            }

            <div className='absolute top-0 left-0'>{startRef.View}</div>
            <div className='absolute top-0 left-0'>{carouselRef.View}</div>
            <div className='absolute top-0 left-0'>{monetaRef.View}</div>

            <audio ref={barabanSoundRef} className='hidden' src="/sounds/baraban.mp3" loop></audio>
            <audio ref={startSoundRef} className='hidden' src="/sounds/start.wav"></audio>
            <audio ref={loseSoundRef} className='hidden' src="/sounds/lose.wav"></audio>
            <audio ref={winSoundRef} className='hidden' src="/sounds/win.wav"></audio>
            <audio ref={btnSoundRef} className='hidden' src="/sounds/btn.wav"></audio>
        </section>
    )
}
export default Carousel

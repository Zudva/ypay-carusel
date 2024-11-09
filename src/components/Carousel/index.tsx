import monetaAnimation from "@/assets/lottie/Moneta/data.json"
import carouselAnimation from "@/assets/lottie/Karousel/data.json"
import startAnimation from "@/assets/lottie/Start/data.json"
import cardAnimation from "@/assets/lottie/Cardholder/data.json"
import moneyAnimation from "@/assets/lottie/Dengi/data.json"
import vetkaAnimation from "@/assets/lottie/Vetka/data.json"
import ypayAnimation from "@/assets/lottie/Ypay/data.json"
import finishAnimation from "@/assets/lottie/Finish/data.json"
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
    const [isStartPlayed, setIsStartPlayed] = useState(false)
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
        autoplay: false,
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
    const cardOptions: LottieOptions = {
        loop: false,
        autoplay: false,
        animationData: cardAnimation,
        assetsPath: '/lottie/Cardholder/images/',
        hidden: true
    }
    const moneyOptions: LottieOptions = {
        loop: false,
        autoplay: false,
        animationData: moneyAnimation,
        assetsPath: '/lottie/Dengi/images/',
        hidden: true
    }
    const vetkaOptions: LottieOptions = {
        loop: false,
        autoplay: false,
        animationData: vetkaAnimation,
        assetsPath: '/lottie/Vetka/images/',
        hidden: true
    }
    const ypayOptions: LottieOptions = {
        loop: false,
        autoplay: false,
        animationData: ypayAnimation,
        assetsPath: '/lottie/Ypay/images/',
        hidden: true
    }
    const finishOptions: LottieOptions = {
        loop: false,
        autoplay: false,
        animationData: finishAnimation,
        assetsPath: '/lottie/Finish/images/',
        hidden: true
    }

    const startRef = useLottie(startOptions)
    const carouselRef = useLottie(carouselOptions)
    const monetaRef = useLottie(monetaOptions)
    const cardRef = useLottie(cardOptions)
    const moneyRef = useLottie(moneyOptions)
    const vetkaRef = useLottie(vetkaOptions)
    const ypayRef = useLottie(ypayOptions)
    const finishRef = useLottie(finishOptions)

    const cards: ICard[] = [
        {from: 4, to: 29, ref: cardRef, isWin: false},
        {from: 33, to: 58, ref: monetaRef, isWin: false},
        {from: 62, to: 85, ref: vetkaRef, isWin: false},
        {from: 89, to: 115, ref: moneyRef, isWin: false},
        {from: 123, to: 143, ref: ypayRef, isWin: true},
    ]

    const startSound = () => {
        barabanSoundRef.current?.play()
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
        setIsStartPlayed(false)
        setCard(null)
        carouselRef.stop()
        startRef.stop()
    }

    const handleWin = () => {
        winSoundRef.current?.play()
        setCount(0)
        setTimeout(handleReset, 10000)
    }

    const handleLose = () => {
        loseSoundRef.current?.play()
        setIsLose(true)
        setCount(prev => prev - 1)

        if (count === 1) {
            setTimeout(() => {
                if (finishRef.animationContainerRef.current && card?.ref.animationContainerRef.current) {
                    card.ref.animationContainerRef.current.hidden = true
                    finishRef.animationContainerRef.current.hidden = false
                    finishRef.play()
                }
            }, 5000)
            setTimeout(() => {
                if (finishRef.animationContainerRef.current) {
                    finishRef.animationContainerRef.current.hidden = true
                    finishRef.stop()
                }
                handleReset()
            }, 10000)
        }
    }

    const handleStart = () => {
        startSound()
        setIsStarted(true)
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
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "1") {
            console.log({isStarted, card, isSelected, isStartPlayed, count, isWin: card?.isWin, currentFrame})

            if (!isStartPlayed) {
                startSoundRef.current?.play()
                startRef.stop()
                startRef.play()
            }

            if (isStarted && !card || isSelected || !isStartPlayed || count === 0) {
                return
            }

            if (!isStarted) {
                btnSoundRef.current?.play()
                handleStart()
                return
            }

            setIsSelected(true)
        }
    }

    const handleEnterFrame = (e: any) => {
        const frame = Number.parseInt(e.currentTime)
        const currCard = cards.find((fr) => frame >= fr.from && frame <= fr.to)
        setCurrentFrame(frame)
        setCard(currCard || null)
        console.log(frame)
        // console.log({currentFrame, card, isSelected})

        if (
            isSelected && currCard &&
            frame === currCard.to &&
            carouselRef.animationContainerRef.current &&
            currCard.ref.animationContainerRef.current &&
            barabanSoundRef.current
        ) {
            console.log('capture', currCard, frame)
            setIsStarted(false)
            setIsSelected(false)
            barabanSoundRef.current.pause()
            barabanSoundRef.current.currentTime = 0
            carouselRef.pause()
            carouselRef.animationContainerRef.current.hidden = true
            currCard.ref.animationContainerRef.current.hidden = false
            currCard.ref.stop()
            currCard.ref.play()
            currCard.isWin ? handleWin() : handleLose()
        }
    }

    const handleComplete = () => {
        setIsStartPlayed(true)
        if (startRef.animationContainerRef.current && carouselRef.animationContainerRef.current) {
            startRef.animationContainerRef.current.hidden = true
            carouselRef.animationContainerRef.current.hidden = false
            handleStart()
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
        <section className='relative w-screen h-screen bg-[url("/images/background-start.png")] bg-cover'>
            {/*<div className='absolute top-0 left-0 w-screen h-screen flex justify-between'>*/}
            {/*    <div className='w-[15%] h-full backdrop-blur z-10'></div>*/}
            {/*    <div className='w-[15%] h-full backdrop-blur z-10'></div>*/}
            {/*</div>*/}

            {isLose &&
                (<div className='absolute left-0 bottom-[170px] w-full text-center z-10 text-[100px] font-semibold'>
                    Осталось {count} {countText[count as keyof typeof countText]}
                </div>)
            }

            <div className='absolute top-0 left-0'>{startRef.View}</div>
            <div className='absolute top-0 left-0'>{carouselRef.View}</div>
            <div className='absolute top-0 left-0'>{monetaRef.View}</div>
            <div className='absolute top-0 left-0'>{cardRef.View}</div>
            <div className='absolute top-0 left-0'>{vetkaRef.View}</div>
            <div className='absolute top-0 left-0'>{moneyRef.View}</div>
            <div className='absolute top-0 left-0'>{ypayRef.View}</div>
            <div className='absolute top-0 left-0'>{finishRef.View}</div>

            <audio ref={barabanSoundRef} className='hidden' src="/sounds/baraban.mp3" loop></audio>
            <audio ref={startSoundRef} className='hidden' src="/sounds/start.wav"></audio>
            <audio ref={loseSoundRef} className='hidden' src="/sounds/lose.wav"></audio>
            <audio ref={winSoundRef} className='hidden' src="/sounds/win.wav"></audio>
            <audio ref={btnSoundRef} className='hidden' src="/sounds/btn.wav"></audio>
        </section>
    )
}
export default Carousel

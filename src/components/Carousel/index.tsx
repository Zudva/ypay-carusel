import mainAnimation from "@/assets/lottie/MAIN.json";
import { LottieOptions, useLottie } from 'lottie-react';
import {useEffect, useRef} from 'react';

const Carousel = () => {
    const barabanRef = useRef<HTMLAudioElement>(null);
    const startRef = useRef<HTMLAudioElement>(null);
    const loseRef = useRef<HTMLAudioElement>(null);
    const winRef = useRef<HTMLAudioElement>(null);
    const btnRef = useRef<HTMLAudioElement>(null);
    const startClick = () => {
        startRef.current?.play();
        setTimeout(() => {
            barabanRef.current?.play();
        }, 200);
    }

    const mainOptions: LottieOptions = {
        loop: false,
        autoplay: false,
        animationData: mainAnimation,
    };

    const carouselObj = useLottie(mainOptions);
    // const Animation = useLottieInteractivity({
    //     carouselObj,
    //     mode: "cursor",
    //     actions: [
    //         {
    //             type: "stop",
    //             frames: [0],
    //         },
    //     ],
    // });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "1") {
                carouselObj.stop();
                startClick();
                carouselObj.play();
                // carouselObj.goToAndStop(146, true);
                // carouselObj.stop();
                // carouselObj.playSegments([73, 146], true);

            }
        };
        // Достижение конкретного фрейма
        const targetFrame = 140;
        const handleFrame = (e: any) => {
            if (e.currentTime >= targetFrame) {
                carouselObj.pause()
            }
            console.log(Number.parseInt(e.currentTime))
            if (Number.parseInt(e.currentTime) === 53 && barabanRef.current) {
                barabanRef.current?.pause();
                barabanRef.current.currentTime = 0;
                loseRef.current?.play();
            }
        }
        // Завершение анимации
        // const handleComplete = () => {
        //     carouselObj.stop();
        //     winRef.current?.play();
        // }

        window.addEventListener("keydown", handleKeyDown);
        const animation = carouselObj.animationItem
        animation?.addEventListener('enterFrame', handleFrame);
        // animation?.addEventListener('complete', handleComplete);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            animation?.removeEventListener('enterFrame', handleFrame);
            // animation?.removeEventListener('complete', handleComplete);
        };
    }, [carouselObj]);

    return (
        <section className='relative'>
            <div className='absolute top-0 left-0'>{carouselObj.View}</div>
            <audio ref={barabanRef} className='hidden' src="/sounds/baraban.mp3" loop></audio>
            <audio ref={startRef} className='hidden' src="/sounds/start.wav"></audio>
            <audio ref={loseRef} className='hidden' src="/sounds/lose.wav"></audio>
            <audio ref={winRef} className='hidden' src="/sounds/win.wav"></audio>
            <audio ref={btnRef} className='hidden' src="/sounds/btn.wav"></audio>
        </section>
    )
}

export default Carousel;

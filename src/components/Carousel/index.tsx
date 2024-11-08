import mainAnimation from "@/assets/lottie/MAIN.json";
import { LottieOptions, useLottie } from 'lottie-react';
import { useEffect } from 'react';

const Carousel = () => {
    const mainOptions: LottieOptions = {
        loop: false,
        autoplay: false,
        animationData: mainAnimation,
    };

    const lottieObj = useLottie(mainOptions);
    // const Animation = useLottieInteractivity({
    //     lottieObj,
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
                lottieObj.stop();
                lottieObj.playSegments([0, 135], true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [lottieObj]);

    return (
        <section className='relative'>
            <div className='absolute top-0 left-0'>{lottieObj.View}</div>
        </section>
    )
}

export default Carousel;

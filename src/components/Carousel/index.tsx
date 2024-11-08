

// import carouselAnimation from "@/assets/lottie/Karusel.json";
import mainAnimation from "@/assets/lottie/MAIN.json";
import {LottieOptions, useLottie} from 'lottie-react';

const Carousel = () => {

    const mainOptions: LottieOptions = {
        loop: true,
        autoplay: true,
        animationData: mainAnimation,
    };

    // const carouselOptions: LottieOptions = {
    //     loop: true,
    //     autoplay: true,
    //     animationData: carouselAnimation, assetsPath: 'assets/images/',
    // };

    const { View: main } = useLottie(mainOptions);
    // const { View: carousel } = useLottie(carouselOptions);

    return (
        <section className='relative'>
            {/*<div className='relative z-10'>{carousel}</div>*/}
            <div className='absolute top-0 left-0'>{main}</div>
        </section>
    )
}


export default Carousel
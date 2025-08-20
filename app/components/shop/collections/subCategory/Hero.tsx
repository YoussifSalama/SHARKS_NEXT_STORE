const Hero = ({ img, title }: { img: string, title: string }) => {
    return (<section className="w-full h-[70vh] relative capitalize font-bold text-shadow-2xs">
        <img src={img} alt={title + "img"}
            className="w-full h-full object-cover" />
        <h1 className="h-full w-full text-4xl text-main-2
        absolute inset-0 flex items-end justify-center p-4
        ">{title}</h1>
    </section>);
}

export default Hero;

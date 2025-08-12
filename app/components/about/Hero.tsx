import CommonServices from "@/app/features/common/CommonServices";
import { Earth, Gauge, HeartHandshake } from "lucide-react";

const Hero = () => {
    const headerForServices = {
        title: "Driven by Purpose and Passion",
        description:
            "At the heart of our brand lies a deep commitment to creating products that not only meet the highest standards of quality but also respect and preserve our planet. We combine innovation with responsibility, ensuring every step — from sourcing to delivery — reflects our dedication to ethical practices and sustainable growth.",
    };

    const services = [
        {
            icon: <Gauge className="w-10 h-10 text-main-1" aria-hidden="true" />,
            title: "Fast Delivery",
            description:
                "We are committed to providing the fastest delivery service possible to ensure your products reach you on time without delay. Our advanced logistics system guarantees precise order tracking and optimizes every step of the shipping process, making your shopping experience smooth and convenient from start to finish.",
        },
        {
            icon: <Earth className="w-10 h-10 text-main-1" aria-hidden="true" />,
            title: "Our Brand Purpose",
            description:
                "We believe in the importance of social and environmental responsibility, striving to implement sustainable practices in every aspect of our operations. From using eco-friendly materials to supporting local communities, our goal is to be a brand that contributes to building a better future for generations to come.",
        },
        {
            icon: <HeartHandshake className="w-10 h-10 text-main-1" aria-hidden="true" />,
            title: "Quality Commitment",
            description:
                "Quality is at the core of everything we offer. We carefully select the best materials and pay close attention to detail during manufacturing to ensure every product reflects our steadfast commitment to delivering the best to our customers. We believe trust starts with product quality and continues through exceptional customer service and ongoing support.",
        },
    ];



    return (
        <section aria-labelledby="hero-heading" className="py-12">
            <CommonServices services={services} header={headerForServices} />
        </section>
    );
};

export default Hero;


interface Service {
    icon: React.ReactNode;
    title: string;
    description?: string;
}
interface Header {
    title: string;
    description: string
}

interface CommonServicesProps {
    services: Service[];
    header: Header;
}

export const ServiceCard = ({ icon, title, description }: Service) => {
    return (
        <article
            className="flex items-center justify-center flex-col gap-4 text-center max-w-xs"
            aria-label={title}
        >
            <div className="text-main-1" aria-hidden="true">
                {icon}
            </div>
            <h3 className="text-normal text-main-1">{title}</h3>
            <p className="text-md text-main-1 opacity-85">{description}</p>
        </article>
    );
};

const CommonServices = ({ services, header }: CommonServicesProps) => {
    return (
        <section className="py-12 container" aria-label="Our Sustainable Services">
            <header className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-main-1">
                    {header.title}
                </h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                    {header.description}
                    Discover how we prioritize the planet through eco-friendly materials, ethical manufacturing, and sustainable design.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                {services.map((service, index) => (
                    <ServiceCard
                        key={index}
                        icon={service.icon}
                        title={service.title}
                        description={service.description}
                    />
                ))}
            </div>
        </section>
    );
};

export default CommonServices;

import { CommonButton1, CommonButton2 } from "@/app/features/common/CommonButtons";
import clsx from "clsx";

export const CommonSection1 = ({ data }: { data: any }) => {
    return (
        <section
            className="flex items-center justify-between container max-md:flex-col py-12"
            aria-label="Online Exclusive Sale Section"
        >
            <div className="flex-1 max-md:w-full text-center px-6">
                <h1 className="text-main-1 font-bold text-2xl md:text-3xl mb-2">
                    {data.title}
                </h1>
                <p className="text-md md:text-lg text-gray-700 mb-6">
                    {data.description.slice(0, 500)}...
                </p>
                <div className="w-full flex items-center justify-center mt-4">
                    <CommonButton2 title={"Discover " + data.title} aria-label={"discover " + data.title} />
                </div>
            </div>
            <div className="flex-1 max-md:w-full flex items-center justify-center px-6 mt-8 md:mt-0">
                <img
                    loading="lazy"
                    src={data.img}
                    width={500}
                    height={500}
                    alt="Fashion sale banner showing 70% discount on exclusive online products"
                    className="w-full max-w-md h-auto shadow-lg object-cover"
                />
            </div>
        </section>
    );
};

export const CommonSection2 = ({ data, className }: { data: any, className?: string }) => {
    return (
        <section
            className={clsx("flex items-center justify-center min-h-[60vh] text-main-2 object-cover flex-col space-y-2", className)}
            style={{
                backgroundImage: 'url("/bg.png")',
                backgroundPosition: 'center top',
                backgroundSize: 'cover'
            }}
            aria-label="Nature-Inspired Fabric Collection"
        >
            <h2 className="text-4xl font-bold">{data.title}</h2>
            <p className="opacity-85 text-sm italic text-wrap max-w-[500px]">
                {data.description.slice(0, 500)}...
            </p>
            <div className="mt-10">
                <CommonButton1 title="Discover Now" aria-label={"discover " + data.title} />
            </div>
        </section>
    );
};



export const CommonSection3 = ({ data, dir }: { data: any, dir: "rtl" | "ltr" }) => {
    return (
        <section
            className="flex items-center justify-between container max-md:flex-col py-12"
            dir={dir}
            aria-label="Online Exclusive Sale Section"
        >
            <div className="flex-1 max-md:w-full text-center px-6">
                <h1 className="text-main-1 font-bold text-2xl md:text-3xl mb-2">
                    {data.title}
                </h1>
                <p className="text-md md:text-lg text-gray-700 mb-6" dir="ltr">
                    {data.description.slice(0, 500)}...
                </p>
            </div>
            <div className="flex-1 max-md:w-full flex items-center justify-center px-6 mt-8 md:mt-0">
                <img
                    loading="lazy"
                    src={data.img}
                    width={500}
                    height={500}
                    alt="Fashion sale banner showing 70% discount on exclusive online products"
                    className="w-full max-w-md h-auto shadow-lg object-cover"
                />
            </div>
        </section>
    );
};
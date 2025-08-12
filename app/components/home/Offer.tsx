import { CommonButton2 } from "@/app/features/common/CommonButtons";
import CommonSectionTitle from "@/app/features/common/CommonSectionTitle";

const Offer = () => {
    return (
        <section className="flex items-center justify-between container max-md:flex-col py-12">
            <div className="flex-1 max-md:w-full text-center px-6">
                <CommonSectionTitle
                    className="text-main-1 font-bold text-2xl md:text-3xl mb-2"
                    title="Online Exclusive SALE - 70% OFF"
                />
                <CommonSectionTitle
                    className="text-md md:text-lg text-gray-700 mb-6"
                    title="Enjoy an Exclusive 70% OFF SALE on signature pieces of modern elegance."
                />
                <div className="w-full flex items-center justify-center mt-4">
                    <CommonButton2 title="Shop Now" />
                </div>
            </div>
            <div className="flex-1 max-md:w-full flex items-center justify-center px-6 mt-8 md:mt-0">
                <img
                    loading="lazy"
                    src="offer.webp"
                    alt="Exclusive Offer"
                    className="w-full max-w-md h-auto shadow-lg object-cover"
                />
            </div>
        </section>
    );
};

export default Offer;
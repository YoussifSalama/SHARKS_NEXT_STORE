import { CommonButton2 } from "@/app/features/common/CommonButtons";
import { CommonImagesPreview } from "@/app/features/common/CommonImagesPreview";
import CommonSectionLinkTitle from "@/app/features/common/CommonSectionLinkTitle";
import CommonSectionTitle from "@/app/features/common/CommonSectionTitle";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const RichRefinedTexture = ({ data }: { data: any }) => {
    return (<section className="min-h-[50vh] py-12">
        <CommonSectionTitle className="text-center" title={"Rich & Refined Texture"} />
        <CommonSectionLinkTitle className="text-center font-bold" title="All Shirts" href="/all-shirts" />
        <ShirtsSlider data={data} />
        <div className="w-full flex items-center justify-center mt-4">
            <CommonButton2 title="View All" />
        </div>
    </section>);
}

const ShirtsSlider = ({ data }: { data: any[] }) => {
    const allVariants = data.flatMap(product =>
        product.variants.map((variant: any) => ({
            ...variant,
            productTitle: product.title,
        }))
    );

    return (
        <Carousel opts={{ align: "start" }} className="w-full container">
            <CarouselContent>
                {allVariants.map((variant, index) => {
                    const images = variant.imgs.map((img: any) => img.url);

                    return (
                        <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/5 overflow-hidden">
                            <div className="scale-85 w-full flex items-center justify-center">
                                <CommonImagesPreview images={images} />
                            </div>
                            <div className="max-md:px-4 max-md:text-center">
                                <p className="text-lg font-light opacity-85 text-main-1">{variant.productTitle}</p>
                                <span className="text-xs font-light opacity-85 text-main-3">LE {variant.price}</span>
                            </div>
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
            <CarouselPrevious className="absolute max-md:left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md md:p-3" />
            <CarouselNext className="absolute max-md:right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md md:p-3" />
        </Carousel>
    );
};



export default RichRefinedTexture;

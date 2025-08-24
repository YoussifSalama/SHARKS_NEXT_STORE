import { CommonButton1 } from "@/app/features/common/CommonButtons";

const Hero = ({ data }: { data: any }) => {

    return (<section
        style={{
            backgroundImage: `url(${data.img})`,
            backgroundPositionX: "center",
            backgroundPositionY: "0",
        }}
        className="h-dvh"
    >
        <div className="container h-full flex items-end justify-start p-4">
            <CommonButton1 title={data.title} />
        </div>
    </section>);
}
export default Hero;
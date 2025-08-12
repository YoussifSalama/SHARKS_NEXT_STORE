import { getCategoriesandItsSubCategoriesForNavbar } from "@/app/actions/category/category";
import Hero from "@/app/components/about/Hero";
import { CommonSection3 } from "@/app/features/common/CommonSections";
import Navbar from "@/app/features/Navbar/Navbar";

type Direction = "ltr" | "rtl";

interface SectionData {
    id: number;
    title: string;
    description: string;
    img: string;
    direction: Direction;
}
const AboutUs = async () => {

    const navResult = await getCategoriesandItsSubCategoriesForNavbar(5, 5);

    const sectionsData: SectionData[] = [
        {
            id: 1,
            title: "Our Headquarters in Egypt",
            description: "Strategically located in the heart of Egypt, our headquarters serve as the central hub for all operations. We are deeply committed to supporting the local community and maintaining strong relationships with our partners across the region. Our modern facilities combine innovation and sustainability to foster growth and excellence.",
            img: "/map.jpg",
            direction: "ltr",
        },
        {
            id: 2,
            title: "Cloths Service",
            description: "We offer a diverse collection of high-quality clothing designed to meet the needs of modern lifestyles. From casual wear to sophisticated styles, our fabrics are carefully selected to ensure comfort, durability, and style. Our clothing service prioritizes customer satisfaction through personalized options and expert craftsmanship.",
            img: "/shirt.jpg",
            direction: "rtl",
        },
        {
            id: 3,
            title: "Watches Collection",
            description: "Discover our exquisite range of premium watches that blend timeless elegance with precise engineering. Each piece is crafted with meticulous attention to detail, combining fine materials and innovative design. Our watches are perfect for those who appreciate luxury and functionality in their everyday accessories.",
            img: "/watch.jpg",
            direction: "ltr",
        },
        {
            id: 4,
            title: "Accessories",
            description: "Enhance your personal style with our curated selection of fashionable accessories. From statement bracelets and rings to sleek sunglasses, each item is chosen to complement and elevate your look. Our accessories embody modern trends while maintaining a classic appeal, perfect for any occasion.",
            img: "/accessories.jpg",
            direction: "rtl",
        },
    ];



    return (
        <div>
            {/* navbar */}
            <Navbar data={navResult.data} />
            <div className="container">

                {/* about us */}
                <Hero />
                {/* sections */}
                {sectionsData.map(({ id, ...data }) => (
                    <CommonSection3 key={id} data={data} dir={data.direction} />
                ))}
            </div>
        </div>
    );
}

export default AboutUs;

import Navbar from "./features/Navbar/Navbar";
import { getCategoriesandItsSubCategoriesForNavbar } from "./actions/category/category";
import Hero from "./components/home/Hero";
import Offer from "./components/home/Offer";
import RichRefinedTexture from "./components/home/RichRefinedTexture";
import { CommonSection1, CommonSection2 } from "./features/common/CommonSections";
import CommonServices from "./features/common/CommonServices";
import { getHomeData } from "./actions/client/home";
import { Box, Recycle, Sprout } from "lucide-react";
import Footer from "./features/footer/Footer";
import NavbarMob from "./features/Navbar/NavbarMob";
import FloatingWhatsAppComponent from "./features/FloatingWhatsApp";
import FloatingWhatsApp from "./features/FloatingWhatsApp";



export default async function Home() {
  const headerForServices = {
    title: "Our Commitment to Sustainability",
    description: "  Discover how we prioritize the planet through eco-friendly materials, ethical manufacturing, and sustainable design."
  }

  const services = [
    {
      icon: <Sprout className="w-10 h-10" />,
      title: "Organic Cotton",
      description:
        "Crafted from 100% organic cotton for softness, breathability, and eco-friendly comfort.",
    },
    {
      icon: <Recycle className="w-10 h-10" />,
      title: "Sustainable Production",
      description:
        "Manufactured using ethical practices and sustainable materials to reduce environmental impact.",
    },
    {
      icon: <Box className="w-10 h-10" />,
      title: "Eco Packaging",
      description:
        "Delivered in biodegradable packaging to ensure a minimal ecological footprint.",
    },
  ];

  const navResult = await getCategoriesandItsSubCategoriesForNavbar(10, 10);
  const pageResult = await getHomeData();

  return (
    <div>

      <Navbar data={navResult.data} />
      {/* @ts-ignore */}
      <NavbarMob data={navResult.data} />
      {/* hero */}
      {
        pageResult?.section1 &&
        <Hero data={pageResult.section1} />
      }
      {/* rich */}
      {
        pageResult?.section2 &&
        <RichRefinedTexture data={pageResult.section2} />
      }
      {/* /offer */}
      {/* <Offer/> */}
      {/* rest */}
      {pageResult?.rest && (pageResult?.rest).map((section: any, index: number) => {
        const whichSection = (index % 2) == 0 ? <CommonSection1 data={section} /> : <CommonSection2 data={section} className={index % 2 !== 0 ? "h-dvh" : ""} />
        return whichSection;
      })}
      {/* service */}
      <CommonServices services={services} header={headerForServices} />
      {/* floating whatsapp */}
      <FloatingWhatsAppComponent />
      {/* footer */}
      <FloatingWhatsApp />

      <Footer />
    </div>
  );
}

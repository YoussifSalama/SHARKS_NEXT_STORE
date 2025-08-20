import { getCategoriesandItsSubCategoriesForNavbar } from "@/app/actions/category/category";
import ProductsSearchSection from "@/app/components/products/ProductsSearch";
import Footer from "@/app/features/footer/Footer";
import Navbar from "@/app/features/Navbar/Navbar";
import NavbarMob from "@/app/features/Navbar/NavbarMob";

const Products = async () => {
    const navResult = await getCategoriesandItsSubCategoriesForNavbar(10, 10);

    return (<div>
        {/* navbar */}
        <Navbar data={navResult?.data} />
        {/* @ts-ignore */}
        <NavbarMob data={navResult?.data} />        <ProductsSearchSection />
        {/* footer */}
        <Footer />
    </div>);
}


export default Products;
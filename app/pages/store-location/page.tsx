import { getCategoriesandItsSubCategoriesForNavbar } from "@/app/actions/category/category";
import Footer from "@/app/features/footer/Footer";
import Navbar from "@/app/features/Navbar/Navbar";
import NavbarMob from "@/app/features/Navbar/NavbarMob";

const StoreLocation = async () => {
    const navResult = await getCategoriesandItsSubCategoriesForNavbar(10, 10);

    return (<section className="overflow-hidden">
        {/* navbar */}
        <Navbar data={navResult.data} />
        {/* @ts-ignore */}
        <NavbarMob data={navResult.data} />
        <div className="py-8 min-h-dvh flex items-center justify-between container max-md:flex-col gap-8">
            <div className="text-center w-full max-w-3xl mx-auto px-4">
                <h1 className="text-2xl font-bold mb-4">Sharks Store Location</h1>
                <p className="font-medium text-gray-700">
                    British House embarked on a journey to perfect the dress shirt. Today, we remain dedicated
                    to upholding our legacy, committed to men's fashion, and celebrating craftsmanship and style
                    for every life moment. Our design philosophy is rooted in expressing individuality and
                    instilling confidence through taste. We steadfastly believe in the idea that fashion may change,
                    but true style endures.
                </p>
            </div>

            <div className="mt-8 w-full h-[400px]">
                <iframe
                className=""
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1dXXXXXXXXXXXX!2dXXXXXXXX!3dXXXXXXXX!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xXXXXXXXX!2sYour%20Store%20Name!5e0!3m2!1sen!2seg!4v1690000000000!5m2!1sen!2seg"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>

        {/* footer */}
        <Footer />
    </section>);
}

export default StoreLocation;
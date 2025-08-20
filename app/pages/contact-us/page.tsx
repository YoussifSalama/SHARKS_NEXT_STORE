import { getCategoriesandItsSubCategoriesForNavbar } from "@/app/actions/category/category";
import ContactForm from "@/app/components/pages/contactUs/ContactForm";
import Footer from "@/app/features/footer/Footer";
import Navbar from "@/app/features/Navbar/Navbar";
import NavbarMob from "@/app/features/Navbar/NavbarMob";

const ContactUs = async () => {
    const navResult = await getCategoriesandItsSubCategoriesForNavbar(10, 10);

    return (<section className="overflow-hidden">
        {/* navbar */}
        <Navbar data={navResult.data} />
        {/* @ts-ignore */}
        <NavbarMob data={navResult.data} />
        {/*  contactpart*/}
        <div className="flex flex-col gap-8 container py-8 min-h-dvh">
            <ContactData />
            <ContactForm />
        </div>
        {/* footer */}
        <Footer />
    </section>);
}


const ContactData = () => {
    return (<div className="text-center w-full">
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <p className="font-medium">
            For further queries, please contact us through:
            <br />
            Customer Service: +011111111111 / +01111111111
            <br />
            Email: support@britishhouse.shop
            <br />
            Store Location: Mivida - New Cairo
            <br />
            Trivium - El Sheikh Zayed
            <br />
            City Stars - Phase 2 - Level 3
            <br />
            For Complaints & inquires: +011111111111
        </p>

    </div>);
}


export default ContactUs;
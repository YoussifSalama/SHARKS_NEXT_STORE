import { Facebook, Twitter } from "lucide-react";
import Link from "next/link";

type listType = {
    title: string,
    href?: string
}
type menuType = {
    title: string;
    list: listType[]
};

const footerLists: menuType[] = [
    {
        title: "Support",
        list: [
            { title: "Contact us", href: "contact-us" },
            { title: "Return & Refund policy", href: "refund" }
        ]
    },
    {
        title: "Menu",
        list: [
            { title: "Shop", href: "shop" },
            { title: "Contact us", href: "contact-us" },
            { title: "About us", href: "about-us" }
        ]
    },
    {
        title: "Store Location",
        list: [
            { title: "Mivida - New Cairo" },
            { title: "Trivium - El Sheikh Zayed" },
            { title: "City Stars - Phase 2 - Level 3" }
        ]
    }
];



const Footer = () => {
    const year = new Date().getFullYear();
    return (<footer className="bg-main-3">
        <div className="text-main-2  container py-10">

            <div className="flex flex-wrap gap-12 items-start">
                {footerLists.map((item, index) => {
                    return (<Menu key={index} title={item.title} list={item.list} />)
                })}
                <div className="flex gap-5">
                    <Link href=""><Facebook className="w-6 h-6" /></Link>
                    <Link href=""><Twitter className="w-6 h-6" /></Link>
                </div>
            </div>
            <div className="text-center mt-10">© {year} SHARKS STORE</div>
        </div>
    </footer>);
}

const Menu = ({ title, list }: menuType) => {
    return (<div>
        <p className="font-semibold mb-4">{title}</p>
        <ul>
            {
                list?.map((item, index) => {
                    return (
                        <li key={index}>
                            {
                                (!item.href && item.title) ? <>{item.title}</> :
                                    <Link href={item.href as string}>{item.title}</Link>
                            }
                        </li>
                    );
                })
            }
        </ul>
    </div>);
}

export default Footer;
import Link from "next/link";

const Header = ({ phone }: { phone?: string }) => {
    const defaultPhone = "201015739888";
    const targetPhone = phone || defaultPhone;
    const message = "Hello, I want to know more about your services!";

    return (
        <header className="w-full cursor-pointer flex items-center justify-center bg-main-1 text-main-2">
            <Link
                href={`https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full p-2 text-center font-regular"
            >
                WhatsApp Me
            </Link>
        </header>
    );
};

export default Header;

import Link from "next/link";

const Header = ({ route }: { route: { title: string; href: string } }) => {
    return (
        <header className="w-full cursor-pointer flex items-center justify-center bg-main-1 text-main-2">
            <Link href={route.href} className="w-full h-full p-2 text-center font-regular">
                {route.title}
            </Link>
        </header>
    );
};
export default Header;

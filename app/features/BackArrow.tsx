import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";

const BackArrow = ({ title, href }: { title: string, href: string }) => {
    return (
        <div className="flex items-center gap-2 text-gray-500">

            <Link href={href} >
                <Button variant="outline"><ArrowLeftCircle className="w-4 h-4" /></Button>
            </Link>
            <span className="text-sm font-medium">{title}</span>
        </div>
    );
}

export default BackArrow;
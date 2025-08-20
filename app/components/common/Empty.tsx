import clsx from "clsx";
import { ShoppingBag } from "lucide-react";

const Empty = ({ className, messgae }: { className: string, messgae: string }) => {
    return (<div className="flex items-center justify-center flex-col gap-4">
        <ShoppingBag className={clsx(className)} />
        <p className="text-sm text-main-1">{messgae}</p>
    </div>);
}

export default Empty;
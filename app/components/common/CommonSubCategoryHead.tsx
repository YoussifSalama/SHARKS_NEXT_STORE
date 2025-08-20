import Link from "next/link";

const CommonSubCategoryHead = ({ title, description }: { title: string, description: string }) => {
    return (<div className="text-main-1 opacity-75 font-medium container">
        <div className="text-sm">
            <Link href="/">Home</Link>
            {"/"}
            <span>{title}</span>
        </div>
        <p className="text-sm text-center font-bold text-md capitalize mt-7" style={{
            "wordBreak": "break-word"
        }}>{description.slice(0, 500)}</p>
    </div>);
}

export default CommonSubCategoryHead;
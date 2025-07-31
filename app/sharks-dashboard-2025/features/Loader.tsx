import { LoaderCircle } from "lucide-react"

export const CategoriesLoader = () => {
    return (
        <div className="grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1  gap-4">
            {Array.from({ length: 8 }).map((_, index) => {
                return <div key={index} className="rounded-md shadow-md p-4 w-full border overflow-hidden h-fit animate-pulse">
                    <div className="relative rounded-md shadow-md overflow-hidden">
                        <div className="w-full h-64 bg-gray-200"></div>
                        <span className="absolute inset-0 flex items-end justify-center bg-gray-300 bg-opacity-30 p-2"></span>
                    </div>

                    <div className="mt-2 h-5 bg-gray-200 rounded w-3/4"></div>

                    <div className="mt-2 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            })}
        </div>
    );
};

const Loader = ({ classname }: { classname: string }) => {
    return <div className="animate-pulse">
        <LoaderCircle className={`animate-spin ${classname}`} />
    </div>
}

export default Loader;


import { Metadata } from "next";
import CountAnalytics from "./components/home/CountAnalytics";
import CategoriesTable from "./components/home/CategoriesTable";
import SubCategoriesTable from "./components/home/SubCategoriesTable";
import ProductsTable from "./components/home/ProductsTable";

export const metadata: Metadata = {
    title: "Sharks Dashboard 2025/Home",
    description: "Dashboard for Sharks Store 2025/Home",
}


const Home = () => {
    return (<section className="flex flex-col gap-4">
        {/* analytics */}
        <CountAnalytics />
        {/* fast reach */}
        <div className="grid grid-cols-4 gap-4 *:col-span-2 max-md:*:col-span-4">
            <div className="p-2 border rounded-md shadow-md"><CategoriesTable/></div>
            <div className="p-2 border rounded-md shadow-md"><SubCategoriesTable/></div>
            <div className="p-2 border rounded-md shadow-md"><ProductsTable/></div>
            <div className="p-2 border rounded-md shadow-md">tables</div>
            <div className="p-2 border rounded-md shadow-md">tables</div>
        </div>
    </section>);
}

export default Home;
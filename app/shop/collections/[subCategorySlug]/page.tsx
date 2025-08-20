import { getCategoriesandItsSubCategoriesForNavbar } from "@/app/actions/category/category";
import { getOneSubCategory } from "@/app/actions/category/subcategory";
import { getRandomProducts } from "@/app/actions/product/product";
import CommonSubCategoryHead from "@/app/components/common/CommonSubCategoryHead";
import Hero from "@/app/components/shop/collections/subCategory/Hero";
import MoreProducts from "@/app/components/shop/collections/subCategory/MoreProducts";
import Products from "@/app/components/shop/collections/subCategory/Products";
import Footer from "@/app/features/footer/Footer";
import Navbar from "@/app/features/Navbar/Navbar";

type PageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const DynamicSubCategoryPage = async ({ searchParams }: PageProps) => {
    const resolvedSearchParams = await searchParams;
    const subId = resolvedSearchParams.subId ? Number(resolvedSearchParams.subId) : null;
    const navPromise = getCategoriesandItsSubCategoriesForNavbar(10, 10);

    if (!subId || isNaN(subId)) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 font-semibold">Invalid SubCategory ID</p>
            </div>
        );
    }

    const subCatPromise = getOneSubCategory(subId);
    const productsPromise = getRandomProducts();

    const [navResult, subCat, productsResult] = await Promise.all([navPromise, subCatPromise, productsPromise]);

    if (!subCat?.data) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">SubCategory not found.</p>
            </div>
        );
    }

    const { title, img, description } = subCat.data;

    const moreProductsData = productsResult?.data?.map((product: any) =>
        product.variants.map((variant: any) => ({
            id: product.id,
            title: product.title,
            description: product.description,
            color: variant.color,
            imgs: variant.imgs,
            offer: variant.offer,
            sizes: variant.sizes,
            price: variant.price,
        }))
    ).flat() || [];

    return (
        <div className="relative">
            <Navbar data={navResult?.data} home={false} />
            <div className="space-y-[37px]">
                <Hero title={title} img={img as string} />
                <CommonSubCategoryHead title={title} description={description} />
                <Products subCatId={subId} />
                <MoreProducts data={moreProductsData} />
            </div>
            <Footer />
        </div>
    );
};

export default DynamicSubCategoryPage;

import { getCategoriesandItsSubCategoriesForNavbar } from "@/app/actions/category/category";
import { getOneProduct, getRandomProducts } from "@/app/actions/product/product";
import MoreProducts from "@/app/components/shop/collections/subCategory/MoreProducts";
import ProductDisplay from "@/app/components/shop/collections/subCategory/product/ProductDisplay";
import Footer from "@/app/features/footer/Footer";
import Navbar from "@/app/features/Navbar/Navbar";
import NavbarMob from "@/app/features/Navbar/NavbarMob";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

type ParamsType = Promise<{ productId: string; subCategorySlug?: string }>;
type PropsType = { params: ParamsType };

const Loading = () => (
    <section className="flex items-center justify-center h-dvh">
        <Loader2 className="w-8 h-8 animate-spin text-main-3" />
    </section>
);

const ErrorComponent = ({ message }: { message: string }) => (
    <section className="flex items-center justify-center h-dvh">
        <p className="text-red-500 text-center">{message}</p>
    </section>
);

const DynamicProduct = async ({ params }: PropsType) => {
    const resolvedParams = await params;
    const productId = Number(resolvedParams.productId);

    const productPromise = getOneProduct(productId);
    const navPromise = getCategoriesandItsSubCategoriesForNavbar(10, 10);
    const moreProductsPromise = getRandomProducts();

    const [productResponse, navResult, moreProductsResult] = await Promise.all([
        productPromise,
        navPromise,
        moreProductsPromise
    ]);

    if (!productResponse?.ok || !productResponse?.data) {
        return <ErrorComponent message="Product not found." />;
    }

    const product = productResponse.data;
    

    const moreProductsData = moreProductsResult?.data?.map((product: any) =>
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
        <section className="relative overflow-hidden min-h-dvh">
            <Navbar data={navResult?.data} />
            {/* @ts-ignore */}
            <NavbarMob data={navResult?.data} />

            <Suspense fallback={<Loading />}>
                {/* @ts-ignore */}
                <ProductDisplay product={product} />
                <MoreProducts data={moreProductsData} />
            </Suspense>

            <Footer />
        </section>
    );
};

export default DynamicProduct;

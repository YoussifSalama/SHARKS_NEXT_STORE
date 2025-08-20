type SizeType = {
    size: string;
    stock: number;
};

type CommonProductMetaProps = {
    title: string;
    color: string;
    sizes: SizeType[];
    price: number;
    badge?: string;
};

const CommonProductMeta = ({ title, color, sizes, price, badge }: CommonProductMetaProps) => {
    return (
        <div className="opacity-85 space-y-2 w-full">
            <div className="flex items-center gap-2">
                <span className="text-sm text-main-3 font-medium">{title}</span>
                {badge && (
                    <span className="text-xs px-2 py-0.5 rounded bg-main-1 text-main-2">
                        {badge}
                    </span>
                )}
                <span
                    style={{ backgroundColor: color }}
                    className="w-5 h-5 rounded-full border border-gray-200"
                />
            </div>

            <p className="text-xs font-semibold">{price} LE</p>

            {sizes && sizes.length > 0 && (
                <div className="flex flex-row gap-3 flex-wrap">
                    {sizes
                        .filter((s) => Number(s.stock) > 0)
                        .map((s, idx) => (
                            <span
                                key={idx}
                                className="text-xs px-2 py-1 rounded bg-main-3 text-main-2"
                            >
                                {s.size}
                            </span>
                        ))}
                </div>
            )}
        </div>
    );
};

export default CommonProductMeta;

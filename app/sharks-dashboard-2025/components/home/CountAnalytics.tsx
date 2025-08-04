"use client";

import { getAnalyticsCounts } from "@/app/actions/analytics/analytics";
import { useEffect, useState } from "react";

interface AnalyticsData {
    totalProducts: number;
    totalCategories: number;
    totalSubCategories: number;
}

const CountAnalytics = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalProducts: 0,
        totalCategories: 0,
        totalSubCategories: 0,
    });
    const [loading, setLoading] = useState(true);

    const getCountAnalytics = async () => {
        try {
            setLoading(true);
            const result = await getAnalyticsCounts();
            if (result.ok && result.data) {
                setAnalytics({
                    totalProducts: result.data.totalProducts,
                    totalCategories: result.data.totalCategories,
                    totalSubCategories: result.data.totalSubCategories,
                });

            } else {
                console.error(result?.message || "Failed to load analytics");
            }
        } catch (err) {
            console.error("Error fetching analytics:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCountAnalytics();
    }, []);

    return (
        <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
            {loading ? (
                <>
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="p-4 border rounded-md shadow-md animate-pulse  h-20"
                        >
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <div className="p-4 border rounded-md shadow-md">
                        <h2 className="text-xl font-semibold">{analytics.totalProducts}</h2>
                        <p className="text-gray-500">Total Products</p>
                    </div>

                    <div className="p-4 border rounded-md shadow-md">
                        <h2 className="text-xl font-semibold">{analytics.totalCategories}</h2>
                        <p className="text-gray-500">Total Categories</p>
                    </div>

                    <div className="p-4 border rounded-md shadow-md">
                        <h2 className="text-xl font-semibold">{analytics.totalSubCategories}</h2>
                        <p className="text-gray-500">Total Sub Categories</p>
                    </div>

                    <div className="p-4 border rounded-md shadow-md">
                        <h2 className="text-xl font-semibold">
                            {analytics.totalProducts + analytics.totalCategories + analytics.totalSubCategories}
                        </h2>
                        <p className="text-gray-500">Total Items</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default CountAnalytics;

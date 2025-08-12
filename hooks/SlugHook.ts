import { useState } from "react";

const useSlug = () => {
    const [slug, setSlug] = useState<string>("");

    const makeSlug = (name: string) => {
        const enhancedName = name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-")
            .replace(/^-+/, "")
            .replace(/-+$/, "");

        setSlug(enhancedName);
    };

    return { slug, makeSlug };
};

export default useSlug;

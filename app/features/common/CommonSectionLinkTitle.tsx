import clsx from "clsx";
import NextLink from "next/link";
import { ExternalLink } from "lucide-react";

interface CommonSectionLinkTitleProps {
    title: string;
    className?: string;
    href: string;
    external?: boolean;
}

const CommonSectionLinkTitle = ({
    title,
    className,
    href,
    external = false,
}: CommonSectionLinkTitleProps) => {
    const linkProps = external
        ? { href, target: "_blank", rel: "noopener noreferrer" }
        : { href };

    const LinkComponent = external ? "a" : NextLink;

    return (
        <h3 className={clsx("text-xl font-light opacity-85 text-main-3", className)}>
            <LinkComponent {...linkProps} className="inline-flex items-center gap-1 underline">
                {title}
                {external && <ExternalLink size={16} aria-label="External link" />}
            </LinkComponent>
        </h3>
    );
};

export default CommonSectionLinkTitle;
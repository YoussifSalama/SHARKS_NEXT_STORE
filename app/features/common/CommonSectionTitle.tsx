import clsx from "clsx";

const CommonSectionTitle = ({ title, className }: { title: string, className: string }) => {
    return (<h2 className={clsx("text-lg font-light opacity-85 text-main-1", className)}>
        {title}
    </h2>);
}

export default CommonSectionTitle;
"use client";
import clsx from "clsx";
import { MoveRight } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const CommonButton1 = ({
    title,
    buttonClassName,
    titleClassName,
    iconClassName,
    to
}: {
    title: string;
    buttonClassName?: string;
    titleClassName?: string;
    iconClassName?: string;
    to?: string
}) => {
    const [hover, setHover] = useState(false);
    const titleRef = useRef<HTMLSpanElement>(null);
    const [titleWidth, setTitleWidth] = useState<number>(0);

    useEffect(() => {
        if (titleRef.current) {
            setTitleWidth(titleRef.current.offsetWidth);
        }
    }, []);

    return (
        <button
            className={clsx(
                hover ? "bg-main-2 text-main-3" : "bg-transparent text-main-2",
                "flex gap-2 py-2 px-4 overflow-hidden border-2 border-main-2 items-center relative text-nowrap",
                buttonClassName
            )}
            style={{
                width: hover ? `${titleWidth + 55}px` : `${titleWidth + 40}px`,
                transition: 'width 0.5s ease-in-out,background-color 0.5s ease-in-out',
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            type="button"
            onClick={() => {
                to && redirect(to)
            }}
        >
            <span ref={titleRef} className={clsx("capitalize text-md", titleClassName)}>{title}</span>

            <span
                className={clsx(
                    "transition-all duration-500 flex items-center w-5",
                    hover ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                )}
            >
                <MoveRight className={clsx("transition-all duration-300", iconClassName)} />
            </span>
        </button>
    );
};


export const CommonButton2 = ({
    title,
    buttonClassName,
    titleClassName,
    iconClassName,
    to
}: {
    title: string;
    buttonClassName?: string;
    titleClassName?: string;
    iconClassName?: string;
    to?: string
}) => {
    const [hover, setHover] = useState(false);
    const titleRef = useRef<HTMLSpanElement>(null);
    const [titleWidth, setTitleWidth] = useState<number>(0);

    useEffect(() => {
        if (titleRef.current) {
            setTitleWidth(titleRef.current.offsetWidth);
        }
    }, []);

    return (
        <button
            className={clsx(
                "flex gap-2 py-2 px-4 overflow-hidden  items-center relative bg-main-3 text-main-2 text-nowrap",
                buttonClassName
            )}
            style={{
                width: hover ? `${titleWidth + 55}px` : `${titleWidth + 40}px`,
                transition: 'width 0.5s ease-in-out,background-color 0.5s ease-in-out',
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            type="button"
            onClick={() => {
                to && redirect(to)
            }}
        >
            <span ref={titleRef} className={clsx("capitalize text-md", titleClassName)}>{title}</span>

            <span
                className={clsx(
                    "transition-all duration-500 flex items-center w-5",
                    hover ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                )}
            >
                <MoveRight className={clsx("transition-all duration-300", iconClassName)} />
            </span>
        </button>
    );
};
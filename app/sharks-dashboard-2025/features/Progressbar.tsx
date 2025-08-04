"use client";

import { cn } from "@/lib/utils";



export const Progressbar2 = ({ progress, upload }: { progress: number; upload: boolean }) => {
    const styles = upload
        ? "bg-gradient-to-t from-black/30 to-black/50"
        : "bg-gradient-to-t from-red-400/60 to-red-600/70";

    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
            {/* Container */}
            <div className={cn(
                "relative w-full h-full flex items-end justify-center overflow-hidden"
            )}>
                {/* Progress Fill */}
                <div
                    className={cn(
                        "w-full transition-all duration-300 ease-in-out",
                        styles
                    )}
                    style={{
                        height: `${progress}%`,
                    }}
                ></div>

                {/* Percentage Text */}
                <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white drop-shadow-md">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
};



const Progressbar = ({ progress, upload }: { progress: number; upload: boolean }) => {
    const styles = upload
        ? "bg-gradient-to-r from-black/10 to-black/50"
        : "bg-gradient-to-r from-red-200 to-red-500";

    const parentBg = upload
        ? "bg-black/10"
        : "bg-red-100";

    return (
        <div className="flex gap-2">
            <div className={cn("w-full h-[15px] rounded-full border shadow-md overflow-hidden", parentBg)}>
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-300 ease-in-out",
                        styles
                    )}
                    style={{
                        width: `${progress}%`,
                    }}
                ></div>
            </div>
            <span className="text-black/50 text-xs font-medium whitespace-nowrap">{progress} %</span>
        </div>
    );
};

export default Progressbar;

"use client";

import { CommonButton2 } from "../features/common/CommonButtons";

const ErrorPage = () => {
    return (
        <div className="min-h-dvh flex items-center justify-center w-dvw px-4">
            <section className="bg-white dark:bg-gray-900 w-full">
                <div className="py-8 mx-auto max-w-screen-xl lg:py-16">
                    <div className="mx-auto max-w-screen-sm text-center">

                        <h1
                            className="mb-6 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-600 dark:text-red-500"
                        >
                            500
                        </h1>

                        <p className="mb-4 text-3xl tracking-tight font-bold text-main-3 md:text-4xl">
                            Oops! Something went wrong.
                        </p>

                        <p className="mb-6 text-lg font-light text-main-3/70">
                            Sorry, an unexpected error has occurred on our side.
                            Please try again later or go back to the homepage.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <CommonButton2 title="Back to Homepage" to="/" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ErrorPage;

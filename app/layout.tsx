import type { Metadata } from "next";
import { Amiri } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { EdgeStoreProvider } from "@/lib/edgestore";
export const runtime = "nodejs";




const AmiriFont = Amiri({
  variable: "--font-amiri",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Sharks",
  description: "Sharks Store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${AmiriFont.variable} antialiased relative`}
      >
        <ToastContainer theme="dark" />
        <EdgeStoreProvider>
          {children}
        </EdgeStoreProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "simplebar-react/dist/simplebar.min.css";
import "react-loading-skeleton/dist/skeleton.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Askify",
  description: "Askify is an software to make chatting to your PDF files easy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${roboto.className} bg-gray-50`}>
          <Navbar />
          <main className="max-w-7xl mx-auto w-full px-20 lg:px-10 min-h-[calc(100vh-90px)] mb-10">
            {children}
          </main>
          <Footer />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Separator } from "@/components/ui/separator";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <Separator />
      <main className="max-w-7xl mx-auto w-full px-20 lg:px-10 min-h-[calc(100vh-90px)] mb-10">
        {children}
      </main>
      <Separator />
      <Footer />
    </>
  );
};

export default MainLayout;

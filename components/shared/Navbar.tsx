import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight } from "lucide-react";
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {
  const user = await currentUser();
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <div className="max-w-7xl mx-auto w-full px-20 lg:px-10">
        <div className="flex justify-between items-center h-14">
          <Link href={"/"} className="text-xl font-bold text-purple-700">
            Askify<span className="text-black">.</span>
          </Link>
          <div className="hidden sm:flex items-center space-x-8">
            {user ? (
              <>
                <Link className="capitalize" href="/dashboard">
                  Dashboard
                </Link>
                <UserAccountNav
                  name={!user.username ? "Your Account" : "user.username"}
                  email={user.emailAddresses[0].emailAddress ?? ""}
                  imageUrl={user.imageUrl ?? ""}
                />
              </>
            ) : (
              <>
                <Link className="capitalize" href="/pricing">
                  Pricing
                </Link>
                <Link className="capitalize" href={"/sign-in"}>
                  Sign in
                </Link>
                <Button asChild className="capitalize">
                  <Link href={"/sign-up"}>
                    get started <ArrowRight className="ml-1.5 h-5 w-5" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

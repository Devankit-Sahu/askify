import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";
import UserAccountNav from "./UserAccountNav";
import { ModeToggle } from "../mode-toggle";
import { loggedInUser } from "@/app/actions";
import MobileNav from "./MobileNav";

const Navbar = async () => {
  const user = await loggedInUser();
  return (
    <nav className="border-b sticky top-0 z-10 bg-background">
      <div className="container flex h-16 justify-between items-center px-4 md:px-10 mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xl font-bold">Askify</span>
          </Link>
          {!user && (
            <nav className="ml-8 hidden md:flex gap-6">
              <Link href="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium hover:text-primary"
              >
                Pricing
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link className="capitalize" href="/dashboard">
                  Dashboard
                </Link>
                <UserAccountNav
                  name={!user.username ? "Your Account" : user.username}
                  email={user.email ?? ""}
                  imageUrl={user.imageUrl ?? ""}
                />
              </>
            ) : (
              <>
                <Link href={"/sign-in"}>
                  <Button className="capitalize" variant="outline">
                    Sign in
                  </Button>
                </Link>
                <Link href={"/sign-up"}>
                  <Button className="capitalize">
                    get started free <ArrowRight className="ml-1.5 h-5 w-5" />
                  </Button>
                </Link>
              </>
            )}
          </div>
          <MobileNav user={user} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

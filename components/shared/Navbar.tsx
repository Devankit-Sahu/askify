import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, MessageSquare } from "lucide-react";
import UserAccountNav from "./UserAccountNav";
import { ModeToggle } from "../mode-toggle";

const Navbar = async () => {
  const user = await currentUser();
  return (
    <nav className="border-b sticky top-0 z-10 bg-background">
      <div className="container flex h-16 items-center px-10">
        <Link href="/" className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          <span className="text-xl font-bold">Askify</span>
        </Link>
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
        <div className="ml-auto hidden md:flex items-center gap-4">
          <ModeToggle />
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
      </div>
    </nav>
  );
};

export default Navbar;

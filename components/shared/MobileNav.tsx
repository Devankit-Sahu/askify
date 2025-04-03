"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Menu, Gem, UserRound } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import CustomSignOutButton from "../CustomSignOutButton";

const MobileNav = ({ user }: { user: User | null }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="md:hidden p-2"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col gap-6 p-6">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-start items-center border-b pb-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold">Askify</span>
              </Link>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* User Profile Section */}
        {user && (
          <div className="flex items-center gap-3 border-b pb-4">
            <Avatar className="w-10 h-10">
              {user.imageUrl ? (
                <Image
                  fill
                  src={user.imageUrl}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                />
              ) : (
                <AvatarFallback>
                  <UserRound className="h-6 w-6 text-zinc-900" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {user.username || "Your Account"}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {!user ? (
            <>
              <Link
                href="/"
                className="text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className="text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/pricing"
                className="text-lg font-medium flex items-center gap-1"
                onClick={() => setIsOpen(false)}
              >
                Upgrade Plan <Gem className="text-blue-600 h-5 w-5" />
              </Link>
              <Link
                href="/dashboard/billing"
                className="text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                Manage Subscription
              </Link>
            </>
          )}
        </div>

        {!user ? (
          <div className="flex flex-col gap-2">
            <Link href={"/sign-in"} onClick={() => setIsOpen(false)}>
              <Button className="capitalize w-full" variant="outline">
                Sign in
              </Button>
            </Link>
            <Link href={"/sign-up"} onClick={() => setIsOpen(false)}>
              <Button className="capitalize w-full">Get started free</Button>
            </Link>
          </div>
        ) : (
          <Button className="capitalize w-full" variant="outline" asChild>
            <CustomSignOutButton />
          </Button>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;

"use client";

import { useClerk } from "@clerk/nextjs";


const SignOutButton = () => {
  const { signOut } = useClerk();

  return (
    <button className="w-full text-start" onClick={() => signOut({ redirectUrl: "/" })}>Log Out</button>
  );
};

export default SignOutButton;

"use client";

import { useClerk } from "@clerk/nextjs";


const SignOutButton = () => {
  const { signOut } = useClerk();

  return (
    <button onClick={() => signOut({ redirectUrl: "/" })}>Log Out</button>
  );
};

export default SignOutButton;

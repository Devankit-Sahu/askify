"use client";

import { UserProfile } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { useTheme } from "next-themes";

const Account = () => {
  const { theme } = useTheme();
  return (
    <UserProfile
      appearance={{
        baseTheme:
          theme === "dark" || theme === "system" ? shadesOfPurple : undefined,
      }}
    />
  );
};

export default Account;

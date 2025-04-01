"use client";

import { UserProfile } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function AccountNestedPage() {
  const { theme } = useTheme();
  return (
    <UserProfile
      appearance={{
        baseTheme:
          theme === "dark" || theme === "system" ? shadesOfPurple : undefined,
      }}
    />
  );
}

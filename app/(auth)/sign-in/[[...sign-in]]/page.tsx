"use client";

import { SignIn } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";

const SignInPage = () => {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center relative py-12">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:16px_16px]" />
      <div className="container px-4 md:px-10">
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Welcome back to Askify</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to continue your document journey
            </p>
          </div>
          <div className="flex justify-center">
            <SignIn
              appearance={{
                elements: {
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  formButtonPrimary:
                    theme === "dark" || theme === "system"
                      ? ""
                      : "bg-primary hover:bg-primary/90 text-primary-foreground",
                  footerActionLink:
                    theme === "dark" || theme === "system"
                      ? ""
                      : "text-primary hover:text-primary/90",
                },
                baseTheme:
                  theme === "dark" || theme === "system"
                    ? shadesOfPurple
                    : undefined,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

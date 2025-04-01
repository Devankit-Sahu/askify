"use client";

import { Card } from "@/components/ui/card";
import { SignUp } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { FileText, MessageSquare } from "lucide-react";
import { useTheme } from "next-themes";

const SignUpPage = () => {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center relative py-12">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:16px_16px]" />
      <div className="container px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Join Askify</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Create your account and start chatting with your documents
              instantly
            </p>
            <div className="space-y-6">
              <Card className="p-4 bg-card/50 backdrop-blur">
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Upload Any Document</h3>
                    <p className="text-sm text-muted-foreground">
                      Support for PDFs, Word docs, PowerPoints, and more
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-card/50 backdrop-blur">
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Chat Naturally</h3>
                    <p className="text-sm text-muted-foreground">
                      Ask questions and get instant, accurate answers
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div className="flex justify-center">
            <SignUp
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

export default SignUpPage;

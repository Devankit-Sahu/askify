import { ArrowRight, Bot, MessageSquare, Upload, Zap } from "lucide-react";
import { Card } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";

const HeroSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:16px_16px]" />
      <div className="container px-4 md:px-10 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Your Documents,
              <span className="bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">
                Your AI-Powered Assistant
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              No more endless scrolling or searching.
              <span className="font-semibold text-primary"> Askify </span>
              lets you chat with your PDFs and get instant, accurate answers.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Upload your document, ask anything, and get AI-driven insights in
              seconds.
            </p>
            <Link href="/sign-in">
              <Button size="lg" className="bg-primary">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <Card className="p-6 shadow-xl bg-background/95 backdrop-blur">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">annual_report_2024.pdf</h3>
                  <p className="text-sm text-muted-foreground">
                    Uploaded and processed
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <Card className="p-3 bg-muted">
                    <p className="text-sm">
                      What were the key revenue drivers in Q4?
                    </p>
                  </Card>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <Card className="p-3">
                    <p className="text-sm">
                      Based on the Q4 analysis, the key revenue drivers were: 1.
                      Enterprise subscription growth (+45%) 2. International
                      market expansion 3. New product launches in the APAC
                      region
                    </p>
                  </Card>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <Card className="p-3 bg-muted">
                    <p className="text-sm">
                      Can you break down the APAC growth?
                    </p>
                  </Card>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <Card className="p-3 bg-muted/50 blur-sm">
                      <p className="text-sm">Analyzing APAC regional data...</p>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { Bot, Brain, FileText, MessageSquare, Upload } from "lucide-react";
import { Card } from "./ui/card";

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-t from-background to-muted relative overflow-hidden">
      <div className="container px-4 md:px-10 mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">See It In Action</h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Easy Upload</h3>
                  <p className="text-muted-foreground">
                    Drag & drop your documents or select from cloud storage
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Instant Processing</h3>
                  <p className="text-muted-foreground">
                    AI analyzes and indexes your content within seconds
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Start Chatting</h3>
                  <p className="text-muted-foreground">
                    Get immediate answers to your questions
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <Card className="p-6 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">product_roadmap.pdf</h3>
                    <p className="text-sm text-muted-foreground">
                      12 pages • Last updated 2 days ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <Card className="p-3 bg-primary text-primary-foreground">
                    <p className="text-sm">
                      I&apos;ve analyzed the roadmap. What would you like to
                      know?
                    </p>
                  </Card>
                </div>
                <div className="flex gap-3 items-start justify-end">
                  <Card className="p-3 bg-muted">
                    <p className="text-sm">
                      What are the key features planned for Q2?
                    </p>
                  </Card>
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <MessageSquare className="h-4 w-4" />
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

export default HowItWorksSection;

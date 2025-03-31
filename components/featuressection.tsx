import { Card } from "./ui/card";
import { Brain, FileText, Search } from "lucide-react";

const FeaturesSection = () => {
  return (
    <div>
      <section className="py-20 bg-background relative">
        <div className="container px-4 md:px-10">
          <h2 className="text-3xl font-bold text-center mb-4">
            Unlock Your Documents&apos; Potential
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Transform static documents into interactive knowledge bases with our
            powerful AI-driven features
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
              <Brain className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Smart Understanding
              </h3>
              <p className="text-muted-foreground">
                Our AI deeply understands your documents, grasping context and
                relationships for accurate insights.
              </p>
            </Card>
            <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
              <Search className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Natural Queries</h3>
              <p className="text-muted-foreground">
                Ask questions in plain language and get precise answers from
                your document content.
              </p>
            </Card>
            <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Universal Support</h3>
              <p className="text-muted-foreground">
                Works with PDFs, Word docs, PowerPoints, and more. One solution
                for all your documents.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesSection;

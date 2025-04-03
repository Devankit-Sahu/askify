import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container px-4 md:px-10 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Documents?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals using DocChat AI to work smarter
            with their documents
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-in">
              <Button size="lg" className="bg-primary">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;

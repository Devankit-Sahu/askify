import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md text-center space-y-6">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="text-3xl font-bold">Subscription not completed</h1>
        <p className="text-muted-foreground">
          You canceled the process before completing your subscription. You can
          try again anytime.
        </p>
        <Link href="/pricing">
          <Button variant="outline" className="mt-4">
            Back to Pricing
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CancelPage;

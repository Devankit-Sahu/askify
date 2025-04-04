import { getUserSubscriptionPlan } from "@/app/actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UpgradeButton from "@/components/UpgradeButton";
import { format } from "date-fns";

const Billing = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted relative py-12">
      <div className="container px-4 md:px-10 mx-auto">
        <h1 className="font-bold text-base sm:text-xl md:text-2xl lg:text-3xl mb-6">
          Billing
        </h1>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
              <p>
                You are currently on the{" "}
                <strong>{subscriptionPlan?.planName}</strong> plan.
              </p>
              {subscriptionPlan?.isSubscribed ? (
                <p className="rounded-full text-xs font-medium">
                  {subscriptionPlan.isCanceled
                    ? "Your plan will be canceled on"
                    : "Your plan renews on"}{" "}
                  {subscriptionPlan?.currentPeriodEnd
                    ? format(subscriptionPlan.currentPeriodEnd, "dd.MM.yyyy")
                    : "N/A"}
                  .
                </p>
              ) : null}
            </CardContent>
            <CardFooter>
              <UpgradeButton isSubscribed={subscriptionPlan?.isSubscribed} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Billing;

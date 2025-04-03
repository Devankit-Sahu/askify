import { getUserSubscriptionPlan } from "@/app/actions";
import BillingForm from "@/components/BillingFrom";

const Billing = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted relative py-12">
      <div className="container px-4 md:px-10 mx-auto">
        <h1 className="font-bold text-base sm:text-xl md:text-2xl lg:text-3xl mb-6">
          Billing
        </h1>
        <BillingForm subscriptionPlan={subscriptionPlan} />
      </div>
    </div>
  );
};

export default Billing;

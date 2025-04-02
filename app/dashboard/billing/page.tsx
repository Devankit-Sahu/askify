import { getUserSubscriptionPlan } from "@/app/actions";
import BillingForm from "@/components/BillingFrom";
import Heading from "@/components/dashboard/Heading";

const Billing = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <div className="pt-10">
      <div className="container px-4 md:px-10">
        <Heading heading="Billing" className="mb-5" />
        <BillingForm subscriptionPlan={subscriptionPlan} />
      </div>
    </div>
  );
};

export default Billing;

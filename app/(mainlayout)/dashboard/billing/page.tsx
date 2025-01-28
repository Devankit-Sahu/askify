import { getUserSubscriptionPlan } from "@/app/actions";
import BillingFrom from "@/components/BillingFrom";
import Heading from "@/components/dashboard/Heading";

const Billing = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <div>
      <Heading heading="Billing" className="my-5" />
      <BillingFrom subscriptionPlan={subscriptionPlan} />
    </div>
  );
};

export default Billing;

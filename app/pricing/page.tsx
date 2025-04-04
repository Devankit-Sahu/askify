import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import UpgradeButton from "@/components/UpgradeButton";
import { plansDetails } from "@/constants/constants";
import { Check } from "lucide-react";
import Link from "next/link";
import { getUserSubscriptionPlan, loggedInUser } from "../actions";

const Pricing = async () => {
  const user = await loggedInUser();
  const subscriptionPlan = await getUserSubscriptionPlan();
  return (
    <section className="min-h-screen py-20">
      <div className="container px-4 md:px-10 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that&apos;s right for you or your team
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {plansDetails.map((pricingDetail) => (
            <Card
              key={pricingDetail.name}
              className={`p-8 ${
                pricingDetail.popular
                  ? "border-primary shadow-lg scale-105"
                  : ""
              }`}
            >
              {pricingDetail.popular && (
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </span>
              )}
              <div className="mb-8">
                <h2 className="text-2xl font-bold">{pricingDetail.name}</h2>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">
                    ${pricingDetail.price}
                  </span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <p className="mt-4 text-muted-foreground">
                  {pricingDetail.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {pricingDetail.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {pricingDetail.name === "Free" ? (
                <Link
                  href={user ? "/dashboard" : "/sign-in"}
                  className={buttonVariants({
                    className: "w-full capitalize",
                    variant: "secondary",
                  })}
                >
                  start for free
                </Link>
              ) : user ? (
                <UpgradeButton isSubscribed={subscriptionPlan?.isSubscribed} />
              ) : (
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    className: "w-full capitalize",
                  })}
                >
                  upgrade now
                </Link>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

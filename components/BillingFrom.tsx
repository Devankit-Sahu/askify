"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { getUserSubscriptionPlan } from "@/lib/stripe.config";
import { format } from "date-fns";

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const BillingFrom = ({ subscriptionPlan }: BillingFormProps) => {
  const handleCheckout = async () => {
    const response = await fetch("/api/checkout", {
      method: "POST",
    });
    const data = await response.json();
    if (data.error) {
      toast({
        title: "Error",
        description: data.error.message,
      });
      return;
    }
    window.location.href = data.url;
  };
  return (
    <form
      method="POST"
      className="mt-12"
      onSubmit={(e) => {
        e.preventDefault();
        handleCheckout();
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            You are currently on the <strong>{subscriptionPlan.name}</strong>{" "}
            plan.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          <Button type="submit">
            {subscriptionPlan.isSubscribed
              ? "Manage Subscription"
              : "Upgrade to PRO"}
          </Button>

          {subscriptionPlan.isSubscribed ? (
            <p className="rounded-full text-xs font-medium">
              {subscriptionPlan.isCanceled
                ? "Your plan will be canceled on "
                : "Your plan renews on"}{" "}
              {format(subscriptionPlan.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}.
            </p>
          ) : null}
        </CardFooter>
      </Card>
    </form>
  );
};

export default BillingFrom;

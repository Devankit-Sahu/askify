"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { getUserSubscriptionPlan } from "@/app/actions";

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
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          You are currently on the <strong>{subscriptionPlan.name}</strong>{" "}
          plan.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
        <form
          method="POST"
          onSubmit={(e) => {
            e.preventDefault();
            handleCheckout();
          }}
        >
          <Button type="submit">
            {subscriptionPlan.isSubscribed
              ? "Manage Subscription"
              : "Upgrade to PRO plan"}
          </Button>
        </form>
        {subscriptionPlan.isSubscribed ? (
          <p className="rounded-full text-xs font-medium">
            {subscriptionPlan.isCanceled
              ? "Your plan will be canceled on"
              : "Your plan renews on"}{" "}
            {format(subscriptionPlan.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default BillingFrom;

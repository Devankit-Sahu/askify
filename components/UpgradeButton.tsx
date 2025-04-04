"use client";

import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Calendar, CreditCard, MapPin, ShieldCheck } from "lucide-react";

interface UpgradeButtonProps {
  isSubscribed?: boolean;
}

const UpgradeButton = ({ isSubscribed = false }: UpgradeButtonProps) => {
  const [open, setOpen] = useState(false);
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

  if (isSubscribed) {
    return (
      <Button
        className="w-full capitalize text-foreground"
        onClick={handleCheckout}
      >
        Manage Subscription
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full capitalize text-foreground">
          Upgrade to pro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Test Card Details
          </DialogTitle>
          <DialogDescription>
            Use these test card details on the next screen. No real payment will
            be made.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3 text-sm">
          <p className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <strong>Card Number:</strong> 4242 4242 4242 4242
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <strong>Expiry:</strong> Any future date (e.g. 12/34)
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-muted-foreground" />
            <strong>CVC:</strong> Any 3 digits (e.g. 123)
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <strong>ZIP:</strong> Any 5 digits (e.g. 12345)
          </p>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCheckout}
            className="w-full capitalize text-foreground"
          >
            Proceed to Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeButton;

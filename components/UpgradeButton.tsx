"use client";

import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

const UpgradeButton = () => {
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
    <Button onClick={handleCheckout} className="w-full capitalize">
      Upgrade to pro
    </Button>
  );
};

export default UpgradeButton;

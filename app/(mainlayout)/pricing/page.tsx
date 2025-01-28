import { buttonVariants } from "@/components/ui/button";
import UpgradeButton from "@/components/UpgradeButton";
import { pricingDetails } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Check, Minus } from "lucide-react";
import Link from "next/link";

const Pricing = async () => {
  const user = await currentUser();
  return (
    <section className="pricing pb-40">
      <h1 className="text-5xl capitalize text-center font-semibold my-5">
        askify pricing
      </h1>
      <p className="text-sm text-gray-600 capitalize text-center mb-20">
        Pricing plans that grow with you. From prototype to Enterprise.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
        {pricingDetails.map((pricingDetail, index) => (
          <div
            key={index}
            className={cn("border border-gray-200 rounded-lg shadow p-8", {
              "border-2 border-purple-600": pricingDetail.plan === "pro",
            })}
          >
            <h1 className="capitalize text-2xl mb-2">
              {pricingDetail.plan} plan
            </h1>
            <p className="capitalize text-gray-400 font-thin text-sm mb-2">
              {pricingDetail.description}
            </p>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold py-10">
                {pricingDetail.price}
              </h1>
              {pricingDetail.plan === "free" ? (
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
                <UpgradeButton />
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
              <ul className="mt-5">
                {pricingDetail.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 mb-2">
                    <div className="bg-gray-200 rounded-full p-[2px]">
                      {feature.isAvailable ? (
                        <Check size={15} className="text-blue-500" />
                      ) : (
                        <Minus size={15} className="text-gray-500" />
                      )}
                    </div>
                    <p
                      className={cn("text-gray-700", {
                        "text-gray-400": !feature.isAvailable,
                      })}
                    >
                      {feature.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;

import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  heading: string;
  className?: string;
};

function Heading({ heading, className }: Props) {
  return (
    <h1 className={cn("text-2xl font-bold text-gray-500", className)}>
      {heading}
    </h1>
  );
}

export default Heading;

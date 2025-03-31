export const PLANS = [
  {
    name: "free",
    fileSizeLimit: 4,
    pdfsPerMonth: 10,
    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "pro",
    fileSizeLimit: 16,
    pdfsPerMonth: 50,
    price: {
      amount: 20,
      priceIds: {
        test: process.env.STRIPE_PRICE_ID_PRO_TEST,
        production: "",
      },
    },
  },
];

export const plansDetails: planDetail[] = [
  {
    name: "Free",
    description: "Perfect for trying out Askify",
    price: "0",
    features: [
      "2 document uploads",
      "100 questions per month",
      "Basic document formats(Pdf)",
      "24-hour response history",
    ],
  },
  {
    name: "Pro",
    description: "For large teams and organizations",
    price: "20",
    features: [
      "Unlimited document uploads",
      "Unlimited questions",
      "All document formats",
      "30-day response history",
      "Priority support",
    ],
    popular: true,
  },
];

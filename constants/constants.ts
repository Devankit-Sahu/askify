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

export const pricingDetails: priceDetail[] = [
  {
    plan: "free",
    description: "for individuals and small teams",
    price: "$0/month",
    features: [
      {
        text: "10 pdfs per month",
        isAvailable: true,
      },
      {
        text: "4MB file size limit",
        isAvailable: true,
      },
      {
        text: "Mobile-friendly interface",
        isAvailable: true,
      },
      {
        text: "Higher-quality responses",
        isAvailable: true,
      },
      {
        text: "Priority support",
        isAvailable: false,
      },
    ],
  },
  {
    plan: "pro",
    description: "for larger projects with higher needs",
    price: "$20/month",
    features: [
      {
        text: "50 pdfs per month",
        isAvailable: true,
      },
      {
        text: "16MB file size limit",
        isAvailable: true,
      },
      {
        text: "Mobile-friendly interface",
        isAvailable: true,
      },
      {
        text: "Higher-quality responses",
        isAvailable: true,
      },
      {
        text: "Priority support",
        isAvailable: true,
      },
    ],
  },
];

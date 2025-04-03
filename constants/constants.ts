export const PLANS = [
  {
    name: "Free",
    fileSizeLimit: 4,
    pdfsPerMonth: 5,
    noOfQuestionPerMonth: 100,
    docTypeSupported: ["pdf"],
    amount: 0,
  },
  {
    name: "Pro",
    fileSizeLimit: 16,
    pdfsPerMonth: 20,
    noOfQuestionPerMonth: null,
    docTypeSupported: ["pdf", "docx", "txt", "pptx", "xlsx"],
    amount: 20,
  },
];

export const plansDetails: planDetail[] = [
  {
    name: "Free",
    description: "Perfect for trying out Askify",
    price: "0",
    features: [
      "5 document uploads",
      "4mb file size limit",
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
      "16mb file size limit",
      "Unlimited questions",
      "All document formats",
      "30-day response history",
      "Priority support",
    ],
    popular: true,
  },
];

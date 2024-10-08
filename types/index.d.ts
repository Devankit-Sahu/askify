interface User {
  id: string;
  email: string;
  username: string | null;
  imageUrl: string | null;
  oauthId: string | null;
  oauthProvider: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: Date | null;
  createdAt: Date;
}

interface PdfFullscreenProps {
  fileUrl: string;
}

interface priceDetail {
  plan: string;
  description: string;
  price: string;
  features: { text: string; isAvailable: boolean }[];
}

interface UploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  url: string;
  secure_url: string;
  original_filename: string;
}

interface Message {
  id: string;
  fileId?: string;
  isUserMessage: boolean;
  text: string | JSX.Element;
  userId?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

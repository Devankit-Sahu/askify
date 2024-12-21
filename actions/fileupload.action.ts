"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "../lib/db.config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { pinecone } from "../lib/pinecone.config";
import { PineconeStore } from "@langchain/pinecone";
import { uploadFileToCloudinary } from "../lib/cloudinary.config";
import { PLANS } from "@/constants/constants";
import { stripe } from "../lib/stripe.config";

export const fileUploadHandler = async (formData: FormData) => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error("User not authenticated");
    }

    const file = formData.get("file") as File;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await uploadFileToCloudinary(fileBuffer);
    const fileData = await prisma.file.create({
      data: {
        name: file.name,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        userId: user.id,
      },
    });

    const response = await fetch(uploadResult.secure_url);
    const blob = await response.blob();

    const loader = new PDFLoader(blob);
    const pageLevelDocs = await loader.load();

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "text-embedding-004",
    });

    const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: fileData.id,
    });

    await prisma.file.update({
      where: { id: fileData.id },
      data: { status: "SUCCESS" },
    });

    return { id: fileData.id };
  } catch (error) {
    throw error;
  }
};

export async function getUserSubscriptionPlan() {
  const { userId } = auth();

  if (!userId) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  const dbUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  const isSubscribed = Boolean(
    dbUser.stripePriceId &&
      dbUser.stripeCurrentPeriodEnd &&
      dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  const plan = isSubscribed
    ? PLANS.find((plan) => plan.price.priceIds.test === dbUser.stripePriceId)
    : null;

  let isCanceled = false;

  if (isSubscribed && dbUser.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      dbUser.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    stripeSubscriptionId: dbUser.stripeSubscriptionId,
    stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
    stripeCustomerId: dbUser.stripeCustomerId,
    isSubscribed,
    isCanceled,
  };
}

"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "../db.config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PLANS } from "@/constants/constants";
import { getUserSubscriptionPlan } from "../stripe.config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { pinecone } from "../pinecone.config";
import { PineconeStore } from "@langchain/pinecone";
import { uploadFileToCloudinary } from "../cloudinary.config";
import { getFiles } from "./file.action";

export const fileUploadHandler = async (formData: FormData) => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    const subscriptionPlan = await getUserSubscriptionPlan();
    const files = await getFiles();

    if (
      (!subscriptionPlan.isSubscribed &&
        subscriptionPlan?.fileSizeLimit &&
        file.size > subscriptionPlan?.fileSizeLimit * 1024 * 1024) ||
      (subscriptionPlan.isSubscribed &&
        subscriptionPlan?.fileSizeLimit &&
        file.size > subscriptionPlan.fileSizeLimit * 1024 * 1024)
    ) {
      throw new Error(
        "File size limit exceeded.You can not upload this file.Please upgrade your plan"
      );
    }
    if (
      (!subscriptionPlan.isSubscribed &&
        subscriptionPlan?.pdfsPerMonth &&
        files.length > subscriptionPlan?.pdfsPerMonth) ||
      (subscriptionPlan.isSubscribed &&
        subscriptionPlan?.pdfsPerMonth &&
        files.length > subscriptionPlan.pdfsPerMonth)
    ) {
      throw new Error(
        "You have exceeded the number of pdfs you can upload per month.Please upgrade your plan"
      );
    }

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

    const pagesAmt = pageLevelDocs.length;

    const isProExceeded =
      pagesAmt > PLANS.find((plan) => plan.name === "pro")!.pagesPerPdf;
    const isFreeExceeded =
      pagesAmt > PLANS.find((plan) => plan.name === "free")!.pagesPerPdf;

    if (
      (!subscriptionPlan.isSubscribed && isFreeExceeded) ||
      (subscriptionPlan.isSubscribed && isProExceeded)
    ) {
      await prisma.file.update({
        where: { id: fileData.id },
        data: { status: "FAILED" },
      });
      return { id: fileData.id };
    }

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

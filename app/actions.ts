"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "../lib/db.config";
import { deleteFileFromCloudinary } from "../lib/cloudinary.config";
import { pinecone } from "../lib/pinecone.config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { uploadFileToCloudinary } from "../lib/cloudinary.config";

export async function createUser(
  data: Omit<
    User,
    | "createdAt"
    | "stripeCustomerId"
    | "stripeSubscriptionId"
    | "stripePriceId"
    | "stripeCurrentPeriodEnd"
  >
) {
  try {
    let user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) user = await prisma.user.create({ data });

    return user;
  } catch (error) {
    throw error;
  }
}

export async function loggedInUser() {
  try {
    const { userId } = auth();
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return null;

    return user;
  } catch (error) {
    throw error;
  }
}

export async function updateUser(data: {
  id: string;
  email?: string;
  username?: string;
  imageUrl?: string;
}) {
  try {
    const { id, email, username, imageUrl } = data;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        username,
        imageUrl,
      },
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    const user = await loggedInUser();
    if (!user) return null;
    await clerkClient.users.deleteUser(userId);
    await prisma.user.delete({ where: { id: userId } });
    return;
  } catch (error) {
    throw error;
  }
}

export const getFiles = async () => {
  try {
    const user = await loggedInUser();
    if (!user) return null;
    return await prisma.file.findMany({
      where: {
        userId: user.id,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getFile = async (fileId: string) => {
  try {
    const user = await loggedInUser();
    if (!user) return null;
    return await prisma.file.findUnique({
      where: {
        id: fileId,
        userId: user.id,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (fileId: string, publicId: string) => {
  try {
    const user = await loggedInUser();
    if (!user) return null;
    if (!fileId || !publicId) {
      throw new Error("fileId and publicId are required");
    }

    const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);
    await pineconeIndex.namespace(fileId).deleteAll();
    await deleteFileFromCloudinary(publicId);
    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });
    return;
  } catch (error) {
    throw error;
  }
};

export const getFilesByCurrentMonth = async () => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const currentDate = new Date();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  return await prisma.file.findMany({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });
};

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
  try {
    const user = await loggedInUser();
    if (!user) return null;

    const subscriptionPlan = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!subscriptionPlan)
      return {
        isSubscribed: false,
        planName: "Free",
        currentPeriodEnd: null,
        isCanceled: false,
      };

    return {
      isSubscribed: true,
      planName: subscriptionPlan.planName,
      currentPeriodEnd: subscriptionPlan.currentPeriodEnd,
      isCanceled: subscriptionPlan.cancelAtPeriodEnd,
    };
  } catch (error) {
    throw error;
  }
}

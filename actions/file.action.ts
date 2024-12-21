"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "../lib/db.config";
import { deleteFileFromCloudinary } from "../lib/cloudinary.config";
import { pinecone } from "../lib/pinecone.config";

export const getFiles = async () => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return await prisma.file.findMany({
    where: {
      userId,
    },
  });
};

export const getFile = async (fileId: string) => {
  return await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });
};

export const deleteFile = async (fileId: string, publicId: string) => {
  if (!fileId || !publicId) {
    throw new Error("fileId and publicId are required");
  }

  const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);
  await pineconeIndex.namespace(fileId).deleteAll();
  await deleteFileFromCloudinary(publicId);
  return await prisma.file.delete({
    where: {
      id: fileId,
    },
  });
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

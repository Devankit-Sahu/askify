"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "../db.config";
import { deleteFileFromCloudinary } from "../cloudinary.config";
import { pinecone } from "../pinecone.config";

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
  const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);
  await pineconeIndex.namespace(fileId).deleteAll();
  await deleteFileFromCloudinary(publicId);
  return await prisma.file.delete({
    where: {
      id: fileId,
    },
  });
};

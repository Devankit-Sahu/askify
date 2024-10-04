import prisma from "../db.config";

export const getFiles = async () => {
  return await prisma.file.findMany();
};

export const getFile = async (fileId: string) => {
  return await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });
};

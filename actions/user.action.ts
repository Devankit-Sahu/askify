"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "../lib/db.config";

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

export async function getUser() {
  try {
    const { userId } = auth();
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    throw error;
  }
}

import { getUserSubscriptionPlan, loggedInUser } from "@/app/actions";
import { PLANS } from "@/constants/constants";
import prisma from "@/lib/db.config";
import { model } from "@/lib/google-genai.config";
import { pinecone } from "@/lib/pinecone.config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, fileId } = body;
    const user = loggedInUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    if (typeof message !== "string" || typeof fileId !== "string") {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    if (!message || !fileId) {
      return NextResponse.json({
        error: "Message or fileId filed is missing",
        status: 400,
      });
    }

    const file = await prisma.file.findFirst({
      //@ts-expect-error: `userId` might be undefined or not properly typed
      where: { id: fileId, userId: user.id },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found", status: 404 });
    }

    // Fetch previous messages from the database
    const userMessages = await prisma.message.findMany({
      where: { fileId, isUserMessage: true },
      orderBy: { createdAt: "asc" },
    });

    const subscriptionPlan = await getUserSubscriptionPlan();
    const currentSubscriptionPlan = PLANS.find(
      (plan) => plan.name === subscriptionPlan?.planName
    );

    if (
      currentSubscriptionPlan &&
      currentSubscriptionPlan?.noOfQuestionPerMonth !== null &&
      userMessages.length > currentSubscriptionPlan?.noOfQuestionPerMonth
    ) {
      return NextResponse.json({
        error: "You have reached your monthly question limit",
        status: 400,
      });
    }

    await prisma.message.create({
      data: {
        text: message,
        isUserMessage: true,
        fileId,
      },
    });

    // Set up embeddings and vector store
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "text-embedding-004",
    });

    const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);
    const vectorstore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: file.id,
    });

    // Get relevant context using similarity search
    const results = await vectorstore.similaritySearch(message, 5);

    // Fetch previous messages from the database
    const previousMessages = await prisma.message.findMany({
      where: { fileId },
      orderBy: { createdAt: "asc" },
    });

    const formattedPrevMessages = previousMessages.map((msg) => ({
      role: msg.isUserMessage ? "user" : "assistant",
      content: msg.text,
    }));

    const prompt = `You are an AI assistant for answering user queries based on previous conversations and relevant document context. If the user's question is not related to the document or the previous conversation, respond with: "I can’t answer this question as it is outside the context of the document."

      **Previous conversation:**
      ${formattedPrevMessages.map((message) => {
        if (message.role === "user") return `user: ${message.content}\n`;
        return `assistant: ${message.content}\n`;
      })}

      **Context:**
      ${results.map((r) => r.pageContent).join("\n\n")}

      **User Input:** ${message}`;

    const response = await model.invoke(prompt);
    const botReply =
      // @ts-expect-error: `response.content` might be undefined or not properly typed
      response?.content?.trim() ||
      "I can’t answer this question as it is outside the context of the document.";

    await prisma.message.create({
      data: {
        text: botReply,
        isUserMessage: false,
        fileId,
      },
    });

    return NextResponse.json({
      text: botReply,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    const user = await loggedInUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    if (!fileId) {
      return NextResponse.json({
        error: "fileId query parameter is required",
        status: 400,
      });
    }

    const messages = await prisma.message.findMany({
      where: { fileId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ messages, status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
}

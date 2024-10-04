import { MESSAGES_PER_PAGE } from "@/constants/constants";
import prisma from "@/lib/db.config";
import { model } from "@/lib/google-genai.config";
import { pinecone } from "@/lib/pinecone.config";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, fileId } = body;
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    if (!message || !fileId) {
      return NextResponse.json({
        error: "Message or fileId filed is missing",
        status: 400,
      });
    }

    const file = await prisma.file.findFirst({ where: { id: fileId, userId } });

    if (!file) {
      return NextResponse.json({ error: "File not found", status: 404 });
    }

    await prisma.message.create({
      data: {
        text: message,
        isUserMessage: true,
        fileId,
        userId,
      },
    });

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "text-embedding-004",
    });
    const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!);

    const vectorstore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: file.id,
    });

    const results = await vectorstore.similaritySearch(message, 5);

    const preMessages = await prisma.message.findMany({
      where: { fileId, userId },
      orderBy: { createdAt: "asc" },
    });

    const formattedPrevMessages = preMessages.map((message) => ({
      role: message.isUserMessage ? ("user" as const) : ("assistant" as const),
      content: message.text,
    }));

    const prompt = `Use the following pieces of context to answer the user's question in markdown format.

      **Previous Conversation:**
      ${formattedPrevMessages.map((message) => {
        if (message.role === "user") return `User: ${message.content}\n`;
        return `Assistant: ${message.content}\n`;
      })}

      **Context:**
      ${results.map((r) => r.pageContent).join("\n\n")}

      **User Input:** ${message}`;

    const response = await model.invoke(prompt);

    // const stream = new ReadableStream({
    //   async start(controller) {
    //     const response = await model.stream(prompt);
    //     let aiMessageContent = "";

    //     for await (const chunk of response) {
    //       aiMessageContent += chunk.content;
    //       controller.enqueue(new TextEncoder().encode(chunk.content as string));
    //     }

    //     if (aiMessageContent) {
    //       await prisma.message.create({
    //         data: {
    //           text: aiMessageContent,
    //           isUserMessage: false,
    //           fileId,
    //           userId,
    //         },
    //       });
    //     }
    //     controller.close();
    //   },
    // });

    await prisma.message.create({
      data: {
        text: response.content as string,
        isUserMessage: false,
        fileId,
        userId,
      },
    });

    return NextResponse.json({
      text: response.content,
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
    const page = parseInt(searchParams.get("page") || "1");

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    if (!fileId) {
      return NextResponse.json({
        error: "fileId query parameter is required",
        status: 400,
      });
    }

    const skip = (page - 1) * MESSAGES_PER_PAGE;

    const messages = await prisma.message.findMany({
      where: { fileId, userId },
      skip,
      take: MESSAGES_PER_PAGE,
      orderBy: { createdAt: "desc" },
    });

    if (!messages.length) {
      return NextResponse.json({ messages: [], status: 204 });
    }

    return NextResponse.json({ messages, status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
}

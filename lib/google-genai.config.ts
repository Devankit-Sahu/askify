import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const model = new ChatGoogleGenerativeAI({
  temperature: 0,
  model: "gemini-1.5-flash",
});

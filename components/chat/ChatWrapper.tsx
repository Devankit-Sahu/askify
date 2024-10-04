import { ChevronLeft, XCircle } from "lucide-react";
import { ChatContextProvider } from "./ChatContext";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { PLANS } from "@/constants/constants";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

const ChatWrapper = ({
  fileId,
  status,
  isSubscribed,
}: {
  fileId: string;
  status: string;
  isSubscribed: boolean;
}) => {
  if (status === "FAILED")
    return (
      <div className="h-full">
        <div className="flex-1 flex justify-center items-center flex-col h-[calc(100vh-10.5rem)]">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h3 className="font-semibold text-xl">Too many pages in PDF</h3>
            <p className="text-zinc-500 text-sm">
              Your{" "}
              <span className="font-medium">
                {isSubscribed ? "pro" : "free"}
              </span>{" "}
              plan supports up to{" "}
              {isSubscribed
                ? PLANS.find((p) => p.name === "pro")?.pagesPerPdf
                : PLANS.find((p) => p.name === "free")?.pagesPerPdf}{" "}
              pages per PDF.
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4",
              })}
            >
              <ChevronLeft className="h-3 w-3 mr-1.5" />
              Back
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="h-full">
        <Messages />
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;

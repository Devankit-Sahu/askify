"use client";

import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import Message from "./Message";
import { Loader2, MessageSquare } from "lucide-react";

const Messages = () => {
  const { messages, isMessageFetchedLoading } = useContext(ChatContext);

  return (
    <div className="flex h-[calc(100vh-10.5rem)] flex-1 flex-col-reverse p-3 gap-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {messages.length > 0 ? (
        messages.map((message: Message, index: number) => {
          const isNextMessageSamePerson =
            messages[index + 1]?.isUserMessage ===
            messages[index]?.isUserMessage;

          return (
            <Message
              message={message}
              isNextMessageSamePerson={isNextMessageSamePerson}
              key={index}
            />
          );
        })
      ) : isMessageFetchedLoading ? (
        <div className="w-full h-full flex flex-1 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;

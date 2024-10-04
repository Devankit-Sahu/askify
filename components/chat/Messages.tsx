"use client";

import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./ChatContext";
import Message from "./Message";
import { MessageSquare } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { useIntersection } from "@mantine/hooks";

const Messages = () => {
  const { messages, isMessageFetchedLoading, fetchMoreMessages } =
    useContext(ChatContext);

  const containerRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchMoreMessages();
    }
  }, [entry]);

  return (
    <div
      ref={containerRef}
      className="flex h-[calc(100vh-10.5rem)] border-zinc-200 flex-1 flex-col-reverse p-3 gap-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      {messages.length > 0 ? (
        messages.map((message: Message, index: number) => {
          const isNextMessageSamePerson =
            messages[index + 1]?.isUserMessage ===
            messages[index]?.isUserMessage;

          return (
            <Message
              ref={index === messages.length - 1 ? ref : null}
              message={message}
              isNextMessageSamePerson={isNextMessageSamePerson}
              key={index}
            />
          );
        })
      ) : isMessageFetchedLoading ? (
        <div className="w-full h-full flex flex-col gap-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
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

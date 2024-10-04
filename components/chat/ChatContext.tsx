"use client";

import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ReactNode, createContext, useEffect, useState } from "react";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isMessageSentLoading: boolean;
  isMessageFetchedLoading: boolean;
  messages: Message[];
  fetchMoreMessages: () => void;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isMessageSentLoading: false,
  isMessageFetchedLoading: false,
  messages: [],
  fetchMoreMessages: () => {},
});

interface Props {
  fileId: string;
  children: ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState<string>("");

  const [isMessageFetchedLoading, setIsMessageFetchedLoading] =
    useState<boolean>(false);
  const [isMessageSentLoading, setIsMessageSentLoading] =
    useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = async () => {
    if (!message) return;
    const messageCopy = message;
    setMessage("");
    setIsMessageSentLoading(true);

    const newMessage = {
      id: Date.now().toString(),
      text: messageCopy,
      isUserMessage: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
    const loadingMessage = {
      id: "loading-message",
      text: (
        <span className="flex h-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </span>
      ),
      isUserMessage: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prevMessages) => [loadingMessage, ...prevMessages]);

    const response = await fetch("/api/message", {
      method: "POST",
      body: JSON.stringify({ message: messageCopy, fileId }),
    });

    if (!response.ok) {
      setIsMessageSentLoading(false);
      toast({
        title: "Error",
        description: "Failed to send message",
      });
      return;
    }

    const data = await response.json();

    // const reader = response.body?.getReader();
    // const decoder = new TextDecoder();
    // let done = false;
    // let accResponse = "";

    // while (reader && !done) {
    //   const result = await reader.read();

    //   if (result && result.value) {
    //     const chunk = decoder.decode(result.value);
    //     accResponse += chunk;

    //     setMessages((prevMessages) => {
    //       const updatedMessages = prevMessages.map((msg) => {
    //         if (msg.id === "loading-message") {
    //           return {
    //             ...msg,
    //             text: accResponse,
    //           };
    //         }
    //         return msg;
    //       });
    //       return updatedMessages;
    //     });

    //     done = result.done;
    //   }
    // }

    // const aiMessage = {
    //   id: "ai-message",
    //   text: accResponse,
    //   isUserMessage: false,
    //   createdAt: new Date().toISOString(),
    // };

    setMessages((prevMessages) => [
      {
        id: "ai-message",
        text: data.text,
        isUserMessage: false,
        createdAt: new Date().toISOString(),
      },
      ...prevMessages.filter((msg) => msg.id !== "loading-message"),
    ]);
    setIsMessageSentLoading(false);
  };

  const fetchMessages = async (pageToFetch = 1) => {
    setIsMessageFetchedLoading(true);

    const response = await fetch(
      `/api/message?fileId=${fileId}&page=${pageToFetch}`
    );

    if (!response.ok) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
      });
      return;
    }

    const data = await response.json();
    if (data.messages.length === 0) setHasMoreMessages(false);
    else setMessages((prevMessages) => [...prevMessages, ...data.messages]);
    setIsMessageFetchedLoading(false);
  };

  const fetchMoreMessages = async () => {
    if (!hasMoreMessages || isMessageFetchedLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchMessages(nextPage);
  };

  useEffect(() => {
    if (fileId) {
      fetchMessages();
    }
  }, [fileId]);

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isMessageSentLoading,
        isMessageFetchedLoading,
        messages,
        fetchMoreMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

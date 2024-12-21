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
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isMessageSentLoading: false,
  isMessageFetchedLoading: false,
  messages: [],
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

  const fetchMessages = async () => {
    setIsMessageFetchedLoading(true);

    const response = await fetch(`/api/message?fileId=${fileId}`);

    if (!response.ok) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
      });
      return;
    }

    const data = await response.json();
    setMessages(data.messages);
    setIsMessageFetchedLoading(false);
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

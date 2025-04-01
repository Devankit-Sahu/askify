import { cn } from "@/lib/utils";
// import { format } from "date-fns";
import { Bot, MessageSquare } from "lucide-react";
import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  message: Message;
  isNextMessageSamePerson: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-start", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex h-6 w-6 aspect-square items-center justify-center",
            {
              "order-2 rounded-sm": message.isUserMessage,
              "order-1 rounded-sm": !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            }
          )}
        >
          {message.isUserMessage ? (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <MessageSquare className="h-4 w-4" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>

        <div
          className={cn("flex flex-col space-y-2 text-base mx-2", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("px-4 py-2 rounded-lg", {
              "bg-muted": message.isUserMessage,
              "bg-primary text-primary-foreground": !message.isUserMessage,
              "rounded-tr-none":
                !isNextMessageSamePerson && message.isUserMessage,
              "rounded-tl-none":
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {typeof message.text === "string" ? (
              <ReactMarkdown className="text-base font-sans">
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {/* {message.id !== "loading-message" ? (
              <div
                className={cn("text-xs select-none mt-2 w-full text-right", {
                  "text-muted": message.isUserMessage,
                  "text-primary-foreground": !message.isUserMessage,
                })}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </div>
            ) : null} */}
          </div>
        </div>
      </div>
    );
  }
);

Message.displayName = "Message";

export default Message;

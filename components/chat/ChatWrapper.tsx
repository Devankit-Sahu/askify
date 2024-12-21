import { ChatContextProvider } from "./ChatContext";
import ChatInput from "./ChatInput";
import Messages from "./Messages";

const ChatWrapper = ({ fileId }: { fileId: string }) => {
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

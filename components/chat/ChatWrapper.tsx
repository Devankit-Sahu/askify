import { ChatContextProvider } from "../../context/ChatContext";
import ChatInput from "./ChatInput";
import Messages from "./Messages";

const ChatWrapper = ({ fileId }: { fileId: string }) => {
  return (
    <ChatContextProvider fileId={fileId}>
      <div className="h-full rounded-md shadow">
        <Messages />
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;

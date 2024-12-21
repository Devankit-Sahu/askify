import ChatWrapper from "@/components/chat/ChatWrapper";
import PdfRender from "@/components/dashboard/PdfRender";
import { getFile } from "@/actions/file.action";

type Props = {
  params: {
    fileId: string;
  };
};

const ChatPage = async ({ params }: Props) => {
  const file = await getFile(params.fileId);

  if (!file) {
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <h1>File not found or fetched</h1>
      </div>
    );
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-red-600">
      <div className="mx-auto w-full max-w-8xl flex flex-col lg:flex-row xl:px-2 h-full bg-white">
        <div className="flex-1">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6 h-full">
            <PdfRender fileUrl={file.url} />
          </div>
        </div>
        <div className="shrink-0 flex-1 lg:flex-[0.75] border-t border-gray-300 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={params.fileId} />
        </div>
      </div>
    </section>
  );
};

export default ChatPage;

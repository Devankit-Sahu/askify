import { getFile } from "@/app/actions";
import ChatWrapper from "@/components/chat/ChatWrapper";
import PdfRender from "@/components/dashboard/PdfRender";
import { Card } from "@/components/ui/card";

type Props = {
  params: {
    fileId: string;
  };
};

const ChatPage = async ({ params }: Props) => {
  const file = await getFile(params.fileId);

  if (!file) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1>File not found or fetched</h1>
      </div>
    );
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] my-5">
      <Card className="mx-auto w-full max-w-8xl flex flex-col lg:flex-row xl:px-2 h-full shadow-xl border-none">
        <div className="flex-1">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6 h-full">
            <PdfRender fileUrl={file.url} />
          </div>
        </div>
        <div className="shrink-0 flex-1 lg:flex-[0.75] border-t border-border lg:border-l lg:border-t-0">
          <ChatWrapper fileId={params.fileId} />
        </div>
      </Card>
    </section>
  );
};

export default ChatPage;

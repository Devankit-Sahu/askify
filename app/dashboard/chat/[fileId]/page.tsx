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
    <section className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted flex items-center justify-center relative py-12">
      <div className="container px-4 md:px-10">
        <Card className="mx-auto w-full max-w-8xl flex flex-col lg:flex-row">
          <div className="flex-1 p-4">
            <PdfRender fileUrl={file.url} />
          </div>
          <div className="p-4 shrink-0 flex-1 border-t border-border lg:border-l lg:border-t-0">
            <ChatWrapper fileId={params.fileId} />
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ChatPage;

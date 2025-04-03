import { getFile } from "@/app/actions";
import ChatWrapper from "@/components/chat/ChatWrapper";
import PdfRender from "@/components/dashboard/PdfRender";
import { Card } from "@/components/ui/card";

const ChatPage = async ({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) => {
  const { fileId } = await params;
  const file = await getFile(fileId);

  if (!file) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1>File not found or fetched</h1>
      </div>
    );
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted relative py-12">
      <div className="container px-4 md:px-10 mx-auto">
        <Card className="mx-auto w-full max-w-8xl flex flex-col lg:flex-row">
          <div className="flex-1 p-4">
            <PdfRender fileUrl={file.url} />
          </div>
          <div className="p-4 shrink-0 flex-1 border-t border-border lg:border-l lg:border-t-0">
            <ChatWrapper fileId={fileId} />
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ChatPage;

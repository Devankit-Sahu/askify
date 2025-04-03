import { File, Ghost } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import UploadButton from "@/components/UploadButton";
import DeleteButton from "@/components/DeleteButton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getFiles } from "@/app/actions";

const Dashboard = async () => {
  const files = await getFiles();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted relative py-12">
      <div className="container px-4 md:px-10 mx-auto">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h1 className="font-bold text-base sm:text-xl md:text-2xl lg:text-3xl">
            My Chats
          </h1>
          <UploadButton />
        </div>
        {files?.length !== 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {files
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((file) => (
                <Card
                  key={file.id}
                  className="hover:shadow-lg transition-all duration-300 hover:border-primary relative space-y-2"
                >
                  <Link
                    href={`/dashboard/chat/${file.id}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="p-5 flex w-full items-center justify-between space-x-6">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                        <File />
                      </div>
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-lg font-medium">
                            {file.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Separator />
                  <div className="px-6 grid grid-cols-2 place-items-center py-2 gap-6 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      {format(new Date(file.createdAt), "MMM dd yyyy")}
                    </div>
                    <DeleteButton fileId={file.id} publicId={file.public_id} />
                  </div>
                </Card>
              ))}
          </div>
        ) : (
          <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center gap-4 text-zinc-500">
            <Ghost className="h-8 w-8" />
            <h3 className="font-semibold text-xl">Pretty empty around here</h3>
            <p>Let&apos;s upload your first PDF.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

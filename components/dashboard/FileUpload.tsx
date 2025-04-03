import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Progress } from "../ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Cloud, File, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  fileUploadHandler,
  getFilesByCurrentMonth,
  getUserSubscriptionPlan,
} from "@/app/actions";
import { PLANS } from "@/constants/constants";

interface FileUploadProps {
  setIsOpen: (value: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ setIsOpen }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();
  const router = useRouter();

  const simulateUploadProgress = () => {
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      if (acceptedFiles.length === 0) {
        return;
      }
      setIsUploading(true);
      const file = acceptedFiles[0];

      if (!file) {
        toast({
          title: "File not provided",
          description: "Please provide a file to upload",
        });
        setIsUploading(false);
        return;
      }

      const subscriptionPlan = await getUserSubscriptionPlan();
      const files = await getFilesByCurrentMonth();
      const currentSubscriptionPlan = PLANS.find(
        (plan) => plan.name === subscriptionPlan?.planName
      );

      if (
        subscriptionPlan?.isSubscribed &&
        currentSubscriptionPlan?.docTypeSupported.includes(
          file.name.split(".")[1]
        )
      ) {
        toast({
          variant: "destructive",
          title: "Unsupported file type",
          description:
            "You are on a free plan and can only upload pdf files. Please upgrade your plan.",
        });
        setIsUploading(false);
        setIsOpen(false);
        return;
      }

      if (
        !subscriptionPlan?.isSubscribed &&
        file.size > (currentSubscriptionPlan?.fileSizeLimit ?? 4) * 1024 * 1024
      ) {
        toast({
          variant: "destructive",
          title: "File size exceeded",
          description:
            "You are on a free plan and cannot upload file more than 4mb. Please upgrade your plan.",
        });
        setIsUploading(false);
        setIsOpen(false);
        return;
      }

      if (
        !subscriptionPlan?.isSubscribed &&
        files.length > (currentSubscriptionPlan?.pdfsPerMonth ?? 5)
      ) {
        toast({
          variant: "destructive",
          title: "Files per month exceeded",
          description:
            "You are on a free plan and can upload 5 pdfs per month. Please upgrade your plan.",
        });
        setIsUploading(false);
        setIsOpen(false);
        return;
      }

      if (
        subscriptionPlan?.isSubscribed &&
        file.size > (currentSubscriptionPlan?.fileSizeLimit ?? 16) * 1024 * 1024
      ) {
        toast({
          variant: "destructive",
          title: "File size exceeded",
          description:
            "Your plan has a file size limit of 16mb. Please upload a smaller size file.",
        });
        setIsUploading(false);
        setIsOpen(false);
        return;
      }

      if (
        subscriptionPlan?.isSubscribed &&
        files.length > (currentSubscriptionPlan?.pdfsPerMonth ?? 20)
      ) {
        toast({
          variant: "destructive",
          title: "Files per month exceeded",
          description: "Your plan has a limit of 20 pdfs per month.",
        });
        setIsUploading(false);
        setIsOpen(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const interval = simulateUploadProgress();
      const result = await fileUploadHandler(formData);
      clearInterval(interval);
      setUploadProgress(100);

      if (result && result.id) {
        router.push(`/dashboard/chat/${result.id}`);
      }

      toast({
        title: "Upload successful",
        description: "Your PDF file has been uploaded.",
      });
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      setIsOpen(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while uploading your file.";
      toast({
        title: "Upload failed",
        description: errorMessage,
      });
    }
  };

  return (
    <Dropzone multiple noClick noKeyboard onDrop={onDrop}>
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-primary  rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                    className="h-1 w-full"
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}

              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default FileUpload;

"use client";

import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { deleteFile } from "@/app/actions";

const DeleteButton = ({
  fileId,
  publicId,
}: {
  fileId: string;
  publicId: string;
}) => {
  const deleteFileHandler = async () => {
    try {
      await deleteFile(fileId, publicId);
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while uploading your file.";
      toast({
        title: "Error",
        description: errorMessage,
      });
    }
  };
  return (
    <Button
      onClick={deleteFileHandler}
      size="sm"
      className="w-full cursor-pointer"
      variant="destructive"
    >
      <Trash className="h-4 w-4" />
    </Button>
  );
};

export default DeleteButton;

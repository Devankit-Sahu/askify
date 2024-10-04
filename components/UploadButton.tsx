"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import FileUpload from "./dashboard/FileUpload";

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button className="capitalize flex items-center gap-2">
          <span>
            <Plus size={20} />
          </span>
          <span> upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="hidden" />
        <FileUpload setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;

import React from "react";
import {
  Upload
} from 'lucide-react';
import { UploadDocumentDto } from "@/utilities/models/chat.model";

const UploadDocument = (props:UploadDocumentDto) => {
  return (
    <div
      className={`border-2 border-dashed rounded p-6 transition-all duration-200 ${
       props.dragActive
          ? "border-secondary bg-card/50"
          : "border-border bg-background hover:border-secondary"
      }`}
      onDragLeave={props.handleDrag}
      onDragOver={props.handleDrag}
      onDrop={props.handleDrop}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="text-secondary">
          <Upload className="w-8 h-8" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-secondary">
            📤 UPLOAD DOCUMENTS
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Drag & drop PDF files here or{" "}
            <button
              onClick={() => props.fileInputRef.current?.click()}
              className="text-primary hover:underline"
            >
              Browse Files
            </button>
          </p>
          {/* <p className="text-xs text-muted-foreground mt-2">
            Max size: 10MB per file
          </p> */}
        </div>
        <input
          ref={props.fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          onChange={props.handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadDocument;

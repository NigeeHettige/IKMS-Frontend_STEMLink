import React from "react";
import {
 
  Trash2
  
} from "lucide-react";
import { LoadedDocumentDto } from "@/utilities/models/chat.model";

const LoadedDocument = (props:LoadedDocumentDto) => {
  return (
    <div className="border border-border rounded bg-card/30 p-4 space-y-2">
      <p className="text-xs font-semibold text-secondary">
        📚 LOADED DOCUMENTS [{props.documents.length}]
      </p>
      <div className="space-y-2">
        {props.documents.map((doc) => (
          <div
            key={doc.id}
            className="flex justify-between items-center text-xs bg-background border border-border rounded p-3 hover:border-secondary transition-all"
          >
            <div className="flex-1">
              <p className="text-foreground font-semibold">📄 {doc.name}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {doc.pages} pages | {(doc.size / 1024 / 1024).toFixed(1)} MB |{" "}
                {doc.chunks} chunks
              </p>
            </div>
            <button
              onClick={() => props.removeDocument(doc.id)}
              className="p-2 text-destructive hover:bg-destructive/10 rounded transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadedDocument;

import React from "react";
import { X } from "lucide-react";
import {
  Document,
} from "@/utilities/models/chat.model";

const DocumentsModal = ({
  isOpen,
  documents,
  onClose,
}: {
  isOpen: boolean;
  documents: Document[];
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border-2 border-green-500 rounded-lg p-6 max-w-3xl w-full mx-4 shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Uploaded Documents
              </h2>
              <p className="text-xs text-muted-foreground">
                {documents.reduce((sum, doc) => sum + doc.chunks_indexed, 0)} total chunks indexed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-background rounded transition-all"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3 hover:bg-green-100 transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {doc.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {doc.chunks_indexed} chunks indexed
                  </p>
                </div>
              </div>
              <div className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                ✓ Indexed
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-border mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsModal;
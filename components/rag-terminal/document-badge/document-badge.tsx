import React from "react";
import { Document } from "@/utilities/models/chat.model";

const DocumentBadge = ({
  documents,
  onClick,
}: {
  documents: Document[];
  onClick: () => void;
}) => {
  if (documents.length === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-1/6 right-6 bg-green-600 text-white rounded-full px-4 py-2 shadow-lg hover:bg-green-700 transition-all flex items-center gap-2 z-40 border-2 border-green-400"
    >
      <span>📄</span>
      <span className="font-semibold text-sm">
        {documents.length} document{documents.length !== 1 ? "s" : ""}
      </span>
    </button>
  );
};

export default DocumentBadge;

import React from "react";
import { Upload,Trash2,X } from "lucide-react";


const UploadModal = ({
  isOpen,
  stagedFiles,
  isProcessing,
  onClose,
  onRemoveFile,
  onConfirmUpload,
}: {
  isOpen: boolean;
  stagedFiles: File[];
  isProcessing: boolean;
  onClose: () => void;
  onRemoveFile: (index: number) => void;
  onConfirmUpload: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border-2 border-green-500 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-foreground">
              Upload Documents
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 hover:bg-background rounded transition-all disabled:opacity-50"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {stagedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3 hover:bg-green-100 transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl">📄</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemoveFile(index)}
                disabled={isProcessing}
                className="p-2 hover:bg-red-100 rounded transition-all text-red-600 hover:text-red-700 disabled:opacity-50"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {stagedFiles.length} file{stagedFiles.length !== 1 ? "s" : ""}{" "}
            selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 bg-card border border-border rounded text-sm hover:bg-background transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmUpload}
              disabled={isProcessing || stagedFiles.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {isProcessing
                ? "Uploading..."
                : `Upload ${stagedFiles.length} file${stagedFiles.length !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;

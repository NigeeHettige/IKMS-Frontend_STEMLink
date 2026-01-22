"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw, Zap, Paperclip } from "lucide-react";

import {
  Document,
  Message,
  UploadResponse,
  QAPayloadDTO,
} from "@/utilities/models/chat.model";
import QueryPlaning from "./query-plan/query-plan";
import SourceContent from "./source-content/source-content";
import { useDispatch, useSelector } from "react-redux";
import { answeringActions } from "@/redux/actions";
import { fileService } from "@/service";
import {
  COMMON_ACTION_TYPES,
  FILE_ACTION_TYPES,
} from "@/utilities/constants/action.constants";

import { parseContextToSources } from "@/utilities/helper/context";
import UploadModal from "./upload-document/upload-document";
import ConfirmModal from "./confirmation-modal/confirmation-modal";
import DocumentsModal from "./loaded-document/loaded-document";
import DocumentBadge from "./document-badge/document-badge";

// Loading dots component
const LoadingDots = () => (
  <div className="flex items-center gap-1">
    <span className="animate-bounce animation-delay-0">●</span>
    <span className="animate-bounce animation-delay-200">●</span>
    <span className="animate-bounce animation-delay-400">●</span>
  </div>
);

export default function RAGTerminal() {
  const [sessionId, setSessionId] = useState<string>("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<string | null>(null);
  const [showQueryPlanning, setShowQueryPlanning] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const documentsRef = useRef<HTMLDivElement>(null);
  const [lastProcessedResponseId, setLastProcessedResponseId] = useState<
    string | null
  >(null);

  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const answer_response = useSelector((state: any) => state.answer.postAnswer);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (answer_response?.data && answer_response.data.answer) {
      // Create unique ID for this response to prevent duplicates
      const responseId = `${answer_response.data.session_id}_${answer_response.data.answer}_${answer_response.data.plan}`;

      // Only process if this is a new response
      if (responseId !== lastProcessedResponseId) {
        setLastProcessedResponseId(responseId);

        // Create AI message from response
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          type: "ai",
          content: answer_response.data.answer,
          timestamp: new Date().toLocaleTimeString(),
          queryPlan: answer_response.data.plan
            ? {
                plan: answer_response.data.plan
                  .split("\n")
                  .map((step: string) => step.trim())
                  .filter((step: string) => step.length > 0),
                subQuestions: answer_response.data.sub_questions || [],
              }
            : undefined,
          sources: answer_response.data.context
            ? parseContextToSources(answer_response.data.context)
            : [],
        };

        setMessages((prev) => {
          // Remove any loading message
          const withoutLoading = prev.filter((msg) => !msg.isLoading);
          return [...withoutLoading, aiMessage];
        });
        setIsProcessing(false);
      }
    }
  }, [answer_response]);

  {
    /*----------------------------------------------------------- SESSION CREATION ------------------------------------------------------------*/
  }
  const generateSessionId = (): string => {
    return `session_${Date.now()}_${crypto.randomUUID()}`;
  };

  // Initialize new session
  const initializeSession = () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    console.log("New session initialized:", newSessionId);
  };

  useEffect(() => {
    initializeSession();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearSession = () => {
    setDocuments([]);
    setMessages([]);
    setInput("");
    setExpandedPlan(null);
    setExpandedSources(null);
    setLastProcessedResponseId(null);
    initializeSession();
  };

  {
    /*----------------------------------------------------------- FILE UPLOAD ------------------------------------------------------------*/
  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    if (files) {
      setStagedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeStagedFile = (index: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmUpload = async () => {
    setIsProcessing(true);

    for (const file of stagedFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response: UploadResponse = await fileService.uploadfile(formData);
        console.log("RESP", response);
        dispatch({
          type: FILE_ACTION_TYPES.POST_FILE + COMMON_ACTION_TYPES.SUCCESS,
          payload: response.data,
        });

        const newDoc = {
          id: crypto.randomUUID(),
          ...response.data,
        };

        setDocuments((prev) => [...prev, newDoc]);
      } catch (error) {
        dispatch({
          type: FILE_ACTION_TYPES.POST_FILE + COMMON_ACTION_TYPES.ERROR,
          payload: error,
        });
      }
    }

    // Clear staged files and close modal
    setStagedFiles([]);
    setIsProcessing(false);

    // Scroll to documents section after upload
    setTimeout(() => {
      documentsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  };

  {
    /*----------------------------------------------------------- QUERY AND ANSWER ------------------------------------------------------------*/
  }

  const handleSendMessage = async () => {
    if (!input.trim()) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Add loading message
    const loadingMessage: Message = {
      id: crypto.randomUUID(),
      type: "ai",
      content: "",
      timestamp: new Date().toLocaleTimeString(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    const payload: QAPayloadDTO = {
      question: input,
      session_id: sessionId,
    };

    setInput("");
    setIsProcessing(true);

    dispatch(answeringActions.postAnswer(payload));
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground font-mono">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={clearSession}
        title="Clear Session"
        message="Are you sure you want to clear all documents and messages? This action cannot be undone."
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={stagedFiles.length > 0}
        stagedFiles={stagedFiles}
        isProcessing={isProcessing}
        onClose={() => setStagedFiles([])}
        onRemoveFile={removeStagedFile}
        onConfirmUpload={handleConfirmUpload}
      />

      <DocumentsModal
        isOpen={showDocumentsModal}
        documents={documents}
        onClose={() => setShowDocumentsModal(false)}
      />

      {/* Document Badge - Floating button */}
      <DocumentBadge
        documents={documents}
        onClick={() => setShowDocumentsModal(true)}
      />

      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold glow-text flex items-center gap-2">
          <Zap className="w-5 h-5" />
          RAG TERMINAL v1.0
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="p-2 hover:bg-card border border-border rounded hover:border-red-500 hover:text-red-500 transition-all duration-200"
            title="Clear session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
          {/* Messages */}
          {messages.length > 0 && (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`float-in ${
                    message.type === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {/* User Message */}
                  {message.type === "user" && (
                    <div className="flex justify-end gap-2">
                      <div className="max-w-2xl">
                        <p className="text-xs text-muted-foreground mb-1">
                          [{message.timestamp}]
                        </p>
                        <div className="bg-card border border-primary rounded p-3">
                          <p className="text-primary text-sm">
                            <span className="font-bold">&gt; </span>
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Message */}
                  {message.type === "ai" && (
                    <div className="flex justify-start gap-2 max-w-3xl">
                      <div className="w-full">
                        <p className="text-xs text-muted-foreground mb-1">
                          [{message.timestamp}]
                        </p>

                        {/* Loading State */}
                        {message.isLoading ? (
                          <div className="bg-card border border-secondary rounded p-3 mb-3">
                            <p className="text-secondary font-bold text-sm mb-2">
                              AI:
                            </p>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>Thinking</span>
                              <LoadingDots />
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Query Plan */}
                            {message.queryPlan && showQueryPlanning && (
                              <QueryPlaning
                                message={message}
                                setExpandedPlan={setExpandedPlan}
                                expandedPlan={expandedPlan}
                              />
                            )}

                            {/* AI Response */}
                            <div className="bg-card border border-secondary rounded p-3 mb-3">
                              <p className="text-secondary font-bold text-sm mb-2">
                                AI:
                              </p>
                              <p className="text-sm text-foreground leading-relaxed">
                                {message.content}
                              </p>
                            </div>

                            {/* Sources */}
                            {message.sources && message.sources.length > 0 && (
                              <SourceContent
                                setExpandedSources={setExpandedSources}
                                expandedSources={expandedSources}
                                message={message}
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background px-6 py-4">
        <div className="max-w-6xl mx-auto flex gap-2">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
              placeholder="Enter your question..."
              disabled={isProcessing}
              className="w-full bg-card border border-border rounded pl-10 pr-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-secondary transition-all disabled:opacity-50"
            />

            {/* File upload icon inside input */}
            <label className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
              <Paperclip className="w-4 h-4" />
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".pdf"
                className="hidden"
                disabled={isProcessing}
                multiple
              />
            </label>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={isProcessing || !input.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded font-semibold text-sm hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-border bg-background px-6 py-3 space-y-3">
        <div className="max-w-6xl mx-auto">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer hover:text-secondary transition-all">
                <input
                  type="checkbox"
                  checked={showQueryPlanning}
                  onChange={(e) => setShowQueryPlanning(e.target.checked)}
                  className="w-3 h-3"
                />
                <span className="text-muted-foreground">Query Planning</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        .animation-delay-0 {
          animation-delay: 0s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

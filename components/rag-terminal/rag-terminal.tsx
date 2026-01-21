"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import { Send, Settings, RotateCcw, Zap ,Paperclip } from "lucide-react";
import UploadDocument from "./upload-document/upload-document";
import {
  Document,
  QueryPlan,
  Source,
  Message,
} from "@/utilities/models/chat.model";
import LoadedDocument from "./loaded-document/loaded-document";
import QueryPlaning from "./query-plan/query-plan";
import SourceContent from "./source-content/source-content";
import PipelineStatus from "./pipeline-status/pipeline-status";
import { useDispatch, useSelector } from "react-redux";
import { fileActions } from "@/redux/actions";
import { FileDto } from "@/utilities/models/file.model";
import { fileService } from "@/service";
import {
  COMMON_ACTION_TYPES,
  FILE_ACTION_TYPES,
} from "@/utilities/constants/action.constants";

const MOCK_AI_RESPONSES: Record<string, string> = {
  default:
    "Based on the uploaded documents, I can provide you with comprehensive insights. The analysis shows multiple key points across the indexed materials, with strong confidence in the retrieved information.",
  vector:
    "Vector databases are specialized data storage systems designed to efficiently store and retrieve vector embeddings. They are fundamental to modern AI applications, enabling semantic search and similarity matching.",
  analysis:
    "The document analysis reveals several important patterns and findings. The data suggests clear correlations between key metrics, with supporting evidence found across multiple sections.",
  benefits:
    "The primary benefits include improved efficiency, enhanced accuracy, and scalability. These advantages are particularly evident in large-scale applications where traditional methods might fall short.",
};

export default function RAGTerminal() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<string | null>(null);
  const [showQueryPlanning, setShowQueryPlanning] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      processFile(files[i]);
    }
  };

  const processFile = async (file: File) => {
    try {
      if (file.type !== "application/pdf") {
        alert("❌ Only PDF files are supported");
        return;
      }

      setIsProcessing(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fileService.uploadfile(formData);

      dispatch({
        type: FILE_ACTION_TYPES.POST_FILE + COMMON_ACTION_TYPES.SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: FILE_ACTION_TYPES.POST_FILE + COMMON_ACTION_TYPES.ERROR,
        payload: error,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        processFile(files[i]);
      }
    }
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const generateQueryPlan = (question: string): QueryPlan => {
    const questionLower = question.toLowerCase();
    let steps = [
      "Analyze question intent",
      "Search for relevant content",
      "Retrieve and rank results",
    ];
    let subQuestions = [`"${question}"`, `Key concepts from "${question}"`];

    if (questionLower.includes("what") || questionLower.includes("define")) {
      steps = [
        "Extract key terms",
        "Search definitions and explanations",
        "Compile comprehensive answer",
      ];
      subQuestions.push("Detailed explanation and context");
    }

    if (questionLower.includes("how") || questionLower.includes("process")) {
      steps = [
        "Identify process steps",
        "Search for methodology",
        "Verify sequence and logic",
      ];
      subQuestions.push("Step-by-step procedures");
    }

    if (
      questionLower.includes("compare") ||
      questionLower.includes("difference")
    ) {
      steps = [
        "Identify comparison criteria",
        "Search for each item",
        "Compare results",
      ];
      subQuestions.push("Comparative analysis");
    }

    return {
      originalQuestion: question,
      searchSteps: steps,
      subQuestions,
    };
  };

  const generateSources = (): Source[] => {
    if (documents.length === 0) return [];

    return documents.slice(0, 2).map((doc) => ({
      name: doc.name,
      pages: Array.from(
        { length: 2 },
        () => Math.floor(Math.random() * doc.pages) + 1,
      ),
      confidence: Math.random() * 0.2 + 0.75,
      chunks: Math.floor(Math.random() * 5) + 2,
    }));
  };

  const generateResponse = (question: string): string => {
    const questionLower = question.toLowerCase();

    if (questionLower.includes("vector")) return MOCK_AI_RESPONSES.vector;
    if (questionLower.includes("analysis")) return MOCK_AI_RESPONSES.analysis;
    if (questionLower.includes("benefit")) return MOCK_AI_RESPONSES.benefits;

    return MOCK_AI_RESPONSES.default;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || documents.length === 0) {
      if (documents.length === 0) {
        alert("⚠️ Please upload documents first");
      }
      return;
    }

    const userMessage: Message = {
      id: Math.random().toString(),
      type: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    // Simulate query planning
    const queryPlan = generateQueryPlan(input);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const sources = generateSources();
    const response = generateResponse(input);

    const aiMessage: Message = {
      id: Math.random().toString(),
      type: "ai",
      content: response,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      queryPlan: showQueryPlanning ? queryPlan : undefined,
      sources,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsProcessing(false);
  };

  const clearSession = () => {
    if (confirm("Clear all documents and messages?")) {
      setDocuments([]);
      setMessages([]);
      setInput("");
      setExpandedPlan(null);
      setExpandedSources(null);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground font-mono">
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold glow-text flex items-center gap-2">
          <Zap className="w-5 h-5" />
          RAG TERMINAL v1.0
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              /* Settings modal would open */
            }}
            className="p-2 hover:bg-card border border-border rounded hover:border-secondary transition-all duration-200"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={clearSession}
            className="p-2 hover:bg-card border border-border rounded hover:border-secondary transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
         

    

          {/* Messages */}
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

                      {/* Query Plan */}
                      {message.queryPlan && (
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
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
     

      <div className="border-t border-border bg-background px-6 py-4">
        <div className="max-w-6xl mx-auto flex gap-2">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) =>
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
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                }}
                accept=".pdf"
                className="hidden"
                disabled={isProcessing}
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
          {/* Pipeline Status */}
          <PipelineStatus isProcessing={isProcessing} />

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
    </div>
  );
}

export interface UploadDocumentDto {
  dragActive: boolean;
  handleDrag: (e: React.DragEvent<Element>) => void;
  handleDrop: (e: React.DragEvent<Element>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface Document {
  id: string;
  name: string;
  size: number;
  pages: number;
  chunks: number;
}


export interface LoadedDocumentDto{
    documents: Document[]
    removeDocument: (id: string) => void
}

export interface QueryPlan {
  originalQuestion: string;
  searchSteps: string[];
  subQuestions: string[];
}

export interface Source {
  name: string;
  pages: number[];
  confidence: number;
  chunks: number;
}


export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
  queryPlan?: QueryPlan;
  sources?: Source[];
}

export interface QuestionPlanDto{
    message: Message
    setExpandedPlan: (value: React.SetStateAction<string | null>) => void
    expandedPlan: string | null
}

export interface SourceDto{
    setExpandedSources: (value: React.SetStateAction<string | null>) => void
    expandedSources: string | null
    message: Message

}

export interface PipelineDto{
    isProcessing: boolean
}
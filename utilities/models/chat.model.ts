export interface UploadDocumentDto {
  documents: Document[];
  setShowAllDocs: (value: React.SetStateAction<boolean>) => void;
  showAllDocs: boolean;
}

export interface FileData {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

export interface Document {
  id: string;
  filename: string;
  chunks_indexed: number;
  message: string;
}

export interface UploadResponse {
  data: {
    filename: string;
    chunks_indexed: number;
    message: string;
  };
  status: number;
  statusText: string;
}

export interface LoadedDocumentDto {
  stagedFiles: File[];
  removeStagedFile: (index: number) => void;
  handleConfirmUpload: () => Promise<void>;
  isProcessing: boolean;
}

export interface QueryPlan {
 plan:string
  subQuestions: string[];
}

export interface Source {
  id: string;
  chunkNumber: number;
  page: string;
  content: string;
  relevance?: number;
}

export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
  queryPlan?: QueryPlan;
  sources?: Source[];
  isLoading?:boolean
}

export interface QuestionPlanDto {
  message: Message;
  setExpandedPlan: (value: React.SetStateAction<string | null>) => void;
  expandedPlan: string | null;
}

export interface SourceDto {
  setExpandedSources: (value: React.SetStateAction<string | null>) => void;
  expandedSources: string | null;
  message: Message;
}

export interface PipelineDto {
  isProcessing: boolean;
}

export interface QAPayloadDTO {
  question: string;
  session_id?: string;
}

export interface QAResponseDTO {
  answer: string;
  context: string;
  plan?: string ;
  sub_questions?: string[];
  session_id: string;
}

export interface AnswerState {
  postAnswer: {
    isLoading: boolean;
    data: QAResponseDTO;
  };
}

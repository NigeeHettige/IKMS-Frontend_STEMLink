import { Source } from "../models/chat.model";

export const parseContextToSources = (context: string): Source[] => {
  // Split by "Chunk X (page=...)" pattern
  const chunkPattern = /Chunk (\d+) \(page=([^)]+)\):\n([\s\S]*?)(?=Chunk \d+|$)/g;
  const sources: Source[] = [];
  let match;

  while ((match = chunkPattern.exec(context)) !== null) {
    const [, chunkNumber, page, content] = match;
    
    sources.push({
      id: `chunk-${chunkNumber}`,
      chunkNumber: parseInt(chunkNumber),
      page: page,
      content: content.trim(),
       // Optional: calculate based on your needs
    });
  }

  return sources;
};
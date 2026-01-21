import React from "react";
import {
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { SourceDto } from "@/utilities/models/chat.model";

const SourceContent = (props: SourceDto) => {
  return (
    <div
      className="border border-accent rounded p-3 bg-card/20 cursor-pointer hover:bg-card/40 transition-all"
      onClick={() =>
        props.setExpandedSources(
          props.expandedSources === props.message.id ? null : props.message.id,
        )
      }
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-accent">
        {props.expandedSources === props.message.id ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
        📖 SOURCES ({props.message.sources?.length || 0} chunks)
      </div>

      {props.expandedSources === props.message.id && (
        <div className="mt-3 space-y-3 text-xs text-foreground">
          {props.message.sources?.map((source) => (
            <div 
              key={source.id} 
              className="ml-2 p-2 bg-card/30 rounded border border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-accent">
                  Chunk {source.chunkNumber}
                </p>
                <span className="text-muted-foreground">
                  Page: {source.page}
                </span>
              </div>
              
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {source.content}
              </p>
           
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SourceContent;
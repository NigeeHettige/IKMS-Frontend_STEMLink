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
        📖 SOURCES
      </div>

      {props.expandedSources === props.message.id && (
        <div className="mt-3 space-y-2 text-xs text-foreground">
          {props.message.sources?.map((source, idx) => (
            <div key={idx} className="ml-2">
              <p className="font-semibold">• {source.name}</p>
              <p className="text-muted-foreground ml-2">
                pages {source.pages.join(", ")}
              </p>
            </div>
          ))}
          <div className="pt-2 border-t border-border flex justify-between text-muted-foreground">
            <span>
              Confidence:{" "}
              {(props.message.sources?.[0]?.confidence || 0).toFixed(2)}
            </span>
            <span>Chunks: {props.message.sources?.[0]?.chunks || 0}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceContent;

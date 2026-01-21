import { PipelineDto } from '@/utilities/models/chat.model'
import React from 'react'

const PipelineStatus = (props:PipelineDto) => {
  return (
    <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-2">
              <span
                className={props.isProcessing ? "text-secondary" : "text-primary"}
              >
                {props.isProcessing ? "⟳" : "✓"}
              </span>
              <span className="text-muted-foreground">[Planning]</span>
              <span>→</span>
              <span
                className={props.isProcessing ? "text-secondary" : "text-primary"}
              >
                {props.isProcessing ? "⟳" : "✓"}
              </span>
              <span className="text-muted-foreground">[Retrieval]</span>
              <span>→</span>
              <span
                className={
                  props.isProcessing ? "text-muted-foreground" : "text-primary"
                }
              >
                ○
              </span>
              <span className="text-muted-foreground">[Summary]</span>
              <span>→</span>
              <span className="text-muted-foreground">○</span>
              <span className="text-muted-foreground">[Verification]</span>
            </div>
          </div>
  )
}

export default PipelineStatus

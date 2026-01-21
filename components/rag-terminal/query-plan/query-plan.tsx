import React from "react";
import {
  
  ChevronDown,
  ChevronRight,
  CheckCircle,
 
} from "lucide-react";
import { QuestionPlanDto } from "@/utilities/models/chat.model";

const QueryPlaning = (props:QuestionPlanDto) => {
  return (
    <div
      className="border border-secondary rounded p-3 mb-3 bg-card/20 cursor-pointer hover:bg-card/40 transition-all"
      onClick={() =>
        props.setExpandedPlan(props.expandedPlan === props.message.id ? null : props.message.id)
      }
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
        {props.expandedPlan === props.message.id ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
        📋 QUERY PLAN
      </div>

      {props.expandedPlan === props.message.id && (
        <div className="mt-3 space-y-2 text-xs text-foreground">
          <div>
            <p className="font-semibold text-secondary mb-1">
              Original Question:
            </p>
            <p className="ml-2 italic text-muted-foreground">
              "{props.message.queryPlan?.originalQuestion}"
            </p>
          </div>

          <div>
            <p className="font-semibold text-secondary mb-1">
              Search Strategy:
            </p>
            <div className="ml-2 space-y-1">
              {props.message.queryPlan?.searchSteps.map((step, idx) => (
                <p key={idx} className="text-muted-foreground">
                  ├─ {idx + 1}. {step}
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-secondary mb-1">
              Sub-queries Generated:
            </p>
            <div className="ml-2 space-y-1">
              {props.message.queryPlan?.subQuestions.map((sq, idx) => (
                <p key={idx} className="text-muted-foreground">
                  • {sq}
                </p>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border flex items-center gap-1 text-primary">
            <CheckCircle className="w-3 h-3" />
            <span>Planning complete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryPlaning;

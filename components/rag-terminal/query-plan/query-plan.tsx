import React from "react";
import { ChevronDown, ChevronRight, CheckCircle } from "lucide-react";
import { QuestionPlanDto } from "@/utilities/models/chat.model";

const QueryPlaning = (props: QuestionPlanDto) => {
  return (
    <div
      className="border border-secondary rounded p-3 mb-3 bg-card/20 cursor-pointer hover:bg-card/40 transition-all"
      onClick={() =>
        props.setExpandedPlan(
          props.expandedPlan === props.message.id ? null : props.message.id,
        )
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
        <div className="mt-3 space-y-3 text-xs text-foreground">
          {/* Search Strategy */}
          {/* Search Strategy */}
          {props.message.queryPlan?.plan &&
            Array.isArray(props.message.queryPlan.plan) && (
              <div className="p-2 bg-card/30 rounded border border-border">
                <p className="font-semibold text-secondary mb-2">
                  🎯 Search Strategy:
                </p>
                <div className="ml-2 space-y-1">
                  {props.message.queryPlan.plan.map((step, idx) => (
                    <p key={idx} className="text-muted-foreground">
                      {step}
                    </p>
                  ))}
                </div>
              </div>
            )}

          {/* Sub-questions Generated */}
          {props.message.queryPlan?.subQuestions &&
            props.message.queryPlan.subQuestions.length > 0 && (
              <div className="p-2 bg-card/30 rounded border border-border">
                <p className="font-semibold text-secondary mb-2">
                  🔍 Sub-queries Generated:
                </p>
                <div className="ml-2 space-y-1">
                  {props.message.queryPlan.subQuestions.map((sq, idx) => (
                    <p
                      key={idx}
                      className="text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-secondary">•</span>
                      <span>{sq}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

          {/* Status */}
          <div className="pt-2 border-t border-border flex items-center gap-2 text-primary">
            <CheckCircle className="w-3 h-3" />
            <span className="font-medium">Planning complete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryPlaning;

"use client";

import React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import type { TradeValidationResult } from "@/lib/tradeRules";
import { cn } from "@/lib/utils";

interface TradeLegalityBadgeProps {
  result: TradeValidationResult | null;
}

export function TradeLegalityBadge({ result }: TradeLegalityBadgeProps) {
  if (!result) return null;

  return (
    <div className="space-y-2">
      {/* Main verdict */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-lg border font-semibold text-sm",
          result.isLegal
            ? "bg-green-500/10 border-green-500/40 text-green-400"
            : "bg-red-500/10 border-red-500/40 text-red-400"
        )}
      >
        {result.isLegal ? (
          <CheckCircle2 className="h-4 w-4 shrink-0" />
        ) : (
          <XCircle className="h-4 w-4 shrink-0" />
        )}
        {result.isLegal ? "Trade is legal" : "Trade is not legal"}
      </div>

      {/* Violations */}
      {result.violations.map((v, i) => (
        <div
          key={i}
          className="flex items-start gap-2 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/20 text-red-300 text-xs"
        >
          <XCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{v.teamId !== "global" ? <strong>{v.teamId}: </strong> : null}{v.message}</span>
        </div>
      ))}

      {/* Warnings */}
      {result.warnings.map((w, i) => (
        <div
          key={i}
          className="flex items-start gap-2 px-3 py-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs"
        >
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span><strong>{w.teamId}: </strong>{w.message}</span>
        </div>
      ))}

      {result.isLegal && result.warnings.length === 0 && (
        <div className="flex items-start gap-2 px-3 py-1.5 text-slate-500 text-xs">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Validated using 125% + $250K rule. All teams assumed over the cap.</span>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { Check } from "lucide-react";
import type { Player, Team } from "@/lib/types";
import { formatSalaryShort } from "@/lib/salaryCap";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  player: Player;
  team: Team;
  isSelected: boolean;
  onToggle: () => void;
}

const POSITION_COLORS: Record<string, string> = {
  PG: "bg-blue-500/20 text-blue-300",
  SG: "bg-purple-500/20 text-purple-300",
  SF: "bg-green-500/20 text-green-300",
  PF: "bg-orange-500/20 text-orange-300",
  C: "bg-red-500/20 text-red-300",
};

const CONTRACT_LABELS: Record<string, string> = {
  standard: "",
  rookie: "R",
  "two-way": "2W",
  "team-option": "TO",
  "player-option": "PO",
};

function contractYearsRemaining(player: Player): number {
  let years = 1;
  if (player.salary2026 !== null) years++;
  if (player.salary2027 !== null) years++;
  return years;
}

export const PlayerCard = React.memo(function PlayerCard({
  player,
  team,
  isSelected,
  onToggle,
}: PlayerCardProps) {
  const years = contractYearsRemaining(player);
  const contractLabel = CONTRACT_LABELS[player.contractType];

  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative w-full text-left rounded-lg border px-3 py-2.5 transition-all duration-150 group",
        "hover:border-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
        isSelected
          ? "border-opacity-100 bg-opacity-20"
          : "border-slate-700 bg-slate-800/60 hover:bg-slate-700/60"
      )}
      style={
        isSelected
          ? {
              borderColor: team.primaryColor,
              backgroundColor: `${team.primaryColor}22`,
            }
          : undefined
      }
      aria-pressed={isSelected}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <span
          className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: team.primaryColor }}
        >
          <Check className="h-3 w-3 text-white" />
        </span>
      )}

      {/* Jersey number accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: team.primaryColor }}
      />

      <div className="pl-1">
        {/* Name row */}
        <div className="flex items-baseline gap-2 pr-6">
          <span className="text-sm font-semibold text-slate-100 leading-tight truncate">
            {player.name}
          </span>
          <span className="text-xs text-slate-500 shrink-0">#{player.jerseyNumber}</span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <span
            className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded",
              POSITION_COLORS[player.position]
            )}
          >
            {player.position}
          </span>
          <span className="text-[11px] text-slate-400">Age {player.age}</span>
          <span className="text-[11px] font-medium text-slate-200">
            {formatSalaryShort(player.salary2025)}
          </span>
          <span className="text-[11px] text-slate-500">
            {years}yr{contractLabel ? ` · ${contractLabel}` : ""}
          </span>
        </div>
      </div>
    </button>
  );
});

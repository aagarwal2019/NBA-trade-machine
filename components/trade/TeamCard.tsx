"use client";

import React from "react";
import { X } from "lucide-react";
import type { Player, Team } from "@/lib/types";
import { useTradeStore } from "@/store/tradeStore";
import { RosterList } from "./RosterList";

interface TeamCardProps {
  team: Team;
  players: Player[];
}

export function TeamCard({ team, players }: TeamCardProps) {
  const { removeTeam, participants } = useTradeStore();
  const participant = participants.find((p) => p.teamId === team.id);
  const selectedCount = participant?.selectedPlayerIds.length ?? 0;

  const rosterCount = players.filter((p) => p.teamId === team.id).length;

  return (
    <div className="flex flex-col bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ backgroundColor: `${team.primaryColor}33`, borderBottom: `2px solid ${team.primaryColor}` }}
      >
        <div className="flex items-center gap-3">
          {/* Color swatch */}
          <div
            className="h-8 w-8 rounded-full border-2 border-white/20 shrink-0 flex items-center justify-center"
            style={{ backgroundColor: team.primaryColor }}
          >
            <span className="text-white text-[10px] font-black leading-none">{team.abbreviation}</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 leading-none">{team.city}</p>
            <p className="text-sm font-bold text-white leading-tight">{team.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: team.primaryColor }}
            >
              {selectedCount} selected
            </span>
          )}
          <button
            onClick={() => removeTeam(team.id)}
            className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded"
            aria-label={`Remove ${team.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Roster list */}
      <div className="flex-1 p-3 overflow-hidden" style={{ minHeight: 0 }}>
        <p className="text-[11px] text-slate-500 mb-2">
          {rosterCount} player{rosterCount !== 1 ? "s" : ""} — click to add to trade block
        </p>
        <div className="h-full">
          <RosterList team={team} players={players} />
        </div>
      </div>
    </div>
  );
}

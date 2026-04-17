"use client";

import React from "react";
import { ArrowRight, X } from "lucide-react";
import type { Player, Team } from "@/lib/types";
import { useTradeStore } from "@/store/tradeStore";
import { formatSalaryShort } from "@/lib/salaryCap";

interface TradeBlockProps {
  teams: Team[];
  players: Player[];
}

export function TradeBlock({ teams, players }: TradeBlockProps) {
  const { participants, togglePlayer } = useTradeStore();

  const activeParticipants = participants.filter((p) => p.selectedPlayerIds.length > 0);

  if (activeParticipants.length === 0) return null;

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${participants.length}, minmax(0, 1fr))` }}>
      {participants.map((participant) => {
        const team = teams.find((t) => t.id === participant.teamId);
        if (!team) return null;
        const selected = players.filter((p) => participant.selectedPlayerIds.includes(p.id));

        return (
          <div key={team.id} className="bg-slate-800/40 border border-slate-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: team.primaryColor }}
              />
              <span className="text-xs font-bold text-slate-300">
                {team.abbreviation} sending
              </span>
            </div>
            {selected.length === 0 ? (
              <p className="text-[11px] text-slate-600 italic">No players selected</p>
            ) : (
              <ul className="space-y-1">
                {selected.map((player) => (
                  <li key={player.id} className="flex items-center justify-between gap-1 group">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ArrowRight className="h-3 w-3 text-slate-500 shrink-0" />
                      <span className="text-xs text-slate-200 truncate">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-slate-400">
                        {formatSalaryShort(player.salary2025)}
                      </span>
                      <button
                        onClick={() => togglePlayer(team.id, player.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label={`Remove ${player.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

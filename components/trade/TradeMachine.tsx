"use client";

import React from "react";
import { GitCompare, Trophy } from "lucide-react";
import type { Player, Team } from "@/lib/types";
import { useTradeStore } from "@/store/tradeStore";
import { TeamSelector } from "./TeamSelector";
import { TeamCard } from "./TeamCard";
import { TradeBlock } from "./TradeBlock";
import { TradeSummary } from "./TradeSummary";

interface TradeMachineProps {
  teams: Team[];
  players: Player[];
}

export function TradeMachine({ teams, players }: TradeMachineProps) {
  const { participants } = useTradeStore();

  const participantTeams = participants
    .map((p) => teams.find((t) => t.id === p.teamId))
    .filter(Boolean) as Team[];

  const hasSelections = participants.some((p) => p.selectedPlayerIds.length > 0);

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Header */}
      <header className="shrink-0 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Trophy className="h-4.5 w-4.5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-base font-black text-white tracking-tight leading-none">
                NBA Trade Machine
              </h1>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">2025-26 Season</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <GitCompare className="h-3.5 w-3.5" />
              <span>
                {participants.length === 0
                  ? "Add 2–4 teams to begin"
                  : `${participants.length} team${participants.length !== 1 ? "s" : ""} in trade`}
              </span>
            </div>
            <TeamSelector teams={teams} />
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-4 gap-4">
        {/* Team roster columns */}
        <div className="flex-1 overflow-hidden flex flex-col gap-4 min-w-0">
          {participants.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Team card grid */}
              <div
                className="flex-1 grid gap-3 overflow-hidden"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(participantTeams.length, 4)}, minmax(0, 1fr))`,
                  minHeight: 0,
                }}
              >
                {participantTeams.map((team) => (
                  <TeamCard key={team.id} team={team} players={players} />
                ))}
              </div>

              {/* Trade block (selected players from all teams) */}
              {hasSelections && (
                <div className="shrink-0">
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-2">
                    Trade Block
                  </p>
                  <TradeBlock teams={teams} players={players} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Trade summary sidebar */}
        <aside className="w-72 xl:w-80 shrink-0 flex flex-col bg-slate-900/60 border border-slate-700 rounded-xl p-4 overflow-y-auto scrollbar-thin">
          <TradeSummary teams={teams} players={players} />
        </aside>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 pb-20">
      <div className="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center">
        <GitCompare className="h-8 w-8 text-slate-600" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-300">Build Your Trade</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">
          Select 2 to 4 NBA teams using the dropdown above, then click players to add them to the trade block.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-2 text-[11px] text-slate-500">
        <div className="bg-slate-800/60 rounded-lg p-3">
          <p className="font-bold text-slate-400 text-base">30</p>
          <p>Teams</p>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-3">
          <p className="font-bold text-slate-400 text-base">125%</p>
          <p>+ $250K rule</p>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-3">
          <p className="font-bold text-slate-400 text-base">2–4</p>
          <p>Team trades</p>
        </div>
      </div>
    </div>
  );
}

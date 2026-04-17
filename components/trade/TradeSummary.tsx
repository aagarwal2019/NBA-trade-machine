"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import type { Player, Team } from "@/lib/types";
import { useTradeStore } from "@/store/tradeStore";
import { formatSalaryShort, formatSalary } from "@/lib/salaryCap";
import { validateTrade } from "@/lib/tradeRules";
import { TradeLegalityBadge } from "./TradeLegalityBadge";
import type { TradeValidationResult } from "@/lib/tradeRules";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TradeSummaryProps {
  teams: Team[];
  players: Player[];
}

export function TradeSummary({ teams, players }: TradeSummaryProps) {
  const { participants, getSelectedPlayers, clearTrade } = useTradeStore();
  const [validationResult, setValidationResult] = React.useState<TradeValidationResult | null>(null);

  const activeParticipants = participants.filter((p) => p.selectedPlayerIds.length > 0);

  // Compute per-team salary info
  const teamSummaries = participants.map((participant) => {
    const team = teams.find((t) => t.id === participant.teamId)!;
    const outgoingPlayers = getSelectedPlayers(participant.teamId, players);
    const outgoingSalary = outgoingPlayers.reduce((s, p) => s + p.salary2025, 0);

    // Incoming = selected players from all OTHER teams
    const incomingPlayers = participants
      .filter((p) => p.teamId !== participant.teamId)
      .flatMap((p) => players.filter((pl) => p.selectedPlayerIds.includes(pl.id)));
    const incomingSalary = incomingPlayers.reduce((s, p) => s + p.salary2025, 0);

    const delta = incomingSalary - outgoingSalary;
    return { team, outgoingPlayers, incomingPlayers, outgoingSalary, incomingSalary, delta };
  });

  function handleCheckLegality() {
    const tradeTeams = teamSummaries.map((s) => ({
      teamId: s.team.id,
      outgoingSalary: s.outgoingSalary,
      incomingSalary: s.incomingSalary,
    }));
    setValidationResult(validateTrade(tradeTeams));
  }

  const hasAnySelections = activeParticipants.length > 0;

  if (participants.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-sm text-center px-6">
        Add at least 2 teams and select players to build a trade.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Trade Summary</h2>
        {hasAnySelections && (
          <button
            onClick={() => { clearTrade(); setValidationResult(null); }}
            className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {/* Per-team summary */}
      <div className="space-y-3">
        {teamSummaries.map(({ team, outgoingPlayers, incomingPlayers, outgoingSalary, incomingSalary, delta }) => (
          <div
            key={team.id}
            className="rounded-lg border border-slate-700 overflow-hidden"
          >
            {/* Team header */}
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ backgroundColor: `${team.primaryColor}22`, borderBottom: `1px solid ${team.primaryColor}44` }}
            >
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: team.primaryColor }}
              />
              <span className="text-xs font-bold text-slate-200">{team.city} {team.name}</span>
            </div>

            <div className="px-3 py-2 space-y-2">
              {/* Outgoing */}
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Sending</p>
                {outgoingPlayers.length === 0 ? (
                  <p className="text-[11px] text-slate-600 italic">—</p>
                ) : (
                  <ul className="space-y-0.5">
                    {outgoingPlayers.map((p) => (
                      <li key={p.id} className="flex justify-between text-xs">
                        <span className="text-slate-300 truncate">{p.name}</span>
                        <span className="text-slate-400 shrink-0 ml-2">{formatSalaryShort(p.salary2025)}</span>
                      </li>
                    ))}
                    <li className="flex justify-between text-xs font-semibold border-t border-slate-700 pt-1 mt-1">
                      <span className="text-slate-400">Total out</span>
                      <span className="text-slate-200">{formatSalaryShort(outgoingSalary)}</span>
                    </li>
                  </ul>
                )}
              </div>

              {/* Incoming */}
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Receiving</p>
                {incomingPlayers.length === 0 ? (
                  <p className="text-[11px] text-slate-600 italic">—</p>
                ) : (
                  <ul className="space-y-0.5">
                    {incomingPlayers.map((p) => (
                      <li key={p.id} className="flex justify-between text-xs">
                        <span className="text-slate-300 truncate">{p.name}</span>
                        <span className="text-slate-400 shrink-0 ml-2">{formatSalaryShort(p.salary2025)}</span>
                      </li>
                    ))}
                    <li className="flex justify-between text-xs font-semibold border-t border-slate-700 pt-1 mt-1">
                      <span className="text-slate-400">Total in</span>
                      <span className="text-slate-200">{formatSalaryShort(incomingSalary)}</span>
                    </li>
                  </ul>
                )}
              </div>

              {/* Delta */}
              {(outgoingSalary > 0 || incomingSalary > 0) && (
                <div
                  className={`flex items-center justify-between px-2 py-1.5 rounded text-xs font-bold ${
                    delta > 0
                      ? "bg-red-500/10 text-red-400"
                      : delta < 0
                      ? "bg-green-500/10 text-green-400"
                      : "bg-slate-700/40 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {delta > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : delta < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    <span>Net salary change</span>
                  </div>
                  <span>
                    {delta > 0 ? "+" : ""}
                    {formatSalaryShort(delta)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Separator className="bg-slate-700" />

      {/* Check legality button */}
      <Button
        onClick={handleCheckLegality}
        disabled={!hasAnySelections}
        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold disabled:opacity-30"
      >
        Check Trade Legality
      </Button>

      {/* Validation result */}
      {validationResult && <TradeLegalityBadge result={validationResult} />}
    </div>
  );
}

"use client";

import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Search, X } from "lucide-react";
import type { Player, Team } from "@/lib/types";
import { useTradeStore } from "@/store/tradeStore";
import { PlayerCard } from "./PlayerCard";

interface RosterListProps {
  team: Team;
  players: Player[];
}

const POSITION_ORDER: Record<string, number> = { PG: 0, SG: 1, SF: 2, PF: 3, C: 4 };

export function RosterList({ team, players }: RosterListProps) {
  const { participants, togglePlayer } = useTradeStore();
  const participant = participants.find((p) => p.teamId === team.id);
  const selectedIds = participant?.selectedPlayerIds ?? [];

  const [query, setQuery] = React.useState("");
  const [posFilter, setPosFilter] = React.useState<string>("ALL");

  const roster = React.useMemo(() => {
    return players
      .filter((p) => p.teamId === team.id)
      .sort((a, b) => POSITION_ORDER[a.position] - POSITION_ORDER[b.position]);
  }, [players, team.id]);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return roster.filter((p) => {
      if (posFilter !== "ALL" && p.position !== posFilter) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [roster, query, posFilter]);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 68,
    overscan: 5,
  });

  const positions = ["ALL", "PG", "SG", "SF", "PF", "C"];

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search players…"
          className="w-full pl-8 pr-7 py-1.5 text-sm bg-slate-700/60 border border-slate-600 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Position filter pills */}
      <div className="flex gap-1 flex-wrap">
        {positions.map((pos) => (
          <button
            key={pos}
            onClick={() => setPosFilter(pos)}
            className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
              posFilter === pos
                ? "text-slate-900"
                : "bg-slate-700/60 text-slate-400 hover:bg-slate-600/60"
            }`}
            style={posFilter === pos ? { backgroundColor: team.primaryColor } : undefined}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Virtualized roster */}
      {filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          {roster.length === 0 ? "No players loaded yet." : "No matches."}
        </div>
      ) : (
        <div
          ref={parentRef}
          className="flex-1 overflow-y-auto pr-0.5 scrollbar-thin"
          style={{ minHeight: 0 }}
        >
          <div
            style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const player = filtered[virtualRow.index];
              return (
                <div
                  key={player.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    paddingBottom: "4px",
                  }}
                >
                  <PlayerCard
                    player={player}
                    team={team}
                    isSelected={selectedIds.includes(player.id)}
                    onToggle={() => togglePlayer(team.id, player.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Team } from "@/lib/types";
import { useTradeStore } from "@/store/tradeStore";

interface TeamSelectorProps {
  teams: Team[];
}

export function TeamSelector({ teams }: TeamSelectorProps) {
  const { participants, addTeam } = useTradeStore();
  const [pendingTeamId, setPendingTeamId] = React.useState<string>("");

  const usedTeamIds = new Set(participants.map((p) => p.teamId));
  const availableTeams = teams.filter((t) => !usedTeamIds.has(t.id));
  const canAddMore = participants.length < 4;

  function handleAdd() {
    if (!pendingTeamId) return;
    addTeam(pendingTeamId);
    setPendingTeamId("");
  }

  if (!canAddMore) return null;

  return (
    <div className="flex items-center gap-3">
      <Select value={pendingTeamId} onValueChange={(v) => setPendingTeamId(v ?? "")}>
        <SelectTrigger className="w-52 bg-slate-800 border-slate-600 text-slate-100">
          <SelectValue placeholder="Add a team…" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-600 text-slate-100 max-h-72">
          {availableTeams.map((team) => (
            <SelectItem
              key={team.id}
              value={team.id}
              className="focus:bg-slate-700 focus:text-white cursor-pointer"
            >
              {team.city} {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleAdd}
        disabled={!pendingTeamId}
        size="sm"
        className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold disabled:opacity-40"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Team
      </Button>
    </div>
  );
}

"use client";

import { create } from "zustand";
import type { Player, Team } from "@/lib/types";

export interface TradeParticipant {
  teamId: string;
  selectedPlayerIds: string[];
}

interface TradeState {
  // The teams participating in the trade (2-4)
  participants: TradeParticipant[];

  // Actions
  addTeam: (teamId: string) => void;
  removeTeam: (teamId: string) => void;
  togglePlayer: (teamId: string, playerId: string) => void;
  clearTrade: () => void;

  // Derived helpers (called with external data)
  getSelectedPlayers: (teamId: string, allPlayers: Player[]) => Player[];
  getOutgoingSalary: (teamId: string, allPlayers: Player[]) => number;
  getIncomingSalary: (teamId: string, allPlayers: Player[]) => number;
}

export const useTradeStore = create<TradeState>((set, get) => ({
  participants: [],

  addTeam: (teamId) => {
    const { participants } = get();
    if (participants.length >= 4) return;
    if (participants.some((p) => p.teamId === teamId)) return;
    set({ participants: [...participants, { teamId, selectedPlayerIds: [] }] });
  },

  removeTeam: (teamId) => {
    set((state) => ({
      participants: state.participants.filter((p) => p.teamId !== teamId),
    }));
  },

  togglePlayer: (teamId, playerId) => {
    set((state) => ({
      participants: state.participants.map((p) => {
        if (p.teamId !== teamId) return p;
        const has = p.selectedPlayerIds.includes(playerId);
        return {
          ...p,
          selectedPlayerIds: has
            ? p.selectedPlayerIds.filter((id) => id !== playerId)
            : [...p.selectedPlayerIds, playerId],
        };
      }),
    }));
  },

  clearTrade: () => {
    set((state) => ({
      participants: state.participants.map((p) => ({ ...p, selectedPlayerIds: [] })),
    }));
  },

  getSelectedPlayers: (teamId, allPlayers) => {
    const participant = get().participants.find((p) => p.teamId === teamId);
    if (!participant) return [];
    return allPlayers.filter((pl) => participant.selectedPlayerIds.includes(pl.id));
  },

  getOutgoingSalary: (teamId, allPlayers) => {
    const players = get().getSelectedPlayers(teamId, allPlayers);
    return players.reduce((sum, p) => sum + p.salary2025, 0);
  },

  getIncomingSalary: (teamId, allPlayers) => {
    const { participants } = get();
    // Incoming = sum of all selected players from OTHER teams
    return participants
      .filter((p) => p.teamId !== teamId)
      .flatMap((p) => allPlayers.filter((pl) => p.selectedPlayerIds.includes(pl.id) && pl.teamId !== teamId))
      // A player's team is their original team; they come IN to the receiving team
      .reduce((sum, p) => sum + p.salary2025, 0);
  },
}));

import { TradeMachine } from "@/components/trade/TradeMachine";
import teamsData from "@/data/teams.json";
import playersData from "@/data/players.json";
import type { Team, Player } from "@/lib/types";

export default function Home() {
  const teams = teamsData as Team[];
  const players = playersData as Player[];

  return (
    <main className="flex flex-col h-full min-h-screen">
      <TradeMachine teams={teams} players={players} />
    </main>
  );
}

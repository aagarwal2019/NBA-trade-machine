# NBA Trade Machine

A web app for building and validating multi-team NBA trades using real 2025-26 rosters, salaries, and CBA rules.

Live rosters reflect mid-season trades (Luka to LAL, AD to WAS, Butler to GSW, Trae to WAS, Fox to SAS, Garland to LAC, Lillard/Holiday to POR, etc.).

## Features

- All 30 NBA teams with current rosters and salaries
- 2–4 team trades — drag players onto the trade block from any participating team
- Virtualized roster lists (smooth scrolling through full rosters)
- Search and position filter on each team card
- Live trade summary with incoming/outgoing salary per team
- **Legality checker** using the 125% + $250K salary-matching rule (plus apron-aware guardrails)
- Dark theme UI with sticky header and responsive layout

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui** components
- **Zustand** for trade state
- **@tanstack/react-virtual** for virtualized roster lists
- **lucide-react** icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Build for production:

```bash
npm run build
npm run start
```

## Project Structure

```
nba-trade-machine/
├── app/                      # Next.js App Router entry
├── components/
│   └── trade/                # TradeMachine, TeamCard, TradeBlock, TradeSummary, TeamSelector
├── lib/
│   ├── types.ts              # Player, Team, Participant types
│   └── trade-rules.ts        # Salary-matching + apron logic
├── store/
│   └── tradeStore.ts         # Zustand store for participants/selections
└── data/
    ├── teams.json            # 30 teams with cap/apron context
    └── players.json          # 440 players with salary + contract data
```

## Salary Matching Rule

For over-the-cap teams, each team's **incoming** salary must fit within:

```
maxIncoming = outgoing * 1.25 + $250,000
```

Under-the-cap teams can absorb up to the cap without matching. The checker flags apron violations (first apron $182.836M, second apron $189.536M) which restrict aggregating salaries and taking back more than you send.

## Data Sources

- **Rosters & salaries:** ESPN Stats API (`site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/{abbr}/roster`)
- **Ages & specific positions:** BBGM (Basketball GM) 2025-26 save file
- **CBA constants:** 2025-26 NBA CBA (cap $141M, tax $172.346M, aprons $182.836M / $189.536M)


import { TPE_FLAT_ADDITION, TPE_THRESHOLD_OVER_6M } from "./salaryCap";

export interface TradeTeam {
  teamId: string;
  outgoingSalary: number;
  incomingSalary: number;
}

export interface TradeValidationResult {
  isLegal: boolean;
  violations: TradeViolation[];
  warnings: TradeWarning[];
}

export interface TradeViolation {
  teamId: string;
  message: string;
}

export interface TradeWarning {
  teamId: string;
  message: string;
}

/**
 * Validates basic salary matching for teams assumed to be over the cap.
 * All teams in v1 are treated as over the cap.
 *
 * Rule: A team over the cap can receive salary up to:
 *   outgoing * 1.25 + $250,000
 *
 * Extensible: add apron rules, TPE logic, no-trade clauses here.
 */
export function validateTrade(teams: TradeTeam[]): TradeValidationResult {
  const violations: TradeViolation[] = [];
  const warnings: TradeWarning[] = [];

  if (teams.length < 2) {
    violations.push({ teamId: "global", message: "A trade requires at least 2 teams." });
    return { isLegal: false, violations, warnings };
  }

  const activeTeams = teams.filter((t) => t.outgoingSalary > 0 || t.incomingSalary > 0);
  if (activeTeams.length < 2) {
    violations.push({ teamId: "global", message: "Each side of the trade must include at least one player." });
    return { isLegal: false, violations, warnings };
  }

  // Check that each participating team sends at least one player
  for (const team of activeTeams) {
    if (team.outgoingSalary === 0) {
      violations.push({
        teamId: team.teamId,
        message: `This team is receiving players but not sending any. Add outgoing players or remove them from the trade.`,
      });
    }
  }

  // Salary matching check (125% + $250K rule — all teams treated as over the cap)
  for (const team of activeTeams) {
    if (team.outgoingSalary === 0) continue;

    const maxReceivable = team.outgoingSalary * TPE_THRESHOLD_OVER_6M + TPE_FLAT_ADDITION;
    if (team.incomingSalary > maxReceivable) {
      const overBy = team.incomingSalary - maxReceivable;
      violations.push({
        teamId: team.teamId,
        message: `Incoming salary exceeds the 125% + $250K threshold by $${(overBy / 1_000_000).toFixed(2)}M.`,
      });
    }
  }

  // Warn if a team is receiving significantly less (potential fairness flag — not a rule violation)
  for (const team of activeTeams) {
    if (team.incomingSalary < team.outgoingSalary * 0.5 && team.outgoingSalary > 5_000_000) {
      warnings.push({
        teamId: team.teamId,
        message: `This team is receiving significantly less salary than it is sending.`,
      });
    }
  }

  return {
    isLegal: violations.length === 0,
    violations,
    warnings,
  };
}

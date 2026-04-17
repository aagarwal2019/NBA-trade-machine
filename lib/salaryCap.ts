// 2025-26 NBA Salary Cap Constants
export const SALARY_CAP = 141_000_000;
export const LUXURY_TAX_LINE = 172_346_000;
export const FIRST_APRON = 182_836_000;
export const SECOND_APRON = 189_536_000;

// Traded Player Exception multipliers
export const TPE_THRESHOLD_UNDER_6M = 2.0;
export const TPE_THRESHOLD_OVER_6M = 1.25;
export const TPE_FLAT_ADDITION = 250_000;

export function formatSalary(salary: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(salary);
}

export function formatSalaryShort(salary: number): string {
  if (salary >= 1_000_000) {
    return `$${(salary / 1_000_000).toFixed(1)}M`;
  }
  return `$${(salary / 1_000).toFixed(0)}K`;
}

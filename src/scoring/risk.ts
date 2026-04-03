import type { Finding, Severity } from '../auditors/types.js';

const SEVERITY_WEIGHTS: Record<Severity, number> = {
  critical: 15,
  high: 8,
  warning: 3,
  info: 1,
};

export function calculateRiskScore(findings: Finding[]): number {
  const totalDeduction = findings.reduce((sum, finding) => {
    return sum + SEVERITY_WEIGHTS[finding.severity];
  }, 0);

  return Math.max(0, 100 - totalDeduction);
}

export function getGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 50) return 'C';
  if (score >= 25) return 'D';
  return 'F';
}

export function getGradeLabel(score: number): string {
  if (score >= 90) return 'Ship it!';
  if (score >= 75) return 'Almost ready';
  if (score >= 50) return 'Needs attention';
  if (score >= 25) return 'High risk';
  return 'Do not submit';
}

export function getGradeEmoji(score: number): string {
  if (score >= 90) return '🟢';
  if (score >= 75) return '🟡';
  if (score >= 50) return '🟠';
  if (score >= 25) return '🔴';
  return '⛔';
}

export function getSeverityEmoji(severity: Severity): string {
  switch (severity) {
    case 'critical': return '🔴';
    case 'high': return '🟠';
    case 'warning': return '🟡';
    case 'info': return 'ℹ️';
  }
}

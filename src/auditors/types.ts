export type Severity = 'critical' | 'high' | 'warning' | 'info';

export interface Finding {
  /** Unique identifier, e.g. "LOC-001" */
  id: string;
  /** Module name, e.g. "localization" */
  module: string;
  /** Severity level */
  severity: Severity;
  /** Short title */
  title: string;
  /** Detailed description */
  message: string;
  /** Affected locale, if applicable */
  locale?: string;
  /** Actionable fix suggestion */
  remedy?: string;
}

export interface AuditResult {
  /** Module name */
  module: string;
  /** Display label */
  label: string;
  /** Emoji icon */
  icon: string;
  /** List of findings */
  findings: Finding[];
  /** Duration in milliseconds */
  duration: number;
}

export interface AuditReport {
  /** App name */
  appName: string;
  /** Bundle ID */
  bundleId: string;
  /** Version string */
  version: string;
  /** Platform */
  platform: string;
  /** Report generation date */
  date: string;
  /** Risk score (0-100) */
  score: number;
  /** Grade letter */
  grade: string;
  /** Grade label */
  gradeLabel: string;
  /** All audit results */
  results: AuditResult[];
  /** All findings across modules */
  findings: Finding[];
  /** Summary counts */
  summary: {
    critical: number;
    high: number;
    warning: number;
    info: number;
    total: number;
    passed: number;
  };
}

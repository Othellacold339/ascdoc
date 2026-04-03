import { describe, it, expect } from 'vitest';
import { calculateRiskScore, getGrade, getGradeLabel } from '../../src/scoring/risk.js';
import type { Finding } from '../../src/auditors/types.js';

function makeFinding(severity: Finding['severity'], id = 'TEST-001'): Finding {
  return {
    id,
    module: 'test',
    severity,
    title: 'Test finding',
    message: 'Test message',
  };
}

describe('Risk Scoring', () => {
  it('returns 100 for no findings', () => {
    expect(calculateRiskScore([])).toBe(100);
  });

  it('deducts 15 for critical', () => {
    expect(calculateRiskScore([makeFinding('critical')])).toBe(85);
  });

  it('deducts 8 for high', () => {
    expect(calculateRiskScore([makeFinding('high')])).toBe(92);
  });

  it('deducts 3 for warning', () => {
    expect(calculateRiskScore([makeFinding('warning')])).toBe(97);
  });

  it('deducts 1 for info', () => {
    expect(calculateRiskScore([makeFinding('info')])).toBe(99);
  });

  it('clamps to 0 minimum', () => {
    const findings = Array.from({ length: 10 }, (_, i) => makeFinding('critical', `C-${i}`));
    expect(calculateRiskScore(findings)).toBe(0);
  });

  it('accumulates multiple severities', () => {
    const findings = [
      makeFinding('critical', 'C-1'),
      makeFinding('high', 'H-1'),
      makeFinding('warning', 'W-1'),
      makeFinding('info', 'I-1'),
    ];
    // 100 - 15 - 8 - 3 - 1 = 73
    expect(calculateRiskScore(findings)).toBe(73);
  });
});

describe('Grade Assignment', () => {
  it('returns A for 90-100', () => {
    expect(getGrade(100)).toBe('A');
    expect(getGrade(90)).toBe('A');
  });

  it('returns B for 75-89', () => {
    expect(getGrade(89)).toBe('B');
    expect(getGrade(75)).toBe('B');
  });

  it('returns C for 50-74', () => {
    expect(getGrade(74)).toBe('C');
    expect(getGrade(50)).toBe('C');
  });

  it('returns D for 25-49', () => {
    expect(getGrade(49)).toBe('D');
    expect(getGrade(25)).toBe('D');
  });

  it('returns F for 0-24', () => {
    expect(getGrade(24)).toBe('F');
    expect(getGrade(0)).toBe('F');
  });
});

describe('Grade Labels', () => {
  it('maps scores to labels', () => {
    expect(getGradeLabel(95)).toBe('Ship it!');
    expect(getGradeLabel(80)).toBe('Almost ready');
    expect(getGradeLabel(60)).toBe('Needs attention');
    expect(getGradeLabel(30)).toBe('High risk');
    expect(getGradeLabel(10)).toBe('Do not submit');
  });
});

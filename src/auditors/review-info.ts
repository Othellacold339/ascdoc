import type { AppData } from '../api/types.js';
import type { AuditResult, Finding } from './types.js';

export function auditReviewInfo(data: AppData): AuditResult {
  const start = Date.now();
  const findings: Finding[] = [];

  if (!data.reviewDetail) {
    findings.push({
      id: 'REV-001',
      module: 'review-info',
      severity: 'warning',
      title: 'No review detail found',
      message: 'Could not find App Store review detail information for this version. This section helps the review team understand your app.',
      remedy: 'Add review information in App Store Connect > App Store > Version > App Review Information.',
    });

    return {
      module: 'review-info',
      label: 'Review Info',
      icon: '📋',
      findings,
      duration: Date.now() - start,
    };
  }

  const attrs = data.reviewDetail.attributes;

  // REV-002: Missing contact info
  const hasContact =
    (attrs.contactFirstName && attrs.contactFirstName.trim().length > 0) ||
    (attrs.contactEmail && attrs.contactEmail.trim().length > 0) ||
    (attrs.contactPhone && attrs.contactPhone.trim().length > 0);

  if (!hasContact) {
    findings.push({
      id: 'REV-002',
      module: 'review-info',
      severity: 'high',
      title: 'Missing reviewer contact information',
      message: 'No contact information (name, email, or phone) is provided for the App Review team. If they have questions, they won\'t be able to reach you quickly.',
      remedy: 'Add contact information (at minimum an email) in the App Review Information section.',
    });
  } else {
    // REV-003: Missing email specifically
    if (!attrs.contactEmail || attrs.contactEmail.trim().length === 0) {
      findings.push({
        id: 'REV-003',
        module: 'review-info',
        severity: 'warning',
        title: 'Missing reviewer contact email',
        message: 'No email address provided for the review team. Email is the most reliable way for reviewers to contact you.',
        remedy: 'Add a monitored email address to the App Review Information section.',
      });
    }

    // REV-004: Missing phone
    if (!attrs.contactPhone || attrs.contactPhone.trim().length === 0) {
      findings.push({
        id: 'REV-004',
        module: 'review-info',
        severity: 'info',
        title: 'Missing reviewer contact phone',
        message: 'No phone number provided for the review team.',
        remedy: 'Consider adding a phone number for faster communication during review.',
      });
    }
  }

  // REV-005: Demo account required but not provided
  if (attrs.demoAccountRequired === true) {
    if (!attrs.demoAccountName || attrs.demoAccountName.trim().length === 0) {
      findings.push({
        id: 'REV-005',
        module: 'review-info',
        severity: 'critical',
        title: 'Demo account required but username is missing',
        message: 'The app requires a demo account for review but no username is provided. This will cause rejection.',
        remedy: 'Provide a working demo account username in App Review Information.',
      });
    }
    if (!attrs.demoAccountPassword || attrs.demoAccountPassword.trim().length === 0) {
      findings.push({
        id: 'REV-006',
        module: 'review-info',
        severity: 'critical',
        title: 'Demo account required but password is missing',
        message: 'The app requires a demo account for review but no password is provided. This will cause rejection.',
        remedy: 'Provide a working demo account password in App Review Information.',
      });
    }
  }

  // REV-007: Empty review notes (just informational)
  if (!attrs.notes || attrs.notes.trim().length === 0) {
    findings.push({
      id: 'REV-007',
      module: 'review-info',
      severity: 'info',
      title: 'No review notes provided',
      message: 'The review notes field is empty. Notes can help the reviewer understand special features, required hardware, or complex flows.',
      remedy: 'Consider adding notes to guide the reviewer, especially for apps with sign-in, subscriptions, or specialized hardware.',
    });
  }

  return {
    module: 'review-info',
    label: 'Review Info',
    icon: '📋',
    findings,
    duration: Date.now() - start,
  };
}

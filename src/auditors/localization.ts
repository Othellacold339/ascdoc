import type { AppData } from '../api/types.js';
import type { AuditResult, Finding } from './types.js';

const PLACEHOLDER_PATTERNS = [
  /lorem\s+ipsum/i,
  /\bTODO\b/,
  /\bTBD\b/,
  /\bFIXME\b/,
  /\[PLACEHOLDER\]/i,
  /\bXXX\b/,
  /\bsample\s+text\b/i,
  /\bdummy\b/i,
  /\btest\s+description\b/i,
  /\bcoming\s+soon\b/i,
];

export function auditLocalization(data: AppData): AuditResult {
  const start = Date.now();
  const findings: Finding[] = [];
  const primaryLocale = data.app.attributes.primaryLocale;

  // Check each version localization
  for (const loc of data.versionLocalizations) {
    const locale = loc.attributes.locale;
    const attrs = loc.attributes;

    // LOC-001: Missing description
    if (!attrs.description || attrs.description.trim().length === 0) {
      findings.push({
        id: 'LOC-001',
        module: 'localization',
        severity: 'critical',
        title: `Missing description for locale \`${locale}\``,
        message: `The App Store description is empty for the ${locale} localization. This is a required field for submission.`,
        locale,
        remedy: `Add a compelling description for ${locale} in App Store Connect > App Store > Version Information.`,
      });
    }

    // LOC-002: Missing keywords
    if (!attrs.keywords || attrs.keywords.trim().length === 0) {
      findings.push({
        id: 'LOC-002',
        module: 'localization',
        severity: 'warning',
        title: `Missing keywords for locale \`${locale}\``,
        message: `Keywords field is empty for ${locale}. This is a missed ASO (App Store Optimization) opportunity.`,
        locale,
        remedy: `Add comma-separated keywords (max 100 chars) for ${locale} to improve search visibility.`,
      });
    }

    // LOC-003: Missing promotional text
    if (!attrs.promotionalText || attrs.promotionalText.trim().length === 0) {
      findings.push({
        id: 'LOC-003',
        module: 'localization',
        severity: 'info',
        title: `Missing promotional text for locale \`${locale}\``,
        message: `Promotional text is empty for ${locale}. This field can be updated without app review.`,
        locale,
        remedy: `Add promotional text for ${locale}. This is shown at the top of the description and can be updated anytime.`,
      });
    }

    // LOC-004: Placeholder text detection
    if (attrs.description) {
      for (const pattern of PLACEHOLDER_PATTERNS) {
        if (pattern.test(attrs.description)) {
          findings.push({
            id: 'LOC-004',
            module: 'localization',
            severity: 'critical',
            title: `Placeholder text detected in \`${locale}\` description`,
            message: `The description for ${locale} contains placeholder text matching "${pattern.source}". This will likely cause rejection.`,
            locale,
            remedy: `Replace placeholder text in the ${locale} description with real content before submission.`,
          });
          break; // One finding per locale for placeholders
        }
      }
    }

    // LOC-005: Description too short
    if (attrs.description && attrs.description.trim().length > 0 && attrs.description.trim().length < 100) {
      findings.push({
        id: 'LOC-005',
        module: 'localization',
        severity: 'warning',
        title: `Description too short for locale \`${locale}\``,
        message: `The description for ${locale} is only ${attrs.description.trim().length} characters. Consider expanding it for better ASO.`,
        locale,
        remedy: `Expand the ${locale} description to at least 100 characters with feature highlights, benefits, and relevant keywords.`,
      });
    }

    // LOC-006: Keywords in description (check for placeholder patterns in keywords too)
    if (attrs.keywords) {
      for (const pattern of PLACEHOLDER_PATTERNS) {
        if (pattern.test(attrs.keywords)) {
          findings.push({
            id: 'LOC-006',
            module: 'localization',
            severity: 'critical',
            title: `Placeholder text in \`${locale}\` keywords`,
            message: `Keywords for ${locale} contain placeholder text matching "${pattern.source}".`,
            locale,
            remedy: `Replace placeholder keywords with real, relevant search terms for ${locale}.`,
          });
          break;
        }
      }
    }
  }

  // LOC-007: Primary locale missing version localization
  const hasPrimaryLocale = data.versionLocalizations.some(
    (l) => l.attributes.locale === primaryLocale,
  );
  if (!hasPrimaryLocale) {
    findings.push({
      id: 'LOC-007',
      module: 'localization',
      severity: 'critical',
      title: `Primary locale \`${primaryLocale}\` missing version localization`,
      message: `Your app's primary locale (${primaryLocale}) has no version localization. This is required for submission.`,
      locale: primaryLocale,
      remedy: `Add a version localization for your primary locale (${primaryLocale}) in App Store Connect.`,
    });
  }

  // LOC-008: Check app info localizations match version localizations
  const versionLocales = new Set(data.versionLocalizations.map((l) => l.attributes.locale));
  const infoLocales = new Set(data.appInfoLocalizations.map((l) => l.attributes.locale));

  for (const infoLocale of infoLocales) {
    if (!versionLocales.has(infoLocale)) {
      findings.push({
        id: 'LOC-008',
        module: 'localization',
        severity: 'high',
        title: `App info locale \`${infoLocale}\` missing version metadata`,
        message: `App info localization exists for ${infoLocale} but there's no corresponding version localization (description, keywords, etc.).`,
        locale: infoLocale,
        remedy: `Add version metadata (description, keywords) for ${infoLocale} or remove the app info localization if not needed.`,
      });
    }
  }

  return {
    module: 'localization',
    label: 'Localization',
    icon: '🌍',
    findings,
    duration: Date.now() - start,
  };
}

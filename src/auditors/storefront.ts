import type { AppData } from '../api/types.js';
import type { AuditResult, Finding } from './types.js';

// Major App Store markets by territory ID
const MAJOR_MARKETS = [
  { id: 'USA', name: 'United States' },
  { id: 'GBR', name: 'United Kingdom' },
  { id: 'DEU', name: 'Germany' },
  { id: 'FRA', name: 'France' },
  { id: 'JPN', name: 'Japan' },
  { id: 'CHN', name: 'China' },
  { id: 'KOR', name: 'South Korea' },
  { id: 'CAN', name: 'Canada' },
  { id: 'AUS', name: 'Australia' },
  { id: 'BRA', name: 'Brazil' },
  { id: 'IND', name: 'India' },
  { id: 'ITA', name: 'Italy' },
  { id: 'ESP', name: 'Spain' },
  { id: 'NLD', name: 'Netherlands' },
  { id: 'TUR', name: 'Turkey' },
];

export function auditStorefront(data: AppData): AuditResult {
  const start = Date.now();
  const findings: Finding[] = [];

  const territoryIds = new Set(data.availableTerritories.map((t) => t.id));
  const totalTerritories = data.availableTerritories.length;

  // STR-001: Very limited territory coverage
  if (totalTerritories === 0) {
    findings.push({
      id: 'STR-001',
      module: 'storefront',
      severity: 'high',
      title: 'No territory availability data found',
      message: 'Could not determine which territories your app is available in.',
      remedy: 'Check App Store Connect > Pricing and Availability to configure territories.',
    });
  } else if (totalTerritories < 10) {
    findings.push({
      id: 'STR-002',
      module: 'storefront',
      severity: 'warning',
      title: `Limited territory coverage (${totalTerritories} territories)`,
      message: `Your app is available in only ${totalTerritories} territories. Apple supports 175+ storefronts.`,
      remedy: 'Consider expanding availability to more territories to increase your potential audience.',
    });
  } else if (totalTerritories < 50) {
    findings.push({
      id: 'STR-003',
      module: 'storefront',
      severity: 'info',
      title: `Moderate territory coverage (${totalTerritories} territories)`,
      message: `Your app is available in ${totalTerritories} territories. You could reach more users by expanding.`,
      remedy: 'Review if there are additional markets worth targeting.',
    });
  }

  // STR-004: Missing major markets
  if (totalTerritories > 0) {
    const missingMajor = MAJOR_MARKETS.filter((m) => !territoryIds.has(m.id));

    if (missingMajor.length > 0) {
      const marketList = missingMajor.map((m) => m.name).join(', ');
      findings.push({
        id: 'STR-004',
        module: 'storefront',
        severity: missingMajor.length > 5 ? 'warning' : 'info',
        title: `Missing ${missingMajor.length} major market(s)`,
        message: `Your app is not available in: ${marketList}. These are among the highest-revenue App Store markets.`,
        remedy: `Consider making your app available in these markets: ${marketList}.`,
      });
    }
  }

  // STR-005: Localization vs territory mismatch
  const localeToTerritory: Record<string, string> = {
    'en-US': 'USA',
    'en-GB': 'GBR',
    'de-DE': 'DEU',
    'fr-FR': 'FRA',
    'ja': 'JPN',
    'zh-Hans': 'CHN',
    'ko': 'KOR',
    'pt-BR': 'BRA',
    'it': 'ITA',
    'es-ES': 'ESP',
    'es-MX': 'MEX',
    'nl-NL': 'NLD',
    'tr': 'TUR',
    'ru': 'RUS',
    'ar-SA': 'SAU',
    'th': 'THA',
    'vi': 'VNM',
    'id': 'IDN',
    'ms': 'MYS',
  };

  const appLocales = data.versionLocalizations.map((l) => l.attributes.locale);
  for (const locale of appLocales) {
    const territory = localeToTerritory[locale];
    if (territory && totalTerritories > 0 && !territoryIds.has(territory)) {
      findings.push({
        id: 'STR-005',
        module: 'storefront',
        severity: 'warning',
        title: `Localized for \`${locale}\` but not available in corresponding territory`,
        message: `Your app has ${locale} localization but is not available in the corresponding territory. The localization effort may be wasted.`,
        locale,
        remedy: `Consider making your app available in the territory that corresponds to the ${locale} localization, or remove the unused localization.`,
      });
    }
  }

  return {
    module: 'storefront',
    label: 'Storefront Coverage',
    icon: '🌐',
    findings,
    duration: Date.now() - start,
  };
}

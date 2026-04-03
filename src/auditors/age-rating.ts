import type { AppData } from '../api/types.js';
import type { AuditResult, Finding } from './types.js';

const NONE_VALUE = 'NONE';

export function auditAgeRating(data: AppData): AuditResult {
  const start = Date.now();
  const findings: Finding[] = [];

  if (!data.ageRatingDeclaration) {
    findings.push({
      id: 'AGE-001',
      module: 'age-rating',
      severity: 'high',
      title: 'Age rating declaration not found',
      message: 'Could not retrieve the age rating declaration. This may indicate it has not been configured.',
      remedy: 'Go to App Store Connect > App Information > Age Rating and complete the questionnaire.',
    });

    return {
      module: 'age-rating',
      label: 'Age Rating',
      icon: '🔞',
      findings,
      duration: Date.now() - start,
    };
  }

  const attrs = data.ageRatingDeclaration.attributes;

  // AGE-002: All content descriptors appear to be at default (NONE)
  const contentFields = [
    'alcoholTobaccoOrDrugUseOrReferences',
    'horrorOrFearThemes',
    'matureOrSuggestiveThemes',
    'profanityOrCrudeHumor',
    'sexualContentGraphicAndNudity',
    'sexualContentOrNudity',
    'violenceCartoonOrFantasy',
    'violenceRealistic',
    'violenceRealisticProlongedGraphicOrSadistic',
    'gamblingSimulated',
  ] as const;

  const allNone = contentFields.every((field) => {
    const value = attrs[field];
    return value === null || value === NONE_VALUE || value === 'INFREQUENT_OR_MILD';
  });

  const allNull = contentFields.every((field) => attrs[field] === null);

  if (allNull) {
    findings.push({
      id: 'AGE-002',
      module: 'age-rating',
      severity: 'high',
      title: 'Age rating fields appear unset',
      message: 'All age rating content descriptors are null, suggesting the questionnaire may not have been completed.',
      remedy: 'Complete the age rating questionnaire in App Store Connect > App Information > Age Rating.',
    });
  } else if (allNone) {
    findings.push({
      id: 'AGE-003',
      module: 'age-rating',
      severity: 'info',
      title: 'All age rating fields set to minimal',
      message: 'All content descriptors are set to NONE or INFREQUENT_OR_MILD. Verify this accurately reflects your app\'s content.',
      remedy: 'Review the age rating questionnaire to ensure it accurately represents your app\'s content.',
    });
  }

  // AGE-004: Gambling enabled but no simulated gambling flag
  if (attrs.gambling === true && (!attrs.gamblingSimulated || attrs.gamblingSimulated === NONE_VALUE)) {
    findings.push({
      id: 'AGE-004',
      module: 'age-rating',
      severity: 'critical',
      title: 'Gambling flag set without proper classification',
      message: 'The gambling flag is enabled but simulated gambling content descriptor is not configured. This inconsistency may cause review issues.',
      remedy: 'Review the gambling-related fields in the age rating to ensure consistency.',
    });
  }

  // AGE-005: Unrestricted web access enabled
  if (attrs.unrestrictedWebAccess === true) {
    findings.push({
      id: 'AGE-005',
      module: 'age-rating',
      severity: 'info',
      title: 'Unrestricted web access enabled',
      message: 'Your app is flagged as providing unrestricted web access. This increases the age rating. Ensure this is intentional.',
      remedy: 'If your app doesn\'t provide a general web browser, consider disabling this flag to lower the age rating.',
    });
  }

  // AGE-006: 17+ flag
  if (attrs.seventeenPlus === true) {
    findings.push({
      id: 'AGE-006',
      module: 'age-rating',
      severity: 'info',
      title: 'App rated 17+',
      message: 'Your app is flagged as 17+. This significantly limits your audience. Ensure this is necessary.',
      remedy: 'If possible, review whether 17+ content can be gated or made optional to lower the base age rating.',
    });
  }

  // AGE-007: Kids age band set but mature content flagged
  if (attrs.kidsAgeBand !== null && attrs.kidsAgeBand !== undefined) {
    const hasMatureContent =
      (attrs.violenceRealistic && attrs.violenceRealistic !== NONE_VALUE) ||
      (attrs.sexualContentOrNudity && attrs.sexualContentOrNudity !== NONE_VALUE) ||
      (attrs.profanityOrCrudeHumor && attrs.profanityOrCrudeHumor !== NONE_VALUE && attrs.profanityOrCrudeHumor !== 'INFREQUENT_OR_MILD');

    if (hasMatureContent) {
      findings.push({
        id: 'AGE-007',
        module: 'age-rating',
        severity: 'critical',
        title: 'Kids age band with mature content flags',
        message: 'Your app targets kids (Kids Age Band is set) but also has mature content descriptors. This is an inconsistency that will likely cause rejection.',
        remedy: 'Either remove the Kids Age Band setting or adjust the content descriptors to be appropriate for children.',
      });
    }
  }

  return {
    module: 'age-rating',
    label: 'Age Rating',
    icon: '🔞',
    findings,
    duration: Date.now() - start,
  };
}

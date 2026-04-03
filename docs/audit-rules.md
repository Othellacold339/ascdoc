# ASC Doctor — Audit Rules Reference

This document describes every check that ASC Doctor performs, organized by module.

## Severity Levels

| Level | Score Impact | Meaning |
|-------|-------------|---------|
| 🔴 Critical | −15 points | Will likely cause App Review rejection |
| 🟠 High | −8 points | Should be fixed before submission |
| 🟡 Warning | −3 points | Missed optimization opportunity |
| ℹ️ Info | −1 point | Nice to have, not required |

---

## 🌍 Localization (`localization`)

| ID | Severity | Rule | Description |
|----|----------|------|-------------|
| LOC-001 | 🔴 Critical | Missing description | Version localization exists but description is empty |
| LOC-002 | 🟡 Warning | Missing keywords | Keywords field empty — missed ASO opportunity |
| LOC-003 | ℹ️ Info | Missing promotional text | Promo text empty — can be updated without review |
| LOC-004 | 🔴 Critical | Placeholder text | Detects "Lorem ipsum", "TODO", "TBD", "Coming Soon" etc. |
| LOC-005 | 🟡 Warning | Description too short | Under 100 characters |
| LOC-006 | 🔴 Critical | Placeholder keywords | Keywords contain placeholder text |
| LOC-007 | 🔴 Critical | Missing primary locale | Primary locale has no version localization |
| LOC-008 | 🟠 High | Locale mismatch | App info locale exists but version metadata is missing |

## 📱 Screenshots (`screenshots`)

| ID | Severity | Rule | Description |
|----|----------|------|-------------|
| SCR-001 | 🔴 Critical | No screenshots | Zero screenshot sets for a localization |
| SCR-002 | 🔴 Critical | Missing required device | No 6.7"/6.9" iPhone screenshots |
| SCR-003 | 🟠 High | Empty screenshot set | Set exists but contains 0 screenshots |
| SCR-004 | 🟡 Warning | Under minimum count | Fewer than 3 screenshots per set |
| SCR-005 | 🔴 Critical | Primary locale missing | Primary locale has no screenshots |

## 🔞 Age Rating (`age-rating`)

| ID | Severity | Rule | Description |
|----|----------|------|-------------|
| AGE-001 | 🟠 High | Not found | Age rating declaration not retrievable |
| AGE-002 | 🟠 High | Fields unset | All content descriptors are null |
| AGE-003 | ℹ️ Info | All minimal | All fields set to NONE (verify intentional) |
| AGE-004 | 🔴 Critical | Gambling mismatch | Gambling enabled without simulated gambling flag |
| AGE-005 | ℹ️ Info | Web access | Unrestricted web access increases age rating |
| AGE-006 | ℹ️ Info | 17+ rated | App rated 17+ limits audience |
| AGE-007 | 🔴 Critical | Kids conflict | Kids age band set with mature content flags |

## 💬 Subtitle (`subtitle`)

| ID | Severity | Rule | Description |
|----|----------|------|-------------|
| SUB-001 | 🟡 Warning | Missing subtitle | No subtitle set |
| SUB-002 | ℹ️ Info | Too short | Under 10 characters |
| SUB-003 | 🟡 Warning | Repeats name | Subtitle contains the app name |
| SUB-004 | 🟡 Warning | Generic text | Contains words like "best", "amazing", "#1" |
| SUB-005 | 🟠 High | Too long | Exceeds 30-character limit |

## 🔒 Privacy (`privacy`)

| ID | Severity | Rule | Description |
|----|----------|------|-------------|
| PRV-001 | 🔴 Critical | Missing URL | No privacy policy URL (required since 2018) |
| PRV-002 | 🟠 High | Invalid URL | URL format is not valid |
| PRV-003 | 🟡 Warning | Not HTTPS | Privacy URL uses HTTP instead of HTTPS |
| PRV-004 | ℹ️ Info | Many URLs | Many unique privacy URLs across localizations |
| PRV-005 | ℹ️ Info | No choices URL | Optional privacy choices URL not set |

## 💳 Subscriptions & IAP (`subscription`)

| ID | Severity | Rule | Description |
|----|----------|------|-------------|
| SUBS-001 | 🟠 High | Group missing locale | Subscription group lacks display name for locale |
| SUBS-002 | 🟠 High | Group empty name | Localization exists but display name is empty |
| SUBS-003 | 🔴 Critical | Missing display name | Subscription has no localized display name |
| SUBS-004 | 🔴 Critical | Missing description | Subscription has no localized description |
| SUBS-005 | 🟠 High | Locale gap | App supports locale but subscription doesn't |
| SUBS-006 | 🔴 Critical | IAP missing name | In-app purchase has no localized display name |
| SUBS-007 | 🟡 Warning | IAP missing desc | In-app purchase has no localized description |
| SUBS-008 | 🟠 High | IAP locale gap | App supports locale but IAP doesn't |

## 🌐 Storefront Coverage (`storefront`)

| ID | Severity | Rule | Description |
|----|----------|------|-------------|
| STR-001 | 🟠 High | No data | Cannot determine territory availability |
| STR-002 | 🟡 Warning | Very limited | Available in fewer than 10 territories |
| STR-003 | ℹ️ Info | Moderate | Available in 10-49 territories |
| STR-004 | 🟡/ℹ️ | Major missing | Missing high-revenue markets |
| STR-005 | 🟡 Warning | Wasted locale | Localized for a territory where app isn't available |

## 📋 Review Info (`review-info`)

| ID | Severity | Rule | Description |
|----|----------|------|-------------|
| REV-001 | 🟡 Warning | No detail | Review detail section not found |
| REV-002 | 🟠 High | No contact | Missing all reviewer contact information |
| REV-003 | 🟡 Warning | No email | Contact info exists but email missing |
| REV-004 | ℹ️ Info | No phone | Phone number not provided |
| REV-005 | 🔴 Critical | Demo user needed | Demo account required but username missing |
| REV-006 | 🔴 Critical | Demo pass needed | Demo account required but password missing |
| REV-007 | ℹ️ Info | Empty notes | Review notes field empty |

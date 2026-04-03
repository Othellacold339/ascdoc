# Contributing to ASC Doctor

Thank you for your interest in contributing! Here's everything you need to get started.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/AykutSarac/ascdoc.git
cd ascdoc

# Install dependencies
npm install

# Build the project
npm run build

# Run with demo data
node dist/index.js --demo
```

## Project Structure

```
src/
├── index.ts              # CLI entry point
├── config.ts             # Configuration resolution
├── auth.ts               # JWT authentication
├── api/
│   ├── client.ts         # HTTP client with retry & pagination
│   ├── types.ts          # ASC API type definitions
│   └── fetcher.ts        # Data fetching orchestrator
├── auditors/
│   ├── index.ts          # Audit orchestrator
│   ├── types.ts          # Finding & result types
│   ├── localization.ts   # 🌍 Localization checks
│   ├── screenshots.ts    # 📱 Screenshot checks
│   ├── age-rating.ts     # 🔞 Age rating checks
│   ├── subtitle.ts       # 💬 Subtitle checks
│   ├── privacy.ts        # 🔒 Privacy checks
│   ├── subscription.ts   # 💳 Subscription & IAP checks
│   ├── storefront.ts     # 🌐 Storefront checks
│   └── review-info.ts    # 📋 Review info checks
├── scoring/
│   └── risk.ts           # Risk score calculation
├── reporter/
│   ├── terminal.ts       # Colored terminal output
│   ├── markdown.ts       # Markdown report
│   └── json.ts           # JSON output for CI
└── demo/
    └── data.ts           # Demo/sample data
```

## Adding a New Audit Rule

1. Open the appropriate auditor file in `src/auditors/`
2. Add your check following the existing pattern:

```typescript
// Use a unique ID with the module prefix
if (someCondition) {
  findings.push({
    id: 'LOC-009',           // Module prefix + sequential number
    module: 'localization',  // Must match the module name
    severity: 'warning',     // critical | high | warning | info
    title: 'Clear, short title',
    message: 'Detailed explanation of what was found and why it matters.',
    locale: locale,          // Optional: if locale-specific
    remedy: 'Actionable fix suggestion.',  // Always include this!
  });
}
```

3. Document the rule in `docs/audit-rules.md`
4. Update the demo data in `src/demo/data.ts` to include a case that triggers your rule

## Code Style

- **TypeScript strict mode** — no `any` types
- **Pure functions** in auditors — they take `AppData` and return `AuditResult`
- **Always include `remedy`** — every finding should have an actionable fix
- **Use existing severity levels** — don't create new ones

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/my-new-rule`
2. Make your changes
3. Ensure `npm run lint` passes
4. Ensure `npm run build` succeeds
5. Ensure `npm test` passes
6. Submit a PR with a clear description

## Questions?

Open a [Discussion](https://github.com/AykutSarac/ascdoc/discussions) or [Issue](https://github.com/AykutSarac/ascdoc/issues).

# Playwright Automation Framework

End-to-end automation framework built with Playwright and JavaScript. Page Object Model,
data-driven specs, environment config, and CI. Adaptable to any web application.

## Project structure

```text
├── tests/
│   ├── blogspot/            # Live suite — testautomationpractice.blogspot.com
│   │   ├── toggle.spec.js
│   │   ├── table.spec.js
│   │   ├── dialog.spec.js
│   │   ├── datePicker.spec.js
│   │   └── newtab.spec.js
│   └── bolt/                # Skipped — see "Skipped suites" below
├── pages/
│   ├── blogspot/            # One page object per widget
│   └── bolt/
├── testdata/                # JSON fixtures, grouped by target
├── utils/dataProvider.js    # Reads a JSON fixture with a clear error if missing
├── playwright.config.js
└── package.json
```

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env      # then fill in the URLs you need
```

## Running tests

```bash
npm test                   # everything
npm run test:blogspot      # the public suite only
npm run test:repeat        # everything, 3x — flake check
npm run test:headed        # watch the browser
npm run test:debug         # Playwright inspector
npm run report             # open the last HTML report
```

## Design decisions

**Page objects own every selector.** No spec contains a raw locator. If a selector breaks,
exactly one file changes.

**No `waitForTimeout`.** Every wait is a web-first assertion
(`expect(locator).toBeVisible()`) or an event promise (`page.waitForEvent('popup')`).
Arbitrary sleeps are the primary cause of flaky suites — a fixed delay is either too short
(flakes) or too long (slow), and it never adapts to the app.

**Dialogs are captured as promises, not via `page.on` handlers.** An `expect()` inside an
event handler runs detached from the test, so its failure doesn't fail anything. The page
objects return `{ type, message }` and the spec asserts on it in test scope.

**Retries belong in CI, not locally.** A locally-retried test hides a real defect; in CI it
absorbs infrastructure noise. `retries: process.env.CI ? 2 : 0`.

**Traces only on first retry.** Full tracing on every run produces gigabytes of artifacts
nobody opens. `trace: 'on-first-retry'` gives you the failing attempt's trace and nothing else.

**Workers capped at 4.** The public target rate-limits concurrent connections; more workers
does not mean faster, it means timeouts.

## Live suites

**blogspot** — 12 tests on a public practice site. Fast, no auth, safe to run anywhere.

**bolt** — 10 tests against a real brokerage app. The credentials in `testdata/bolt/` are
live and they work:

- login with valid credentials reaches onboarding
- login with a wrong password is rejected
- the onboarding date picker opens, selects a year/month/day, and writes `01/15/1999`
- the onboarding wizard reports step 2 of 8 and shows its progress rail

Run `bolt-auth` first (or use `npm test`, which runs it as a dependency) to produce
`.auth/bolt.json`; the bolt specs reuse that session instead of logging in per test.

**Two specs are still skipped**, and the reasons are in the files:

- `dropdown` — the country dropdown was on the registration form. `/signup`, `/register`,
  `/join` and `/create-account` all render empty shells now; the public signup flow is gone.
- `paymentFlow` — commission splits live inside a deal, which needs an account past
  onboarding (this one is at step 2 of 8). Needs a seeded tenant.

**Concurrency:** the bolt app invalidates a session shared by several concurrent browser
contexts, and two concurrent auth setups tear `.auth/bolt.json`. So the `bolt` and
`bolt-auth` projects run with `workers: 1`, while blogspot stays at 4.

## Coverage

12 live tests across 5 widgets: toggle button state machine, sortable product table with
pagination, alert/confirm/prompt dialogs, jQuery UI date picker, and multi-window popups.

`WEB_AUTOMATION_FEATURES.md` is the longer checklist of web features worth automating, with a
suggested practice site for each — it's the backlog for this repo.

## Linting

```bash
npm run lint
npm run lint:fix
```

## Requirements

Node 18+ and a Chromium download. No Android SDK, no Java, no Selenium.

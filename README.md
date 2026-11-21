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
npm run test:blogspot      # the live suite only
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

## Skipped suites

`tests/bolt/` targets a third-party brokerage. Those specs are wrapped in
`test.describe.skip` on purpose:

- they mutate real state on someone else's system (account creation, payment splits)
- the credentials are a throwaway account that expires
- one of them is structurally broken in its original form and is kept only as a record

They are skipped, not deleted, so the intent stays visible. Point them at a disposable
environment before re-enabling.

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

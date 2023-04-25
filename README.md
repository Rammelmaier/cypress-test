# E2E automated tests with Cypress

Gherkin (Cucumber) + Cypress + JS E2E tests for react application.

# How to use?

1. Install `dependencies`:
  - Install dependencies for e2e tests: `npm install`.

2. Build and run on local host test app (not included in this repo).

3. Launch automated tests e2e tests:
  - via Cypress UI launcher: `npm run cypress:open`.
  - direct launch: `npm run test`.

# Configuration

By default local host port is 5501. Change it if necessary in `./cypress.config.js`: `e2e.baseUrl`.

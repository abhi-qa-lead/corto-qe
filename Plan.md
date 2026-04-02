Corto-QE: Test Automation Framework Plan

     Context

     QA automation portfolio project with two tasks: UI automation for DemoQA Book Store and API automation for Restful Booker. Both use Playwright. We start with Task 1 (UI) first, then Task 2 (API).
     Atlassian integration (Confluence + Jira) is deferred until OAuth is resolved.

     Key scope decisions:
     - Task 1 excludes user registration, login, authentication, profile, and collection management. Only public-facing book store features.
     - Risk Matrix saved locally at docs/risk-matrix.md (RPN = L × I, no Detectability)
     - No Jira tickets yet — will create once Atlassian auth works

     ---
     Phase 1: Project Scaffolding

     Folder Structure

     corto-qe/
     ├── .github/workflows/
     │   ├── ui-tests.yml
     │   └── api-tests.yml
     ├── src/
     │   ├── ui/
     │   │   ├── pages/
     │   │   │   ├── base.page.ts
     │   │   │   ├── bookStore.page.ts
     │   │   │   └── bookDetails.page.ts
     │   │   └── data/
     │   │       └── books.ts
     │   └── api/
     │       ├── clients/
     │       │   ├── base.client.ts
     │       │   ├── auth.client.ts
     │       │   └── booking.client.ts
     │       ├── data/
     │       │   ├── bookings.json
     │       │   ├── partialUpdates.json
     │       │   └── invalidPayloads.json
     │       └── types/
     │           └── booking.types.ts
     ├── tests/
     │   ├── ui/
     │   │   ├── bookStore.spec.ts
     │   │   ├── search.spec.ts
     │   │   ├── bookDetails.spec.ts
     │   │   └── navigation.spec.ts
     │   └── api/
     │       ├── healthCheck.spec.ts
     │       ├── auth.spec.ts
     │       ├── createBooking.spec.ts
     │       ├── getBooking.spec.ts
     │       ├── updateBooking.spec.ts
     │       ├── partialUpdateBooking.spec.ts
     │       ├── deleteBooking.spec.ts
     │       └── e2e-flow.spec.ts
     ├── docs/
     │   └── risk-matrix.md          # ✓ Already created
     ├── playwright.config.ts
     ├── tsconfig.json
     ├── package.json
     ├── .gitignore
     └── README.md

     Config Files

     - package.json — Deps: @playwright/test. Scripts: test:ui, test:api, test:all, test:ui:headed, report
     - playwright.config.ts — Two projects:
       - ui-tests: baseURL https://demoqa.com, chromium, tests/ui/**, retries 1, trace on-first-retry
       - api-tests: baseURL https://restful-booker.herokuapp.com, no browser, tests/api/**, retries 0
     - tsconfig.json — ES2022, strict, path aliases

     Steps

     1. npm init -y
     2. npm install -D @playwright/test typescript
     3. npx playwright install chromium
     4. Create playwright.config.ts, tsconfig.json, .gitignore
     5. git init + initial commit

     ---
     Phase 2: Task 1 — UI Automation (High RPN scenarios first)

     Page Objects (Page Object Model)

     base.page.ts
     - Constructor: Page instance
     - Methods: navigateTo(path), waitForPageLoad(), getCurrentUrl()

     bookStore.page.ts (extends BasePage)
     - Locators: search box (#searchBox), book table rows, book title links, pagination controls, rows-per-page dropdown
     - Methods: getAllBooks(), searchFor(query), clearSearch(), getBookCount(), clickBook(title), getVisibleBookTitles(), setRowsPerPage(count), goToNextPage(), goToPreviousPage()

     bookDetails.page.ts (extends BasePage)
     - Locators: ISBN/Title/SubTitle/Author/Publisher/Pages/Description/Website wrapper elements, "Back To Book Store" button
     - Methods: getField(fieldName), getAllDetails(), getWebsiteLink(), goBackToStore()

     Test Data (src/ui/data/books.ts)

     Array of 8 books with ISBN, title, author, publisher — sourced from GET /BookStore/v1/Books API.

     Test Specs (ordered by RPN priority)

     ┌─────────────────────┬───────────────────────────────────────────────────────────────┬─────────────┐
     │      Spec File      │                       Covers Scenarios                        │  Priority   │
     ├─────────────────────┼───────────────────────────────────────────────────────────────┼─────────────┤
     │ bookStore.spec.ts   │ UI-001 (RPN 15), UI-002 (8), UI-003 (15), UI-016 (8)          │ High+Medium │
     ├─────────────────────┼───────────────────────────────────────────────────────────────┼─────────────┤
     │ search.spec.ts      │ UI-004 (20), UI-005 (16), UI-006 (9), UI-007 (9), UI-008 (12) │ High+Medium │
     ├─────────────────────┼───────────────────────────────────────────────────────────────┼─────────────┤
     │ bookDetails.spec.ts │ UI-009 (20), UI-010 (15), UI-011 (20), UI-012 (6)             │ High+Low    │
     ├─────────────────────┼───────────────────────────────────────────────────────────────┼─────────────┤
     │ navigation.spec.ts  │ UI-013 (12), UI-014 (9), UI-015 (9)                           │ Medium      │
     └─────────────────────┴───────────────────────────────────────────────────────────────┴─────────────┘

     ---
     Phase 3: Task 2 — API Automation (after UI is complete)

     Client Wrapper Pattern

     base.client.ts — Wraps APIRequestContext. Generic HTTP methods. Handles headers, token via Cookie: token={value}.

     auth.client.ts — createToken(username, password) → token string. Credentials: admin/password123.

     booking.client.ts — getAllBookings(filters?), getBooking(id), createBooking(data), updateBooking(id, data, token), partialUpdateBooking(id, data, token), deleteBooking(id, token).

     Data-Driven Test Data (JSON)

     - bookings.json — 3-5 valid booking payloads
     - partialUpdates.json — Partial PATCH payloads
     - invalidPayloads.json — Negative test data

     Types (booking.types.ts)

     Interfaces: Booking, BookingResponse, BookingDates

     Test Specs (ordered by RPN)

     ┌──────────────────────────────┬─────────────────────────────────────────────────────────────────────┬──────────┐
     │          Spec File           │                          Covers Scenarios                           │ Priority │
     ├──────────────────────────────┼─────────────────────────────────────────────────────────────────────┼──────────┤
     │ e2e-flow.spec.ts             │ API-020 (25), API-021 (25)                                          │ Highest  │
     ├──────────────────────────────┼─────────────────────────────────────────────────────────────────────┼──────────┤
     │ deleteBooking.spec.ts        │ API-017 (25), API-018 (20), API-019 (9)                             │ High     │
     ├──────────────────────────────┼─────────────────────────────────────────────────────────────────────┼──────────┤
     │ updateBooking.spec.ts        │ API-013 (25), API-014 (20)                                          │ High     │
     ├──────────────────────────────┼─────────────────────────────────────────────────────────────────────┼──────────┤
     │ partialUpdateBooking.spec.ts │ API-015 (25), API-016 (20)                                          │ High     │
     ├──────────────────────────────┼─────────────────────────────────────────────────────────────────────┼──────────┤
     │ createBooking.spec.ts        │ API-010 (25), API-011 (16), API-012 (9)                             │ High     │
     ├──────────────────────────────┼─────────────────────────────────────────────────────────────────────┼──────────┤
     │ auth.spec.ts                 │ API-002 (20), API-003 (12), API-004 (6)                             │ High     │
     ├──────────────────────────────┼─────────────────────────────────────────────────────────────────────┼──────────┤
     │ getBooking.spec.ts           │ API-006 (16), API-007 (16), API-008 (15), API-005 (12), API-009 (9) │ High     │
     ├──────────────────────────────┼─────────────────────────────────────────────────────────────────────┼──────────┤
     │ healthCheck.spec.ts          │ API-001 (10)                                                        │ Medium   │
     └──────────────────────────────┴─────────────────────────────────────────────────────────────────────┴──────────┘

     Key API quirks to handle

     - Token goes in Cookie header, NOT Authorization
     - DELETE returns 201 (not 204)
     - API resets every 10 min — tests must be self-contained

     ---
     Phase 4: CI/CD (GitHub Actions)

     - ui-tests.yml — push/PR trigger for src/ui/** + tests/ui/**. Installs chromium. Uploads HTML report.
     - api-tests.yml — push/PR trigger for src/api/** + tests/api/**. No browser install.

     ---
     Phase 5: Deferred — Atlassian Integration

     Once OAuth is resolved for abhiqalead.atlassian.net:
     1. Push Risk Matrix to Confluence
     2. Create 2 Jira Epics + Stories for High RPN scenarios
     3. Retroactively link branches/commits to Jira tickets

     ---
     Implementation Order

     1. Project scaffolding — npm init, deps, config, git init
     2. UI Page Objects — base.page.ts → bookStore.page.ts → bookDetails.page.ts
     3. UI Test Data — books.ts
     4. UI Test Specs — bookStore → search → bookDetails → navigation
     5. Run & validate UI tests
     6. API Types & Clients — types → base → auth → booking
     7. API Test Data — JSON files
     8. API Test Specs — healthCheck → auth → create → get → update → partialUpdate → delete → e2e
     9. Run & validate API tests
     10. CI/CD workflows
     11. README.md with AI usage notes

     Verification

     - npx playwright test --project=ui-tests — all UI tests green
     - npx playwright test --project=api-tests — all API tests green
     - npx playwright test — both suites pass together
     - npx playwright show-report — HTML report renders

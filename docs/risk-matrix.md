# Risk Matrix — Risk Based Testing (RBT)

## Methodology

**Risk Priority Number (RPN)** = Likelihood (L) × Impact (I)

| Score | Likelihood | Impact |
|-------|-----------|--------|
| 1 | Very Unlikely | Negligible |
| 2 | Unlikely | Minor |
| 3 | Possible | Moderate |
| 4 | Likely | Major |
| 5 | Very Likely | Critical |

**RPN Range:** 1–25

| Priority | RPN Range | Action |
|----------|-----------|--------|
| **High** | 15–25 | Must automate — highest risk, prioritize first |
| **Medium** | 8–14 | Should automate — moderate risk |
| **Low** | 1–7 | Nice to have — low risk, automate if time permits |

---

## Task 1 — DemoQA Book Store UI (Public Mode)

**Application URL:** https://demoqa.com/books
**Scope:** Public-facing features only. User registration, login, authentication, profile, and collection management are excluded.

| ID | Scenario | L | I | RPN | Priority |
|----|----------|---|---|-----|----------|
| UI-001 | Book Store page loads and displays all 8 books | 3 | 5 | 15 | **High** |
| UI-002 | Book table shows correct columns (Image, Title, Author, Publisher) | 2 | 4 | 8 | Medium |
| UI-003 | Each book row displays correct title, author, publisher | 3 | 5 | 15 | **High** |
| UI-004 | Search filters books by title keyword | 4 | 5 | 20 | **High** |
| UI-005 | Search filters books by author name | 4 | 4 | 16 | **High** |
| UI-006 | Search filters books by publisher name | 3 | 3 | 9 | Medium |
| UI-007 | Search with no matching results shows empty table | 3 | 3 | 9 | Medium |
| UI-008 | Clearing search box restores all books | 3 | 4 | 12 | Medium |
| UI-009 | Click book title navigates to book details page | 4 | 5 | 20 | **High** |
| UI-010 | Book details shows all fields (ISBN, Title, Sub Title, Author, Publisher, Pages, Description, Website) | 3 | 5 | 15 | **High** |
| UI-011 | Book details data matches the book clicked | 4 | 5 | 20 | **High** |
| UI-012 | Website link on book details is correct and clickable | 2 | 3 | 6 | Low |
| UI-013 | "Back To Book Store" button navigates back to book list | 3 | 4 | 12 | Medium |
| UI-014 | Pagination — rows per page selector works (5, 10, 20, 25, 50, 100) | 3 | 3 | 9 | Medium |
| UI-015 | Pagination — next/previous page navigation | 3 | 3 | 9 | Medium |
| UI-016 | Book titles are rendered as clickable links | 2 | 4 | 8 | Medium |

### Summary — Task 1

| Priority | Count | Scenario IDs |
|----------|-------|-------------|
| **High** | 7 | UI-001, UI-003, UI-004, UI-005, UI-009, UI-010, UI-011 |
| **Medium** | 7 | UI-002, UI-006, UI-007, UI-008, UI-013, UI-014, UI-015, UI-016 |
| **Low** | 1 | UI-012 |

---

## Task 2 — Restful Booker API

**Base URL:** https://restful-booker.herokuapp.com
**API Docs:** https://restful-booker.herokuapp.com/apidoc/index.html
**Scope:** All endpoints — Auth, Booking CRUD, Health Check. Positive and negative scenarios.

| ID | Scenario | L | I | RPN | Priority |
|----|----------|---|---|-----|----------|
| API-001 | GET /ping returns 201 (health check) | 2 | 5 | 10 | Medium |
| API-002 | POST /auth with valid credentials returns token | 4 | 5 | 20 | **High** |
| API-003 | POST /auth with invalid credentials | 3 | 4 | 12 | Medium |
| API-004 | POST /auth with missing fields | 2 | 3 | 6 | Low |
| API-005 | GET /booking returns array of booking IDs | 3 | 4 | 12 | Medium |
| API-006 | GET /booking filter by firstname/lastname | 4 | 4 | 16 | **High** |
| API-007 | GET /booking filter by checkin/checkout dates | 4 | 4 | 16 | **High** |
| API-008 | GET /booking/{id} returns correct booking details | 3 | 5 | 15 | **High** |
| API-009 | GET /booking/{id} with non-existent ID returns 404 | 3 | 3 | 9 | Medium |
| API-010 | POST /booking creates new booking successfully | 5 | 5 | 25 | **High** |
| API-011 | POST /booking with missing required fields | 4 | 4 | 16 | **High** |
| API-012 | POST /booking with invalid data types | 3 | 3 | 9 | Medium |
| API-013 | PUT /booking/{id} full update with valid token | 5 | 5 | 25 | **High** |
| API-014 | PUT /booking/{id} without token returns 403 | 4 | 5 | 20 | **High** |
| API-015 | PATCH /booking/{id} partial update with valid token | 5 | 5 | 25 | **High** |
| API-016 | PATCH /booking/{id} without token returns 403 | 4 | 5 | 20 | **High** |
| API-017 | DELETE /booking/{id} with valid token returns 201 | 5 | 5 | 25 | **High** |
| API-018 | DELETE /booking/{id} without token returns 403 | 4 | 5 | 20 | **High** |
| API-019 | DELETE /booking/{id} with non-existent ID | 3 | 3 | 9 | Medium |
| API-020 | E2E: Auth → Create → Read → Update → Partial Update → Delete → Verify deleted | 5 | 5 | 25 | **High** |
| API-021 | Data flow: POST creates booking → GET verifies created data matches | 5 | 5 | 25 | **High** |

### Summary — Task 2

| Priority | Count | Scenario IDs |
|----------|-------|-------------|
| **High** | 13 | API-002, API-006, API-007, API-008, API-010, API-011, API-013, API-014, API-015, API-016, API-017, API-018, API-020, API-021 |
| **Medium** | 6 | API-001, API-003, API-005, API-009, API-012, API-019 |
| **Low** | 1 | API-004 |

---

## Next Steps

1. Push this Risk Matrix to Confluence once Atlassian auth is resolved
2. Create Jira Epics and Stories for High RPN scenarios
3. Begin implementation starting with Task 1 (UI Automation)

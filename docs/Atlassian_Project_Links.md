These links are private and only the admin can view them.
They are maintained here for quick reference and demo purposes.

Important Links:

- **Confluence Risk Matrix:** https://abhiqalead.atlassian.net/wiki/x/AYAV
- **Jira Product Discovery:** https://abhiqalead.atlassian.net/jira/polaris/projects/MDP/ideas/view/12108020
- **RPN scoring template:** https://abhiqalead.atlassian.net/jira/polaris/projects/MDP/ideas/view/12108021

> The Atlassian workspace is private. Local copies of the same artifacts (Confluence PDFs, Frontend Impact Assessment screenshots, RBT framework) are available in [`docs/`](docs/) for reviewers without Atlassian access. The full Risk Matrix is also mirrored as Markdown at [`docs/risk-matrix.md`](docs/risk-matrix.md).

### Ticketing & sprint flow

Every identified scenario became a **Jira ticket** in the backlog, tagged with its RPN score. Tickets were then pulled into the active sprint in RPN order - highest risk first. This ensured that if time ran out, the most critical coverage was already in place.

- **Jira Sprint Board:** https://abhiqalead.atlassian.net/jira/software/projects/COR/boards/1
- **Jira Backlog:** https://abhiqalead.atlassian.net/jira/software/projects/COR/boards/1/backlog
- **Ticket prefix:** `COR-XX` (COR for Corto, XX for ticket number)

### Development workflow

Each Jira ticket followed a strict branch-per-ticket, PR-per-ticket workflow:

1. Create a feature branch off `main` named after the Jira ticket (e.g., `cor-27-get-booking-filter-by-name`)
2. Implement the test(s) for that single ticket - no bulk-implementing multiple tickets on one branch
3. Open a Pull Request referencing the Jira ID in the title
4. Code review (self-review + automated review - see AI disclosure below)
5. Merge to `main` once the PR is approved and CI passes
6. Transition the Jira ticket to Done

This gave full traceability: every commit, PR, and test in the codebase can be traced back to a Jira ticket, which can be traced back to a Risk Matrix entry, which can be traced back to a real user-facing scenario.

### Tooling summary

| Tool               | Purpose                                               |
| ------------------ | ----------------------------------------------------- |
| **Confluence**     | Risk Matrix (RBT), documentation                      |
| **Jira**           | Scenario tracking, sprint planning, traceability      |
| **Playwright**     | Test framework for both UI and API Automated testing  |
| **Postman**        | Manual API prototyping and exploration                |
| **GitHub**         | Source control, branch-per-ticket, PR reviews         |
| **GitHub Actions** | CI pipeline - UI and API test suites as parallel jobs |
| **GitHub Pages**   | Public hosting of the live test reports dashboard     |
| **CodeRabbit**     | Automated PR code review (GitHub plugin)              |
| **CodeQL**         | Automated security scanning on every PR               |

---

## Bugs found

The automated test suite surfaced the following genuine defects in the Restful Booker API during test development. Each was filed as a Jira bug ticket with steps to reproduce, expected vs. actual behavior, and impact analysis.

| #   | Endpoint        | Defect                                                      | Expected          | Actual                                        | Impact                                                                         | Ticket                                                   |
| --- | --------------- | ----------------------------------------------------------- | ----------------- | --------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------- |
| 1   | `POST /booking` | Numeric values in `firstname` / `lastname` crash the server | `400 Bad Request` | `500 Internal Server Error`                   | Missing input validation; potential stack-trace leakage on unhandled exception | [COR-29](https://abhiqalead.atlassian.net/browse/COR-29) |
| 2   | `POST /booking` | Invalid date formats are accepted and persisted             | `400 Bad Request` | `200 OK` (booking created with corrupt dates) | Corrupt data in storage; downstream consumers (reports, calendars) will break  | [COR-30](https://abhiqalead.atlassian.net/browse/COR-30) |
| 3   | `POST /booking` | Non-numeric `totalprice` is accepted and persisted          | `400 Bad Request` | `200 OK` (booking created with invalid price) | Risk of incorrect billing and reporting errors downstream                      | [COR-31](https://abhiqalead.atlassian.net/browse/COR-31) |

These bugs were not seeded or contrived - they were discovered organically while writing the negative test scenarios driven by the Risk Matrix. This demonstrates the real value of RBT-driven automation: the process itself surfaces defects that pure happy-path coverage would never find.

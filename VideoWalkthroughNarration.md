# Project Walkthrough — Narration Script

> **Format key:**
> _[Brackets]_ = stage directions: what to show on screen, what to click, what to highlight
> **Bold** = the key message of that beat — if you forget the exact words, just hit the bold idea
> Plain text = the conversational narration. Read it once or twice but **don't memorize it word-for-word** — the goal is to internalize the *flow*, then say it in your own voice.
>
> **Target runtime:** ~7–8 minutes of scripted content, leaving 2–3 minutes for natural off-script asides, deeper dives, or follow-up explanations. Total ceiling: **10 minutes.**

---

## 0:00 – 0:45 · Hook & framing

_[Webcam full-screen or large overlay. Friendly, calm energy. Smile.]_

Hey, I'm Abhi. Thanks for taking the time to review my submission.

So before I jump in — a quick note on how I approached this. The take-home only really asks for the coding part, but since I'm applying for a **Lead QA Engineer** role, I wanted to treat this the way I'd actually treat a real piece of work in a team. Which means: not just the tests, but the *thinking* behind them — the planning, the prioritization, the process, the reporting. The goal of the next few minutes is to walk you through all of that, end to end.

I'll keep it tight — about ten minutes — and I'll show you everything live, not just the code.

_[Pause. Maybe a small smile. Switch scene.]_

Alright, let's jump in.

---

## 0:45 – 1:30 · Discovery & scope

_[Switch to browser. Open the two target apps in side-by-side tabs: DemoQA Book Store and Restful Booker docs.]_

So there are two applications in scope here. On the UI side, there's the **DemoQA Book Store** — a simple book catalogue with search, filtering, and book detail pages. On the API side, there's **Restful Booker** — a hotel booking API with full CRUD, an auth flow, and a few endpoints around partial updates.

The first thing I did, even before opening any code, was just *use* both apps. I clicked around. I tried to break things. I sent some requests in Postman. **I wanted to actually understand what I was about to test before I wrote a single line of automation.**

A scope decision I made early: I left out the user registration and login flows on the UI side. Those weren't critical to the core book store experience, and the take-home gave me permission to drop them, so I focused my effort on the public-facing features that matter most to a real user.

---

## 1:30 – 3:00 · Risk-Based Testing (the differentiator)

_[Switch to Confluence. Open the Frontend Impact Assessment page first.]_

Okay so this is where I want to spend a bit of extra time, because this is where I think I differ from how most people would approach this kind of take-home.

**Instead of jumping straight into writing tests, I ran this through a proper Risk-Based Testing exercise.**

So in the first pass — _[show the FIA page]_ — I just brain-dumped every scenario I could think of for both applications. No prioritization, no scoring. I just wanted to capture everything: happy paths, edge cases, validation rules, error conditions, the lot.

In a real team setting, this would actually be a one-hour session with developers, product, and other QAs. You always catch things in a group that you'd miss solo. I'd typically run this as the first of two sessions, a week apart from the second one.

_[Switch to the Confluence Risk Matrix page.]_

Then in the second pass, I scored each scenario on two axes — **Likelihood** of failure and **Impact** if it fails — both on a one-to-five scale. Multiply them together and you get the **Risk Priority Number**, the RPN. _[Scroll through the matrix, point at the highest-RPN rows.]_

The high-RPN items at the top — these are what I automated first. The lower ones got deferred. **The whole point is: when you're working under a time constraint, you want to be sure that when time runs out, the most valuable coverage is already in place.**

I deliberately kept this lean — just two factors, no Detectability axis — because for a small project with a solo tester, more dimensions just slow you down without adding signal.

---

## 3:00 – 3:45 · Jira flow & sprint planning

_[Switch to Jira. Open the backlog view.]_

Once the Risk Matrix was scored, every scenario became a Jira ticket. _[Scroll the backlog.]_ I organized them into three Epics — Test Framework Setup, UI Automation, and API Automation — and pulled them into the sprint in RPN order. Highest risk first.

_[Click into one ticket — ideally one of the UI search tests.]_

Each ticket has a clear description, acceptance criteria, and a link back to the Risk Matrix entry it came from. **So there's full traceability** — every test in this codebase can be traced back to a ticket, which can be traced back to a risk score, which can be traced back to a real user-facing scenario.

_[Switch to the Sprint board view briefly. Point at the columns.]_

And every ticket followed the same workflow — branch, PR, review, merge, transition. One ticket, one branch, one PR. No bulk-implementing. Each piece of work is small, reviewed, and traceable.

---

## 3:45 – 5:30 · Code walkthrough (UI + API)

_[Switch to VS Code. Open the project folder. Show the file tree on the left.]_

Okay let me show you the code. I'll keep this fast — I just want to highlight a few decisions, not read every file.

_[Open `src/ui/pages/bookStore.page.ts`.]_

On the **UI side**, I followed the **Page Object Model**. Every page has its own class — the locators and the interactions live there, and the test specs only handle assertions. So the test files focus on *what* is being tested, and the page objects focus on *how* to interact with the app. _[Scroll briefly through the file.]_

_[Open `tests/ui/searchByTitle.spec.ts` to show how it consumes the page object.]_

And the tests use **custom Playwright fixtures** — _[open `src/ui/fixtures/index.ts`]_ — so I never have to manually instantiate page objects in every test. That keeps the spec files really clean.

_[Switch to `src/helpers/Restful-booker.postman_collection.json` or open it in Postman if you have it set up.]_

For the **API side**, this is something I always do — I prototype every endpoint manually in **Postman first**, before writing a single automated test. _[If Postman is open, show the collection running.]_ It lets me visualize the data flow, catch quirks early, and basically build a contract in my head before I encode it in tests. This collection in the repo is the actual blueprint I built the automated tests from.

_[Open `tests/api/createBooking-negative.spec.ts`.]_

Then once I knew the API behaviour cold, I automated it. **All the negative scenarios are data-driven** — _[show the test.describe loop over the payload array]_ — so if I want to add another invalid input, it's a one-line change.

_[Open `tests/api/e2e-flow-CRUD-happy-path.spec.ts`.]_

And there's an end-to-end CRUD flow spec that chains POST, GET, PUT, PATCH, DELETE, and a final GET-404 — all on the same booking, passing IDs and field values between steps. **This validates not just individual endpoints, but the integrity of the data as it flows through the entire system.**

---

## 5:30 – 6:30 · The bugs I found (proof of value)

_[Switch to Jira. Open the bug tickets COR-29, COR-30, COR-31. Or open the Bugs Found section of the README.]_

Now — this is the part I'm actually most proud of.

While I was writing the negative test scenarios driven by the Risk Matrix, **I uncovered three real defects in the Restful Booker API.** These weren't seeded, they weren't contrived — they came out organically because the negative tests were *designed to find them*.

_[Click into COR-29.]_

The first one — sending a numeric value where the API expects a string for `firstname` or `lastname` — instead of returning a 400 Bad Request, the server crashes with a 500. That means missing input validation, and worse, potential stack-trace leakage on the unhandled exception.

_[Click into COR-30 briefly.]_

The other two are similar — invalid date formats and non-numeric prices both get accepted with a 200 OK instead of being rejected. Which means corrupt data ends up in the system.

**This is the real value of risk-based negative testing.** You can write a hundred happy-path tests and they'll all pass because the API works fine on the happy path. It's only when you systematically attack the edges — the way RBT pushes you to — that you start finding the things that actually matter.

---

## 6:30 – 7:30 · CI/CD & caching

_[Switch to VS Code. Open `.github/workflows/playwright.yml`.]_

Alright, CI/CD. _[Scroll through the workflow file.]_

The pipeline runs the UI and API suites as **two parallel jobs** on every push to main. Where I want to draw your attention is the **caching strategy** — _[scroll to the cache steps]_ — because honestly this is where most CI pipelines either help you ship or make you dread waiting on them.

I'm caching three things: the **pnpm store**, so dependencies don't re-download. The **Playwright browser binaries**, which is the biggest win — that's about 200 megabytes of Chromium that gets skipped entirely on cache hits. And the **cache key includes the exact Playwright version** _[point at the key]_, so if I bump Playwright, the cache automatically invalidates and pulls fresh binaries. No manual cache busting, no stale-cache debugging.

_[Switch to GitHub Actions UI. Open the "Run workflow" dropdown for the playwright workflow.]_

I also added a **manual workflow dispatch** — anyone on the team can come here and trigger a run on demand. _[Show the dropdown inputs.]_ You can pick which project to run — UI only, API only, or both — and you can even pass a tag filter if you only want to run, say, the negative tests.

---

## 7:30 – 8:45 · Live test reports on GitHub Pages

_[Switch to a browser tab open at the GitHub Pages dashboard URL.]_

And then for reporting — _[show the landing page]_ — I publish the test results to **GitHub Pages** on every push to main.

The default Playwright HTML report is great, but it's normally trapped inside a CI artifact that someone has to download and unzip. **By publishing it to Pages, anyone with the link can see the latest results in a browser, no clone, no setup.**

_[Click the UI Tests card.]_

You get the full Playwright HTML report — all the test results, the traces, the screenshots, the videos, the time-travel debugging. _[Click into one passing test, show the trace viewer briefly.]_ This is the real Playwright report, not a stripped-down version.

_[Go back, click the API Tests card.]_

Same on the API side. _[If there's a failed test visible, click into it and show the assertion error.]_

So the moment a test fails on main, I can come here, see exactly what failed, see the request, see the response — without ever leaving the browser.

---

## 8:45 – 9:30 · What I'd do next (forward-looking)

_[Optional: show the README's "Further enhancements" section, or just speak to camera.]_

If I were taking this further as a real production project, the things I'd add next are: **RPN-based test tagging** so CI can run high-risk tests on every PR and the full suite nightly; **cross-browser testing** with Firefox and WebKit; **visual regression** for the critical UI flows; and a **Slack integration** so failures actually surface to the team in real-time, not just on a dashboard nobody checks.

But for the scope of this take-home, I deliberately stopped at the MVP and instead invested that time in the parts that I think are higher-leverage — the risk-based planning, the bug discovery, the reporting, and the developer experience.

---

## 9:30 – 10:00 · Close

_[Switch back to webcam full-screen. Smile, relax.]_

So that's the project. To recap quickly: I started with risk-based planning, prioritized scenarios by RPN, automated them in Playwright using POM and data-driven patterns, found three real bugs in the process, set up a parallel-job CI pipeline with aggressive caching and manual dispatch, and published the results live on GitHub Pages.

**My goal was to show that the way I approach testing isn't just "write code that runs" — it's about understanding risk, communicating value, and building things that a team can actually maintain.**

Thanks so much for watching. I'd love to walk through any of this in person — happy to go deeper on the architecture, the bugs, the CI strategy, or anything else you're curious about.

_[Small wave. End.]_

---

## Notes for delivery

- **You don't need to hit every word.** Use the bold lines as your "must say this" anchors. Everything else, paraphrase.
- **Pause between sections.** Even a one-second silence feels long when you're recording, but it's gold for the viewer — it gives them time to process.
- **If you stumble, don't stop.** Self-correct and keep going. "Sorry, let me say that again" sounds way more human than a perfect take.
- **Drink water before the take.** Not during. Dry mouth is the enemy.
- **One take is fine.** If you mess up badly in the first 30 seconds, restart. Otherwise, keep rolling.
- **The 10-minute limit is a ceiling, not a target.** If you finish in 8:30, that's a *win*, not a failure.
- **Energy matters more than perfection.** Sound interested in your own work. The hiring manager can tell.

## What to have open before you hit record

A pre-flight checklist so you're not fumbling on camera:

1. ✅ **Confluence** — FIA page in tab 1, Risk Matrix in tab 2
2. ✅ **Jira** — Backlog view in tab 3, Sprint board in tab 4, COR-29 bug ticket in tab 5
3. ✅ **VS Code** — corto-qe project open, key files pinned: `bookStore.page.ts`, `searchByTitle.spec.ts`, `fixtures/index.ts`, `createBooking-negative.spec.ts`, `e2e-flow-CRUD-happy-path.spec.ts`, `playwright.yml`
4. ✅ **Postman** — Restful Booker collection imported and authenticated (optional but powerful if you can show one request running live)
5. ✅ **Browser** — GitHub Actions runs page in tab 6, GitHub Pages dashboard in tab 7
6. ✅ **OBS** — scenes ready: webcam-full, screen-with-webcam-corner, screen-only
7. ✅ **Audio** — mic tested, levels checked, notifications muted
8. ✅ **Clean desktop** — close Slack, email, anything personal that might pop up
9. ✅ **Window arrangement** — VS Code and browser positioned where you want them; don't drag windows around on camera
10. ✅ **A glass of water** — not on camera, just nearby

Plan Phase: FamilySpace Calendar Feature
Objectives

Main Goal: Develop a shared family calendar page (/calendar) in Nuxt 3, featuring month-view event creation, invites, and RSVPs, using manual Firebase CRUD for data handling and FullCalendar for UI—ensuring seamless Tailwind integration without real-time overhead.
Success Metrics:

Functional MVP: Users can create/view/edit events in month view; invite family members; update RSVPs (yes/no/maybe) with manual refresh.
Performance: Page loads <3s; mobile-responsive (Lighthouse score >85 on mobile).
Security: Events scoped to familyId; no unauthorized access via Firestore rules.
Usability: Cozy, icon-rich design (e.g., 🎉 badges for RSVPs) matching main page warmth.

Step-by-Step Roadmap

StepDescriptionDependenciesTimeline (from Oct 03, 2025)RisksMitigations1Setup Dependencies & Basic Structure

- Install FullCalendar Vue3 wrapper.
- Create /pages/calendar.vue with Tailwind layout (header with family name, month picker).
- Extend auth store to fetch/load family members for attendee lists.Existing Nuxt config, Firebase plugins, auth store.Day 1 (Oct 03)Tailwind purge skips classes.Update tailwind.config.js with FullCalendar paths; test inline classes.2Define Events Schema & Firestore Setup
- Create events subcollection under families/{familyId}.
- Schema: `{ title: string, startDate: timestamp, attendees: array[userIds], rsvps: map{userId: 'yes''no''maybe'}, color: string, createdAt: timestamp }.<br>- Add manual CRUD utils (e.g., addEvent, getEventsByRange, updateRSVP`).
- Set Firestore rules for family-only access.Research schema; Firebase utils.Day 1-2 (Oct 03-04)3Implement Calendar UI & Views
- Integrate FullCalendar in /calendar.vue: Month view with event slots (badges for RSVPs).
- Add event modal (create/edit) with form: title, date picker, attendee checkboxes.
- Mobile-first: Swipe nav, touch taps; Tailwind responsive.Step 1 libs; Tailwind setup.Day 2-3 (Oct 04-05)Event rendering mismatches theme.Custom CSS for icons/colors; mobile dev tools preview.4Add Event Creation & Invites
- On create: Save via manual addDoc, populate attendees/rsvps.
- Invites: Checkbox select from members; update array on save.
- Fetch: Manual query on load/refresh for events.Steps 2-3; Pinia for form state.Day 3-4 (Oct 05-06)Stale data on multi-user edits.Add pull-to-refresh (e.g., via useFetch on focus); optional polling.5Implement RSVPs & Interactions
- RSVP buttons per event: Manual updateDoc on rsvps map; refresh list.
- Edit/delete with admin check from auth.Step 4; Permissions from store.Day 4 (Oct 06)Atomic update failures.Use transactions for rsvps; error toasts.6Testing & Polish
- Unit: CRUD with Vitest.
- E2E: Event create/RSVP flow.
- Polish: Auto-birthday events; offline warnings.All prior.Day 5 (Oct 07)Mobile gesture bugs.Emulate iOS/Android; touch event tests.7Deployment & Monitoring
- Deploy to Vercel; monitor Firebase reads.
- Add nav link from dashboard.Nuxt scripts.Day 6 (Oct 08)Unexpected read costs.Set budgets in console; log queries.
  Total Timeline: 1 week for MVP (iterative).
  Resources Needed

Tools/Libs: npm i @fullcalendar/vue3 fullcalendar (add to package.json).
Dev Environment: Nuxt dev; Firebase console for indexes/rules.
Assumptions: Manual fetches suffice (no real-time); free tier ok for <100 ops/day.
Team: Solo; Git for backups.

Next: Implementation Triggers

Start when: Libs installed, schema confirmed.
Post-Plan: "Based on plan.md, implement Step 1: [details]."

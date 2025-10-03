Research Phase: FamilySpace Calendar Feature
Key Findings
Vue/Nuxt Calendar Libraries

Recommended Libraries: For Nuxt 3/Vue 3 with Tailwind compatibility (avoiding Nuxt UI due to reported conflicts with Tailwind purging and scoped styles), prioritize FullCalendar with its official @fullcalendar/vue3 wrapper—it's robust for month/week/day views, event rendering (dots, badges for RSVPs), drag-and-drop, and seamless Tailwind integration via custom CSS classes (e.g., event colors matching family themes). Alternatives include Syncfusion Vue Calendar (free community edition for basic date selection and scheduling, under 50KB gzipped, with Tailwind overrides) and vue3-datepicker (lightweight for month grids, easy event overlays, mobile-optimized with touch swipes). Custom builds using date-fns + Tailwind CSS grids (as in NextJS adaptations) are viable for full control but add dev time. Skip heavier options like PrimeVue if not using Vuetify.
Pros/Cons: FullCalendar excels in event-heavy apps (invites/RSVP props via eventContent), responsive out-of-box (<10KB core), but requires manual Tailwind theming for icons (e.g., 📅). Syncfusion offers built-in accessibility (ARIA for family sharing) and low overhead, con: Less flexible for deep customizations. vue3-datepicker is ultra-light (5KB) for mobile-first, but lacks advanced scheduling—ideal starter. All align with Composition API and Pinia; install via npm i @fullcalendar/vue3 fullcalendar and wrap in <FullCalendar> for SSR-safe Nuxt pages.
Integration Notes: Use Tailwind's @apply in global CSS (not scoped) for overrides; test purge with content: ['./**/*.vue'] in tailwind.config.js to avoid "unknown class" errors. Community examples show Nuxt 3 setups with no conflicts when modules are ordered (Tailwind first).

Firebase Integration (Non-Real-Time)

Core Approach: Leverage the standard Firebase SDK for manual CRUD operations—use addDoc/setDoc for event creation, getDocs with queries (e.g., where('startDate', '>=', startMonth)) for fetching month-view data on load/refresh, and updateDoc for RSVPs/invites. No listeners like onSnapshot() to skip real-time overhead; instead, trigger refetches via Pinia actions (e.g., on modal close or page focus) for updates. This fits free tier (pay-per-read/write, ~$0.06/100K ops) without persistent connections, using your existing plugins/firebase.js for auth/db imports. Tutorials emphasize composables like useEventQuery(familyId, dateRange) for scoped fetches.
Pros/Cons: Simpler setup (no extra modules like VueFire), offline via SDK caching, and cost-predictable for low-traffic family apps (e.g., <50 events/month). Handles date ranges efficiently with composite indexes (create in console for startDate + familyId). Con: No auto-sync—users must refresh/pull-to-refresh for changes; mitigate with manual polling (e.g., every 5min via setInterval in mounted hook). Builds directly on your auth store for familyId filtering.
Setup Fit: Extend utils like addEvent with getEventsByRange; query subcollections families/{familyId}/events for privacy.

Mobile-First UI/UX Best Practices

Family-Specific Design: Focus on thumb-friendly interfaces: Infinite-scroll month swipes (horizontal for navigation), one-tap event creation with auto-suggest (e.g., "Birthday" from family profiles), and subtle indicators like stacked avatars or emoji badges for RSVPs (yes=🟢, no=🔴). Use progressive disclosure—tap day for agenda popover with invites list; support dark mode toggles for evening planning. For 2025 trends, integrate voice input for quick adds (via Web Speech API) and haptic feedback on RSVPs. Ensure 48px min touch targets, semantic colors (e.g., warm oranges for family events), and accessibility (screen reader labels for dates).
Pros/Cons: Boosts retention with intuitive flows (e.g., Cozi-inspired shared lists under calendar); scales to multi-device (sync on app open). Challenge: Overloading small screens—limit to 3-5 events/day view; test on iOS/Android emulators for gesture conflicts. Aim for Core Web Vitals: LCP <2.5s via lazy-loaded grids.
Inspirations: Draw from Fantastical (gesture-based editing) and Google Calendar (mobile-first ranges); prioritize family flows like role-based filters (parents see all, kids see fun events only).

Feature Benchmarks from Similar Apps

Event Invites & RSVPs: Emulate Cozi/OurCal with form-based invites (checkbox family members, auto-populate attendees array) and status maps in Firestore for atomic updates. OSS like Radicale (CalDAV) shows simple yes/no/maybe tracking without servers; add export to iCal for cross-app sharing. No recurring per spec—focus on one-off family milestones (e.g., auto-birthday inserts from profiles).
Pros/Cons: Scales to your 10+ member arrays via queries; keeps lightweight (no chat). Con: Manual notifications—use Firebase Cloud Messaging (free) for push on RSVP changes, triggered via functions.

Security for Private Family Events

Rules Structure: Subcollection families/{familyId}/events/{eventId} with rules: allow read, write: if request.auth.uid in get(/databases/$(database)/documents/families/$(familyId)).data.members[*].userId; for family-only CRUD. For RSVPs: allow update: if request.auth.uid in resource.data.attendees && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['rsvps.' + request.auth.uid]); (atomic own-status only). Enable App Check to block unauthorized clients; use UID validation on writes.
Pros/Cons: Ironclad privacy (no leaks beyond members), emulator-testable locally. Con: Rules complexity—use Firebase's simulator for multi-user scenarios; monitor via console audits. Integrates with your auth for role-based extras (e.g., admin deletes).

Overall Feasibility

MVP in 1 week: FullCalendar + manual Firestore fetches, Tailwind for cozy mobile UI. Low cost/risk, leveraging your models; start with stub fetches for proof-of-concept.

Sources

Vue Libraries: Syncfusion Calendar , FullCalendar Vue3 [implied in searches, e.g., web:6 adaptations], vue3-datepicker [web:2 Reddit].
Firebase: Manual CRUD Tutorials [web:33, web:36], StackOverflow Non-VueFire .
UI/UX: Eleken Calendar UIs , Justinmind Best Practices , Mobile-First 2025 , Time Picker Trends .
Features: Cozi/OurCal Benchmarks [web:19 YouTube, web:12].
Security: Firebase Best Practices , Rules Get Started , Security Tips [web:25, web:27 Reddit].

Gaps/Questions

Events Schema: Confirm {title, startDate (ISO), attendees: [userIds], rsvps: {userId: 'yes/no/maybe'}} under families subcollection?
Deep-Dive: Screenshots from Cozi for RSVP UI?
Testing: Pull-to-refresh UX for non-real-time updates?

# Avram Kids · Agent Operating Contract

## Product
Avram Kids is a mobile-first booking and operations application for children's event equipment hire in Gaborone, Botswana.

## Roles
- Product owner / final reviewer: user
- Technical navigator + implementation: ChatGPT through repository tooling
- No Codex dependency for this project

## Workflow
START → BUILD → VERIFY → CHECKPOINT → CONTINUE/RECOVER.

Golden rule: **Unexpected result = STOP → inspect reality → then act.**

## Immediate product priority: usable first
Do not overbuild the marketing site while the business workflow is still missing. Development order is:
1. Public customer experience: browse real equipment → booking request.
2. QA operations workspace: `/admin` must let the owner inspect booking requests, update statuses, review the equipment catalogue, and manage QA specials.
3. Shared persistence: move bookings, catalogue, specials and operational state from browser QA storage into Firebase-backed data with appropriate security.
4. Authentication: add proper admin authentication after the workflow is proven usable. Authentication is not a blocker for QA.
5. Operational refinement: availability/calendar, confirmed jobs, event-day workflow, customer communication, and reporting only as justified by the real workflow.

The existing AdminHub `/admin` experience may be used as a temporary reference/QA pattern. Do not modify the separate AdminHub project from this repository.

## Current QA mode
The current `/admin` workspace is intentionally usable without authentication for QA. It uses browser-local storage for booking requests and specials. This is explicitly temporary and must never be described as production/shared persistence.

QA journey:
Customer `/` → choose equipment → `/book` → submit request → `/admin` in the same browser → inspect request → update status → test WhatsApp/call actions.

The QA admin also exposes the current real 11-item equipment catalogue and a local specials editor. Do not invent real prices, promotions, availability, certifications, guarantees, confirmed bookings, or unsupported service claims.

## Public funnel
The public site should clearly present:
- Avram Kids brand
- Jumping Castles
- Water Slides / Slip 'n Slides
- Active Play / Interactive Games only where supported by the actual business offering
- current real equipment and supplied prices/sizes
- specials/packages area without fabricated offers
- booking route at `/book`
- direct WhatsApp / phone / email contact

Use the supplied Avram equipment/pricing as the source of truth. Custom event packages can be requested but must not be fabricated.

## Booking
`/book` collects customer name, phone, optional email, event date, event location, offering, quantity, event type and notes. A submitted QA request is stored locally under the versioned browser key `avram_booking_requests_v1` so `/admin` can inspect it in the same browser.

Until verified shared persistence is implemented, never imply that a browser-local request is visible to Avram from another device/browser. Never fake a Firebase write, confirmed availability, payment transaction, or Google OAuth flow.

## Admin system
The admin system is a first-class product surface, not an afterthought. Build it around the actual owner workflow:
- incoming requests
- request detail
- status lifecycle: New → Contacted → Confirmed → Completed / Cancelled
- event date/location/equipment/customer details
- direct contact actions
- equipment catalogue visibility
- specials/content management
- later: shared Firebase data, authentication, availability and calendar operations

Prefer the smallest workflow that makes the business usable. Do not turn Avram into a generic ERP.

## Data and Firebase
Firebase configuration is environment-driven and belongs to the Avram Kids Firebase project (`avram-kids`). Never reuse Translend Firebase identifiers or credentials. Never expose secrets or commit `.env.local`.

When moving from QA storage to Firebase, design security first: public customers may create the minimum booking-request data required; private operational/admin reads and writes must not be exposed anonymously. Do not weaken Firestore rules simply to make a demo work.

## Scope discipline
Do not add accounting, payroll, fleet management, routing, AI chatbot, customer accounts, fake payments, fake Google login, or unnecessary dependencies. Preserve useful Next.js, Firebase, error-boundary, TypeScript, PWA, Analytics and Speed Insights foundations where genuinely useful.

No Translend terminology may remain in active Avram UI, metadata, routes, navigation, or user-facing error messages.

## Quality gates
Before declaring a checkpoint, run and pass:
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

Do not suppress errors. Review the diff and git status before checkpointing. A deployment being READY is useful evidence, but it does not replace application QA.

## Recovery reporting
When continuing work, report:
- current branch
- current commit
- git status
- last verified checkpoint
- what works
- what remains
- next controlled action

## Separation rule
This repository is Avram Kids. Never modify Translend, AdminHub, PurePress, or any other project while working here.

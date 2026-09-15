# Avram Kids · Agent Operating Contract

## Product
Avram Kids is a mobile-first booking and operations application for children's event equipment hire in Gaborone, Botswana.

The core product goal is operational relief: customers should be able to see the real equipment, understand the booking path, submit one complete request online, and leave the owner with an organized queue of qualified requests rather than another stream of repetitive WhatsApp conversations.

## Roles
- Product owner / final reviewer: user
- Technical navigator + implementation: ChatGPT through repository tooling
- No Codex dependency for this project

## Workflow
START → BUILD → VERIFY → CHECKPOINT → CONTINUE/RECOVER.

Golden rule: **Unexpected result = STOP → inspect reality → then act.**

## Immediate product priority: usable first
Do not overbuild the marketing site while the business workflow is still missing. Development order is:
1. Public customer experience: browse real equipment → complete booking request.
2. Owner operations workspace: `/admin` must organize incoming requests, show complete event briefs, update statuses, review the equipment catalogue, and manage real specials/content.
3. Shared persistence: move bookings, catalogue, specials and operational state from browser-local implementation storage into Firebase-backed data with appropriate security.
4. Authentication: add proper admin authentication after the workflow is proven usable. Authentication is a security layer, not a reason to expose unfinished implementation details in the customer experience.
5. Operational refinement: availability/calendar, confirmed jobs, event-day workflow, automated customer notifications and reporting only as justified by the real workflow.

The existing AdminHub `/admin` experience may be used as a temporary reference for authentication patterns. Do not modify the separate AdminHub project from this repository.

## Current product state
The user is testing the actual Avram Kids product as the final reviewer. The product itself must never be presented as a QA build, QA mode, demo, or test app.

The current `/admin` workspace is the real Avram Kids Operations surface. It is intentionally usable without authentication while the owner workflow is being established. Browser-local storage is a temporary implementation detail and must not be exposed as the product identity or falsely described as shared production persistence.

Current customer-to-owner journey:
Customer `/` → browse real equipment/prices → `/book` → submit one complete event request → request is organized in `/admin` → owner reviews qualified requests → owner contacts only the requests she is ready to handle → status moves through the booking lifecycle.

The booking form should collect enough information to prevent the owner from having to repeat basic qualification questions in WhatsApp: customer name, phone, optional email, event date, event start time, location, equipment, quantity, estimated guests, event type and optional notes.

The public site should make online booking the primary action. WhatsApp and phone may remain as secondary contact routes, but they must not be the primary workflow or encourage customers to duplicate a website request in chat.

## Public funnel
The public site should clearly present:
- Avram Kids brand
- Jumping Castles
- Water Slides / Slip 'n Slides
- Active Play / Interactive Games only where supported by the actual business offering
- current real equipment and supplied prices/sizes
- specials/packages area without fabricated offers
- booking route at `/book`
- clear explanation that customers submit their complete event request online
- secondary contact details without making manual messaging the booking system

Use the supplied Avram equipment/pricing as the source of truth. Custom event packages can be requested but must not be fabricated.

## Booking
`/book` is a structured lead-capture and booking-request workflow, not an instant-confirmation system. It collects the information required for the owner to review a request without beginning another questionnaire in WhatsApp.

A submitted request receives a reference and is stored under the versioned browser key `avram_booking_requests_v1` so the current operations surface can inspect it in the same browser.

Until verified shared persistence is implemented, never imply that a browser-local request is visible to Avram from another device/browser. Never fake a Firebase write, confirmed availability, payment transaction, automated WhatsApp message, email delivery, or Google OAuth flow.

Customer-facing copy must not expose internal implementation language such as QA storage, Firebase-next, authentication-next, browser-only persistence, or development limitations. It must remain truthful: a request is not a confirmed booking until Avram checks availability and confirms it.

## Owner operations
The admin system is a first-class product surface, not an afterthought. Build it around the actual owner workflow:
- incoming booking requests
- complete event brief at a glance
- qualified/ready-to-review indication based on required information
- filters for the requests that need attention and upcoming work
- request status lifecycle: New → Contacted → Confirmed → Completed / Cancelled
- event date/time/location/equipment/quantity/guest count/customer details
- direct contact actions only from an owner-reviewed request
- equipment catalogue visibility
- specials/content management
- later: shared Firebase data, authentication, availability and calendar operations

The purpose is to let the owner focus on the business and respond to organized, qualified leads when she chooses, rather than manually collecting the same details from scattered messages.

Owner-only destructive/testing controls may exist during development, but use product language such as `Clear requests`, never `Reset QA data`.

## Data and Firebase
Firebase configuration is environment-driven and belongs to the Avram Kids Firebase project (`avram-kids`). Never reuse Translend Firebase identifiers or credentials. Never expose secrets or commit `.env.local`.

When moving from local implementation storage to Firebase, design security first: public customers may create the minimum booking-request data required; private operational/admin reads and writes must not be exposed anonymously. Do not weaken Firestore rules simply to make a demo work.

## Scope discipline
Do not add accounting, payroll, fleet management, routing, AI chatbot, customer accounts, fake payments, fake Google login, or unnecessary dependencies. Preserve useful Next.js, Firebase, error-boundary, TypeScript, PWA, Analytics and Speed Insights foundations where genuinely useful.

No Translend terminology may remain in active Avram UI, metadata, routes, navigation, or user-facing error messages.

## Quality gates
Before declaring a checkpoint, run and pass:
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

Do not suppress errors. Review the diff and git status before checkpointing. A deployment being READY is useful evidence, but it does not replace application QA by the product owner.

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

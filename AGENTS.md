# Avram Kids · Agent Operating Contract

## Product
Avram Kids is a mobile-first booking and operations application for children's event equipment hire in Gaborone, Botswana.

The core product goal is operational relief: customers should see real equipment, prices and specials, submit one complete request online, and leave the owner with an organized queue of qualified requests rather than another stream of repetitive WhatsApp conversations.

The owner must be able to run the public catalogue without developer help: change equipment names/descriptions/sizes/prices, replace equipment images, hide/show items, add/remove equipment, and publish/retire specials and sale messaging. Customer-facing content must always come from the current managed catalogue, not hard-coded duplicate data.

## Roles
- Product owner / final reviewer: user
- Technical navigator + implementation: ChatGPT through repository tooling
- No Codex dependency for this project

## Workflow
START → BUILD → VERIFY → CHECKPOINT → CONTINUE/RECOVER.

Golden rule: **Unexpected result = STOP → inspect reality → then act.**

## Product completion path
Build the smallest real operating system that lets Avram run bookings without repetitive manual data collection. Work in this order:

1. **Public customer experience**
   - Browse current equipment, prices, sizes, descriptions and published specials.
   - Select equipment and complete the structured `/book` request.
   - Keep WhatsApp/phone as secondary contact routes, not the primary booking workflow.

2. **Owner catalogue/content management**
   - `/admin` is the real Avram Operations surface.
   - Equipment: add, edit, delete, hide/show, change name/description/size/price, and manage a customer-facing image.
   - Specials: add, edit, publish/unpublish, delete, and control customer-facing title, description, price/discount wording, date/window and related equipment where appropriate.
   - Keep seeded catalogue data as the recovery baseline, but do not force the owner to edit code.
   - Avoid fabricated availability, promotions, testimonials or guarantees.

3. **Shared Firebase persistence**
   - Move equipment, specials and booking requests from browser-local storage to Firestore.
   - Use the Avram Kids Firebase project only: `avram-kids`.
   - Public booking creation must be limited to the minimum fields needed for a request.
   - Private catalogue/content/booking management must not be anonymously writable.
   - Do not weaken Firestore rules just to make a demo work.
   - Never silently pretend a remote write succeeded if Firebase is unavailable.

4. **Admin authentication and authorization**
   - Protect `/admin` and private Firestore reads/writes with real authentication/authorization.
   - Owner/staff roles should be explicit rather than inferred from client-side UI state.
   - Existing AdminHub authentication patterns may be referenced, but the separate AdminHub repository must never be modified from this project.

5. **Operational booking lifecycle**
   - Requests: New → Contacted → Confirmed → Completed / Cancelled.
   - Owner can review complete event briefs, contact qualified leads, and manage upcoming work.
   - Add availability/conflict handling based on real equipment inventory before claiming a booking is confirmed.
   - Add confirmed-job/calendar views only when the underlying data model is stable.

6. **Automation and owner relief**
   - New qualified request notification to the owner.
   - Honest customer acknowledgement after a successful request submission.
   - Reminder/confirmation flows only when a real integration exists.
   - Never fake WhatsApp, email, payment, calendar or notification delivery.
   - Automate repetitive routing/status work before adding AI features.

7. **Analytics and product monitoring**
   - Vercel Web Analytics must actually be mounted in the root Next.js layout, not merely installed as a dependency.
   - Vercel Speed Insights should remain wired where useful.
   - Start with page/visitor analytics; add custom funnel events only when they provide a clear product decision and the plan supports them.

8. **Operational reporting**
   - Useful views: incoming requests, upcoming confirmed jobs, catalogue/specials state, response/booking status and basic demand patterns.
   - Do not build accounting, payroll, fleet management, routing or an ERP.

## Current product state
The user is testing the actual Avram Kids product as the final reviewer. The product itself must never be presented as a QA build, QA mode, demo, or test app.

The current `/admin` workspace is the real Avram Kids Operations surface. It is intentionally usable without authentication while the owner workflow is being established. Browser-local storage is a temporary implementation detail and must not be exposed as the product identity or falsely described as shared production persistence.

Current customer-to-owner journey:
Customer `/` → browse real equipment/prices → `/book` → submit one complete event request → request is organized in `/admin` → owner reviews qualified requests → owner contacts only the requests she is ready to handle → status moves through the booking lifecycle.

The booking form should collect enough information to prevent the owner from having to repeat basic qualification questions in WhatsApp: customer name, phone, optional email, event date, event start time, location, equipment, quantity, estimated guests, event type and optional notes.

## Public funnel
The public site should clearly present:
- Avram Kids brand
- Jumping Castles
- Water Slides / Slip 'n Slides
- Active Play / Interactive Games only where supported by the actual business offering
- current real equipment and supplied prices/sizes/images
- currently published specials/packages without fabricated offers
- booking route at `/book`
- clear explanation that customers submit their complete event request online
- secondary contact details without making manual messaging the booking system

Use the supplied Avram equipment/pricing as the initial source of truth. Custom event packages can be requested but must not be fabricated.

## Booking
`/book` is a structured lead-capture and booking-request workflow, not an instant-confirmation system. It collects the information required for the owner to review a request without beginning another questionnaire in WhatsApp.

A submitted request currently uses the versioned browser key `avram_booking_requests_v1` so the current operations surface can inspect it in the same browser. This is temporary and must be replaced by Firestore shared persistence.

Until verified shared persistence is implemented, never imply that a browser-local request is visible to Avram from another device/browser. Never fake a Firebase write, confirmed availability, payment transaction, automated WhatsApp message, email delivery, or Google OAuth flow.

Customer-facing copy must not expose internal implementation language such as QA storage, Firebase-next, authentication-next, browser-only persistence, or development limitations. It must remain truthful: a request is not a confirmed booking until Avram checks availability and confirms it.

## Owner operations
The admin system is a first-class product surface, not an afterthought. Build it around the actual owner workflow:
- incoming booking requests
- complete event brief at a glance
- qualified/ready-to-review indication based on required information
- filters for requests that need attention and upcoming work
- request status lifecycle: New → Contacted → Confirmed → Completed / Cancelled
- event date/time/location/equipment/quantity/guest count/customer details
- direct contact actions only from an owner-reviewed request
- equipment catalogue management
- equipment image management
- specials/sales management
- later: shared Firebase data, authentication, availability and calendar operations

The purpose is to let the owner focus on the business and respond to organized, qualified leads when she chooses, rather than manually collecting the same details from scattered messages.

Owner-only destructive controls should use clear product language such as `Clear requests`, never `Reset QA data`.

## Catalogue/content rules
- There must be one source of truth for equipment data consumed by `/`, `/book`, and `/admin`.
- Do not duplicate prices or equipment details in separate page components.
- An equipment record should support at minimum: id, name, description/detail, size, price, image, active/visible state, and ordering metadata where useful.
- Images must be replaceable from `/admin` without editing code. Prefer a real upload/storage path once Firebase Storage or an approved image-storage mechanism is wired; do not fake uploads with a filename-only control.
- Specials should be managed data, not hard-coded marketing copy. A special should support at minimum: title, customer-facing description, active/published state, optional price/offer wording, optional start/end dates, and optional related equipment.
- Deleting/hiding catalogue items must not corrupt historical booking records. Store booking snapshots of the selected equipment name/price/details needed for historical context.
- Prices displayed to customers must be the current managed price unless a published special explicitly changes the displayed offer.

## Data and Firebase
Firebase configuration is environment-driven and belongs to the Avram Kids Firebase project (`avram-kids`). Never reuse Translend Firebase identifiers or credentials. Never expose secrets or commit `.env.local`.

Firestore is currently intentionally locked with deny-all rules. Treat that as the safe starting point. Before enabling real writes:
- define Firestore collections/documents and validation expectations;
- decide exactly which fields anonymous customers may create;
- protect all private/admin reads and writes behind real authentication and authorization;
- prevent customers from writing arbitrary catalogue/special/status fields;
- validate dates, quantities, price fields and role assumptions where applicable;
- add only the minimum indexes required by actual queries;
- test allowed and denied access paths before calling the data layer production-ready.

Likely initial collections are `equipment`, `specials`, `bookingRequests`, and later `jobs`/`availability` if the workflow proves they are needed. Keep the model simple and operational.

## Analytics
The project already depends on `@vercel/analytics`, but installation alone does not enable Web Analytics. The root `src/app/layout.tsx` must render the official Next.js `<Analytics />` component. Do not claim analytics is active until the component is wired and a deployment has been visited/verified.

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

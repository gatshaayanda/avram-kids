# Avram Kids · Agent Operating Contract

## Product
Avram Kids is a mobile-first booking and operations application for children's event equipment hire in Gaborone, Botswana.

Core outcome: customers see current equipment/prices/media/specials, submit one complete booking request, and the owner receives an organized operational queue instead of repeatedly collecting the same details in WhatsApp.

The product is real production software, not a QA/demo shell. Firebase project: `avram-kids`. Firebase is the shared source of truth.

## Roles
- Product owner / final reviewer: user
- Technical navigator + implementation: ChatGPT through repository tooling
- No Codex dependency

## Workflow
START → BUILD → VERIFY → CHECKPOINT → CONTINUE/RECOVER.

**Golden rule: unexpected result = STOP → inspect reality → then act.**

Before each checkpoint report current branch, commit, status, verified functionality, remaining work and next controlled action. Never claim a deployment or integration is working without verifying it.

## Architecture rules
- Next.js App Router, Firebase Authentication, Firestore and Firebase Storage only for application persistence.
- Do not introduce Supabase, a third-party CMS, fake payments, fake WhatsApp/email delivery, or another database.
- Preserve the existing PWA, Analytics, Speed Insights, TypeScript and Firebase foundations.
- Never modify Translend, AdminHub, PurePress or another repository while working on Avram.
- Never commit secrets or `.env.local`.
- Browser localStorage may be a recovery/cache mechanism only; it is not the shared production source of truth.
- Public pages consume managed Firebase content rather than duplicated hard-coded catalogue/marketing records.

## Public customer experience
Customer path:
`/` → browse current catalogue → `/book` → submit complete request → owner reviews → owner contacts customer → availability checked → confirmation.

`/book` must collect at minimum: name, phone, optional email, event date, start time, location, equipment, quantity, estimated guests, event type and notes.

A request is not a confirmed booking until Avram checks availability and confirms it. Customer-facing copy must never imply otherwise.

WhatsApp/phone remain secondary contact routes, not the primary booking system.

## Catalogue and public content
There is one source of truth for equipment used by `/`, `/book` and `/admin`.

Equipment records support at minimum: id, name, description/detail, size, price, image URL, active/visible state and useful ordering metadata.

Owner must be able to:
- add/edit/delete equipment;
- hide/show equipment;
- change customer-facing name/detail/size/price;
- upload/replace equipment images without editing code;
- manage published specials and offer wording;
- upload/replace/hide/show/reorder/remove homepage images and videos.

Firebase Storage holds image/video files. Firestore holds metadata, publication state and ordering. Never store large media blobs in Firestore.

Seeded equipment remains the recovery baseline but must not be the only way to edit the catalogue.

Never fabricate availability, testimonials, promotions, packages or guarantees.

Historical bookings must retain enough equipment snapshot information to remain understandable if catalogue records later change or are deleted.

## Firebase security
Firestore collections:
- `equipment`
- `specials`
- `homeMedia`
- `bookingRequests`
- `admins`
- later operational collections such as `availability`, `customers`, `payments`, `invoices` and `loyalty` only when their data contracts are implemented.

Security requirements:
- public customers may create only validated booking-request fields;
- customers cannot read/update/delete private booking requests;
- customers cannot write equipment, specials, statuses, media or admin records;
- admin/staff access requires Firebase Authentication plus `admins/{uid}` with role `owner` or `staff`;
- clients cannot grant themselves admin access;
- Storage uploads/deletes require authorized admin/staff and validate file type/size;
- public reads must use queries compatible with Firestore rules because security rules are not filters.

Repository files `firebase.json`, `firestore.rules` and `storage.rules` must match the deployed Firebase project. **Changing a rules file in GitHub does not deploy it to Firebase.** Production verification requires the corresponding rules to be published/deployed in the Firebase Console or CLI.

Current media limits:
- equipment images: under 8 MB;
- homepage images/videos: under 25 MB.

## Booking operations
Current request lifecycle:
`New → Contacted → Confirmed → Completed / Cancelled`.

The owner needs:
- incoming requests;
- complete event brief at a glance;
- qualified/ready-to-review indication;
- filters for attention/upcoming work;
- event date/time/location/equipment/quantity/guest count/customer details;
- direct contact actions;
- status changes with visible success/failure feedback.

Next operational layer:
- real equipment availability/conflict checks;
- calendar/upcoming confirmed jobs;
- preparation/setup/active/collection/completion workflow where useful.

Do not claim availability from catalogue state alone. Inventory conflicts must be based on real booking/job data.

## Admin feedback
Every admin action that writes, publishes, hides, deletes, uploads, changes status or fails must give the owner immediate visible feedback through the existing admin toast/notice pattern.

Success messages must say what actually happened. Failure messages must not imply success. Destructive actions require confirmation.

Media uploads require connectivity. Never fake an offline upload.

## Financial operations — required next product layer
Avram should have a simple financial section connected directly to bookings, not a full accounting/ERP system.

The financial model should support:
- quoted rental amount;
- approved special/loyalty discount;
- deposit required;
- amount paid;
- balance due;
- payment status;
- payment date/reference/method where recorded;
- invoice status/reference when invoicing is introduced;
- financial totals tied to the specific booking/customer.

The booking remains the operational anchor: financial records must reference the booking rather than becoming a separate disconnected ledger.

Start simple. Do not build payroll, tax accounting, inventory accounting, fleet finance or a giant accounting suite.

## Customer relationship + repeat customer model
Customer relationship structure begins during booking. A request should preserve enough contact information to recognize a returning customer without requiring a customer account.

Use normalized phone number as the primary practical matching key, with email as a secondary signal where available. Do not expose customer history publicly.

The loyalty concept is an **owner-controlled repeat-customer offer**, not an automatic promise:
- when the system identifies that a customer is making a second or later booking/request, admin can see that repeat-customer context;
- admin decides whether to grant a repeat-customer discount, including the 10% example;
- the discount is recorded against the relevant booking when approved;
- the customer-facing announcement is managed through the same Specials/Promotions system used for normal offers;
- the system must never automatically promise a discount unless an active offer/policy exists.

This allows Avram to say, for example, “10% off your next booking” when the owner has deliberately enabled and announced that offer, while keeping the actual decision under owner control.

## Specials and promotions
Specials are managed Firebase records, not localStorage-only marketing copy.

A special should support at minimum:
- title;
- customer-facing description;
- active/published state;
- offer/price wording;
- optional start/end window;
- optional related equipment;
- later, optional audience/repeat-customer eligibility.

Admin can create, edit, publish/hide and delete. Public pages show only published specials.

## Automation and notifications
Required later:
- owner notification when a new qualified request arrives;
- honest customer acknowledgement after a successful request;
- reminder/confirmation messages only when a real email/WhatsApp/SMS integration exists.

Never fake message delivery. Automate repetitive routing/status work before adding AI.

## PWA/offline
The app must be installable as a PWA and provide truthful offline behavior.

Required production verification:
- manifest loads;
- service worker registers;
- shell/core routes open after first online visit;
- Firestore persistent local cache works;
- queued Firestore writes synchronize when connectivity returns;
- an offline booking is explicitly marked as saved locally/pending sync rather than falsely claiming Avram received it;
- admin changes may queue offline;
- Firebase Storage uploads require connectivity.

Do not cache private/admin responses in a way that exposes one user's private data to another user.

## Analytics
Vercel Web Analytics must actually be mounted in the root layout and enabled in the Vercel project before claiming live analytics. Speed Insights should remain wired where useful.

## Scope discipline
Do not add:
- accounting/ERP complexity beyond the simple booking-linked finance layer above;
- payroll;
- fleet management;
- routing;
- AI chatbot;
- customer login/accounts unless a later business need requires them;
- fake payment processing;
- unnecessary dependencies.

## Quality gates
Before declaring a code checkpoint, run:
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

Then verify the deployed browser flow relevant to the change. A Vercel READY deployment is evidence of a successful deployment/build, not proof that Firebase rules, Storage, authentication or application workflows are correct.

## Current state / next controlled work
The public booking path is now proven end-to-end: a customer submission creates a Firestore booking request and the owner dashboard can read it.

The immediate remaining foundation work is:
1. verify/publish both Firestore and Storage rules in the `avram-kids` Firebase project;
2. verify equipment image upload and homepage media upload end-to-end;
3. make every admin action consistently toast-confirmed;
4. unify Specials so `/admin` never uses localStorage as its source of truth;
5. connect `/admin/content` cleanly into the main Operations navigation;
6. add real availability/conflict handling and calendar operations;
7. add booking-linked finance/invoicing/payment status;
8. add repeat-customer recognition and owner-controlled loyalty offers;
9. add owner notification/automation integrations only when real delivery mechanisms are configured;
10. complete PWA/offline verification and production QA.

## Recovery rule
If a deployed result differs from the repository contract, do not patch blindly. Inspect the live behavior, Firebase deployment state, branch and commit first.

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
- Never modify another project/repository while working on Avram.
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

Historical bookings must retain enough equipment snapshot information to remain understandable if catalogue prices or descriptions later change.

## Firebase security
Firestore collections:
- `equipment`
- `specials`
- `homeMedia`
- `bookingRequests`
- `admins`
- `financeRecords`
- later operational collections such as `availability`, `customers`, `loyalty`, `invoices` only when their data contracts are implemented.

Security requirements:
- public customers may create only validated booking-request fields;
- customers cannot read/update/delete private booking requests;
- customers cannot write equipment, specials, statuses, media, finance or admin records;
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

## Financial operations — foundation now implemented
Avram uses a simple booking-linked finance model, not a full accounting/ERP system.

Implemented:
- `financeRecords` Firestore collection;
- admin-only security rule;
- `/admin/finance` workspace;
- quote/rental amount;
- approved discount amount;
- deposit required;
- amount paid;
- calculated net due and balance;
- payment status;
- payment method/reference;
- invoice status;
- booking selector so finance remains anchored to a real booking;
- visible save/error feedback.

Next finance work:
- preserve finance snapshot when a booking becomes confirmed;
- generate a real invoice document/PDF when the invoice contract is finalized;
- record payment events rather than only the current total when transaction history is needed;
- add owner-controlled due dates/reminders;
- never add fake payment processing.

Start simple. Do not build payroll, tax accounting, inventory accounting, fleet finance or a giant accounting suite.

## Customer relationship + repeat customer model
Customer relationship structure begins during booking. A request should preserve enough contact information to recognize a returning customer without requiring a customer account.

Use normalized phone number as the primary practical matching key, with email as a secondary signal where available. Do not expose customer history publicly.

Next customer work:
- introduce a private `customers` collection keyed by a stable normalized contact identity;
- link booking requests to the customer record without exposing private history to customers;
- show admin repeat context such as `2nd request` or `returning customer`;
- preserve historical bookings even if catalogue records change.

## Loyalty and promotions
The loyalty concept is an **owner-controlled repeat-customer offer**, not an automatic promise.

When the system identifies a second or later request, admin can see repeat-customer context. Admin decides whether to grant a discount, including the 10% example. The discount is recorded against the relevant booking/finance record when approved.

The customer-facing announcement is managed through the same Specials/Promotions system used for normal offers. The system must never automatically promise a discount unless an active offer/policy exists.

Current Specials implementation is Firebase-backed and supports title, description, offer wording, active state and optional start/end dates. Both Operations and Content surfaces must use Firebase, never localStorage as the source of truth.

## Media
Current public media architecture:
- Firebase Storage for files;
- Firestore `homeMedia` metadata;
- admin upload/replace/publish/hide/delete/reorder;
- image/video type and 25 MB client-side validation;
- visible admin toast/error feedback.

Production verification still required: publish the current Storage rules and perform a real upload test for both equipment images and homepage media.

## Availability and calendar — next major operational layer
Build availability from confirmed bookings and actual equipment inventory.

Required later:
- equipment/date conflict detection;
- quantity-aware inventory if multiple units exist;
- event calendar/upcoming confirmed jobs;
- clear operational states around preparation/setup/event/collection/completion.

Do not label equipment available based only on whether the catalogue item is active.

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
- accounting/ERP complexity beyond the simple booking-linked finance layer;
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

## Current checkpoint — 17 September 2026
### Proven live
- Public Avram site is rendering Firebase-backed equipment.
- Public booking submission is working against Firestore.
- A real test request was created and appeared in Operations as `Request #IZCAGZKR`.
- Operations can read requests, inspect details, contact the customer, and change request status.
- Equipment catalogue CRUD and visibility are Firebase-backed.
- Specials are now Firebase-backed in the content architecture; the old Operations localStorage implementation is being retired/isolated from the source of truth.
- Homepage media has Firebase Storage + Firestore architecture and admin upload validation/toasts.
- Booking-linked finance foundation is now in code at `/admin/finance`.

### Code pushed but not yet fully production-verified
- Homepage/equipment media upload against the deployed Storage rules.
- Finance record creation/update against deployed Firestore rules.
- Full admin content flow on the deployed build.
- CI/build quality gates after the latest checkpoint.

### Immediate next controlled sequence
1. Publish/deploy the current `firestore.rules` and `storage.rules` to Firebase project `avram-kids`.
2. Test equipment image upload and homepage image/video upload live.
3. Test `/admin/finance` against a real booking and verify quote → discount → deposit → paid → balance.
4. Finish main `/admin` navigation so Finance and Public Content are first-class Operations sections.
5. Remove any remaining localStorage-only Specials code after confirming no migration is needed.
6. Add booking equipment/price snapshots so historical requests remain stable.
7. Build conflict-aware availability/calendar from confirmed bookings.
8. Add private customer records and repeat-customer recognition.
9. Connect owner-controlled repeat-customer loyalty offers to Specials + booking finance.
10. Add invoice generation and payment-event history after the finance contract is stable.
11. Add real owner/customer notification integrations only when actual delivery providers are configured.
12. Complete PWA/offline verification, analytics verification and production QA.

## Recovery rule
If a deployed result differs from the repository contract, do not patch blindly. Inspect the live behavior, Firebase deployment state, branch and commit first.

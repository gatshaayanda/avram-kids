# Avram Kids · Agent Operating Contract

## Product
Avram Kids is a mobile-first booking and operations application for children's event equipment hire in Gaborone, Botswana.

The core product goal is operational relief: customers should see real equipment, prices and specials, submit one complete request online, and leave the owner with an organized queue of qualified requests rather than another stream of repetitive WhatsApp conversations.

The owner must be able to run the public catalogue and homepage content without developer help: change equipment names/descriptions/sizes/prices, replace equipment images, hide/show items, add/remove equipment, publish/retire specials and sale messaging, and manage homepage images/videos. Customer-facing content must always come from the current managed content, not hard-coded duplicate data.

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
   - Browse current equipment, prices, sizes, descriptions, images and published specials.
   - Select equipment and complete the structured `/book` request.
   - Keep WhatsApp/phone as secondary contact routes, not the primary booking workflow.

2. **Owner catalogue/content management**
   - `/admin` is the real Avram Operations surface.
   - Equipment: add, edit, delete, hide/show, change name/description/size/price, and upload/replace a customer-facing image.
   - Specials: add, edit, publish/unpublish, delete, and control customer-facing title, description, price/discount wording, date/window and related equipment where appropriate.
   - Home Page / Media: upload, replace, hide/show, reorder and remove homepage images and videos; support simple titles/captions and choose published media shown on the public homepage.
   - Store media files in Firebase Storage and media metadata/order/published state in Firestore; never store large image/video blobs in Firestore.
   - Keep seeded catalogue data as the recovery baseline, but do not force the owner to edit code.
   - Avoid fabricated availability, promotions, testimonials or guarantees.

3. **Shared Firebase persistence**
   - Equipment, specials, homepage media metadata and booking requests must use Firestore rather than browser-local storage as the shared source of truth.
   - Use the Avram Kids Firebase project only: `avram-kids`.
   - Public booking creation must be limited to the minimum fields needed for a request.
   - Private catalogue/content/booking management must not be anonymously writable.
   - Never silently pretend a remote write succeeded if Firebase is unavailable.

4. **Admin authentication and authorization**
   - Protect `/admin` and private Firestore reads/writes with Firebase Authentication plus explicit Avram admin/staff authorization.
   - Role documents are provisioned out-of-band; a client must never be able to grant itself admin access.
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

7. **PWA and offline operation**
   - Avram Kids must be installable as a PWA from a supported browser.
   - Cache the application shell and core public routes so the site can open without a network after first visit.
   - Provide a truthful offline state and an offline fallback page.
   - Enable persistent Firestore local cache so previously loaded equipment/content and booking data remain available offline and Firestore writes can queue locally for synchronization when connectivity returns.
   - Customers must be able to complete a booking request while offline when the app has already been loaded and Firestore has initialized; the app must clearly say the request is saved locally/pending sync rather than falsely claiming the owner has received it.
   - Admin Firestore changes can queue offline, but Firebase Storage file uploads (images/videos) require connectivity; never fake an offline media upload.
   - Register the service worker from the root layout, keep cache versioned, and provide install affordance where the browser supports it.
   - Do not cache private/admin responses in a way that exposes one user's private data to another user; browser-local Firestore persistence remains scoped to the authenticated browser profile.

8. **Analytics and product monitoring**
   - Vercel Web Analytics must actually be mounted in the root Next.js layout, not merely installed as a dependency.
   - Vercel Speed Insights should remain wired where useful.
   - Start with page/visitor analytics; add custom funnel events only when they provide a clear product decision and the plan supports them.

9. **Operational reporting**
   - Useful views: incoming requests, upcoming confirmed jobs, catalogue/specials/media state, response/booking status and basic demand patterns.
   - Do not build accounting, payroll, fleet management, routing or an ERP.

## Current product state
The user is testing the actual Avram Kids product as the final reviewer. The product itself must never be presented as a QA build, QA mode, demo, or test app.

The `/admin` workspace is the real Avram Kids Operations surface. It has a Firebase Authentication access gate, shared Firestore data functions, and Firebase Storage image-upload support in code. Browser-local storage remains only as a temporary fallback/cache and must not be presented as the shared production source of truth.

The PWA foundation now includes a web app manifest, install icon, service worker, offline fallback, install affordance/offline status UI, and persistent Firestore local caching/queued writes. The manifest icon purpose typing has been corrected on `avram-v1`; this must be verified in a deployed browser before calling offline operation production-ready.

Current customer-to-owner journey:
Customer `/` → browse current equipment/prices/images → `/book` → submit one complete event request to Firestore → owner reviews it in `/admin` → owner contacts qualified requests → status moves through the booking lifecycle.

The booking form collects enough information to prevent the owner from having to repeat basic qualification questions in WhatsApp: customer name, phone, optional email, event date, event start time, location, equipment, quantity, estimated guests, event type and optional notes.

## Public funnel
The public site should clearly present:
- Avram Kids brand
- Jumping Castles
- Water Slides / Slip 'n Slides
- Active Play / Interactive Games only where supported by the actual business offering
- current real equipment and supplied prices/sizes/images
- currently published specials/packages without fabricated offers
- published homepage media where configured
- booking route at `/book`
- clear explanation that customers submit their complete event request online
- secondary contact details without making manual messaging the booking system

Use the supplied Avram equipment/pricing as the initial source of truth. Custom event packages can be requested but must not be fabricated.

## Booking
`/book` is a structured lead-capture and booking-request workflow, not an instant-confirmation system. It writes booking requests through the shared Firestore data layer and returns the Firestore request reference after a successful remote/local Firestore write.

If Firestore has no local cache and a booking write cannot be queued, the customer must see a truthful error. When persistence is available and the write is queued offline, the UI must explicitly identify the request as saved on the device and pending synchronization rather than implying Avram has already received it.

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
- equipment image management through real Firebase Storage uploads
- specials/sales management
- homepage image/video management
- later: availability and calendar operations

The purpose is to let the owner focus on the business and respond to organized, qualified leads when she chooses, rather than manually collecting the same details from scattered messages.

Owner-only destructive controls should use clear product language such as `Clear requests`, never `Reset QA data`.

## Catalogue/content rules
- There must be one source of truth for equipment data consumed by `/`, `/book`, and `/admin`.
- Do not duplicate prices or equipment details in separate page components.
- An equipment record should support at minimum: id, name, description/detail, size, price, image, active/visible state, and ordering metadata where useful.
- Images must be replaceable from `/admin` without editing code. Uploads belong under the Avram Firebase Storage equipment path and must be protected by admin authorization.
- Specials should be managed data, not hard-coded marketing copy. A special should support at minimum: title, customer-facing description, active/published state, optional price/offer wording, optional start/end dates, and optional related equipment.
- Homepage media should support at minimum: id, type (`image` or `video`), storage path, public URL, title/caption, active/published state, ordering metadata and timestamps. Media files belong in Firebase Storage under an Avram homepage-media path.
- Deleting/hiding catalogue items must not corrupt historical booking records. Store booking snapshots of the selected equipment name/price/details needed for historical context.
- Prices displayed to customers must be the current managed price unless a published special explicitly changes the displayed offer.

## Data and Firebase
Firebase configuration is environment-driven and belongs to the Avram Kids Firebase project (`avram-kids`). Never reuse Translend Firebase identifiers or credentials. Never expose secrets or commit `.env.local`.

Repository-managed Firebase configuration includes `firebase.json`, `firestore.rules`, `storage.rules`, the client Firebase service module, and the shared data layer. The Firebase Console must still have the corresponding rules deployed before production writes are expected to work.

Firestore collections are:
- `equipment`: public active catalogue, admin-managed
- `specials`: public active promotions, admin-managed
- `homeMedia`: public published homepage media metadata, admin-managed
- `bookingRequests`: public-create/private-read booking intake
- `admins`: provisioned role records; clients cannot write themselves into this collection

Security requirements:
- public customers may create only the minimum booking-request fields;
- customers cannot read or modify private booking requests;
- customers cannot write equipment, specials, statuses, homeMedia or admin records;
- admin/staff reads and writes require Firebase Authentication plus an `admins/{uid}` role record of `owner` or `staff`;
- equipment and homepage media files are publicly readable but uploads/deletes require an authorized admin and are limited to appropriate file types and reasonable size limits;
- test allowed and denied access paths before calling the data layer production-ready.

The first owner account must be created in Firebase Authentication and its UID must be provisioned as an `admins/{uid}` document with `role: "owner"` outside the client application. Never add a self-service admin-signup path.

## Analytics
The project depends on `@vercel/analytics` and the root `src/app/layout.tsx` renders the official Next.js `<Analytics />` component. Vercel Web Analytics still requires Analytics to be enabled in the Vercel project and a deployed/visited production build before data appears. Do not claim live analytics until that is verified.

## Scope discipline
Do not add accounting, payroll, fleet management, routing, AI chatbot, customer accounts, fake payments, fake Google login, or unnecessary dependencies. Preserve useful Next.js, Firebase, error-boundary, TypeScript, PWA, Analytics and Speed Insights foundations where genuinely useful.

No Translend terminology may remain in active Avram UI, metadata, routes, navigation, or user-facing error messages.

## Quality gates
Before declaring a checkpoint, run and pass:
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

Also verify the deployed PWA on a supported browser: manifest loads, service worker registers, core routes open offline after a first online visit, Firestore local persistence works, and an offline booking request is clearly marked as pending rather than falsely confirmed.

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

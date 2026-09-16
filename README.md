# Avram Kids

Mobile-first booking and operations application for children's event equipment hire in Gaborone, Botswana.

## Product flow
Customer → managed offering → complete booking request → Avram Operations queue → availability review → confirmation → event.

Customers do not need an account. Booking requests are written to Firebase Firestore `bookingRequests`. Submission is a request, not an instant booking confirmation.

## Operations
`/admin` is the protected owner/staff workspace for booking requests and the live equipment catalogue. The catalogue can be added to, edited, hidden, restored from the seeded baseline, and have customer-facing images replaced.

`/admin/content` is the protected Firebase-backed content workspace for specials and homepage images/videos. Firebase Storage holds media files; Firestore holds content metadata, publication state and ordering.

## Firebase
`.firebaserc` targets the `avram-kids` Firebase project. Firestore and Storage rules in this repository must be deployed to that project before production writes are expected to work. Admin access requires Firebase Authentication plus an `admins/{uid}` role of `owner` or `staff`.

## PWA
Includes manifest, service worker, offline fallback and persistent Firestore local caching/queued writes. Offline booking must be shown as pending synchronization, never as already received.

## Development
```bash
npm install
npm run dev
npx tsc --noEmit
npm run lint
npm run build
```

Never commit secrets or `.env.local`.

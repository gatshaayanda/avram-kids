# Avram Kids

Avram Kids is a mobile-first booking website and operations foundation for children's event equipment hire.

## Public experience

The first release focuses on a simple customer journey:

Customer → Offering → Booking Request → Availability → Confirmation → Event → Completion

Initial offering categories:
- Jumping Castles
- Water Slides
- Obstacle Courses
- Interactive Games

The public site is available at `/` and the booking request form at `/book`.

## Booking behaviour

Customers do not need an account to request a booking. The current form provides an honest client-side confirmation state and direct WhatsApp/phone fallback. It does not pretend to persist a booking or confirm availability until the real backend workflow is implemented.

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS, Firebase foundation, and Vercel.

## Development

Run:

```bash
npm install
npm run dev
```

Quality gates:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Never commit secrets or `.env.local`.

## Deployment checkpoint

The PWA manifest build fix is present on `avram-pwa-implementation`; this checkpoint commit is intended to retrigger the connected Vercel Git deployment from the current branch head.

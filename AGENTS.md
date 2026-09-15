# Avram Kids · Agent Operating Contract

## Product
Avram Kids is a mobile-first booking and operations application for children's event equipment hire.

## Roles
- Product owner / final reviewer: user
- Technical navigator: ChatGPT
- Hands-on implementation: direct repository tooling

## Workflow
START → BUILD → CONTINUE/RECOVER.

Golden rule: **Unexpected result = STOP → inspect reality → then act.**

## Product order
1. Public booking funnel
2. Admin-managed offerings and specials
3. Booking operations

Core journey:
Customer → Offering → Special (optional) → Booking Request → Availability → Confirmation → Event → Completion.

## Foundation
- Next.js App Router
- React + TypeScript
- Firebase
- Vercel
- Mobile-first and PWA-friendly
- Customers do not need an account to submit the initial booking request

## Public funnel
The first usable experience is a clear public website with:
- Avram Kids brand presentation
- Jumping Castles
- Water Slides
- Obstacle Courses
- Interactive Games
- Specials area prepared for admin-managed content
- booking route at `/book`
- direct contact / WhatsApp fallback

Do not invent real prices, promotions, availability, certifications, guarantees, confirmed bookings, or unsupported service claims.

## Booking
`/book` collects customer name, phone, optional email, event date, event location, offering, quantity, and notes. Until a verified persistence backend is implemented, submission must only provide an honest client-side request-received state and contact fallback. Never fake a Firebase write or Google OAuth flow.

## Data and Firebase
Firebase configuration is environment-driven and belongs to the Avram Kids Firebase project (`avram-kids`). Never reuse Translend Firebase identifiers or credentials. Never expose secrets or commit `.env.local`.

## Scope discipline
Do not add accounting, payroll, routing, fleet management, AI chatbot, customer accounts, fake payments, fake Google login, or unnecessary dependencies. Preserve useful Next.js, Firebase, error-boundary, TypeScript, and Vercel Analytics/Speed Insights foundations where they are genuinely useful.

No Translend terminology may remain in the active Avram UI, metadata, routes, navigation, or user-facing error messages.

## Quality gates
Run and pass all three before declaring a checkpoint:
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

Do not suppress errors. Review the diff and git status before checkpointing.

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

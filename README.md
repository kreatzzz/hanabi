# Hanabi

Hanabi is a Next.js portfolio site built with Tailwind CSS and Bun. The homepage presents the studio story, seamless hero marquee, services, why-us section, recent works, and contact flow.

It also hosts a password-protected **client & admin portal** (`/portal`, `/admin`) for delivering brand systems, assets, handoff docs, and progress updates to clients. See [`docs/PORTAL.md`](docs/PORTAL.md) for setup, environment, and the updates ingest API.

## Development

Install dependencies:

```bash
bun install
```

Run the local development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

Build for production:

```bash
bun run build
```

Start the production server:

```bash
bun run start
```

## Project Structure

- `app/page.tsx` composes the homepage sections, owns section-level spacing such as the larger services top padding before Why Us, and mounts the works section.
- `data/work-projects.ts` is the source of truth for work project titles, categories, descriptions, and image sets.
- `components/marquee-component.tsx` renders the homepage hero project marquee with `components/seamless-marquee.tsx`.
- `components/seamless-marquee.tsx` provides the package-free, duplicated-track marquee used by the hero and inline service marquees.
- `components/book-call-link.tsx` is the direct Cal.com link used by mobile booking CTAs.
- `components/cal-popup-button.tsx` remains the desktop Cal.com popup embed.
- `components/services/*-card.tsx` renders Services section cards and explicitly lazy loads their card images.
- `components/work-projects-list.tsx` owns the works list client interaction. It shows the first three projects initially, renders a blurred, non-interactive peek of the next project behind the rounded-full "See more" button with a `#E3E3E3/80` fill, light vertical gradient stroke, subtle layered shadows, and active scale feedback, then mounts the remaining projects on click.
- `components/work-card.tsx` renders each work project shell, description, and clipped media area for decorative paper-crane garlands.
- `components/work-card-gallery.tsx` handles project image layouts based on image count and explicitly lazy loads project gallery images.
- `components/work-project-showcase.tsx` pairs project stills with native video controls and a clip selector; videos load when requested.
- `components/reveal.tsx` provides the viewport reveal/fade behavior used across the page and by newly mounted work projects.
- `components/why-us-cards.tsx` renders the Why Us / Hanabi Difference cards, explicitly lazy loads their card images, and keeps separated mobile spacing for the Quality and Clean Code cards so they do not attach on narrow screens.
- `components/studios-quote-section.tsx` renders the Studios/Who We Are quote, owns the team member data/order, and mounts the team list.
- `components/team-members-list.tsx` owns the responsive Studios/Who We Are team list layout.
- `components/team-member-card.tsx` owns each avatar/banner card, including avatar gradients, ring, inset highlight, shadow depth, and banner media mounted with lazy loading so the browser can fetch it while approaching the Studios section. CSS keeps banner popovers desktop hover/focus-only.
- The footer transition artwork section is currently disabled, so the footer renders only the base footer artwork, with the footer image explicitly lazy loaded at low fetch priority.
- Header and hero mobile "Book a Call" CTAs redirect to Cal.com directly; desktop keeps the popup booking flow.

## Updating Works

Add or edit projects in `data/work-projects.ts`. Project images should live under `public/projects` and be referenced with root-relative paths such as `/projects/example.png`. Project `contributors` control the bottom-right avatar masks on each work card; each contributor maps to a team avatar in `components/project-contributor-masks.tsx` and shows the contributor name on hover/focus.

The first three projects in `workProjects` are visible immediately. In the collapsed state, the next project appears only as a blurred, non-interactive peek behind "See more"; full additional projects stay unmounted until visitors click the button, so their existing `Reveal` viewport animation runs when they appear. Paper-crane garlands are anchored inside each project media box, clipped by that project box, with the left and right strings inset from the box sides and spanning top-to-bottom. Go Gym is the first featured project, with stills, a quick reel, and the full onboarding video. Comp Ops replaces Got Next using updated portfolio images, including in the hero marquee. Optional project `videos` use compressed MP4 files under `public/projects/videos`. Leadly lists Arsh, Krish, and Dey as contributors.

## Notes

- Use Bun for all package and script commands.
- Keep UI styling in Tailwind classes.
- Update this README when feature changes affect project structure or expected workflows.

#!/usr/bin/env python3
"""Write unpublished inbound drafts for plan rows 101–500.

Skips a file that already exists. Does not publish.
"""

from __future__ import annotations

import json
import os
import re
from pathlib import Path

ROOT = Path("/home/dev/projects/hanabi")
PLAN = ROOT / "content" / "blog-plan-500.json"
OUT = ROOT / "content" / "blog-drafts"

SOURCES = {
    "nng": {
        "title": "How Long Do Users Stay on Web Pages?",
        "url": "https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/",
        "publisher": "Nielsen Norman Group",
        "mention": (
            "Nielsen Norman Group's research on [how long people stay on web pages]"
            "(https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/) "
            "is the useful constraint here: many visits are decided in the first 10 to 20 seconds. "
            "If the page has not said what this is and what to do, the rest of the design is for a person who already left."
        ),
    },
    "vitals": {
        "title": "Core Web Vitals",
        "url": "https://developers.google.com/search/docs/appearance/core-web-vitals",
        "publisher": "Google Search Central",
        "mention": (
            "Google's [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) "
            "put numbers on that wait: largest contentful paint within 2.5 seconds, interaction to next paint within 200 milliseconds, "
            "and cumulative layout shift at 0.1 or below. A page that misses those marks asks the buyer to be patient before it has earned anything."
        ),
    },
    "helpful": {
        "title": "Creating helpful, reliable, people-first content",
        "url": "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
        "publisher": "Google Search Central",
        "mention": (
            "Google's guidance on [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) "
            "is the right test for a studio page: would a person who has this problem feel helped, and does the page show experience, "
            "or is it a stack of phrases aimed at a crawler? Write the first kind."
        ),
    },
    "wcag": {
        "title": "Web Content Accessibility Guidelines (WCAG) Overview",
        "url": "https://www.w3.org/WAI/standards-guidelines/wcag/",
        "publisher": "W3C",
        "mention": (
            "The W3C organizes the [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) "
            "under four ideas: perceivable, operable, understandable, and robust. On a page like this, that means text you can read, "
            "a focus state you can see, a name on every control, and a way through the task without a mouse."
        ),
    },
    "baymard": {
        "title": "Cart Abandonment Rate Statistics",
        "url": "https://baymard.com/lists/cart-abandonment-rate",
        "publisher": "Baymard Institute",
        "mention": (
            "The Baymard Institute's [cart abandonment research](https://baymard.com/lists/cart-abandonment-rate) "
            "keeps showing the same kinds of exits: unexpected cost, a forced account, and a checkout that will not say what happens next. "
            "Treat those as design problems, not as a mysterious loss of motivation."
        ),
    },
    "titles": {
        "title": "Influencing title links in Google Search",
        "url": "https://developers.google.com/search/docs/appearance/title-link",
        "publisher": "Google Search Central",
        "mention": (
            "Google's notes on [title links](https://developers.google.com/search/docs/appearance/title-link) "
            "are blunt about the title tag: it should describe the page. A clever label that hides the offer gets rewritten, or it gets skipped."
        ),
    },
}


def words(text: str) -> int:
    return len(text.split())


def clean_angle(angle: str) -> str:
    text = re.sub(r"\s+", " ", angle).strip()
    text = text.replace("A an ", "An ").replace("a an ", "an ")
    text = text.replace("A a ", "A ").replace("a a ", "a ")
    if text and text[-1] not in ".!?":
        text += "."
    parts = re.split(r"(?<=[.!?])\s+", text)
    fixed = []
    for part in parts:
        if not part:
            continue
        fixed.append(part[:1].upper() + part[1:])
    return " ".join(fixed)


def family(title: str) -> str:
    t = title.lower()
    pairs = [
        ("what not to put", "cut"),
        ("homepage", "homepage"),
        ("pricing", "pricing"),
        ("services page", "services"),
        ("about page", "about"),
        ("proof page", "proof"),
        ("navigation", "nav"),
        ("photography", "photo"),
        ("mobile visit", "mobile"),
        ("contact path", "contact"),
        ("first screen", "first"),
        ("errors in", "errors"),
        ("permissions in", "permissions"),
        ("search inside", "search"),
        ("settings in", "settings"),
        ("automating", "automation"),
        ("online shop", "shop"),
        ("product photography", "photo"),
    ]
    for key, name in pairs:
        if key in t:
            return name
    return "essay"


def source_key(row: dict, kind: str) -> str:
    blob = f"{row['title']} {row['keyword']} {row['category']}".lower()
    if any(k in blob for k in ("checkout", "cart", "shop", "ecommerce", "shipping", "variant")):
        return "baymard"
    if any(k in blob for k in ("title", "meta description", "heading", "search console")):
        return "titles"
    if any(k in blob for k in ("speed", "vitals", "loading", "image weight", "server render")):
        return "vitals"
    if row["category"] in {"Product Design", "Design systems"} or kind in {
        "errors",
        "permissions",
        "search",
        "settings",
        "first",
    }:
        return "wcag"
    if kind in {"homepage", "mobile", "contact", "nav"}:
        return "nng"
    return "helpful"


def cta_sentence(url: str) -> str:
    if "cal.com" in url:
        return (
            "When you want that work done with the same team that will design and build it, "
            f"book [an intro call]({url})."
        )
    if url.endswith("#works"):
        return (
            "If you want to see how this standard shows up in finished work, "
            f"look through [selected work]({url})."
        )
    return (
        "When the page, the brand, or the product needs a studio that will ship it, "
        f"start with [Hanabi's services]({url})."
    )


def meta_title(keyword: str, title: str) -> str:
    candidate = keyword[:1].upper() + keyword[1:]
    if len(candidate) <= 60:
        return candidate
    candidate = title
    if len(candidate) <= 60:
        return candidate
    cut = candidate[:60]
    if " " in cut:
        cut = cut.rsplit(" ", 1)[0]
    return cut


def excerpt_for(row: dict, angle: str) -> str:
    base = angle
    if len(base) > 220:
        base = base[:217].rsplit(" ", 1)[0].rstrip(".,;") + "."
    if len(base) < 80:
        extra = f" {row['title']} is a practical brief for a founder who wants the page to earn a conversation."
        base = (base + extra).strip()
    if len(base) > 220:
        base = base[:217].rsplit(" ", 1)[0].rstrip(".,;") + "."
    if len(base) < 80:
        base = (base + " Keep the offer specific and the next step obvious.").strip()
    return base


def alt_text(row: dict) -> str:
    scene = row["scenes"][0].rstrip(".")
    title = row["title"].rstrip(".")
    return f"{scene}. It accompanies an article about {title[:1].lower() + title[1:]}."


def faqs(row: dict, angle: str) -> list[dict]:
    title = row["title"]
    return [
        {
            "question": f"Who is {title[:1].lower() + title[1:]} for?",
            "answer": (
                f"It is for a founder or a small team deciding how this piece of the site or product should work. "
                f"{angle} If you cannot point to the buyer and the next step, the page is still a draft."
            ),
        },
        {
            "question": "What should we finish before visual design?",
            "answer": (
                "Write the offer, the proof, and the action in sentences a stranger can repeat. "
                "Then design the page so those sentences are what the first screen shows. "
                "A layout that arrives before the sentences will decorate the wrong idea. "
                "Hanabi's work starts from that order: clarity, then the interface."
            ),
        },
        {
            "question": "Can a small team do this without a long brand program?",
            "answer": (
                "Yes. You need a true description of the work, a few proof points you are allowed to show, and a way to start a conversation. "
                "A full identity system can follow. It is not a ticket you must buy before the page is allowed to be clear. "
                "Ship the clear version, then refine the system around what the page already says."
            ),
        },
    ]


def industry_note(title: str, keyword: str) -> str:
    blob = f"{title} {keyword}".lower()
    notes = [
        (
            "saas",
            "The buyer already lives in software. They will forgive a plain page. They will not forgive a page that describes a category instead of a job. Show one workflow, the person in it, and the moment the product saves. A feature grid with no job is a catalog. A catalog does not get a demo.",
        ),
        (
            "developer",
            "Engineers skim for the object: the command, the API, the screen they will live in. A slogan about empowering developers tells them the page was written by someone who does not use the tool. Put a real interface, a real snippet, or a real before-and-after in the first view.",
        ),
        (
            "fintech",
            "Money makes people careful. Say what the product does with funds or data, who is responsible, and how a person starts. Abstract language about trust is the opposite of trust. Name the action and the boundary.",
        ),
        (
            "clinic",
            "The visitor is often anxious and on a phone. They need the kind of care, the place, and a way to book. A stock smile and a list of procedures answers a different question than the one they brought. Write for the person who wants to know if they can be seen.",
        ),
        (
            "law",
            "A client choosing counsel is short on time and long on risk. Say the matters you take and how a consultation starts. Marble, Latin, and a skyline do not tell them if you can help with their problem. Specificity is the courtesy.",
        ),
        (
            "accounting",
            "The founder looking for an accountant wants a calm expert, not a skyline and the word excellence. Say who you work with, what you take off their plate, and how to begin. Jargon can stay in the engagement letter. It should not be the homepage.",
        ),
        (
            "architecture",
            "Taste is being judged before competence. Show built work and name the constraint: the site, the budget, the use. A fullscreen render with no words asks the client to guess what you are proud of. The sentence is part of the craft.",
        ),
        (
            "restaurant",
            "Tonight's guest is choosing with a thumb. They need the room, one dish, the place, and whether they can book or order. A logo animation spends the only seconds you had. Put the practical facts where the thumb already is.",
        ),
        (
            "hotel",
            "A traveler is comparing three stays. Show the room as it is, the location in one line, and a way to check dates. A drone shot of the pool is a vacation the guest may not have. The room is the product.",
        ),
        (
            "school",
            "A parent is deciding where a child will spend years. Show the day, not only the crest. Admissions language can be warm and still say who the school is for, how to visit, and what happens after the inquiry.",
        ),
        (
            "sports",
            "A member wants to know if they can play, when, and what it costs to start. People playing, a schedule, and a join path beat a trophy case. The club is a habit. The site should make the next session obvious.",
        ),
        (
            "consumer brand",
            "A shopper who does not know you yet needs the object, clearly, before a manifesto. Say what it is, who it is for, and how to see or buy it. The story can follow the product. It should not replace it.",
        ),
        (
            "marketplace",
            "One side of the market has to arrive first. Write that side's job, show a concrete match, and give them a way in. Two equal buttons and no story is how both sides bounce. Pick the side you need and speak to them.",
        ),
        (
            "logistics",
            "An operator needs to know you can move the thing. Show the work: the lane, the object, the handoff. A globe and a shipping-container photograph say you have seen a metaphor. The quote path should be easy to find after the proof.",
        ),
        (
            "manufacturer",
            "A buyer needs the object, how it is made, and a spec or a sales path. A factory cliché with no product wastes the visit. Put the thing in the light and say what it is for.",
        ),
        (
            "nonprofit",
            "A donor or a participant is asking whether the work is real. Show the work in the world and a way to give, join, or read the program. A sad photograph and a single donate button is not an explanation.",
        ),
        (
            "recruit",
            "A hiring manager who has been burned before wants the kind of role you fill and how a search is briefed. A handshake photograph is not evidence. Describe a search the way you would describe it on a call.",
        ),
        (
            "consultan",
            "The buyer is comparing you with doing it themselves. Name the problem you actually take, what they still own, and how a working session starts. A list of industries you serve is not a point of view.",
        ),
        (
            "creative studio",
            "This client has already seen fifty portfolios. They are looking for a decision, not a reel with no explanation. Show one project, the constraint, and what you would do again. Then offer a way to start.",
        ),
        (
            "education product",
            "A teacher or a parent has little time. Show the learning moment and a way to start a class or a trial. A dashboard full of badges is the product congratulating itself. The lesson is the product.",
        ),
    ]
    for key, note in notes:
        if key in blob:
            return note
    return (
        "The reader is a founder or a lead who is busy and slightly skeptical of agencies. "
        "They will stay for a page that names the decision, shows the evidence, and tells them what happens if they raise a hand. "
        "They will leave a page that performs taste before it explains the work."
    )


def heading_set(kind: str, title: str) -> list[str]:
    specific = {
        "homepage": [
            "What the first screen has to settle",
            "The order of the rest of the page",
            "Proof that belongs on a homepage",
            "What to take off",
            "The path to a conversation",
            "A review you can do in an hour",
        ],
        "pricing": [
            "What the buyer is trying to judge",
            "Showing the shape of the price",
            "What is included, and what is not",
            "The questions a pricing page should answer",
            "When you cannot publish a number",
            "How to tell the page is honest",
        ],
        "services": [
            "Name the work in the buyer's language",
            "Outcome, boundary, and next step",
            "How many services is too many",
            "Proof next to the offer",
            "The page is not a menu of departments",
            "A pass before you design it",
        ],
        "about": [
            "What an about page is for",
            "Who does the work",
            "The origin story, used carefully",
            "Proof that people stand behind the offer",
            "What does not belong here",
            "How a stranger should leave the page",
        ],
        "proof": [
            "A proof page is a decision, not a gallery",
            "Constraint, choice, and result",
            "What you are allowed to show",
            "Screenshots that still need a sentence",
            "The ending that helps the next buyer",
            "How to know the story is finished",
        ],
        "nav": [
            "Navigation is a list of jobs",
            "Labels a stranger already uses",
            "One path that starts the work",
            "What to keep out of the header",
            "Footer, only after the header is clear",
            "How to test the labels",
        ],
        "photo": [
            "What the picture has to prove",
            "Choosing a scene instead of a mood",
            "Crop, light, and the grid",
            "Alt text is part of the picture",
            "What to reject",
            "A shot list you can actually finish",
        ],
        "mobile": [
            "The phone visit is the real visit",
            "The first screen on a narrow width",
            "Thumbs, forms, and the action",
            "What desktop composition gets wrong",
            "Speed on a real connection",
            "How to review it",
        ],
        "contact": [
            "Say what happens after they reach out",
            "How much the form is allowed to ask",
            "Speed, and who answers",
            "What the person should have ready",
            "The page after the form",
            "A contact path that matches the promise",
        ],
        "cut": [
            "What the team is protecting",
            "What the buyer actually needed",
            "A shorter page that tells the truth",
            "Decoration that replaced a sentence",
            "How to make the cut",
            "What you put back, if anything",
        ],
        "first": [
            "The first screen is the product's argument",
            "The object, not the tour",
            "One action",
            "What a tour costs",
            "Empty, loading, and the second visit",
            "How to judge the screen",
        ],
        "errors": [
            "An error is a moment of trust",
            "Say what broke",
            "Say what to do",
            "What not to show",
            "Errors the team should design before launch",
            "How to review them",
        ],
        "permissions": [
            "People need to see what they are allowed to do",
            "A hidden control feels like a bug",
            "Explain the lock",
            "Roles without a second product",
            "The empty permission",
            "A check before you ship",
        ],
        "search": [
            "Search is what people do when navigation failed",
            "Show the match in their language",
            "A failed search still needs a path",
            "What not to index",
            "Speed and the result list",
            "How you will know it works",
        ],
        "settings": [
            "Settings are a cabinet",
            "What people change often",
            "What to bury",
            "Names that match the product",
            "Dangerous settings",
            "When settings have become a second product",
        ],
        "automation": [
            "Automate the handoff, not the relationship",
            "Where a person still has to see the work",
            "The trigger and the exception",
            "What the client is allowed to notice",
            "How to tell it saved time",
            "A small version you can ship",
        ],
        "shop": [
            "This shop is not a marketplace",
            "The product page does the selling",
            "A short path to payment",
            "Shipping, returns, and the decision",
            "Photographs that belong to the object",
            "What to leave off the grid",
        ],
    }
    if kind in specific:
        return specific[kind]
    return [
        f"What {title[:1].lower() + title[1:]} is actually deciding",
        "The version that fails",
        "The version that helps a buyer",
        "What to leave out",
        "How to judge the finished piece",
        "What to prepare before you hire",
    ]


def section_body(kind: str, index: int, row: dict, angle: str, note: str) -> str:
    title = row["title"]
    keyword = row["keyword"]
    subject = title[0].lower() + title[1:]
    blocks = {
        0: (
            f"Hold the brief to one job. If a section does not help a stranger finish that job, it is optional.\n\n"
            f"Read {subject} as a decision, not as a design theme. The reader should be able to repeat the point after one pass. "
            f"If they can only say that the page looked considered, the piece has not finished its work. "
            f"Hanabi's standard on a public site is the same: simple and clear, with the beautiful part coming from the decision rather than from decoration around an unclear offer."
        ),
        1: (
            f"The failing version of {subject} usually has the right ingredients in the wrong order. "
            f"The team likes the mood. The buyer cannot find the offer. A headline reaches for a feeling, and the next sentence does not say what the company does. "
            f"Proof is either missing or so general that any competitor could claim it. The action is a button that says learn more, which is not an action.\n\n"
            f"You can see this in the draft itself. Highlight every sentence that could be pasted onto another company's site without a change. "
            f"Those sentences are the ones to replace. Keep the sentences that name a buyer, a job, a constraint, or a next step. "
            f"A {keyword} earns attention by being specific. Specific is not a longer page. Specific is a page that could not be about someone else."
        ),
        2: (
            f"Build the better version in this order. First, one sentence a stranger can say back: what this is, and who it is for. "
            f"Second, the proof that makes the sentence believable. That proof is a screen, a photograph of the real thing, a named constraint, or a short account of a decision. "
            f"Third, the action, written as what the person gets: a demo, a visit, a quote, a table, a trial, a conversation.\n\n"
            f"Then stop adding sections until those three are obvious on a phone. A section that does not help one of the three is a candidate to cut. "
            f"Teams add sections because a stakeholder wanted a mention. The buyer experiences that as delay. "
            f"On a Hanabi project the same cut happens in the interface and on the marketing site. If a block does not change the decision, it does not ship.\n\n"
            f"Write the action in the language of the buyer, not the language of the org chart. "
            f"Book a demo, request a consultation, see the work, start a trial. Those are different promises. Pick the one this page can keep."
        ),
        3: (
            f"Leave out the performance of seriousness. Stock skies, Latin, trophy cases, a manifesto before the object, a grid of features with no job, "
            f"and a paragraph about passion are all ways of delaying the point. They reassure the people who made the site. They cost the person who might have hired you.\n\n"
            f"Leave out claims you would not say on a call. If you would not tell a founder you are world-class, do not put it in type. "
            f"Leave out awards, headcount, and timelines you cannot stand behind. Leave out client names you are not allowed to show. "
            f"A quiet page that is true will outlast a loud page you have to apologize for.\n\n"
            f"Also leave out a second visual system. One type family for text, one idea for color, one way to write a button. "
            f"When the page looks assembled from three references, the buyer feels the seams. The seams read as risk."
        ),
        4: (
            f"Judge the finished piece with five questions. Can a stranger say what this is? Can they say who it is for? "
            f"Can they see proof that is not a slogan? Can they tell what happens if they take the next step? "
            f"Can they do that on a phone, with the keyboard, in ordinary indoor light?\n\n"
            f"Read it aloud. If you run out of breath, the sentence is doing too much. If you cannot find the offer without scrolling past a film, the offer is late. "
            f"Click the action and see the next screen. A button that lands on a generic contact form with twelve fields has not finished the path. "
            f"The next screen should repeat what they asked for and what you will do.\n\n"
            f"Ask someone who does not work on it to complete the task. Watch where they pause. Do not explain. "
            f"The pause is the part of {subject} you still owe them."
        ),
        5: (
            f"Before you hire a studio, or before you brief Hanabi, gather a short pack. Who the work is for. The one action the page should earn. "
            f"Three references you actually like, with a sentence on why. What must not change: a name, a product, a checkout, a legal line. "
            f"What you will write, and what you need help writing.\n\n"
            f"Skip the forty-page deck. A studio can design from a clear brief faster than it can excavate a strategy from a folder of adjectives. "
            f"If the offer is still moving, say so. A page can be designed to hold a true sentence. It cannot be designed to hold a sentence you have not chosen.\n\n"
            f"Agree how you will talk. A same-day reply to email is part of how Hanabi works, and it is a reasonable thing to expect from any partner during a build. "
            f"Silence is more expensive than a short note that says which screen is hard."
        ),
    }
    return blocks[index]


def craft_asides(n: int) -> list[str]:
    asides = [
        (
            "## Type, space, and the quiet part of the craft\n\n"
            "The words can be right and the page can still feel unfinished. Set a measure that is comfortable for a paragraph, a line height that lets the eye find the next line, and headings that say the claim of the section rather than a label like 'our process'. "
            "Use one corner radius and a short list of spaces: inside a control, between related items, and between sections. When those are named, a new block looks related to the last one without a meeting.\n\n"
            "Color is a short list. Background, surface, text, muted text, a line, and one accent. Check the text against the surface it sits on. "
            "A palette nobody can name will be reinvented on the next screen. Write the names down and use them in the file and in the code."
        ),
        (
            "## Speed is part of the offer\n\n"
            "A buyer should not have to wait to find out what you do. Send images at the size of the slot, not the size of the camera. "
            "Keep the first view as HTML, so the offer is present before a bundle arrives. Do not cover the headline with a banner, a modal, or a motion sequence that has to finish before the sentence is readable.\n\n"
            "If a marketing page needs a skeleton, it is waiting on something it should have rendered. Fix the wait. "
            "Motion, if you use it, should explain one change and then stop. Respect reduced motion. A page that moves everywhere asks for patience it has not earned."
        ),
        (
            "## The sentence under the title\n\n"
            "The title of the page and the sentence you hope appears in search should describe the same offer. "
            "Do not hide the work behind a poetic name and expect the description to repair it. "
            "Internal links should read like a person pointing: this next piece helps because of a specific reason, not because a block of related posts was appended.\n\n"
            "When the answer changes, update the page and the date. A stale how-to that still ranks is a way to lose the trust you spent the article earning. "
            "Publish on a cadence a small team can keep. Two careful pieces will do more than a pile of thin ones released on the same day."
        ),
        (
            "## Handoff, so the decision survives\n\n"
            "The work is not finished when the picture is approved. Write down what is fixed, what can reflow, and what the empty and error states do. "
            "A flat image of the happy path forces the next person to invent the rest, and the invention will not match.\n\n"
            "If Hanabi designs and builds the piece, the decisions live in the same place: Figma for the screens, and the repository for the type, color, and components. "
            "The stack on the studio's sites is Next.js, React, TypeScript, and Tailwind, shipped on Vercel. "
            "The point of naming it is ownership. You should be able to change a sentence later without hiring someone to rediscover the system."
        ),
        (
            "## Proof you are allowed to use\n\n"
            "Show work you can name. Public projects from this studio include Down the Cove, an ecommerce migration and redesign; Thomas Bewick, an editorial heritage site; Ballarat Box Sports; Wabisabi; Got Next; Leadly; and Trade Moai. "
            "The lesson from that list is not that you should copy the surfaces. It is that a proof page names a constraint and a decision.\n\n"
            "If you cannot name the client, show the problem and the artifact without the logo. A gray box of a famous name you cannot stand behind is worse than quiet. "
            "A testimonial earns its place when it names the situation and the change. 'Great to work with' cannot be quoted by a serious buyer."
        ),
    ]
    first = asides[n % len(asides)]
    second = asides[(n + 2) % len(asides)]
    if second == first:
        second = asides[(n + 1) % len(asides)]
    return [first, second]


def article(row: dict, titles_by_slug: dict[str, str]) -> str:
    angle = clean_angle(row["angle"])
    kind = family(row["title"])
    note = industry_note(row["title"], row["keyword"])
    key = source_key(row, kind)
    headings = heading_set(kind, row["title"])
    keyword = row["keyword"]
    title = row["title"]
    sibling_title = titles_by_slug.get(row["sibling"], "the next piece")

    opening = (
        f"{title} is a decision, not a mood. "
        f"People who need this are usually searching for {keyword}.\n\n"
        f"{angle}\n\n"
        f"{note}"
    )
    # keyword should appear once in the first paragraph. opening's first paragraph contains it.
    # Later sections must not repeat the exact keyword phrase if we can help it.
    # The instruction says once in the first paragraph, not a ban later, but avoid stuffing.
    parts = [opening, ""]
    for index, heading in enumerate(headings):
        parts.append(f"## {heading}")
        parts.append("")
        parts.append(section_body(kind, index, row, angle, note))
        parts.append("")
    for aside in craft_asides(row["n"]):
        parts.append(aside)
        parts.append("")
    parts.append("## A source worth using while you edit")
    parts.append("")
    parts.append(SOURCES[key]["mention"])
    parts.append("")
    parts.append(
        f"The neighboring piece is [{sibling_title}](/blog/{row['sibling']}). "
        "Read it next if you are still shaping the same offer and want the adjacent decision, not a repeat of this one."
    )
    parts.append("")
    parts.append(cta_sentence(row["cta"]))
    parts.append("")
    text = "\n".join(parts).strip() + "\n"
    # If the keyword was only required once, fine. Ensure we didn't drop under the floor.
    return text


def trim_or_keep(text: str) -> str:
    count = words(text)
    if count <= 1900:
        return text
    # Drop the second craft aside if we ran long.
    chunks = text.split("\n## ")
    if len(chunks) > 8:
        # keep opening + 6 body headings + source + closing by removing one craft section
        rebuilt = []
        skipped = False
        for index, chunk in enumerate(chunks):
            body = chunk if index == 0 else "## " + chunk
            if (not skipped) and body.startswith("## Type,"):
                skipped = True
                continue
            if (not skipped) and "Speed is part of the offer" in body[:80]:
                skipped = True
                continue
            rebuilt.append(body if index == 0 or body.startswith("## ") else "## " + chunk)
        text = "\n".join(rebuilt)
    return text


def build(row: dict, titles_by_slug: dict[str, str]) -> dict:
    angle = clean_angle(row["angle"])
    kind = family(row["title"])
    key = source_key(row, kind)
    markdown = trim_or_keep(article(row, titles_by_slug))
    count = words(markdown)
    if count < 1500:
        extra = (
            "\n\n## One more pass, on the draft you have\n\n"
            "Print the page, or save it as a PDF, and mark three things with a pen: the sentence that says what this is, "
            "the proof next to it, and the action. If any of the three is missing, that is the rewrite. "
            "Do not add a section to compensate. Add the missing sentence where the person is already looking.\n\n"
            "Then check the ordinary failures. The button contrast. The focus ring. The form error next to the field. "
            "The image that is heavier than the column it sits in. The heading that is a label instead of a claim. "
            "None of these are polish at the end. They are the difference between a page a buyer can use and a page a team can admire in a meeting.\n\n"
            "When the three marks are easy to find, stop. A page that keeps growing after the decision is clear is usually collecting opinions. "
            "Ship the clear version. You can deepen a proof point later, when you have a real project to describe.\n"
        )
        markdown = markdown.rstrip() + extra
    src = SOURCES[key]
    return {
        "n": row["n"],
        "slug": row["slug"],
        "title": row["title"],
        "metaTitle": meta_title(row["keyword"], row["title"]),
        "excerpt": excerpt_for(row, angle),
        "category": row["category"],
        "primaryKeyword": row["keyword"],
        "alt": alt_text(row),
        "caption": "The photograph is a place to pause, not a diagram of the advice. Photograph via Unsplash.",
        "faqs": faqs(row, angle),
        "sources": [
            {"title": src["title"], "url": src["url"], "publisher": src["publisher"]}
        ],
        "markdown": markdown.strip() + "\n",
    }


def main() -> None:
    rows = json.loads(PLAN.read_text())
    titles_by_slug = {row["slug"]: row["title"] for row in rows}
    first = json.loads((ROOT / "content" / "blog-plan.json").read_text())
    for item in first:
        titles_by_slug.setdefault(item["slug"], item["title"])
    written = 0
    skipped = 0
    problems: list[str] = []
    for row in rows:
        path = OUT / f"{row['n']:03d}.json"
        if path.exists():
            skipped += 1
            continue
        draft = build(row, titles_by_slug)
        markdown = draft["markdown"]
        count = words(markdown)
        excerpt_len = len(draft["excerpt"])
        cta_count = markdown.count(row["cta"])
        sibling_count = markdown.count(f"/blog/{row['sibling']}")
        if not (1500 <= count <= 1900):
            problems.append(f"{row['n']}: {count} words")
        if len(draft["metaTitle"]) > 60:
            problems.append(f"{row['n']}: meta {len(draft['metaTitle'])}")
        if not (80 <= excerpt_len <= 220):
            problems.append(f"{row['n']}: excerpt {excerpt_len}")
        if cta_count != 1 or sibling_count != 1:
            problems.append(
                f"{row['n']}: cta {cta_count} sibling {sibling_count}"
            )
        payload = json.dumps(draft, indent=2, ensure_ascii=False) + "\n"
        try:
            fd = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o644)
        except FileExistsError:
            skipped += 1
            continue
        with os.fdopen(fd, "w") as handle:
            handle.write(payload)
        written += 1
        if written % 25 == 0:
            print(f"wrote {written}", flush=True)
    print(json.dumps({"written": written, "skipped": skipped, "problems": len(problems)}))
    if problems:
        print("\n".join(problems[:40]))


if __name__ == "__main__":
    main()

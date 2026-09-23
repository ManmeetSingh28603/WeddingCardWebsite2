# Mahima & Ayush — wedding invitation

A static site: plain HTML, CSS and JavaScript, no build step and no
dependencies.

```
index.html                 the way in — links to both cards and both builders
bride.html                 bride-side invitation
groom.html                 groom-side invitation
bride-invite-builder.html  bride-side guest-link builder
groom-invite-builder.html  groom-side guest-link builder
style.css                  all styling and animation
script.js                  CONFIG at the top, then behaviour
assets/                    everything the site actually loads
tests/                     node:assert checks over the markup and config
```

## Viewing it

### Published pages

- Bride invitation: `https://manmeetsingh28603.github.io/WeddingCardWebsite2/bride.html`
- Groom invitation: `https://manmeetsingh28603.github.io/WeddingCardWebsite2/groom.html`
- Bride builder: `https://manmeetsingh28603.github.io/WeddingCardWebsite2/bride-invite-builder.html`
- Groom builder: `https://manmeetsingh28603.github.io/WeddingCardWebsite2/groom-invite-builder.html`

`index.html` is the way in — it links to both cards and both builders rather
than bouncing to one of them. The builders are unlinked from the guest-facing
pages, but GitHub Pages cannot password protect a static file, so treat those
addresses as semi-private rather than secret.

Locally: double-click `index.html`. Everything works from the filesystem; the
only degradation is that the flying grains during the scratch use fallback
colours instead of ones sampled from the foil, because a browser will not let
a page read pixels back from a `file://` image.

To serve it properly instead: `npx serve .`

Tests: `node tests/invitation-pages.test.js`.

## Changing the content

**Everything the invitation says lives in the `CONFIG` object at the top of
`script.js`.** Nothing below it needs touching to change a name, a time or a
number. Anything not yet supplied is marked `MISSING` in a comment there.

Conventions worth knowing:

- An **empty string** removes a line rather than printing a blank. A gap where
  a line should be reads as a fault; a shorter card does not.
- A contact with an empty `tel` renders **without** call and WhatsApp buttons,
  since a `tel:+` link with no number leads nowhere. **An empty contact list
  takes the whole RSVP section off the page** — a heading and "we are only a
  call away" with nothing under them is worse than silence. Put a row in
  `CONFIG.rsvp` and the section comes back on its own.
- `CONFIG.lineage` prints under each name in the hero, the invited side first.
  It is set in Pinyon Script above them, so `.hero-names` needs a line-height
  over 1 and the padding under `.hero-name`, or a descender runs into the
  `D/O` line beneath it.
- **One venue, `AMARAA` in `script.js`** — name, address *and* coordinates
  together. The "Find your way to us" map is pinned by lat/lng, so a link
  whose name disagrees with the pin sends guests to the wrong place.
- `dress` on an event is optional and prints a **Guest colour code** row under
  the venue on the opened card. Leave it off and nothing renders.

## Still missing

**[`DETAILS-NEEDED.md`](DETAILS-NEEDED.md) is the full list** — what is
outstanding, what was deleted because it belonged to the card this was cloned
from, what is still borrowed from it, and what was assumed rather than given.
The short version:

| | |
| --- | --- |
| RSVP contact numbers | none supplied for either side, so the RSVP section removes itself from both cards |
| The year | assumed **2026**, which makes the Wedding a Tuesday — confirm |
| Amaraa Farms postal address | only "Arjunganj, Lucknow" is on record; the map pin is exact |
| Grandparents, and the groom's father | only the parents' names were supplied |
| `assets/og/og.jpg`, `favicon.png`, `apple-touch-icon.png` | deleted — each carried the previous couple's name or monogram. Nothing points at them; the head comments say how to put each back. |

Everything outstanding is also marked `MISSING` in a comment in `script.js`.

### Cloned from another card

This started as the invitation for a different couple. Their names, venue,
dates, wording and artwork have all been taken out, and
`tests/invitation-pages.test.js` fails if any of it creeps back. What remains
of theirs is decorative and carries nobody's name — the floral ground, the
three function films and the score — and is listed in `DETAILS-NEEDED.md` §3
so it can be replaced deliberately rather than forgotten.

## One invitation, many links

Guests are invited to different functions, and there is still only one
invitation. The link carries the list:

```
https://…/WeddingCardWebsite2/?e=sangeet,wedding
```

and only those cards render. The plain URL, with no `?e` at all, is the
general invitation and shows everything.

**Open the builder for that side to make a link** — tick the functions, choose
whether Blessings are included, copy, or hand it straight to WhatsApp. Nothing
is stored anywhere and no per-guest data lives in the repo, so inviting
someone never needs a code change or a redeploy: the link *is* the
configuration.

Three things follow from that:

- **The ids in `CONFIG.events` are part of every link already sent.** Renaming
  one silently breaks those links. Each builder keeps its own copy of the list
  and has to be edited in step — the tests check the two agree.
- **The dates follow the visible cards.** Hero, foil and footer all read from
  `spanOf()`, so a guest invited only to the Wedding is told *24 November*,
  not *23–24 November*. The countdown aims at their first function too. The
  `CONFIG.dates` strings are only a fallback for when nothing is dated.
- **An unknown or empty list falls back to the whole programme**, on purpose:
  a guest following a mistyped or truncated link should land on the
  invitation, not on an empty page.
- **`?b=0` drops the Blessings section**, outright rather than emptied.
  Blessings show by default, so only a link that says otherwise hides them.

## Save the dates

Three cards, built from `CONFIG.events`. Tapping one expands it in place into
the full invitation using a FLIP: the card jumps to its opened geometry, both
boxes are measured, and only the inverse transform is animated back to zero,
so nothing reflows mid-flight.

Every card that has a film takes its closed face from that film — a single
frame cut out of it (`assets/cards/*-still.jpg`) — so the shut card and the
opened one are the same scene, and no two cards on a page look alike. The
still doubles as the video's poster, so opening a card has nothing to flash
through. The films are `preload="none"`: a grid of cards must not pull a video
each on load.

**No card says whose side a function is on.** Guests are told what they are
invited to by their own link; the cards read the same for everyone.

One thing not to undo: **the backdrop hangs off `.schedule`, not off `body`.**
`.schedule` carries a `z-index` and is therefore its own stacking context, so
a backdrop painted at body level can never come between the section and one
of the section's own children — the opened card would render *underneath* the
dim.

Escape, the × button, and a tap on the backdrop all close.

## The gate

**Both cards open on the same film**, `assets/video/gate.mp4` — 720×1280
portrait, ten seconds. It starts on the closed doors, pushes through the arch
and ends on the Amaraa Farms sign revealed beyond them. That last frame is the
hand-off to the hero, so the gate runs the film out and hands over on its own
`ended` event rather than cutting it short.

It replaced two films that were different per side, both from the cloned card:
a Rumi Darwaza on the bride's and a sealed envelope on the groom's. Both have
been deleted.

A film is laid out at **its own aspect ratio**, or the element letterboxes
inside its box and the gate shows side bands. `data-shape="portrait"` picks
the portrait geometry; swap in a film of another shape and the `aspect-ratio`
and the `width: max(…)` that keeps it covering the screen move together.

The source burns a **sparkle in the bottom-right corner**, so the portrait rule
cuts 15% off the bottom — checked against the first frame and the last — and
pushes the element down by half the cut to re-centre what survives it. Taking
it off the right instead would cost much more of the arch.

**The film carries no wording**, so `.intro-prompt` is the only thing telling a
guest to tap. It is not decoration. The groom's card went without it while his
gate was the envelope, which had "Tap to open" printed into the frame; it is
back now that both cards share a silent film. Once the gate is plainly moving
the prompt turns into "Tap to skip" — and because one physical tap fires
`pointerdown`, then `touchend`, then `click`, `SKIP_AFTER_MS` is the grace
window that stops that cascade opening the gate and slamming it in the same
gesture.

`data-film-end` is the escape hatch for a film that runs on past the moment
that matters — it pauses there and hands over instead. No card sets it today;
the envelope film needed it, because its source cut to a blue backdrop.

If the film fails to load, the gate removes itself rather than leaving a tap
that does nothing.

## The hero card

What the gate opens onto: eyebrow, ॐ in a gold ring, the names in **Pinyon
Script**, the invitation sentence, and the dates between gold rules. Setting
`markImage` on a side puts a painting in that ring instead and opens it out
into a framed panel; nothing ships with one, because the painting that was
here belonged to the family this card was cloned from. The
palette lives in its own tokens — `--card-ground`, `--deep-ink`, `--olive-ink`,
`--gold-ink` — kept apart from the watercolour tokens that dress the gate,
blessings, RSVP and countdown.

### The floral ground, and why it is not `background.png`

The supplied `background.png` is **3811×1902, landscape 2:1**, with artwork
only on the left **31%** and the right **19%** and an empty middle of
**49.5%**. Cover-fitted to a 480-wide portrait column it shows the middle
27% — which is the empty part. **Every flower crops away.**

So the two bands were cut out and rebuilt as a portrait frame,
`assets/hero/floral_frame.webp` (1200×2100, 83 KB against the original's
5 MB): left band top-left and turned 180° for bottom-right, right band
top-right and turned for bottom-left, over a ground sampled from the
original's own middle (`#f7f2ed`). Each band's two inward edges are erased to
a gradient — without that the rectangles show as hard seams against the
ground.

**Replacing it:** a portrait export of the same artwork can be dropped
straight in and the re-composition thrown away. Another landscape one needs
the same treatment, and the band boundaries have to be re-measured — they are
specific to this file.

## Where the celebration is

Heading, address, and a Google Maps embed in the keyless `?output=embed`
form — **no API key anywhere**. It is pinned by coordinate rather than by a
name search, so it lands on the farm and not on whatever the search decides.
The frame is desaturated a little so the bright blue map sits inside the
invitation rather than on top of it, and the "Open in Maps" button is held
clear of Google's attribution strip, which their terms require stay legible.

Both cards carry this section, because both sides gather at the same venue.

## The countdown and the close

The countdown is **four small boxes, not a screen**. It sits between the
scratch card and the cards, and the scratch section is deliberately
content-height rather than `100svh` so the two read as one panel — heading,
bar, couple, then the boxes. Put `min-height: 100svh` back on
`.scratch-section` and the countdown is pushed onto a screen of its own again.

The footer closes on the **same floral ground as the hero**, untreated — same
artwork, same daylight, both ends of the invitation. The only thing over it is
the hero's own veil: a soft cream lift through the middle so the type holds,
and a seam at the top so the panel above runs into it. Because it is the same
file there is no second image to load.

## Assets

Everything the site loads lives in `assets/`. Root-level `*.mp4` and `*.mp3`
are gitignored, so working files dropped in the folder stay out of the repo.
`background.png` is the one source kept on disk: the hero's floral frame was
re-composed from it and cannot be re-cut from the derived WebP.

`music/ishq-hai.mp3` comes in at **0:38** — `MUSIC_START` in `script.js` — and
the `<audio>` carries no `loop`, because looping natively would drop back to 0
and replay the intro; the loop is re-seeded on `ended` instead. **It is the
previous couple's track**; a different song needs `MUSIC_START` changed or
removed, and deleting the file simply hides the music button.

Nothing in `assets/` is unreferenced. The films and stills for functions this
celebration does not have — Hawan, Mehendi, Reception — were deleted along with
the two retired gate films, which is about 25 MB of the previous card's media.
`gate.mp4` and `gate_poster.jpg` are the only media supplied for this
invitation; see [`DETAILS-NEEDED.md`](DETAILS-NEEDED.md) §3 for what is still
borrowed.

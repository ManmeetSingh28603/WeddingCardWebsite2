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
rsvp-sheet/Code.gs         the Google Apps Script that receives RSVP replies
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
  since a `tel:+` link with no number leads nowhere. An empty contact list
  drops the list and its "please call" line; the reply form stays.
- **Nothing says "Bride's Side" or "Groom's Side"** — not the RSVP, not the
  Blessings. Each card carries only its own family's contact and list.
- `CONFIG.lineage` prints under each name in the hero, the invited side first.
- **One venue, `AMARAA` in `script.js`** — name, address *and* coordinates
  together. The "Find your way to us" map is pinned by lat/lng, so a link
  whose name disagrees with the pin sends guests to the wrong place.
- `dress` on an event is optional and prints a **Guest colour code** row under
  the venue on the opened card. Leave it off and nothing renders. The family
  asked for no colour codes, so no function sets it.

## Still missing

**[`DETAILS-NEEDED.md`](DETAILS-NEEDED.md) is the full list** — what is
outstanding, what was deleted because it belonged to the card this was cloned
from, what is still borrowed from it, and what was assumed rather than given.
The short version:

| | |
| --- | --- |
| The year | assumed **2026**, which makes the Wedding a Tuesday — confirm |
| `favicon.png`, `apple-touch-icon.png` | deleted — each carried the previous couple's name or monogram. Nothing points at them; the head comments say how to put each back. |

Everything outstanding is also marked `MISSING` in a comment in `script.js`.

### Cloned from another card

This started as the invitation for a different couple. Their names, venue,
dates, wording and artwork have all been taken out, and
`tests/invitation-pages.test.js` fails if any of it creeps back. What remains
of theirs now is the score and the music-button artwork, listed in
`DETAILS-NEEDED.md` §3. Every picture on the card is the couple's own, from
their announcement site.

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

## The design

**Copied from the couple's own announcement site,
`https://majestic-melba-33846c.netlify.app`** — its fonts, palette, entrance,
hero, olive Save the Dates panel, Haldi painting and closing. The details are
this card's own: lineage, scratch card, countdown, map, Blessings, RSVP.

- **Type:** Italiana for the names and the door title; Cormorant Garamond for
  reading and for every section heading; Cinzel for the SAVE THE DATES title
  only; DM Sans for eyebrows and small caps.
- **Palette:** `--deep-ink #313b29`, `--ink-2 #474936`, `--olive-ink #6d7654`,
  `--gold-ink #ae8950`, on `--card-ground #f9f5ed` / `--page-ground #f6f0e6`.
  The older token names (`--ivory`, `--gold`, `--ink`, `--ink-soft`) are kept as
  aliases of these. Both cards share one design — the groom's card is no longer
  pink.
- **Artwork:** `assets/gate/royal-doors.jpg`, `assets/hero/floral-frame.jpg`
  (hero, Save the Dates, Blessings and footer all use it),
  `assets/hero/gold-divider.svg` and `assets/cards/haldi-card.jpg` (re-encoded
  from the site's 2.9 MB PNG as JPEG at the same size). **Sangeet and Wedding
  keep their films** — `assets/video/{sangeet,wedding}-bg.mp4`, each with a
  still in `assets/cards/` for its shut face — at the family's request.

## The entrance

**Two doors and a button**, as on the announcement site. One painting is split
down the middle: each `.door` is half the box wide with `background-size:
200%`, so shut they read as one pair. **Open invitation** slides each off its
own side over 1.55s, starts the score (inside the click, so browsers allow
it), reveals the hero, and removes the entrance at 1.6s. The film gate it
replaced, and all its crop and skip logic, is gone.

## Save the dates

Three cards on the olive panel, built from `CONFIG.events`. Haldi is the
couple's painting; Sangeet and Wedding show a still from their film when shut
and play the film once opened (`preload="none"`, so the grid never pulls a
video on load). Each card has one of three colourways (`event--marigold`,
`--stars`, `--breeze`) whose inks are taken card by card from the reference.
Shut, a card shows the name, the date and "Tap to unfold". Tapping it grows it
to a near full-height card with a FLIP — the card jumps to its opened
geometry, both boxes are measured, and only the inverse transform is animated
(1.1s, as the reference does it). The wording fades in once it has nearly
landed, set in the painting's open sky at `--pop-top`.

**No card says whose side a function is on.** Guests are told what they are
invited to by their own link; the cards read the same for everyone.

One thing not to undo: **the backdrop hangs off `.schedule`, not off `body`.**
`.schedule` carries a `z-index` and is therefore its own stacking context, so
a backdrop painted at body level can never come between the section and one
of the section's own children — the opened card would render *underneath* the
dim. For the same reason nothing inside `.schedule` may take a `z-index` of its
own: the floral is `::before`, the inset frame is an `outline`, and the
children are only `position: relative`.

Escape, the × button, and a tap on the backdrop all close.

## RSVP

This card's contact — call or WhatsApp — and then the **reply form**: name,
phone number, date of arrival, date of departure. Name and phone are required;
the dates are optional, for guests who are local. The form checks the phone
looks like a number and that departure is not before arrival.

Replies go to a **Google Sheet**, through the Apps Script web app in
[`rsvp-sheet/Code.gs`](rsvp-sheet/Code.gs) — its header says how to deploy
it. Its `/exec` URL is set in `CONFIG.rsvpForm.endpoint`; emptied, the form
still shows but tells a guest it cannot send and to call instead. Each row
records which card it came from. **Redeploying the script as a new
deployment changes the URL** — use Manage deployments → New version instead.

- Apps Script sends no CORS headers, so the post is `no-cors`: the response
  is opaque, and the form can only tell a sent request from a network failure.
- The hidden `website` field is a honeypot; a reply that fills it is dropped.
- The script stores any value starting `= + - @` as text, so a reply can never
  run as a formula in the sheet.
- Guests' phone numbers go to the sheet only — never into this public repo.

## The hero card

What the doors open onto: eyebrow, ॐ in a gold ring, the names in
**Italiana** with the lineage under each, and the invitation sentence, on the
floral ground with the reference's veil. Setting `markImage` on a side puts a
painting in that ring instead and opens it out into a framed panel; nothing
ships with one.

## Where the celebration is

Heading, address, and a Google Maps embed in the keyless `?output=embed`
form — **no API key anywhere**. It is pinned by coordinate rather than by a
name search, so it lands on the farm and not on whatever the search decides.
The frame is desaturated a little so the bright blue map sits inside the
invitation rather than on top of it, and the "Open in Maps" button is held
clear of Google's attribution strip, which their terms require stay legible.

## The countdown and the close

The countdown is **four small boxes, not a screen**. It sits between the
scratch card and the cards, and the scratch section is deliberately
content-height rather than `100svh` so the two read as one panel. The
scratch section wears the reference's "celebration of love" treatment: its
floral washed back to paper, with the gold divider on the seam above.

The footer closes as the reference does: blush to paper, the floral pressed
faintly in, "With love, Mahima & Ayush" in Cormorant. **No hashtag** — it was
removed at the family's request; `CONFIG.couple.hashtag` is empty.

## Assets

Everything the site loads lives in `assets/`, and nothing there is
unreferenced. Root-level `*.mp4`, `*.mp3`, `*.jpg` and `*.jpeg` are
gitignored, so working files dropped in the folder stay out of the repo.

`music/kk-cruisin.mp3` is the score (K.K. Cruisin', True Remix). It is never
autoplayed: it starts on the **Open invitation** press, inside the click, so
browsers allow sound. It plays from the top — `MUSIC_START` in `script.js` is 0
— and the loop restarts there on `ended` rather than with a native `loop`, so a
future song with an intro to skip only needs that number raised. Deleting the
file simply hides the music button.

# What is still needed

This card was built by cloning an existing invitation — one made for a
different couple, **Radhika & Raghav**, at Hotel Damson Plum. Everything that
identified them has been taken out. This file is the list of what that left
behind, and what only you can supply.

Everything the invitation *says* lives in the `CONFIG` object at the top of
`script.js`. You do not need to touch anything below it.

---

## 1. Blocking — the card is incomplete without these

| What | Where it goes | What happens meanwhile |
| --- | --- | --- |
| **The year** | `CONFIG.dates.year` and `CONFIG.dates.moment.y` | Assumed **2026** — see §4. |

The RSVP numbers and the venue address have arrived and are on the card.
The share card (`assets/og/og.jpg`) is the family's own monogram artwork,
centred on 1200×630 from the `og.jpeg` they sent.

---

## 2. Deleted because it belonged to the cloned card — you must supply a replacement

These were **not** generic decoration. Each one carried the other couple's
name, their monogram, or their family's own choice, so each has been deleted
outright rather than left in place. A wrong picture is worse than no picture.

| File to supply | Size | What it is | What is happening right now |
| --- | --- | --- | --- |
| `favicon.png` | 32×32 | The little icon in a browser tab | The old one was their **RR monogram**. There is none now, so browsers show their default and ask for `/favicon.ico` once per page (a harmless 404 in the console). Add the file and restore the `<link rel="icon">` — again, the comment in the head marks the spot. |
| `apple-touch-icon.png` | 180×180 | The icon if someone saves the card to their phone's home screen | Same monogram, same story. |
| *(optional)* an image for the gold ring | square, ~300px | A painting instead of the ॐ in the hero's gold ring | The old card had a Shrinathji pichwai there, which was **that family's choice**. Both cards now show ॐ, which is what your own announcement site uses. If you want a painting instead, put it in `assets/hero/` and set `markImage:` on that side in `script.js` — the ring opens out into a framed panel for it. |

---

## 3. Still borrowed from the cloned card — your call

These are decorative and carry nobody's name, so they have been **left in
place and working**. Deleting them would leave a blank, broken card. But they
were made for the other wedding, so replace them if you want the invitation to
be entirely your own.

| File | What it does | Notes |
| --- | --- | --- |
| `assets/hero/floral_frame.webp` | The floral background behind the hero **and** the footer — both ends of the card | It was re-composed from their artwork. Replacing it needs care: see **The floral ground** in `README.md`, which explains why it is a portrait rebuild and what a replacement has to be. |
| `assets/cards/haldi-mehendi-still.jpg`<br>`assets/cards/sangeet-still.jpg`<br>`assets/cards/wedding-still.jpg` | The face of each shut function card | Generic scenes — a bougainvillea arch, a ballroom, a garden. Each is a frame cut from the film below it, so a replacement has to be cut from the matching film or both change together. |
| `assets/video/haldi-mehendi-bg.mp4`<br>`assets/video/sangeet-bg.mp4`<br>`assets/video/wedding-bg.mp4` | The film behind each card once it is opened | Same three scenes, moving. |
| `assets/music/ishq-hai.mp3` | The background score | **This is the song the other family chose.** It starts at 0:38 (`MUSIC_START` in `script.js`), which is tuned to this track — a different song needs that number changed or removed. Delete the file and the music button hides itself; nothing else breaks. |
| `assets/scratch/couple.webp` | The illustration of the couple under the scratch bar | The previous card's drawing, kept by choice. It is faceless and carries no names. Replace the file to change it. |
| `assets/music/kamaicha.png`, `bow.png` | The artwork on the music button | Supplied to the previous project. |

`assets/video/gate.mp4` and `assets/hero/gate_poster.jpg` are **yours** — the
film you sent. Everything else in `assets/` is listed above.

---

## 4. Assumed rather than given — please confirm

| Assumption | Why | If wrong |
| --- | --- | --- |
| **The year is 2026** | Your announcement says only "23rd / 24th November". 2026 is the next one. It makes **Haldi and Sangeet a Monday** and the **Wedding a Tuesday** — worth a second look, since that is unusual. | `CONFIG.dates` — the year, the footer string, and `moment.y` |
| **Both sides are invited to all three functions** | Nothing said otherwise. The two cards differ only in whose name comes first, whose family line shows, and whose compliments are listed. | `SIDE_CONFIGS[…].events` |
| **The countdown aims at the wedding**, 24 Nov 7:00 pm | It was aimed at the wedding on the old card too. | `CONFIG.dates.moment` |
| **The three functions' descriptions** | Taken word for word from your announcement site. | `copy:` on each event |

---

## 5. Wording that is mine, not yours

Not borrowed from the cloned card, but not from your announcement either — I
wrote it. Change any of it freely.

- The meta description and share-card title on both pages: *"With love, Mahima & Ayush invite you to celebrate their wedding at Amaraa Farms, Lucknow."*
- The RSVP line: *"For timings, travel, or anything at all — please call."*
- The tap prompts on the gate: *"Tap to begin celebration"* (bride) and *"Tap to open the invitation"* (groom).
- *"Scratch to reveal"*, painted into the foil itself by `drawFoil()` in `script.js`.
- The blessings heading is **empty** — the line that was there was the other family's sign-off. Add your own to `CONFIG.blessings.note` or leave it hidden.

Taken straight from your announcement site and safe to leave: *"Together with
our families"*, *"With joyous hearts, we invite you…"*, *"Two days, one
beautiful beginning"*, *"The festivities"*, *"Save the dates"*, *"Find your way
to us"*, *"We cannot wait to celebrate with you"*, **#MahimaWedsAyush**, and
the ॐ.

---

## 6. Already confirmed — no action needed

What you gave me, in place and correct:

- **Bride's side** — Mr Prem Sagar Pal (father), Mrs Neetu Pal (mother). With Best Compliments: Prem Sagar Pal, Neetu Pal, Garima Pal.
- **Groom's side** — Mrs Gayatri Srivastava (mother), Mr Vijay Kumar Sahay (father). With Best Compliments: Gayatri Srivastava, Utkarsha Sahay.
- **Grandparents** — bride: Late Kanhaiyalal Pal & Late Sakhiya Devi (Baba, Dadi), Shtrughan Pal & Vidyavati Pal (Nana, Nani). Groom: Late Surendra Prasad & Late Sushila Prasad, Late Badrinath Sahay & Late Saraswati Sahay.
- **RSVP** — bride's side Prem Sagar Pal, groom's side Gayatri Srivastava. Each card lists only its own side.
- **Venue** — Amaraa Farms and Resort, Arjunganj, Lucknow, Uttar Pradesh 226002.
- **Spellings** of the compliments lists confirmed.
- Haldi 23rd, 11:00 am · Sangeet 23rd, 7:00 pm · Wedding 24th, 7:00 pm, all at Amaraa Farms, Arjunganj, Lucknow.
- **No guest colour codes** on any function — the family asked for them to be removed.
- **"Confirm Your Presence" is gone** — the form, its backend, its styling and both builders' tick boxes.

The hero prints grandparents, then parents, under each name — see
`CONFIG.lineage`. "Shtrughan" is spelled as supplied; the usual spelling is
"Shatrughan", so it is worth one confirmation.

---

## One thing to know about this repo

**It is public.** Anyone with the address can read it, and GitHub Pages cannot
password-protect a static file. That is fine for an invitation, but it is why
nothing lives here beyond what a paper card would print: the two RSVP numbers
are on the card on purpose, but no guest list and no ID documents — and none
should be added.

`node tests/invitation-pages.test.js` checks all of the above that can be
checked: that the previous couple's names, wording and artwork have not crept
back, and that nothing points at a file that no longer ships.

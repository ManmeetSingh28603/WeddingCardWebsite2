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
| **RSVP phone numbers**, bride's side and groom's side | `CONFIG.rsvp.bride` / `.groom` in `script.js` | **The whole RSVP section removes itself from both cards.** A heading and "please call" with nothing under them is worse than no section, so it hides until a number exists. Add one row and it comes back on its own. |
| **The year** | `CONFIG.dates.year` and `CONFIG.dates.moment.y` | Assumed **2026** — see §4. |
| **Full postal address of Amaraa Farms** | `CONFIG.venue.address` and `AMARAA.address` | The venue line reads just "Arjunganj, Lucknow". The map pin itself is exact, taken from your Google Maps link. |

Each of these is marked `MISSING` in a comment in `script.js`, so they are
findable without this file.

---

## 2. Deleted because it belonged to the cloned card — you must supply a replacement

These were **not** generic decoration. Each one carried the other couple's
name, their monogram, or their family's own choice, so each has been deleted
outright rather than left in place. A wrong picture is worse than no picture.

| File to supply | Size | What it is | What is happening right now |
| --- | --- | --- | --- |
| `assets/og/og.jpg` | 1200×630 | The **share card** — the picture WhatsApp, iMessage and Instagram show when someone sends the link | The old one said *"Radhika & Raghav · Hotel Damson Plum, Lucknow · 20–21 November 2026"*. **It was live.** There is now no `og:image` at all, so a shared link shows the title and one line of text, and no picture. Add the file, then put the `og:image`, `og:image:width`, `og:image:height` and `twitter:image` tags back in both `bride.html` and `groom.html` — the comment in the head says exactly how, and the paths must be absolute. |
| `favicon.png` | 32×32 | The little icon in a browser tab | The old one was their **RR monogram**. There is none now, so browsers show their default and ask for `/favicon.ico` once per page (a harmless 404 in the console). Add the file and restore the `<link rel="icon">` — again, the comment in the head marks the spot. |
| `apple-touch-icon.png` | 180×180 | The icon if someone saves the card to their phone's home screen | Same monogram, same story. |
| `assets/scratch/couple.webp` | transparent PNG or WebP, ~450px wide | An **illustration of the couple** that stood under the scratch bar | The old one was drawn for them. The section closes up neatly without it, so nothing looks broken. Drop a file in and restore the `<img class="scratch-couple">` in both cards — `.scratch-couple` in `style.css` still styles it. |
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
| **The wedding has no dress code** | Haldi and Sangeet have one on your announcement; the wedding does not. | add `dress:` to the wedding event |
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
- **Groom's side** — Gayatri Srivastava (mother). With Best Compliments: Gayatri Srivastava, Utkarsha Sahay.
- Haldi 23rd, 11:00 am · Sangeet 23rd, 7:00 pm · Wedding 24th, 7:00 pm, all at Amaraa Farms, Arjunganj, Lucknow.
- Dress codes: Yellow & Orange (Haldi), Dark Blue / Black & Red / Maroon (Sangeet).
- **"Confirm Your Presence" is gone** — the form, its backend, its styling and both builders' tick boxes.

Only the parents' names were supplied, so the hero lines read `D/O Smt. Neetu
Pal & Shri Prem Sagar Pal` and `S/O Smt. Gayatri Srivastava`. Send
grandparents' names, or the groom's father's, and they go in at
`CONFIG.lineage`.

---

## One thing to know about this repo

**It is public.** Anyone with the address can read it, and GitHub Pages cannot
password-protect a static file. That is fine for an invitation, but it is why
no phone numbers, no guest list and no ID documents live here — and why they
should not be added.

`node tests/invitation-pages.test.js` checks all of the above that can be
checked: that the previous couple's names, wording and artwork have not crept
back, and that nothing points at a file that no longer ships.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const has = (file) => fs.existsSync(path.join(root, file));

/* ── the pages exist ── */
for (const f of ['index.html', 'bride.html', 'groom.html',
                 'bride-invite-builder.html', 'groom-invite-builder.html']) {
  assert.ok(has(f), f + ' must exist');
}

/* ── the media each gate and each filmed card actually needs ── */
for (const f of ['assets/video/gate.mp4',               // the gate, both cards
                 'assets/hero/gate_poster.jpg',         // and its held first frame
                 'assets/video/haldi-mehendi-bg.mp4',   // Haldi card
                 'assets/video/sangeet-bg.mp4',         // Sangeet card
                 'assets/video/wedding-bg.mp4',         // Wedding card
                 'assets/music/ishq-hai.mp3']) {
  assert.ok(has(f), f + ' must exist');
}

const bride = read('bride.html');
const groom = read('groom.html');
const index = read('index.html');
const script = read('script.js');
const css = read('style.css');
const brideBuilder = read('bride-invite-builder.html');
const groomBuilder = read('groom-invite-builder.html');
const pages = [['bride', bride], ['groom', groom]];
const builders = [['bride', brideBuilder], ['groom', groomBuilder]];
const everything = [['bride.html', bride], ['groom.html', groom],
                    ['index.html', index], ['script.js', script], ['style.css', css],
                    ['bride-invite-builder.html', brideBuilder],
                    ['groom-invite-builder.html', groomBuilder]];

assert.match(bride, /data-invite-side="bride"/);
assert.match(groom, /data-invite-side="groom"/);

/* ── nothing of the previous celebration may survive a copy ── */
for (const [what, src] of everything) {
  assert.doesNotMatch(src, /Radhika|Raghav|Rastogi|Khanna|Damson|Tivoli/i,
                      'the previous couple must not linger in ' + what);
}

/* ── nor may their artwork. Every one of these carried their names, their
      monogram or their family's choice; a wrong picture on a share card or
      a browser tab is worse than none, so each is DELETED rather than
      swapped for a placeholder, and the markup must not reach for it. ── */
for (const f of ['favicon.png',                 // RR monogram
                 'apple-touch-icon.png',        // RR monogram
                 'assets/hero/nathji.jpg']) {   // the pichwai their side chose
  assert.ok(!has(f), f + ' is the previous card’s and must stay deleted');
}
for (const [name, page] of pages) {
  const markup = page.replace(/<!--[\s\S]*?-->/g, '');   // the comments name them on purpose
  /* The share card is the couple's own monogram now, and a scraper only
     follows an absolute URL. */
  const IMG = 'content="https://manmeetsingh28603.github.io/WeddingCardWebsite2/assets/og/og.jpg"';
  assert.ok(markup.includes('<meta property="og:image" ' + IMG), name + ' needs an absolute og:image');
  assert.ok(markup.includes('<meta name="twitter:image" ' + IMG), name + ' needs an absolute twitter:image');
  assert.doesNotMatch(markup, /favicon\.png|apple-touch-icon\.png|nathji/,
                      name + ' must not reach for deleted artwork');
  assert.match(markup, /<img class="scratch-couple" src="assets\/scratch\/couple\.webp"/,
               name + ' shows the couple under the scratch bar');
  assert.match(markup, /<meta name="twitter:card" content="summary_large_image"/,
               name + ' shows the share picture large');
}
assert.ok(has('assets/og/og.jpg'), 'the share card image must ship');
assert.doesNotMatch(script, /markImage: '/, 'no side may name artwork that does not ship');

/* ── and no wording lifted from that card ── */
for (const [what, src] of everything) {
  assert.doesNotMatch(src.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, ''),
                      /With immense joy and love|only a call away|good wishes of our families/i,
                      'copy from the cloned card must not linger in ' + what);
}

/* ── the postal address, as the family wrote it ── */
assert.match(script, /address: 'Amaraa Farms and Resort, Arjunganj, Lucknow, Uttar Pradesh 226002'/);

/* ── Confirm Your Presence is GONE, not merely switched off: the form, its
      styling, its glyphs, its link parameter and its builder tick box ── */
for (const [what, src] of everything) {
  assert.doesNotMatch(src, /attendance|attendParam|Confirm Your Presence|Aadhaar|af-submit|attend-done/i,
                      'the attendance form must not linger in ' + what);
}
for (const [name, page] of pages) {
  assert.doesNotMatch(page, /ic-upload|ic-check/,
                      name + ' keeps glyphs only the removed form used');
}
assert.doesNotMatch(css, /\.af-|\.attend/, 'the attendance styling must be gone too');
assert.doesNotMatch(script, /\bwantsAttendance\b|\binitAttendance\b/);
assert.ok(!has('apps-script'), 'the form backend must be gone with the form');

/* ── an RSVP with nobody to call takes itself off the page ── */
assert.match(script, /document\.getElementById\('rsvp'\)\?\.remove\(\);/,
             'an empty contact list must remove the section, not print an empty heading');
assert.match(script, /tel: '918318526297'/, 'the bride’s side has a number to call');
assert.match(script, /tel: '917275251099'/, 'the groom’s side has a number to call');

/* ── one gate film, on both cards, cropped as the portrait it is ── */
for (const [name, page] of pages) {
  assert.match(page, /<video class="intro-film"/, name + ' needs a gate film');
  assert.match(page, /src="assets\/video\/gate\.mp4"/, name + ' opens on the gate film');
  assert.match(page, /poster="assets\/hero\/gate_poster\.jpg"/, name + ' needs the held first frame');
  assert.match(page, /data-shape="portrait"/, name + ' film is portrait and is cropped as such');
  assert.doesNotMatch(page, /opening\.mp4|envelope-opening\.mp4|opening_poster|envelope_poster/,
                      name + ' must not still reach for a retired gate');
  /* The gate ends on the venue reveal, so it runs out rather than being cut
     short. A data-film-end here would throw away the hand-off. */
  assert.doesNotMatch(page, /data-film-end/, name + ' must run the gate film to its end');
  /* The film carries no wording of its own, so this is the whole
     instruction — the groom's card went without it while his gate was the
     envelope, which had "Tap to open" printed into it. */
  assert.match(page, /class="intro-prompt"[\s\S]{0,260}intro-prompt-text/,
               name + ' gate would have nothing telling a guest to tap');
}

/* ── the CSS envelope that the groom's film replaced is gone ── */
for (const [what, src] of [['groom.html', groom], ['style.css', css], ['script.js', script]]) {
  assert.doesNotMatch(src, /env-flap|env-seal|env-pocket|env-card|data-gate="envelope"/,
                      'the CSS envelope must not linger in ' + what);
}

/* ── the gate shows no names: they belong to the card behind it ── */
for (const [name, page] of pages) {
  assert.doesNotMatch(page, /intro-couple|data-intro-names/,
                      name + ' must not put the couple on the gate');
}
assert.doesNotMatch(css, /\.intro-couple/, 'the gate-names rule must be gone too');

/* ── a film is laid out at ITS OWN aspect ratio, or the element
      letterboxes inside its own box and the gate shows side bands ── */
assert.match(css, /\.intro-film \{[^}]*aspect-ratio: 1280 \/ 720/s,
             'the landscape film needs a landscape box');
assert.match(css, /\.intro-film\[data-shape="portrait"\] \{[^}]*aspect-ratio: 720 \/ 1280/s,
             'the portrait film needs a portrait box');
assert.doesNotMatch(css, /\.intro-prompt \{[^}]*display: none/s,
                    'the gate would have no instruction at all');

/* ── the score: same track both sides, in at 0:38, and NOT natively looped
      (native loop would drop back to 0 and replay the intro) ── */
for (const [name, page] of pages) {
  assert.match(page, /assets\/music\/ishq-hai\.mp3/, name + ' must use the score');
  assert.doesNotMatch(page, /<audio[^>]*\sloop/, name + ' must not loop the audio natively');
}
assert.match(script, /const MUSIC_START = 38;/);
assert.match(script, /currentTime = MUSIC_START/);

/* ── the three cards, each on its own film ── */
assert.match(script, /film: 'assets\/video\/haldi-mehendi-bg\.mp4', filmCrop: 'bottom'/,
             'the Haldi film needs the crop that loses its generator mark');
assert.match(script, /film: 'assets\/video\/sangeet-bg\.mp4', filmTone: 'night'/);
assert.match(script, /film: 'assets\/video\/wedding-bg\.mp4'/);
assert.match(script, /class="event-film"/);
assert.match(script, /preload="none"/, 'a grid of cards must not pull a video each on load');
assert.match(css, /\.event\.is-open \.event-film \{ opacity: 1; \}/);
assert.match(css, /\.event\.is-open\.has-film--night \.event-detail/,
             'a night film needs the dark veil, or the type vanishes into it');

/* ── a filmed card opens as the film: full-bleed, no scrim over the
      picture, and the veil carried by the text block itself ── */
assert.match(css, /\.event\.is-open\.has-film \{[^}]*height: min\(92svh, 840px\)/s,
             'a filmed card opens near full-screen');
assert.match(css, /\.event\.is-open\.has-film::before \{ background: none; \}/,
             'the all-over scrim must come off, or the film is just a tint');
assert.match(css, /\.event\.is-open\.has-film \.event-detail \{[^}]*linear-gradient/s,
             'the wording carries its own fade');

/* ── no two cards on a page may draw the same film: that is what makes two
      functions look like the same card twice ── */
const films = {};
for (const m of script.matchAll(/id: '([a-z]+)'[\s\S]*?film: '([^']+)'/g)) films[m[1]] = m[2];
const used = Object.values(films);
assert.equal(new Set(used).size, used.length, 'two cards share a film: ' + used.join(', '));

/* ── the guest colour code: optional, and the family asked for none ── */
assert.match(script, /const dress = ev\.dress/);
assert.match(script, /pop-dress-label">Guest colour code/);
assert.match(css, /\.pop-dress \{/, 'the colour code row needs its own rule');
assert.doesNotMatch(script, /^\s*dress: '/m, 'no function carries a colour code');

/* ── one venue, one pin, on BOTH cards — the two-venue split is over ── */
assert.match(script, /lat: 26\.7993442, lng: 80\.9897956/, 'Amaraa Farms needs its pin');
assert.match(script, /venue: AMARAA/);
for (const [name, page] of pages) {
  assert.match(page, /id="venue"/, name + ' carries the venue section');
  assert.match(page, /venueMapFrame/, name + ' carries the map');
}

/* ── the RSVP list is headed by whichever side's card it is ── */
assert.match(script, /SIDE === 'groom' \? 'Groom\u2019s Side' : 'Bride\u2019s Side'/);

/* ── lineage, and the descender fix that stops a tail colliding ── */
assert.match(script, /D\/O Smt\. Neetu Pal &amp; Shri Prem Sagar Pal/);
assert.match(script, /S\/O Smt\. Gayatri Srivastava &amp; Shri Vijay Kumar Sahay/);
assert.match(script, /'Granddaughter of',\s*'Late Shri Kanhaiyalal Pal/);
assert.match(script, /'Grandson of',\s*'Late Shri Surendra Prasad/);
assert.match(css, /\.hero-names \{[^}]*--font-script/s, 'the names are set in the script face');
assert.doesNotMatch(css, /\.hero-names \{[^}]*line-height: \.82/s, 'the clipping line-height must not come back');

/* ── the blessings each side was given ── */
assert.match(script, /'Prem Sagar Pal',\s*'Neetu Pal',\s*'Garima Pal',/);
assert.match(script, /'Gayatri Srivastava',\s*'Utkarsha Sahay',/);

/* ── index is a way in, not a redirect ── */
assert.doesNotMatch(index, /http-equiv="refresh"/, 'index must not bounce straight to a card');
for (const link of ['bride.html', 'groom.html', 'bride-invite-builder.html', 'groom-invite-builder.html']) {
  assert.match(index, new RegExp('href="' + link.replace('.', '\\.') + '"'), 'index links to ' + link);
}

/* ── each builder keeps its own copy of the function list, so the two have
      to be checked against CONFIG.events: an id that drifts breaks every
      link already sent ── */
const ids = [...script.matchAll(/^      id: '([a-z]+)'/gm)].map(m => m[1]);
assert.deepEqual(ids, ['haldi', 'sangeet', 'wedding']);
for (const [name, b] of builders) {
  const builderIds = [...b.matchAll(/\{ id: '([a-z]+)'/g)].map(m => m[1]);
  assert.deepEqual(builderIds, ids, name + ' builder has drifted from CONFIG.events');
  assert.match(b, /params\.push\('b=0'\)/, name + ' builder must write the blessings parameter');
  assert.match(b, /id="blessings"/, name + ' builder needs the blessings tick box');
  assert.match(b, new RegExp('new URL\\(\'' + name + '\\.html\''), name + ' builder must point at its own card');
}

console.log('Invitation page configuration checks passed.');

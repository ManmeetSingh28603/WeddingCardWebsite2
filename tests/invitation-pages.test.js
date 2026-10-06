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

/* ── the artwork the design actually loads ── */
for (const f of ['assets/gate/royal-doors.jpg',   // the entrance doors
                 'assets/hero/floral-frame.jpg',  // hero, schedule, blessings, footer
                 'assets/hero/gold-divider.svg',
                 'assets/cards/haldi-card.jpg',
                 'assets/cards/sangeet-still.jpg',  // Sangeet and Wedding keep
                 'assets/video/sangeet-bg.mp4',     // their films, each with
                 'assets/cards/wedding-still.jpg',  // a still for its shut face
                 'assets/video/wedding-bg.mp4',
                 'assets/music/kk-cruisin.mp3']) {
  assert.ok(has(f), f + ' must exist');
}
/* ── and what the redesign replaced is gone ── */
for (const f of ['assets/video/gate.mp4', 'assets/video/haldi-mehendi-bg.mp4',
                 'assets/music/ishq-hai.mp3',
                 'assets/hero/floral_frame.webp', 'assets/hero/gate_poster.jpg']) {
  assert.ok(!has(f), f + ' was replaced and must stay deleted');
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

/* ── the old cloned card's form stays gone; the new one is the RSVP form ── */
for (const [what, src] of everything) {
  assert.doesNotMatch(src, /attendance|attendParam|Confirm Your Presence|Aadhaar|af-submit|attend-done/i,
                      'the cloned card’s attendance form must not linger in ' + what);
}
assert.ok(!has('apps-script'), 'the cloned card’s form backend must stay gone');

/* ── RSVP: this card's contact, then the reply form ── */
assert.match(script, /tel: '918318526297'/, 'the bride’s side has a number to call');
assert.match(script, /tel: '917275251099'/, 'the groom’s side has a number to call');
for (const [name, page] of pages) {
  assert.match(page, /<form class="rsvp-form" id="rsvpForm"/, name + ' carries the RSVP form');
  for (const field of ['name', 'phone', 'arrival', 'departure']) {
    assert.match(page, new RegExp('<input[^>]*name="' + field + '"'), name + ' form asks for ' + field);
  }
  assert.match(page, /type="date" name="arrival"/, name + ' arrival is a date');
  assert.match(page, /type="date" name="departure"/, name + ' departure is a date');
  assert.match(page, /class="rsvp-trap"[^>]*name="website"/, name + ' form needs its honeypot');
}
assert.match(script, /rsvpForm: \{\s*endpoint: '/, 'the form posts to a configured endpoint');
assert.match(script, /mode: 'no-cors'/, 'Apps Script sends no CORS headers');
assert.ok(has('rsvp-sheet/Code.gs'), 'the sheet script must ship with its setup notes');
assert.match(read('rsvp-sheet/Code.gs'), /\^\[=\+\\-@\]/, 'replies must not be stored as live formulas');

/* ── no "Bride's Side" / "Groom's Side" anywhere a guest can read ── */
for (const [what, src] of [['script.js', script], ['bride.html', bride], ['groom.html', groom]]) {
  assert.doesNotMatch(src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, ''),
                      /(Bride|Groom)’s Side|(Bride|Groom)'s Side/,
                      'a side label must not be printed in ' + what);
}
assert.doesNotMatch(css, /\.bl-side|\.rsvp-side/, 'the side-label styling must be gone too');

/* ── no hashtag on either card ── */
assert.match(script, /hashtag: '',/, 'the hashtag is removed');
for (const [name, page] of pages) {
  assert.doesNotMatch(page, /data-hashtag|MahimaWedsAyush/i, name + ' must not print the hashtag');
}

/* ── the entrance: the royal doors, opened by a button ── */
for (const [name, page] of pages) {
  assert.match(page, /class="door door-left"[\s\S]*class="door door-right"/, name + ' needs both doors');
  assert.match(page, /<button class="open-button" id="openInvitation"/, name + ' needs the open button');
  assert.doesNotMatch(page, /<video/, name + ' must not carry a gate film any more');
}
assert.match(css, /\.door \{[^}]*background-image: url\("assets\/gate\/royal-doors\.jpg"\)/s);
assert.match(css, /\.entrance\.is-open \.door-left  \{ transform: translateX\(-102%\); \}/);
assert.doesNotMatch(css, /intro-film|ivory-dissolve|intro-prompt/, 'the film gate styling must be gone');
assert.match(script, /startBgMusic\(\);\n    screen\.classList\.add\('is-open'\)/,
             'the score starts inside the open click');

/* ── the reference's faces, and nothing else ── */
for (const [name, page] of pages) {
  assert.match(page, /family=Cinzel[^"]*Cormorant\+Garamond[^"]*DM\+Sans[^"]*Italiana/, name + ' loads the reference fonts');
  assert.doesNotMatch(page, /Pinyon/, name + ' must not load the old script face');
}
assert.doesNotMatch(css, /Pinyon|--font-script/);

/* ── the score: same track both sides, looped from MUSIC_START by script
      rather than natively, and never autoplayed: it starts on the open click ── */
for (const [name, page] of pages) {
  assert.match(page, /<audio id="bgMusic" src="assets\/music\/kk-cruisin\.mp3"/, name + ' must use the score');
  assert.doesNotMatch(page, /<audio[^>]*\s(loop|autoplay)/, name + ' must not loop or autoplay natively');
}
assert.match(script, /const MUSIC_START = 0;/);
assert.match(script, /currentTime = MUSIC_START/);

/* ── the three cards: Haldi on the couple's painting, Sangeet and Wedding
      on their films, each in its own colourway ── */
assert.match(script, /art: 'assets\/cards\/haldi-card\.jpg', theme: 'marigold',\n(?!\s*film:)/);
assert.match(script, /art: 'assets\/cards\/sangeet-still\.jpg', theme: 'stars',\s*film: 'assets\/video\/sangeet-bg\.mp4'/);
assert.match(script, /art: 'assets\/cards\/wedding-still\.jpg', theme: 'breeze',\s*film: 'assets\/video\/wedding-bg\.mp4'/);
assert.match(script, /preload="none"/, 'a grid of cards must not pull a video each on load');
assert.match(css, /\.event\.is-open \.event-film \{ opacity: 1; \}/);
for (const theme of ['marigold', 'stars', 'breeze']) {
  assert.match(css, new RegExp('\\.event--' + theme + ' \\{[^}]*--pop-top'), theme + ' needs its colourway');
}
assert.match(script, /Tap to unfold/);

/* ── shut, a card wears its teaser name; opened, its plain name ── */
assert.match(script, /id: 'haldi', title: 'Haldi', teaser: 'The Yellow Affair'/);
assert.match(script, /id: 'sangeet', title: 'Sangeet', teaser: 'The Wedding Jukebox'/);
assert.match(script, /id: 'wedding', title: 'Wedding', teaser: 'The Forever Affair'/);
assert.match(script, /class="event-name">\$\{ev\.teaser \|\| ev\.title\}/);
assert.match(script, /class="pop-name">\$\{ev\.title\}/);
/* the teaser sits over the busiest part of each painting, so the shut card
   lays a pool of its own ground behind the words, and drops it when open */
for (const theme of ['marigold', 'stars', 'breeze']) {
  assert.match(css, new RegExp('\\.event--' + theme + ' \\{[^}]*--scrim:'), theme + ' needs a scrim colour');
}
assert.match(css, /\.event::before \{[^}]*radial-gradient[^}]*var\(--scrim\)/s);
assert.match(css, /\.event\.is-open::before \{ opacity: 0; \}/);
/* "Tap to unfold" is pinned to the card's foot, so it must sit OUTSIDE the
   summary: inside it, the pin resolved against the summary and landed on
   the date. Outside, the name and date centre in the card on their own. */
assert.match(script, /<\/div>\s*<p class="event-open">Tap to unfold<\/p>/,
             'Tap to unfold must be a direct child of the card, after the summary');

/* ── no map button on the cards: the Venue section carries the map ── */
assert.doesNotMatch(script + css, /event-map-link|Show location on map/);

/* ── the groom's side lists Ayush as well as his mother ── */
assert.match(script, /\{ name: 'Ayush Sahay',\s*tel: '918123764986', shown: '\+91 81237 64986' \}/);

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

/* ── lineage, under names set in Italiana as the reference sets them ── */
assert.match(script, /D\/O Smt\. Neetu Pal &amp; Shri Prem Sagar Pal/);
assert.match(script, /S\/O Smt\. Gayatri Srivastava &amp; Shri Vijay Kumar Sahay/);
assert.match(script, /'Granddaughter of',\s*'Late Shri Kanhaiyalal Pal/);
assert.match(script, /'Grandson of',\s*'Late Shri Surendra Prasad/);
assert.match(css, /\.hero-names \{[^}]*--font-name/s, 'the names are set in Italiana');

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

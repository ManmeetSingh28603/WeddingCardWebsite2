/* ============================================================
   Wedding invitation — behaviour
   Intro gate · Hero card · Scratch-to-reveal · Save the dates ·
   Venue · Blessings · RSVP · Countdown · Music
   ============================================================ */

/* ════════════════════════════════════════════════════════════
   THE ONE PLACE TO EDIT
   Everything the invitation says lives in this object. Nothing
   below it needs touching to change a name, a time or a number.
   ════════════════════════════════════════════════════════════ */
let CONFIG = {

  couple: {
    names:   'Mahima & Ayush',
    bride:   'Mahima',
    groom:   'Ayush',
    venue:   'Amaraa Farms, Lucknow',
    /* Removed at the family's request; empty takes the line off the page. */
    hashtag: '',
  },

  dates: {
    year: 2026,
    /* These three are FALLBACKS. The dates actually printed in the hero,
       under the foil and in the footer are derived from whichever
       functions are on screen — see spanOf() — so a guest invited only to
       the Wedding is not told the celebration runs 23–24 November.
       They are used only if that derivation finds no dated events. */
    scratchNumber: '23 – 24',        // revealed under the foil
    scratchMonth:  'November 2026',
    footer:        '23<sup>rd</sup> – 24<sup>th</sup> November 2026',
    /* Drives the countdown; mo is 0-indexed, so 10 = November. Set to the
       wedding itself. NOTE: the year was not stated on the source
       invitation — 2026 is assumed because 23/24 November 2026 is the next
       occurrence. Confirm before the cards go out. */
    moment: { y: 2026, mo: 10, d: 24, h: 19, min: 0 },
  },

  /* The invitation card the gate opens onto. */
  hero: {
    eyebrow: 'Together with our families',
    /* The mark inside the gold ring. Empty removes the ring entirely. */
    mark:    'ॐ',
    invite:  'With joyous hearts, we invite you to celebrate the beginning of our beautiful new chapter.',
    /* Fallback only — see CONFIG.dates. */
    dates:   '23 · 24 November',
  },

  /* ── Per-guest invitations ──────────────────────────────────────
     One invitation, many links. A link carries the functions that
     guest is invited to:

       .../WeddingCardWebsite2/?e=sangeet,wedding

     and only those cards render. The plain URL, with no ?e at all, is
     the general invitation and shows every function. Nothing else about
     the page changes, and no per-guest data lives in the repo — the
     link IS the configuration, so inviting someone never needs a code
     change or a redeploy.

     A link can also drop the Blessings section:

       .../WeddingCardWebsite2/?e=wedding&b=0

     Blessings SHOW by default, so the plain URL is unaffected and only
     a link that says otherwise hides them.

     invite-builder.html is the tool that writes the links. */
  invite: {
    param: 'e',
    blessingsParam: 'b',
  },

  scratch: {
    heading: 'Two days, one beautiful beginning',
    cta:     'Scratch to reveal',
  },

  venue: {
    kicker:  'Find your way to us',
    name:    'Amaraa Farms',
    /* The postal address as the family wrote it. */
    address: 'Amaraa Farms and Resort, Arjunganj, Lucknow, Uttar Pradesh 226002',
    mapUrl:  'https://maps.app.goo.gl/FvnkfV8fd2BBWL3q8',
    /* Google's keyless embed form. Coordinates come from the link above,
       so the pin lands on the farm itself rather than on a name search. */
    lat: 26.7993442,
    lng: 80.9897956,
    zoom: 16,
  },

  /* The families' lineage lines, printed under each name in the hero.
     Overwritten below — see CONFIG.lineage after SIDE_CONFIGS. */
  lineage: {
    bride: [],
    groom: [],
  },

  /* One card per function. Tapping a card expands it in place into the
     full invitation — see initEventCards().

     `id` is what a guest link names, so these strings are part of every
     link already sent out: renaming one breaks those links.

     No card says whose side a function is on. Guests are told which
     functions they are invited to by their own link, and the cards read
     the same for everyone.

       title  the function's plain name, shown once its card is opened
       teaser the name on the shut card; falls back to title if absent
       at     when the countdown aims at this function; noon if absent
       art    the painting behind the card
       theme  which particle treatment plays, and which of the three
              colourways in style.css dresses the card: marigold (light,
              warm), stars (night), breeze (light, rose)
       dress  optional guest colour code, printed under the venue.
              The family asked for none, so no function sets it.

       film   optional video that plays behind an opened card; its `art`
              is then a still cut from it, shown shut and used as poster
       filmHold  optional second at which the film stops and holds,
              instead of looping

     Haldi is the couple's own painting, from their announcement site;
     Sangeet and Wedding keep the films they had before the redesign. Each
     picture leaves its top clear for the wording and puts the couple at
     the foot, so an opened card is the whole picture with the words set
     in its sky. */
  events: [
    {
      id: 'haldi', title: 'Haldi', teaser: 'Golden Carnival',
      day: '23', suffix: 'rd', weekday: 'Monday', month: 'November',
      time: '11:00 am onwards',
      at: { h: 11, min: 0 },
      copy: 'Join us for a sunshine-soaked Haldi carnival filled with music, colour, games, food and endless laughter.',
      art: 'assets/cards/haldi-card.jpg', theme: 'marigold',
    },
    {
      id: 'sangeet', title: 'Sangeet', teaser: 'Wedding Jukebox',
      day: '23', suffix: 'rd', weekday: 'Monday', month: 'November',
      time: '7:00 pm onwards',
      at: { h: 19, min: 0 },
      copy: 'An evening of dance, music, laughter, food and fun. Come ready to celebrate under the stars.',
      /* The ballroom film, as before the redesign: the still is the shut
         card's face and the film's poster; the film plays once it opens. */
      art: 'assets/cards/sangeet-still.jpg', theme: 'stars',
      film: 'assets/video/sangeet-bg.mp4',
    },
    {
      id: 'wedding', title: 'Wedding', teaser: 'Forever Affair',
      day: '24', suffix: 'th', weekday: 'Tuesday', month: 'November',
      time: '7:00 pm onwards',
      at: { h: 19, min: 0 },
      copy: 'Join us for an evening of sacred vows, sparkling celebrations, music and love as we begin our forever together.',
      art: 'assets/cards/wedding-still.jpg', theme: 'breeze',
      /* The lanterns and chandelier drop in during the first second and
         rise out again at about 4.2s, so this film plays once and holds
         at 3.9s, with everything hanging down, rather than looping. */
      film: 'assets/video/wedding-bg.mp4', filmHold: 3.9,
    },
  ],

  /* One page per side, each built from its own list below. */
  blessings: {
    /* MISSING — the line under the Blessings heading. The one here was the
       previous card's, so it is empty, which hides it. */
    note: '',
    bride: [
      {
        title: 'With Best Compliments',
        names: [
          'Prem Sagar Pal',
          'Neetu Pal',
          'Garima Pal',
        ],
      },
    ],
    groom: [
      {
        title: 'With Best Compliments',
        names: [
          'Gayatri Srivastava',
          'Utkarsha Sahay',
        ],
      },
    ],
  },

  /* `tel` is the full international form behind the call and WhatsApp
     links; `shown` is what is printed on the page. Each card lists only
     its own side, without saying whose side it is. */
  rsvp: {
    bride: [
      { name: 'Prem Sagar Pal', tel: '918318526297', shown: '+91 83185 26297' },
    ],
    groom: [
      { name: 'Gayatri Srivastava', tel: '917275251099', shown: '+91 72752 51099' },
      { name: 'Ayush Sahay',        tel: '918123764986', shown: '+91 81237 64986' },
    ],
  },

  /* The RSVP form posts to a Google Apps Script web app that appends a row
     to a Google Sheet — the script, and how to deploy it, are in
     rsvp-sheet/Code.gs. This is that web app's /exec URL. Empty, the form
     still shows but says it cannot send yet. */
  rsvpForm: {
    endpoint: 'https://script.google.com/macros/s/AKfycbyUbOvYqNQhsGt1NLB9_YPokUWV5a6aeuzJudBd0hCaxe5Z5rll-YABAoPsFksHTQaD/exec',
  },
};

const SIDE = document.documentElement.dataset.inviteSide === 'groom' ? 'groom' : 'bride';

/* One venue for the whole celebration. It carries its own link AND its own
   coordinates: the "Find your way to us" map is pinned by lat/lng, so a
   link whose name and address disagree with the pin sends guests astray. */
const AMARAA = {
  name: 'Amaraa Farms',
  address: 'Amaraa Farms and Resort, Arjunganj, Lucknow, Uttar Pradesh 226002',
  mapUrl: 'https://maps.app.goo.gl/FvnkfV8fd2BBWL3q8',
  lat: 26.7993442, lng: 80.9897956,
};
/* Every function is looked up here rather than derived from a side, so a
   function that moves later only has to be named in this table. `city` is
   simply the second line. The cards print no map link of their own: the
   Venue section below them carries the map. */
const V_AMARAA = { name: AMARAA.name, city: 'Arjunganj, Lucknow', mapUrl: AMARAA.mapUrl };
const EVENT_VENUES = {
  haldi:   V_AMARAA,
  sangeet: V_AMARAA,
  wedding: V_AMARAA,
};
const SIDE_CONFIGS = {
  bride: {
    names: 'Mahima & Ayush', order: ['bride', 'groom'], blessings: true,
    /* markImage puts a painting in the gold ring instead of CONFIG.hero.mark,
       and the ring opens out into a framed panel for it. The previous card
       had a pichwai here, which was that family's; with none, both sides show
       the ॐ their own announcement uses. Drop an image in assets/hero/ and
       name it here to change that. */
    events: ['haldi', 'sangeet', 'wedding'], rsvp: CONFIG.rsvp.bride,
    venue: AMARAA,
  },
  groom: {
    names: 'Ayush & Mahima', order: ['groom', 'bride'], blessings: true,
    events: ['haldi', 'sangeet', 'wedding'],
    rsvp: CONFIG.rsvp.groom,
    venue: AMARAA,
  },
};

/* Grandparents first, then parents — the order the family sent them in.
   Paternal grandparents lead on the bride's side (Baba, Dadi, then Nana,
   Nani); the groom's are in the order given. */
CONFIG.lineage = {
  bride: [
    'Granddaughter of',
    'Late Shri Kanhaiyalal Pal &amp; Late Smt. Sakhiya Devi',
    '&amp; Shri Shtrughan Pal &amp; Smt. Vidyavati Pal',
    'D/O Smt. Neetu Pal &amp; Shri Prem Sagar Pal',
  ],
  groom: [
    'Grandson of',
    'Late Shri Surendra Prasad &amp; Late Smt. Sushila Prasad',
    '&amp; Late Shri Badrinath Sahay &amp; Late Smt. Saraswati Sahay',
    'S/O Smt. Gayatri Srivastava &amp; Shri Vijay Kumar Sahay',
  ],
};
Object.assign(CONFIG.venue, SIDE_CONFIGS[SIDE].venue);
/* Feeds the <title> and any [data-venue] line. Both sides gather at the
   same farm, so it does not follow the side the way it used to. */
CONFIG.couple.venue = 'Amaraa Farms, Lucknow';
CONFIG.events = CONFIG.events.map((event) => ({
  ...event,
  venue: EVENT_VENUES[event.id]
    || { name: AMARAA.name, city: 'Arjunganj, Lucknow', mapUrl: AMARAA.mapUrl },
}));
const SIDE_CONFIG = SIDE_CONFIGS[SIDE];
CONFIG.couple.names = SIDE_CONFIG.names;
CONFIG.rsvp.bride = SIDE_CONFIG.rsvp;
CONFIG.events = CONFIG.events.filter((event) => SIDE_CONFIG.events.includes(event.id));
/* ════════════════════════════════════════════════════════════
   Nothing below here needs editing for ordinary changes.
   ════════════════════════════════════════════════════════════ */


const CFG = { reducedMotion: false };

/* Only the tap's TRAILING events carry user activation on Android Chrome —
   pointerdown and touchstart never do. Every audio retry uses this list. */
const RETRY_EVENTS = ['pointerup', 'touchend', 'click', 'keydown'];

document.addEventListener('DOMContentLoaded', () => {
  CFG.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  renderStrings();
  renderVenue();
  renderEventCards();
  renderBlessings();
  renderRsvp();

  initMusic();
  initIntro();
  initHero();
  initEventCards();
  initFooter();
  initBlessings();
  initRsvp();
  initRsvpForm();
  initCountdownSection();
  initScratch();
});


/* ============================================================
   SHARED HELPERS
   ============================================================ */

/* Add a class the first time an element comes into view, then stop watching.
   Under reduced motion the class is applied at once. */
function revealOnce(el, className, options) {
  if (!el) return;
  if (CFG.reducedMotion || !('IntersectionObserver' in window)) {
    el.classList.add(className);
    return;
  }
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    el.classList.add(className);
    obs.disconnect();
  }, options || { threshold: 0.2 }).observe(el);
}

/* Stamp an ascending delay across a list, so a group arrives in reading
   order without a hand-written delay per element in the CSS. */
function stagger(nodes, prop, step, start) {
  Array.prototype.forEach.call(nodes, (el, i) => {
    el.style.setProperty(prop, `${(start || 0) + i * step}ms`);
  });
}

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};


/* ============================================================
   CONTENT — rendered from CONFIG
   ============================================================ */

function renderStrings() {
  document.querySelectorAll('[data-couple-names]').forEach(n => { n.textContent = CONFIG.couple.names; });
  document.querySelectorAll('[data-venue]').forEach(n => { n.textContent = CONFIG.couple.venue; });

  /* An unset line is removed rather than printed empty — an invitation with
     a blank where the hashtag goes reads as a fault, a shorter one does not. */
  document.querySelectorAll('[data-hashtag]').forEach(n => {
    if (CONFIG.couple.hashtag) n.textContent = CONFIG.couple.hashtag;
    else n.remove();
  });

  /* ── the hero card ──
     Every line here follows the same convention as the hashtag: an empty
     string takes the line away rather than printing a gap. */
  const line = (sel, value, asHtml) => {
    document.querySelectorAll(sel).forEach((n) => {
      if (!value) { n.remove(); return; }
      if (asHtml) n.innerHTML = value; else n.textContent = value;
    });
  };
  const H = CONFIG.hero || {};
  line('[data-hero-eyebrow]', H.eyebrow);
  line('[data-hero-mark]',    H.mark);
  /* A painting, not a glyph — so the gold ring opens out into a framed
     panel. A pichwai inside a 54px circle reads as a smudge. */
  if (SIDE_CONFIG.markImage) {
    document.querySelectorAll('[data-hero-mark]').forEach((n) => {
      n.classList.add('hero-mark--art');
      n.textContent = '';
      const img = el('img');
      img.src = SIDE_CONFIG.markImage;
      img.alt = '';
      n.appendChild(img);
    });
  }
  line('[data-hero-invite]',  H.invite);
  line('[data-hero-dates]',   '');

  document.querySelectorAll('[data-bride-name]').forEach(n => { n.textContent = CONFIG.couple.bride; });
  document.querySelectorAll('[data-groom-name]').forEach(n => { n.textContent = CONFIG.couple.groom; });
  document.querySelectorAll('[data-bride-lineage]').forEach(n => { n.innerHTML = CONFIG.lineage.bride.join('<br>'); });
  document.querySelectorAll('[data-groom-lineage]').forEach(n => { n.innerHTML = CONFIG.lineage.groom.join('<br>'); });
  document.querySelectorAll('.hero-names').forEach((names) => {
    const bride = names.querySelector('[data-person="bride"]');
    const groom = names.querySelector('[data-person="groom"]');
    const amp = names.querySelector('.hero-amp');
    const first = SIDE_CONFIG.order[0] === 'groom' ? groom : bride;
    const second = SIDE_CONFIG.order[1] === 'groom' ? groom : bride;
    if (first && amp && second) names.replaceChildren(first, amp, second);
  });

  const S = CONFIG.scratch || {};
  line('[data-scratch-heading]', S.heading);
  line('[data-scratch-cta]',     S.cta);

  /* Dates follow whichever functions this link shows — see spanOf(). The
     CONFIG.dates strings are the fallback for when nothing is dated. */
  const span = spanOf(visibleEvents());
  const num = document.querySelector('[data-date-num]');
  const mon = document.querySelector('[data-date-month]');
  if (num) num.textContent = span ? span.number : CONFIG.dates.scratchNumber;
  if (mon) mon.textContent = span ? span.month  : CONFIG.dates.scratchMonth;
  const fd = document.querySelector('[data-footer-date]');
  if (fd) fd.innerHTML = span ? span.footer : CONFIG.dates.footer;
  document.title = `${CONFIG.couple.names} | ${CONFIG.couple.venue}`;
}

/* ============================================================
   VENUE — name, address and the map
   The embed is Google's keyless ?output=embed form and is pinned by
   coordinate rather than by name search, so it lands on the hotel
   itself. Nothing here needs an API key.
   ============================================================ */
function renderVenue() {
  const V = CONFIG.venue;
  const section = document.getElementById('venue');
  if (!section || !V) return;

  const put = (sel, value, asHtml) => {
    const n = section.querySelector(sel);
    if (!n) return;
    if (!value) { n.remove(); return; }
    if (asHtml) n.innerHTML = value; else n.textContent = value;
  };
  put('[data-venue-kicker]', V.kicker);
  put('[data-venue-name]',   V.name);
  put('[data-venue-address]', V.address, true);

  const frame = document.getElementById('venueMapFrame');
  const open  = document.getElementById('venueOpen');

  if (open) {
    if (V.mapUrl) open.href = V.mapUrl;
    else open.remove();
  }
  if (frame) {
    if (Number.isFinite(V.lat) && Number.isFinite(V.lng)) {
      frame.src = `https://www.google.com/maps?q=${V.lat},${V.lng}`
                + `&z=${V.zoom || 16}&hl=en&output=embed`;
    } else {
      /* No coordinates means no map worth showing — drop the frame and
         leave the address and the button, which still work. */
      frame.remove();
    }
  }
}


/* ============================================================
   SAVE THE DATES — one card per function
   ============================================================ */
/* Which functions this particular link is for.

   ?e=wedding,reception  ->  just those two cards
   no ?e at all          ->  every function, the general invitation

   A list that matches nothing falls back to the whole programme on
   purpose: a guest following a mistyped or truncated link should land on
   the invitation, not on an empty page. Computed once and reused, so the
   cards, the dates and the countdown can never disagree. */
let VISIBLE_EVENTS = null;

function visibleEvents() {
  if (VISIBLE_EVENTS) return VISIBLE_EVENTS;
  const all = CONFIG.events;
  let picked = all;
  try {
    const raw = new URLSearchParams(location.search).get((CONFIG.invite || {}).param || 'e');
    if (raw) {
      const want = raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      const hit = all.filter(ev => want.indexOf(ev.id) !== -1);
      if (hit.length) picked = hit;
    }
  } catch (_) { /* no URL API, or a malformed query — show everything */ }
  VISIBLE_EVENTS = picked;
  return picked;
}

/* The span the visible functions cover, so the hero, the foil and the
   footer never announce dates a guest is not invited to. Returns null if
   nothing is dated, and the CONFIG.dates strings stand in. */
function spanOf(events) {
  const dated = events.filter(e => Number.isFinite(Number(e.day)));
  if (!dated.length) return null;
  const byDay = [...dated].sort((a, b) => Number(a.day) - Number(b.day));
  const lo = byDay[0], hi = byDay[byDay.length - 1];
  const year = (CONFIG.dates && CONFIG.dates.year) || '';
  const one  = lo.day === hi.day;
  return {
    number: one ? `${lo.day}` : `${lo.day} – ${hi.day}`,
    month:  `${lo.month} ${year}`,
    hero:   one ? `${lo.day} ${lo.month}` : `${lo.day} · ${hi.day} ${lo.month}`,
    footer: one
      ? `${lo.day}<sup>${lo.suffix}</sup> ${lo.month} ${year}`
      : `${lo.day}<sup>${lo.suffix}</sup> – ${hi.day}<sup>${hi.suffix}</sup> ${lo.month} ${year}`,
    first: lo,
  };
}

function renderEventCards() {
  const host = document.getElementById('eventsGrid');
  if (!host) return;

  visibleEvents().forEach((ev, i) => {
    const card = document.createElement('article');
    card.className = `event event--${ev.theme || 'marigold'}`;
    card.id = `evt-${ev.id}`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-expanded', 'false');
    card.style.setProperty('--card-delay', `${i * 90}ms`);

    /* `note` is optional: an empty one prints nothing at all rather than
       an empty row. */
    const note  = ev.note  ? `<p class="event-note">${ev.note}</p>` : '';
    /* preload="none": a film is only wanted once its card opens, so a grid
       of cards never pulls a video each on load. The still is the poster. */
    const film  = ev.film
      ? `<video class="event-film" src="${ev.film}" poster="${ev.art || ''}"
                muted${ev.filmHold ? '' : ' loop'} playsinline webkit-playsinline preload="none"${ev.filmHold ? ` data-hold="${ev.filmHold}"` : ''}
                disablepictureinpicture aria-hidden="true"></video>`
      : '';
    const when  = `${ev.day}<sup>${ev.suffix}</sup> ${ev.month}`;
    /* The couple's own name for a function goes on top; the function it
       actually is goes underneath it, in both the shut and opened card. */
    const alias = ev.subtitle ? `<p class="event-alias">${ev.subtitle}</p>` : '';
    const popAlias = ev.subtitle ? `<p class="pop-alias">${ev.subtitle}</p>` : '';
    /* With a timetable the single time would just repeat its first row, so
       the opened card shows the date alone and lets the list say the rest. */
    const runs = Array.isArray(ev.schedule) && ev.schedule.length ? ev.schedule : null;
    const popWhen = runs ? `${ev.weekday}, ${when}`
                         : `${ev.weekday}, ${when} &middot; ${ev.time}`;
    /* Optional: a function with no colour code prints no row at all. */
    const dress = ev.dress
      ? `<p class="pop-dress"><span class="pop-dress-label">Guest colour code</span>${ev.dress}</p>`
      : '';
    const sched = runs
      ? `<ul class="pop-run">${runs.map(r =>
          `<li><span class="pop-run-what">${r.what}</span><span class="pop-run-when">${r.when}</span></li>`
        ).join('')}</ul>`
      : '';

    card.innerHTML =
      `<div class="event-art" aria-hidden="true"></div>
       ${film}
       <div class="event-sparks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
       <div class="event-summary">
         <h3 class="event-name">${ev.teaser || ev.title}</h3>
         ${alias}
         <p class="event-day">${when}</p>
         <p class="event-time">${ev.time}</p>
         ${note}
       </div>
       <p class="event-open">Tap to unfold</p>
       <button class="event-close" type="button" aria-label="Close ${stripTags(ev.title)} invitation">&times;</button>
       <div class="event-detail">
         <p class="pop-kicker">We invite you to our</p>
         <h3 class="pop-name">${ev.title}</h3>
         ${popAlias}
         <p class="pop-when">${popWhen}</p>
         <p class="pop-copy">${ev.copy}</p>
         ${sched}
         <p class="pop-venue">${ev.venue.name}${ev.venue.city ? `<br />${ev.venue.city}` : ''}</p>
         ${dress}
       </div>`;

    /* The painting is set as a style rather than in the markup so a missing
       file leaves a tinted card instead of a broken image box. */
    const art = card.querySelector('.event-art');
    if (ev.art) art.style.backgroundImage = `url("${ev.art}")`;

    host.appendChild(card);
  });
}

function stripTags(s) { return String(s).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&'); }


/* Expanding cards, FLIP-style: let the card jump to its opened geometry,
   measure both boxes, then animate the inverse transform back to zero. The
   browser only ever paints the end state, so the growth stays smooth even
   though the layout change is instant. */
function initEventCards() {
  const host = document.getElementById('eventsGrid');
  const section = document.getElementById('events');
  if (!host || !section) return;

  const cards = [...host.querySelectorAll('.event')];
  let openCard = null;

  const animate = (card, opening) => {
    const first = card.getBoundingClientRect();

    card.classList.toggle('is-open', opening);
    document.body.classList.toggle('has-open-card', opening);
    card.setAttribute('aria-expanded', String(opening));
    openCard = opening ? card : null;

    /* the film runs only while its card is open */
    const film = card.querySelector('.event-film');
    if (film) {
      if (opening) {
        try { film.currentTime = 0; } catch (_) {}
        const p = film.play();
        if (p && p.catch) p.catch(() => {});   /* the still stands in */
        /* A held film stops on its chosen frame and stays there. timeupdate
           only fires every ~250ms, so it is caught a little late and then
           seeked back to the exact frame. */
        const hold = parseFloat(film.dataset.hold);
        if (hold && !film.dataset.holdWired) {
          film.dataset.holdWired = '1';
          film.addEventListener('timeupdate', () => {
            if (film.currentTime >= hold) { film.pause(); film.currentTime = hold; }
          });
        }
      } else {
        film.pause();
      }
    }

    const last = card.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    const sx = first.width / last.width;
    const sy = first.height / last.height;

    if (CFG.reducedMotion) return;

    /* An opened card is centred by its own translate, so the inverse has to
       be composed on top of that rather than replacing it. */
    const base = opening ? 'translate(-50%, -50%)' : 'none';
    const inverse = opening
      ? `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`
      : `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;

    /* The reference unfolds its cards slowly — 1.1s — and the wording only
       fades in once the card has nearly landed (see .event-detail). */
    card.animate([{ transform: inverse }, { transform: base }],
                 { duration: 1100, easing: 'cubic-bezier(.16,.82,.24,1)', fill: 'both' });
  };

  cards.forEach((card) => {
    const close = card.querySelector('.event-close');

    card.addEventListener('click', (e) => {
      if (e.target.closest('.event-close')) return;
      if (!card.classList.contains('is-open')) animate(card, true);
    });
    card.addEventListener('keydown', (e) => {
      const open = card.classList.contains('is-open');
      if ((e.key === 'Enter' || e.key === ' ') && !open) { e.preventDefault(); animate(card, true); }
      if (e.key === 'Escape' && open) animate(card, false);
    });
    if (close) {
      close.addEventListener('click', (e) => { e.stopPropagation(); animate(card, false); });
    }
  });

  /* Escape and a tap on the dimmed backdrop both close, wherever focus is. */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openCard) animate(openCard, false);
  });
  document.addEventListener('click', (e) => {
    if (openCard && !e.target.closest('.event')) animate(openCard, false);
  }, true);

  cards.forEach((card, i) => {
    revealOnce(card, 'is-shown', { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  });
  revealOnce(section, 'is-visible', { threshold: 0.1 });
}


/* The footer used to ride along on the countdown's reveal. It is its own
   section now, so it needs its own trigger — without one its lines stay
   blurred at opacity 0, because the CSS that clears them keys off an
   ancestor it no longer has. */
function initFooter() {
  revealOnce(document.querySelector('.wedding-footer'), 'is-visible',
             { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
}


/* Blessings show unless a link says otherwise: ?b=0 takes the section
   away entirely, heading and all, rather than leaving an empty panel. */
function wantsBlessings() { return linkAllows('blessingsParam', 'b'); }

/* The switch reads the same shape whichever parameter it is given. */
function linkAllows(configKey, fallbackParam) {
  try {
    const key = (CONFIG.invite || {})[configKey] || fallbackParam;
    const raw = new URLSearchParams(location.search).get(key);
    if (raw === null) return true;
    return !/^(0|no|off|false)$/i.test(raw.trim());
  } catch (_) { return true; }
}

function renderBlessings() {
  if (!SIDE_CONFIG.blessings) return;
  const host = document.getElementById('blessings');
  if (!host) return;

  if (!wantsBlessings()) { host.remove(); return; }

  /* No "Bride's Side" / "Groom's Side" label: each card carries only its own
     family's list, so naming the side says nothing a guest needs. */
  const page = (side, blocks, note) => {
    const art = el('article', `bl-page bl-page--${side}`);
    art.setAttribute('aria-label', 'Blessings');
    art.appendChild(Object.assign(el('div', 'bl-art'), { ariaHidden: 'true' }));

    const inner = el('div', 'bl-inner');
    inner.appendChild(el('div', 'bl-rule',
      '<span class="bl-rule-line"></span><span class="bl-rule-diamond">&#9670;</span><span class="bl-rule-line"></span>'));
    inner.appendChild(el('h2', 'bl-heading', 'Blessings'));
    if (note) inner.appendChild(el('p', 'bl-note', note));

    blocks.forEach(b => {
      const blk = el('div', 'bl-block');
      blk.appendChild(el('h3', 'bl-block-title', b.title));
      blk.appendChild(el('p', 'bl-names', b.names.map(n => `<span>${n}</span>`).join('')));
      inner.appendChild(blk);
    });

    art.appendChild(inner);
    return art;
  };

  /* Whichever side's card this is, and only if that side has a list. */
  const list = CONFIG.blessings[SIDE];
  if (!list || !list.length) { host.remove(); return; }
  host.appendChild(page(SIDE, list, CONFIG.blessings.note));
}

function renderRsvp() {
  const host = document.getElementById('rsvpLists');
  if (!host) return;

  /* No numbers for this side: the list and the "please call" line go, and
     the form carries the section on its own. */
  const contacts = CONFIG.rsvp.bride;
  if (!contacts || !contacts.length) {
    host.remove();
    document.querySelector('.rsvp-note')?.remove();
    return;
  }

  /* No side label over the list — each card shows only its own contact. */
  const list = (people) => {
    const ul = el('ul', 'rsvp-contacts');
    ul.setAttribute('aria-label', 'Contacts');
    people.forEach(p => {
      const li = el('li', 'rsvp-row');
      /* A contact with no number gets no buttons: `tel:+` and a bare wa.me
         link both lead nowhere, and a dead button is worse than none. */
      const actions = p.tel
        ? `<div class="rsvp-actions">
             <a href="tel:+${p.tel}" class="rsvp-action rsvp-action--phone" aria-label="Call ${p.name}">
               <svg aria-hidden="true"><use href="#ic-phone"/></svg>
             </a>
             <a href="https://wa.me/${p.tel}" class="rsvp-action rsvp-action--wa" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ${p.name}">
               <svg aria-hidden="true"><use href="#ic-wa"/></svg>
             </a>
           </div>`
        : '';
      li.innerHTML =
        `<div class="rsvp-identity">
           <span class="rsvp-name">${p.name}</span>
           <span class="rsvp-num">${p.shown}</span>
         </div>${actions}`;
      ul.appendChild(li);
    });
    host.appendChild(ul);
  };

  list(CONFIG.rsvp.bride);
}

/* The reply form. Posts to the Apps Script web app in
   CONFIG.rsvpForm.endpoint, which appends a row to the family's sheet.
   Apps Script sends no CORS headers, so the request goes out as no-cors:
   the response is opaque, and a resolved fetch is the only success signal
   there is. A network failure still rejects, and is reported as such. */
function initRsvpForm() {
  const form = document.getElementById('rsvpForm');
  if (!form) return;
  const status = document.getElementById('rsvpStatus');
  const button = form.querySelector('.rsvp-submit');
  const say = (text, kind) => {
    status.textContent = text;
    status.dataset.kind = kind || '';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const arrival = String(data.get('arrival') || '');
    const departure = String(data.get('departure') || '');

    if (!name) { say('Please tell us your name.', 'error'); form.elements.name.focus(); return; }
    if (!/^\+?[\d\s()-]{7,20}$/.test(phone)) {
      say('Please enter a phone number we can reach you on.', 'error');
      form.elements.phone.focus();
      return;
    }
    /* ISO dates compare correctly as strings */
    if (arrival && departure && departure < arrival) {
      say('The departure date is before the arrival date.', 'error');
      form.elements.departure.focus();
      return;
    }
    if (data.get('website')) { say('Thank you, we have your RSVP.', 'ok'); form.reset(); return; }

    const endpoint = (CONFIG.rsvpForm || {}).endpoint;
    if (!endpoint) { say('Replies cannot be sent just yet. Please call instead.', 'error'); return; }

    button.disabled = true;
    say('Sending…');
    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({ side: SIDE, name, phone, arrival, departure }),
      });
      form.reset();
      say('Thank you, we have your RSVP.', 'ok');
    } catch (_) {
      say('That did not go through. Please check your connection and try again.', 'error');
    } finally {
      button.disabled = false;
    }
  });
}


/* ============================================================
   PARALLAX — the foreground ornaments of the painted panels.
   One shared scroll loop for every registered overlay: each drifts
   against its own section's progress, so the depth reads as you
   scroll past.

   The drift is written as a CSS variable rather than a transform,
   because these same elements carry a sway ANIMATION — a transform
   set here would be overwritten by the keyframes every frame.
   ============================================================ */
const DRIFT_LAYERS = [];

/* ============================================================
   BLESSINGS — every block is watched on its own, so a list this
   long arrives a group at a time, as it is read.
   ============================================================ */
function initBlessings() {
  if (!SIDE_CONFIG.blessings) {
    document.getElementById('blessings')?.remove();
    return;
  }
  const section = document.getElementById('blessings');
  if (!section) return;

  section.querySelectorAll('.bl-page').forEach((page) => {
    stagger(page.querySelectorAll('.bl-rule, .bl-heading, .bl-note'), '--bl-delay', 160, 60);
    /* a low threshold: the page is taller than the viewport, so waiting for
       a fifth of it would hold the masthead back until it had scrolled past */
    revealOnce(page, 'is-visible', { threshold: 0.02 });
  });

  section.querySelectorAll('.bl-block').forEach((block) => {
    /* names cascade within their own block, capped so a long list never
       leaves its last line waiting seconds */
    block.querySelectorAll('.bl-names span').forEach((n, i) => {
      n.style.setProperty('--bl-name-delay', `${180 + Math.min(i, 9) * 68}ms`);
    });
    revealOnce(block, 'is-shown', { threshold: 0.3, rootMargin: '0px 0px -8% 0px' });
  });
}


/* ============================================================
   RSVP
   ============================================================ */
function initRsvp() {
  const section = document.getElementById('rsvp');
  if (!section) return;

  section.querySelectorAll('.rsvp-rule, .rsvp-heading, .rsvp-sub-rule, .rsvp-note, .rsvp-row, .rsvp-form')
    .forEach((n, i) => n.style.setProperty('--rsvp-delay', `${i * 90}ms`));

  if (CFG.reducedMotion) { section.classList.add('is-visible'); return; }

  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    section.classList.add('is-visible');
    obs.disconnect();
  }, { threshold: 0.18, rootMargin: '0px 0px -12% 0px' }).observe(section);
}


/* ============================================================
   COUNTDOWN + FOOTER
   ============================================================ */
function initCountdownSection() {
  const section = document.getElementById('countdown');
  if (!section) return;

  section.querySelectorAll('[data-countdown-letters]').forEach((node) => {
    const text = (node.textContent || '').trim();
    node.setAttribute('aria-label', text);
    node.textContent = '';
    Array.from(text).forEach((char, index) => {
      const span = document.createElement('span');
      if (char === ' ') { span.className = 'cd-space'; span.innerHTML = '&nbsp;'; }
      else span.textContent = char;
      span.style.setProperty('--letter-delay', `${index * 34}ms`);
      node.appendChild(span);
    });
  });

  /* Counts to the FIRST function this link shows, not always the wedding:
     a guest invited only to the Reception wants to know how long until
     their evening. Falls back to CONFIG.dates.moment when nothing on
     screen is dated. `at` gives the hour; noon if a function has none,
     which only shifts the hours column, never the days. */
  const M = CONFIG.dates.moment;
  const first = (spanOf(visibleEvents()) || {}).first;
  const target = first
    ? new Date(M.y, M.mo, Number(first.day),
               (first.at && first.at.h) || 12, (first.at && first.at.min) || 0, 0).getTime()
    : new Date(M.y, M.mo, M.d, M.h, M.min, 0).getTime();
  const units = {
    days:    section.querySelector('[data-unit="days"]'),
    hours:   section.querySelector('[data-unit="hours"]'),
    minutes: section.querySelector('[data-unit="minutes"]'),
    seconds: section.querySelector('[data-unit="seconds"]'),
  };
  const pad = v => String(Math.max(0, v)).padStart(2, '0');

  const setUnit = (key, value) => {
    const node = units[key];
    if (!node) return;
    const next = key === 'days' ? String(Math.max(0, value)) : pad(value);
    if (node.textContent === next) return;
    const card = node.closest('.countdown-card');
    node.textContent = next;
    if (!CFG.reducedMotion && card) {
      card.classList.remove('is-changing');
      void card.offsetWidth;
      card.classList.add('is-changing');
      setTimeout(() => card.classList.remove('is-changing'), 520);
    }
  };

  const update = () => {
    const distance = Math.max(0, target - Date.now());
    const total = Math.floor(distance / 1000);
    setUnit('days', Math.floor(total / 86400));
    setUnit('hours', Math.floor((total % 86400) / 3600));
    setUnit('minutes', Math.floor((total % 3600) / 60));
    setUnit('seconds', total % 60);
  };

  update();
  setInterval(update, 1000);

  if (CFG.reducedMotion) { section.classList.add('is-visible'); return; }
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    section.classList.add('is-visible');
    obs.disconnect();
  }, { threshold: 0.28 }).observe(section);
}


/* ============================================================
   BACKGROUND MUSIC
   The score starts on the opening tap — the user gesture browsers
   require. We prime inside the gesture and keep a retry net armed
   for Android, where the first attempt can still be refused.
   ============================================================ */
let bgAudio = null, musicBtn = null;
let musicFailed = false, musicStarted = false, awayPaused = false;

function setMusicState(playing) {
  if (!musicBtn) return;
  musicBtn.classList.toggle('is-muted', !playing);
  musicBtn.setAttribute('aria-label', playing ? 'Mute music' : 'Play music');
}

/* The control belongs to the invitation, not to the opening card: it is
   brought in with the hero and never sits over the gate. Idempotent. */
function showMusicControl() {
  if (!musicBtn || musicFailed) return;
  musicBtn.hidden = false;
  setMusicState(!!(bgAudio && !bgAudio.paused));
  requestAnimationFrame(() => musicBtn.classList.add('is-ready'));
}

function initMusic() {
  bgAudio = document.getElementById('bgMusic');
  /* The element carries no `loop`: the loop restarts at MUSIC_START, so a
     song with an intro to skip skips it every time round, not just once. */
  if (bgAudio) {
    bgAudio.addEventListener('ended', () => {
      try { bgAudio.currentTime = MUSIC_START; bgAudio.play(); } catch (_) {}
    });
  }
  musicBtn = document.getElementById('musicBtn');
  if (!bgAudio || !musicBtn) return;

  musicBtn.addEventListener('click', () => {
    if (bgAudio.paused) {
      try { bgAudio.muted = false; bgAudio.volume = 1; } catch (_) {}
      const p = bgAudio.play();
      if (p && p.catch) p.catch(() => {});
      setMusicState(true);
    } else {
      bgAudio.pause();
      setMusicState(false);
    }
  });

  /* no score file — hide the control entirely rather than offering a
     button that does nothing */
  bgAudio.addEventListener('error', () => {
    musicFailed = true;
    if (musicBtn) musicBtn.hidden = true;
  }, { once: true });

  /* background-tab etiquette — never override a manual pause */
  const pauseAway = () => {
    if (!bgAudio || bgAudio.paused) return;
    awayPaused = true;
    bgAudio.pause();
  };
  const resumeBack = () => {
    if (!awayPaused || !bgAudio) return;
    awayPaused = false;
    const p = bgAudio.play();
    if (p && p.catch) p.catch(() => {});
  };
  document.addEventListener('visibilitychange', () => { document.hidden ? pauseAway() : resumeBack(); });
  window.addEventListener('pagehide', pauseAway);
  window.addEventListener('pageshow', resumeBack);
}

function cleanupMusicRetry() {
  RETRY_EVENTS.forEach(ev => document.removeEventListener(ev, retryBgMusic));
}
function retryBgMusic() {
  cleanupMusicRetry();
  musicStarted = false;
  startBgMusic();
}

/* Where the score comes in, and where each loop restarts. The current
   track (assets/music/bgm.mp3) plays from the top;
   a song with a long intro can be started later by raising this. */
const MUSIC_START = 0;

/* Start the score and reveal the toggle. Idempotent. On rejection, arm
   one-shot listeners on the trailing gesture events so the SAME tap — or
   the next one — recovers. */
function startBgMusic() {
  if (!bgAudio || musicFailed || musicStarted) return;
  if (!bgAudio.paused) { musicStarted = true; return; }
  musicStarted = true;
  try { bgAudio.muted = false; bgAudio.volume = 1; bgAudio.currentTime = MUSIC_START; } catch (_) {}
  const p = bgAudio.play();
  if (p && p.catch) {
    p.catch(() => {
      musicStarted = false;
      cleanupMusicRetry();                 /* never double-arm */
      RETRY_EVENTS.forEach(ev => document.addEventListener(ev, retryBgMusic, { passive: true }));
    });
  }
  setMusicState(true);
}


/* ============================================================
   ENTRANCE  (the royal doors)
   ============================================================ */
function lockScroll(on) {
  document.documentElement.style.overflow = on ? 'hidden' : '';
  document.body.style.overflow = on ? 'hidden' : '';
}

function initIntro() {
  const screen = document.getElementById('introScreen');
  const button = document.getElementById('openInvitation');
  if (!screen || !button) return;

  lockScroll(true);
  button.focus({ preventScroll: true });

  let opened = false;
  button.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    /* Inside the click, so the gesture's activation covers the score;
       startBgMusic carries its own retry net if the browser refuses. */
    startBgMusic();
    screen.classList.add('is-open');
    revealHero();
    /* the doors take 1.55s to clear the screen (see .door in style.css) */
    setTimeout(() => { screen.remove(); lockScroll(false); }, CFG.reducedMotion ? 0 : 1600);
  });
}


/* ============================================================
   HERO
   ============================================================ */
function revealHero() {
  const hero = document.getElementById('hero');
  if (hero) hero.classList.add('is-animated');
  showMusicControl();
}

function initHero() {
  const hero = document.getElementById('hero');
  if (!hero) return;


  if (document.getElementById('introScreen')) return;
  if (CFG.reducedMotion) { hero.classList.add('is-animated'); return; }
  requestAnimationFrame(() => setTimeout(() => hero.classList.add('is-animated'), 360));
}

/* ============================================================
   SCRATCH TO REVEAL + BLOSSOM SHOWER
   The oval is cut by a canvas clip path rather than a CSS mask:
   mask-image switches between alpha and luminance behaviour across
   browsers, and the foil has to disappear exactly on the oval.
   ============================================================ */
function initScratch() {
  const canvas   = document.getElementById('scratchCanvas');
  const petalCv  = document.getElementById('petalCanvas');
  const hint     = document.getElementById('scratchHint');
  const revealEl = document.getElementById('scratchReveal');
  const hashtag  = document.getElementById('scratchHashtag');
  const section  = document.getElementById('scratchSection');
  const wrap     = document.getElementById('scratchFrameWrap');
  const glint    = document.getElementById('scratchGlint');
  const sandCv   = document.getElementById('sandCanvas');
  if (!canvas || !petalCv || !section) return;

  const ctx  = canvas.getContext('2d', { willReadFrequently: true });
  const pCtx = petalCv.getContext('2d');
  const sCtx = sandCv ? sandCv.getContext('2d') : null;
  const reduce = CFG.reducedMotion;

  /* ── prompts ── */
  let promptsDismissed = false;
  const dismissPrompts = () => {
    if (promptsDismissed) return;
    promptsDismissed = true;
    if (glint) glint.classList.add('hidden');
    if (wrap) wrap.classList.remove('attention');
  };

  let isDrawing = false, lastPos = null, revealed = false, lastCheck = 0;
  const GRID = 32;
  const coverage = new Uint8Array(GRID * GRID);

  /* ── sand: warm grains that fly off the surface while scratching ── */
  let sand = [], sandRAF = null, sandAccum = 0;
  /* Gilt fallback, replaced at runtime by colours read back out of the bar
     itself so the grains match whatever the foil was painted as. */
  /* The foil, the dust it throws off and the label on it all have to
     agree, so they are stated once. The bride's is olive, off the card's
     own --olive-ink; the groom's is a baby pink off his blush envelope,
     with a deep rose label because cream on baby pink cannot be read. */
  const FOIL = SIDE === 'groom'
    ? { stops: ['#fbdfe2', '#f6c8cd', '#efb2b9', '#e299a2', '#d1848e'],
        sheen: 'rgba(255,246,247,.5)',
        label: 'rgba(122,58,66,.95)',
        sand:  ['#f6c8cd', '#efb2b9', '#e299a2', '#d1848e', '#fdeef0'] }
    : { stops: ['#9aa473', '#87925f', '#6d7654', '#5a6344', '#454e36'],
        sheen: 'rgba(246,240,206,.34)',
        label: 'rgba(255,246,226,.94)',
        sand:  ['#9aa473', '#87925f', '#6d7654', '#5a6344', '#dfe6c4'] };
  let SAND_COLORS = FOIL.sand.slice();
  let paletteReady = false;

  function samplePalette(w, h, dpr) {
    if (paletteReady) return;
    try {
      /* Sampled along the bar rather than in a disc — it is wide and short
         now, so points clustered near the middle would all land on the
         same stripe of the gradient. */
      const pts = [[.12,.5],[.28,.34],[.4,.62],[.5,.45],[.62,.3],[.74,.6],[.88,.5],[.5,.7],[.2,.68]];
      const cols = [];
      for (const [fx, fy] of pts) {
        const d = ctx.getImageData(Math.round(fx * w * dpr), Math.round(fy * h * dpr), 1, 1).data;
        if (d[3] > 20) cols.push(`rgb(${d[0]},${d[1]},${d[2]})`);
      }
      if (cols.length >= 3) { SAND_COLORS = cols; paletteReady = true; }
    } catch (_) { /* not ready yet — keep the fallback */ }
  }

  function sizeSand() {
    if (!sCtx) return;
    const dpr = window.devicePixelRatio || 1;
    const r = section.getBoundingClientRect();
    sandCv.width  = Math.round(r.width * dpr);
    sandCv.height = Math.round(r.height * dpr);
    sCtx.setTransform(1, 0, 0, 1, 0, 0);
    sCtx.scale(dpr, dpr);
  }

  function spawnSand(clientX, clientY, dirX, dirY) {
    if (!sCtx || reduce) return;
    const dpr = window.devicePixelRatio || 1;
    const r = section.getBoundingClientRect();
    if (sandCv.width !== Math.round(r.width * dpr) || sandCv.height !== Math.round(r.height * dpr)) sizeSand();
    const x = clientX - r.left, y = clientY - r.top;
    const n = 3 + (Math.random() * 3 | 0);
    for (let i = 0; i < n; i++) {
      const speed = 30 + Math.random() * 70;
      const spread = (Math.random() - 0.5) * 60;
      sand.push({
        x, y,
        vx: dirX * speed * 0.6 + spread,
        vy: dirY * speed * 0.3 - (30 + Math.random() * 60),   /* initial upward pop */
        g: 320 + Math.random() * 140,
        size: 0.5 + Math.random(),
        color: SAND_COLORS[(Math.random() * SAND_COLORS.length) | 0],
        life: 1,
        decay: 1.4 + Math.random() * 1.2,
      });
    }
    startSand();
  }

  function startSand() {
    if (sandRAF) return;
    let last = performance.now();
    (function step(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const r = section.getBoundingClientRect();
      sCtx.clearRect(0, 0, r.width, r.height);
      const alive = [];
      for (const p of sand) {
        p.vy += p.g * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= p.decay * dt;
        if (p.life <= 0) continue;
        sCtx.globalAlpha = Math.max(0, Math.min(1, p.life));
        sCtx.fillStyle = p.color;
        sCtx.beginPath();
        sCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        sCtx.fill();
        alive.push(p);
      }
      sCtx.globalAlpha = 1;
      sand = alive;
      sandRAF = sand.length ? requestAnimationFrame(step) : null;
    })(last);
  }

  /* ── the foil ──
     The frame sits in normal flow, so the wrap's height comes from its own
     proportions. setup() is fired from several triggers so at least one
     always wins whatever order things finish loading in. */
  function setup() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    canvas.width  = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    drawFoil(rect.width, rect.height);
    samplePalette(rect.width, rect.height, dpr);
  }

  function drawFoil(w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    /* A rounded bar now, not an oval — cut as a clip path rather than a CSS
       mask, because mask-image switches between alpha and luminance
       behaviour across browsers and the gilt has to end exactly on the
       rounded edge. */
    const r = Math.min(h / 2, 26);
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(0, 0, w, h, r);
    else {
      ctx.moveTo(r, 0); ctx.lineTo(w - r, 0); ctx.quadraticCurveTo(w, 0, w, r);
      ctx.lineTo(w, h - r); ctx.quadraticCurveTo(w, h, w - r, h);
      ctx.lineTo(r, h); ctx.quadraticCurveTo(0, h, 0, h - r);
      ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
    }
    ctx.clip();

    /* Foil, lit from the upper left, with a highlight band raked across it
       so the bar reads as foil rather than as flat paint. See FOIL above
       for which colours, and why each card gets its own. */
    const g = ctx.createLinearGradient(0, 0, w, h);
    FOIL.stops.forEach((c, i) => g.addColorStop(i / (FOIL.stops.length - 1), c));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const sheen = ctx.createLinearGradient(0, h * 0.1, w * 0.55, h);
    sheen.addColorStop(0,    'rgba(255,255,255,0)');
    sheen.addColorStop(0.45, FOIL.sheen);
    sheen.addColorStop(0.6,  'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = FOIL.label;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `500 ${Math.max(12, Math.min(16, h * 0.3))}px "Cormorant Garamond", Georgia, serif`;
    const label = (CONFIG.scratch && CONFIG.scratch.cta) || 'Scratch to reveal';
    ctx.letterSpacing = '.18em';
    ctx.fillText(label, w / 2, h / 2 + 1);
    ctx.restore();
  }

  /* The bar sits in normal flow and needs no image, so the first paint is
     enough to size it; the later triggers are belt and braces for fonts
     and late layout shifts. */
  requestAnimationFrame(setup);
  window.addEventListener('load', () => requestAnimationFrame(() => requestAnimationFrame(setup)));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setup).catch(() => {});
  if ('ResizeObserver' in window) new ResizeObserver(() => { if (!revealed) setup(); }).observe(canvas);

  /* ── erase ──
     Sized off the bar's HEIGHT, not its width: the bar is wide and short,
     and a radius taken from the width would clear the whole thing in a
     single touch. */
  const brushR = () => {
    const r = canvas.getBoundingClientRect();
    return Math.max(14, Math.min(26, r.height * 0.42));
  };

  function erase(x, y) {
    const r = brushR();
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(0.6, 'rgba(0,0,0,0.85)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    mark(x, y, r);
  }

  function scratchLine(a, b) {
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const steps = Math.max(1, Math.ceil(dist / 6));
    for (let i = 0; i <= steps; i++) {
      erase(a.x + (b.x - a.x) * (i / steps), a.y + (b.y - a.y) * (i / steps));
    }
  }

  /* coverage is tracked on a coarse grid rather than by reading pixels back
     every move — getImageData on each pointermove is what makes a scratch
     card stutter */
  function mark(x, y, r) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const cw = rect.width / GRID, ch = rect.height / GRID;
    const x0 = Math.max(0, Math.floor((x - r) / cw)), x1 = Math.min(GRID - 1, Math.floor((x + r) / cw));
    const y0 = Math.max(0, Math.floor((y - r) / ch)), y1 = Math.min(GRID - 1, Math.floor((y + r) / ch));
    for (let gy = y0; gy <= y1; gy++) for (let gx = x0; gx <= x1; gx++) coverage[gy * GRID + gx] = 1;
  }

  /* The bar fills its box, so every cell counts — unlike the oval this
     replaced, where the corners could never be cleared and had to be left
     out of the fraction. */
  function getCoverage() {
    let done = 0;
    for (let i = 0; i < coverage.length; i++) if (coverage[i]) done++;
    return done / coverage.length;
  }

  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  canvas.addEventListener('pointerdown', (e) => {
    if (revealed) return;
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    isDrawing = true;
    lastPos = getPos(e);
    erase(lastPos.x, lastPos.y);
    if (hint) hint.classList.add('hidden');
    dismissPrompts();
    sandAccum = 0;
    spawnSand(e.clientX, e.clientY, 0, -1);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!isDrawing || revealed) return;
    e.preventDefault();
    const pos = getPos(e);
    const prev = lastPos || pos;
    scratchLine(prev, pos);

    const dx = pos.x - prev.x, dy = pos.y - prev.y;
    const len = Math.hypot(dx, dy);
    sandAccum += len;
    if (len > 0 && sandAccum >= 7) {
      sandAccum = 0;
      spawnSand(e.clientX, e.clientY, dx / len, dy / len);
      /* a little grit under the finger on devices that support it */
      if (!reduce && navigator.vibrate) navigator.vibrate(6);
    }
    lastPos = pos;

    const now = performance.now();
    if (now - lastCheck > 200) {
      lastCheck = now;
      if (getCoverage() >= 0.45) complete();
    }
  });

  canvas.addEventListener('pointerup', (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    lastPos = null;
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    if (!revealed && getCoverage() >= 0.45) complete();
  });
  canvas.addEventListener('pointercancel', () => { isDrawing = false; lastPos = null; });

  function complete() {
    if (revealed) return;
    revealed = true;
    dismissPrompts();
    canvas.classList.add('gone');
    if (hint) hint.classList.add('hidden');
    if (revealEl) revealEl.classList.add('show');
    if (hashtag) setTimeout(() => hashtag.classList.add('visible'), 700);
    startPetals();
  }

  /* ── the blossom shower ── */
  function startPetals() {
    if (reduce || !pCtx) return;
    const dpr = window.devicePixelRatio || 1;
    const r = section.getBoundingClientRect();
    petalCv.width = Math.round(r.width * dpr);
    petalCv.height = Math.round(r.height * dpr);
    pCtx.setTransform(1, 0, 0, 1, 0, 0);
    pCtx.scale(dpr, dpr);
    petalCv.classList.add('active');

    const COLORS = ['#f2a8c0', '#e88bab', '#f6c2d2', '#dd7fa2', '#f9d6e0'];
    const petals = Array.from({ length: 46 }, () => ({
      x: Math.random() * r.width,
      y: -20 - Math.random() * r.height * 0.6,
      w: 7 + Math.random() * 8,
      vy: 34 + Math.random() * 52,
      vx: -14 + Math.random() * 28,
      rot: Math.random() * Math.PI * 2,
      vr: (-1 + Math.random() * 2) * 1.6,
      sway: 0.6 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      life: 1,
    }));

    const started = performance.now();
    let last = started;
    (function step(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const age = (now - started) / 1000;
      pCtx.clearRect(0, 0, r.width, r.height);

      let visible = 0;
      for (const p of petals) {
        p.phase += p.sway * dt;
        p.x += (p.vx + Math.sin(p.phase) * 26) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        /* everything fades together over the last two seconds, so the
           shower ends as one gesture rather than petal by petal */
        if (age > 6) p.life = Math.max(0, 1 - (age - 6) / 2);
        if (p.y > r.height + 30) continue;
        visible++;
        pCtx.save();
        pCtx.translate(p.x, p.y);
        pCtx.rotate(p.rot);
        pCtx.globalAlpha = 0.9 * p.life;
        pCtx.fillStyle = p.color;
        pCtx.beginPath();
        pCtx.ellipse(0, 0, p.w / 2, p.w / 3.1, 0, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.restore();
      }
      pCtx.globalAlpha = 1;

      if (visible && age < 8.5) requestAnimationFrame(step);
      else { petalCv.classList.remove('active'); pCtx.clearRect(0, 0, r.width, r.height); }
    })(last);
  }

  /* one pulse as the card arrives, so it is noticed at all */
  if (wrap && !reduce) {
    revealOnce(wrap, 'attention', { threshold: 0.45 });
  }
  window.addEventListener('resize', () => { if (!revealed) setup(); sizeSand(); }, { passive: true });
  sizeSand();
}

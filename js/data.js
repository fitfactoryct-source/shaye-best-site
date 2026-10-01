import { TBC, isTbc } from './tbc.js';

// PREVIEW: local build shows unconfirmed sponsors dimmed with a label.
// Set false at launch to hide anything still unconfirmed.
export const PREVIEW = false;

export const EVENT = {
  name: 'Shaye Best Classic 2027',
  year: 2027,
  presenter: { slug: 'research-peptides', name: 'Research Peptides', url: 'https://peptides.co.za' }, // confirmed for 2027 by Troy
  showDate: null,                       // ISO string once confirmed; countdown mounts only when set
  showDay: TBC('Date to be announced'),
  doors: TBC('09h00'),
  start: TBC('10h00'),
  athleteMeeting: TBC('09h00, backstage, compulsory'),
  regDate: TBC('The day before the show'),
  regTime: TBC('15h00 – 20h00'),
  regWarning: 'No late registration on show day under any circumstances',
  venue: TBC('Corpus Christi Gemeente'),
  address: TBC('Uys Krige Drive 78, Panorama, Cape Town'),
  gps: TBC({ lat: -33.884920, lng: 18.577903 }),
  prizeTotal: 190000,
  phone: '082 406 2121',
  whatsapp: 'https://wa.me/27824062121?text=' + encodeURIComponent(
    "Hi Shaye, I'd like to join the Shaye Best Classic 2027 athlete WhatsApp group and receive the registration form."),
  email: 'shaye@shaye.best',
  facebook: 'https://www.facebook.com/shaye.best',
  instagram: 'https://www.instagram.com/shaye_best/',
  tiktok: 'https://www.tiktok.com/@shaye.best.classic'
};

// Five overall titles, throne order left→right. Confirmed 2026-08-25.
// `throne` = seat position left→right on the summit still (Troy, 2026-09-06):
// Men's Bodybuilding · Ladies Bodybuilding · Classic Physique (centre) ·
// Men's Physique · Ladies Bikini.
export const OVERALLS = [
  { key: 'mens-bb',       title: "Men’s Bodybuilding", amount: 40000, runnerUp: 25000, throne: 0,
    feeds: 'All Men’s Bodybuilding line-up winners' },
  { key: 'mens-physique', title: "Men’s Physique",     amount: 30000, throne: 3,
    feeds: 'All Men’s Physique line-up winners' },
  { key: 'ladies-bb',     title: 'Ladies Bodybuilding', amount: 30000, throne: 1,
    feeds: 'Ladies Figure Open, Ladies Figure 40+ and Ladies Bodybuilding Open winners' },
  { key: 'ladies-bikini', title: 'Ladies Bikini',      amount: 30000, throne: 4,
    feeds: 'Bikini, Fitness Bikini, Ladies Masters and Ladies Wellness winners' },
  { key: 'classic',       title: 'Classic Physique',   amount: 35000, rises: true, throne: 2,
    feeds: 'Short, Medium and Tall class winners' }
];

// Ledges on the climb, base → summit. Whole list TBC until Shaye confirms 2027 divisions.
export const DIVISION_GROUPS = TBC([
  // Men together, then ladies together (Troy, 2026-09-29); the climb section draws a heading per side.
  { overall: 'mens-bb', side: 'men', name: "Men’s Bodybuilding", lineups: [
    'Junior Bodybuilding 21 and under', 'Bodybuilding over 50', 'Bodybuilding over 40',
    'Bodybuilding under 70 kg', 'Bodybuilding under 80 kg', 'Bodybuilding under 90 kg', 'Bodybuilding over 90 kg' ] },
  { overall: 'classic', side: 'men', name: 'Classic Physique', note: 'New for 2027 · three height classes',
    lineups: [ 'Short', 'Medium', 'Tall' ] },
  { overall: 'mens-physique', side: 'men', name: "Men’s Physique", lineups: [
    "Junior Men’s Physique 21 and under", "Men’s Physique Masters 40+",
    "Men’s Physique up to 175 cm", "Men’s Physique over 175 cm", 'Mr. Denim Open' ] },
  { overall: 'ladies-bb', side: 'ladies', name: 'Ladies Bodybuilding & Figure', lineups: [
    'Ladies Figure Open', 'Ladies Figure 40+', 'Ladies Bodybuilding Open' ] },
  { overall: 'ladies-bikini', side: 'ladies', name: 'Bikini & Wellness', lineups: [
    'Ladies Bikini 21 and under', 'Ladies Bikini 40+', 'Ladies Bikini up to 171 cm', 'Ladies Bikini over 171 cm',
    'Ladies Fitness Bikini up to 171 cm', 'Ladies Fitness Bikini over 171 cm',
    'Ladies Wellness Open', 'Ladies Sports Model Open' ] }
]);

export const COSTS = [
  { label: 'First line-up',          price: TBC('R500'), note: 'Per athlete' },
  { label: 'Additional line-up',     price: TBC('R350'), note: 'Each' },
  { label: 'Spectator door entry',   price: TBC('R200'), note: 'All ages' },
  { label: 'Backstage & show combo', price: TBC('R700'), note: 'Limited passes: main hall and backstage' }
];

export const DATES = [
  { when: TBC('Day before the show'), time: EVENT.regTime, what: 'Registration',
    detail: 'At the venue. No late registration on show day under any circumstances.' },
  { when: TBC('Show day'), time: TBC('09h00'), what: 'Compulsory athlete meeting',
    detail: 'Backstage. The #shayebestclassicloading trophy and R1 000 is awarded here.' },
  { when: TBC('Show day'), time: TBC('09h00'), what: 'Doors open to the public', detail: '' },
  { when: TBC('Show day'), time: TBC('10h00'), what: 'Show starts', detail: '' }
];

export const PARTNERS = [
  // Tanning company not confirmed for 2027 (Troy, 2026-09-29): name, contact and rules withheld until it is.
  // The 2026 company's terms are in git history (eb7e5d7).
  { name: 'Tanning company', tbc: true, role: 'Tanning, hair and makeup',
    items: [ ['Stage-ready tan', TBC('R600')], ['Makeup (stage glam with lashes)', TBC('R700')],
             ['Hair (straightened / curled / high ponytail / braid)', TBC('R350')],
             ['Full combo: makeup + hair + tan', TBC('R1 550')] ],
    rules: [ 'Company, prices and rules to be confirmed. They will be shared in the athlete WhatsApp group.' ] },
  { name: 'Studio Audacity', role: 'Official event photography', contact: 'Jay · 076 968 0184',
    items: [ ['Early bird: book and pay before the event', TBC('R400')], ['Normal package', TBC('R500')] ],
    rules: [ 'All stage photographs in high-resolution digital format, for all divisions.',
             'Minimum 2 weeks after the event for release, due to the number of participants.',
             'Delivered via WeTransfer.',
             'Studio Audacity retain the rights for first release of the official photos as watermarked previews.' ] }
];

export const SOCIAL_TROPHY = {
  hashtags: ['#shayebest', '#shayebestclassic', '#shayebestclassicloading'],
  tag: 'Tag shayebest on Facebook and Instagram, and shaye.best.classic on TikTok.',
  prize: 'R1 000 and a unique #shayebestclassicloading trophy',
  rule: 'Post as many times as you like. The post with the most likes across all social media wins, awarded by Shaye Best at the athlete meeting.'
};

// 2027 line-up confirmed by Shaye (Troy, 2026-09-26): Research Peptides (title),
// Dermaporium, Refresche, Engen Rietvlei, PocketLogic, FitFactory. The rest are
// carried over from last year, hidden until re-confirmed.
export const SPONSORS = [
  { slug: 'research-peptides', name: 'Research Peptides', tier: 'title', url: 'https://peptides.co.za', confirmed: true },
  { slug: 'browns',        name: 'Browns The Diamond Store',  tier: 'partner', confirmed: false },
  { slug: 'my-gym',        name: 'My Gym',                    tier: 'partner', confirmed: false },
  { slug: 'dermaporium',   name: 'Dermaporium',               tier: 'partner', confirmed: true, url: 'https://dermaporium.co.za' },
  { slug: 'refresche',     name: 'Refresche Teeth Whitening', tier: 'partner', confirmed: true },
  { slug: 'engen-rietvlei',name: 'Engen Rietvlei',            tier: 'partner', confirmed: true },
  { slug: 'planet-nails',  name: 'Planet Nails Distribution', tier: 'partner', confirmed: false },
  { slug: 'sorbet-hairbar',name: 'Sorbet hairbar',            tier: 'partner', confirmed: false },
  { slug: 'dryforce',      name: 'DryForce',                  tier: 'partner', confirmed: false },
  { slug: 'psygro',        name: 'Psygro',                    tier: 'partner', confirmed: false },
  { slug: 'tanworx',       name: 'Tanworx',                   tier: 'partner', confirmed: false },
  { slug: 'fitfactory',    name: 'FitFactory',                tier: 'partner', confirmed: true, url: 'https://fit-factory-app-production.up.railway.app' },
  { slug: 'pocketlogic',   name: 'PocketLogic',               tier: 'partner', confirmed: true, url: 'https://www.thepocketlogic.com' },
  { slug: 'net-nutrition', name: 'N.E.T Nutrition',           tier: 'partner', confirmed: false, url: 'https://www.netnutrition.co.za' }
];

// Classic Physique height-to-weight. Rows are "up to and including upTo cm".
// A row has EITHER `plus` (max = height - 100 + plus, the old ratio shape)
// OR `maxKg` (fixed cap per band, the IFBB-style table shape). Whole table
// TBC: the 2027 ratio is changing; this seeds the old one so the UI works.
// 2027 official weigh-in reference (Shaye, PDF 2026-09-22, archived at
// docs/2027-classic-physique-weigh-in-reference.pdf). Short ≤175, Medium 176–188, Tall ≥189.
export const CLASSIC_TABLE = [
  { upTo: 168, plus: 8,    label: 'Short class · up to 168 cm · plus 8 kg' },
  { upTo: 171, plus: 10,   label: 'Short class · 169⁠–⁠171 cm · plus 10 kg' },
  { upTo: 175, plus: 12,   label: 'Short class · 172⁠–⁠175 cm · plus 12 kg' },
  { upTo: 180, plus: 15,   label: 'Medium class · 176⁠–⁠180 cm · plus 15 kg' },
  { upTo: 188, plus: 17,   label: 'Medium class · 181⁠–⁠188 cm · plus 17 kg' },
  { upTo: 196, plus: 19,   label: 'Tall class · 189⁠–⁠196 cm · plus 19 kg' },
  { upTo: Infinity, plus: 21.5, label: 'Tall class · over 196 cm · plus 21.5 kg' }
];

// Highlights strip on the main page: 2026 winners (Studio Audacity, supplied by Shaye 2026-09-06).
// All 30 exports live in assets/event-photos/2026/ for the /2026 archive page; these 12 carry the strip.
// Ordered so gender, category (bodybuilding/physique/bikini) and Shaye-cheque
// shots never repeat back-to-back in the strip (Troy, 2026-09-07).
export const HIGHLIGHT_PHOTOS = [
  'dsc07999', 'dsc02312', 'dsc05414', 'dsc05494', 'dsc08241', 'dsc05981',
  'dsc02466', 'dsc05909', 'dsc06152', 'dsc08253', 'dsc06416', 'dsc03054',
  'dsc07046', 'dsc06556', 'dsc08274', 'dsc03885', 'dsc08125', 'dsc07158',
  'dsc08282', 'dsc06703', 'dsc04715', 'dsc06805', 'dsc07241', 'dsc08375',
  'dsc06885', 'dsc04958', 'dsc07509', 'dsc07693', 'dsc07932', 'dsc05157'
]
  .map(n => `assets/event-photos/2026/${n}.webp`);

// Short clips for the highlights strip: { poster, src, title }. Empty until footage arrives.
export const HIGHLIGHT_CLIPS = [];

export const SHAYE = {
  vision: 'Driving excellence, absolute integrity, and freedom in physique sports.',
  portrait: 'assets/shaye-portrait.webp'
};

// Answers are functions of a formatter `f` (render.js passes tbc()) so
// prices/dates interpolate from the facts above and update when they flip.
export const FAQ = [
  { q: 'How do I enter?',
    a: () => 'Send a WhatsApp to 082 406 2121 to join the athlete group. Shaye sends the registration form there. Entries are not taken on this page.' },
  { q: 'Can I register on show day?',
    a: f => (isTbc(EVENT.regDate) || isTbc(EVENT.regTime)
      ? 'No. The registration date and time are to be confirmed. There is no late registration on show day under any circumstances.'
      : `No. Registration is ${f(EVENT.regDate)}, ${f(EVENT.regTime)} only. There is no late registration on show day under any circumstances.`) },
  { q: 'What does it cost to compete?',
    a: f => (isTbc(COSTS[0].price) || isTbc(COSTS[1].price)
      ? 'Entry prices are to be confirmed. Message the athlete WhatsApp group for updates.'
      : `${f(COSTS[0].price)} for your first line-up and ${f(COSTS[1].price)} for each additional line-up.`) },
  { q: 'How much is it to watch?',
    a: f => (isTbc(COSTS[2].price) || isTbc(COSTS[3].price)
      ? 'Door prices are to be confirmed. Door entry is open to all ages, and a backstage and show combo will have limited passes.'
      : `${f(COSTS[2].price)} at the door, all ages. A backstage and show combo is ${f(COSTS[3].price)}, with limited passes.`) },
  { q: 'Can I use my own tanning company?',
    a: () => 'The tanning company for 2027 is to be confirmed. Shaye shares it in the athlete WhatsApp group.' },
  { q: 'How do I know if I qualify for Classic Physique?',
    a: () => 'Use the calculator on this page. Enter your height and it gives your maximum stage weight from the 2027 table.' },
  { q: 'When do I get my photos?',
    a: f => 'Minimum two weeks after the event, sent via WeTransfer by Studio Audacity. ' + (isTbc(PARTNERS[1].items[0][1]) || isTbc(PARTNERS[1].items[1][1])
      ? 'Photo package prices are to be confirmed.'
      : `${f(PARTNERS[1].items[0][1])} if you book and pay before the event, ${f(PARTNERS[1].items[1][1])} after.`) },
  { q: 'Is there a prize for every line-up winner?',
    a: () => 'Line-up winners receive a trophy, 2nd and 3rd receive medals, and 4th to 6th receive a unique participation medal. The cash prizes are for the five overall titles.' }
];

export const EVENT = {
  name: 'Shaye Best Classic 2026',
  presenter: 'Research Peptides',
  showDate: '2026-08-29T10:00:00+02:00',
  doors: '09h00',
  start: '10h00',
  athleteMeeting: '09h00, backstage — compulsory',
  regDate: 'Friday 28 August 2026',
  regTime: '15h00 – 20h00',
  regWarning: 'No late registration on show day under any circumstances',
  venue: 'Corpus Christi Gemeente',
  address: 'Uys Krige Drive 78, Panorama, Cape Town',
  gps: { lat: -33.884920, lng: 18.577903 },
  prizeTotal: 125000,
  phone: '082 406 2121',
  whatsapp: 'https://wa.me/27824062121?text=' + encodeURIComponent(
    "Hi Shaye, I'd like to join the Shaye Best Classic 2026 athlete WhatsApp group and receive the registration form."),
  email: 'shaye@shaye.best',
  facebook: 'https://www.facebook.com/shaye.best',
  facebookEvent: 'https://facebook.com/events/s/shaye-best-classic-2026-29-aug/1819860872003364/',
  instagram: 'https://www.instagram.com/shaye_best/',
  tiktok: 'https://www.tiktok.com/@shaye.best.classic'
};

// Official show-day running order (poster, 2026-08-24). Same 23 line-ups as
// the old per-division entry list — stage order differs from entry numbering.
export const RUNNING_ORDER = [
  { n:1,  title:'Junior Bodybuilding',    tag:'Under 21' },
  { n:2,  title:'Bodybuilding',           tag:'Over 50' },
  { n:3,  title:'Bodybuilding',           tag:'Over 40' },
  { n:4,  title:'Bodybuilding',           tag:'Under 70 kg' },
  { n:5,  title:'Bodybuilding',           tag:'Under 80 kg' },
  { n:6,  title:'Bodybuilding',           tag:'Under 90 kg' },
  { n:7,  title:'Bodybuilding',           tag:'Over 90 kg' },
  { n:8,  title:'Ladies Figure',          tag:'Open' },
  { n:9,  title:'Ladies Bodybuilding',    tag:'Open' },
  { n:10, title:'Classic Bodybuilding',   tag:'Height-to-weight ratio applies' },
  { break:'30 minute break' },
  { n:11, title:'Ladies Bikini',          tag:'Under 21' },
  { n:12, title:'Ladies Bikini',          tag:'40+' },
  { n:13, title:'Ladies Bikini',          tag:'Up to 171 cm' },
  { n:14, title:'Ladies Bikini',          tag:'Over 171 cm' },
  { n:15, title:'Ladies Fitness Bikini',  tag:'Up to 171 cm' },
  { n:16, title:'Ladies Fitness Bikini',  tag:'Over 171 cm' },
  { n:17, title:'Ladies Wellness',        tag:'Open' },
  { n:18, title:"Junior Men's Physique",  tag:'Under 21' },
  { n:19, title:"Men's Physique Masters", tag:'40+' },
  { n:20, title:"Men's Physique",         tag:'Up to 175 cm' },
  { n:21, title:"Men's Physique",         tag:'Over 175 cm' },
  { n:22, title:'Ladies Sports Model',    tag:'Open' },
  { n:23, title:'Mr. Denim',              tag:'Open' },
  { break:'10 minute break' },
  { overall:"Men's Bodybuilding Overall" },
  { overall:"Men's Physique Overall" },
  { overall:'Ladies Bikini Overall' },
  { overall:'Ladies Bodybuilding Overall' }
];

export const OVERALLS = [
  { title:"Men's Bodybuilding", amount:25000,
    note:'2nd R15 000 · 3rd R10 000',
    feeds:'All Men’s Bodybuilding line-up winners, including Classic' },
  { title:"Men's Physique", amount:25000, note:'',
    feeds:'All Men’s Physique line-up winners' },
  { title:'Ladies Bodybuilding', amount:25000, note:'',
    feeds:'Ladies Figure Open and Ladies Bodybuilding Open winners' },
  { title:'Ladies Bikini', amount:25000, note:'',
    feeds:'Bikini, Fitness Bikini, Ladies Masters and Ladies Wellness winners' }
];

export const COSTS = [
  { label:'First line-up',        price:'R500', note:'Per athlete' },
  { label:'Additional line-up',   price:'R350', note:'Each' },
  { label:'Spectator door entry', price:'R200', note:'All ages' },
  { label:'Backstage & show combo', price:'R700', note:'Limited passes — main hall and backstage' }
];

export const DATES = [
  { when:'20 June 2026',    time:'09h00 – 11h00', what:'Free athlete workshop', past:true,
    detail:'Judging, posing, tanning, show photography, Q&A. Booking essential — WhatsApp “Book me for seminar” to 082 406 2121. Free to participating athletes.' },
  { when:'Fri 28 Aug 2026', time:'15h00 – 20h00', what:'Registration',
    detail:'Corpus Christi Gemeente. No late registration on show day under any circumstances.' },
  { when:'Sat 29 Aug 2026', time:'09h00', what:'Compulsory athlete meeting',
    detail:'Backstage. The #shayebestclassicloading trophy and R2 000 is awarded here.' },
  { when:'Sat 29 Aug 2026', time:'09h00', what:'Doors open to the public', detail:'' },
  { when:'Sat 29 Aug 2026', time:'10h00', what:'Show starts', detail:'' }
];

export const PARTNERS = [
  { name:'Tanworx', role:'Tanning, hair and makeup',
    contact:'Ina — 072 604 5821',
    items:[ ['Stage-ready tan','R600'], ['Makeup (stage glam with lashes)','R700'],
            ['Hair (straightened / curled / high ponytail / braid)','R350'],
            ['Full combo — makeup + hair + tan','R1 550'] ],
    rules:[ 'The ONLY accredited company on show day. No other company will be allowed at the venue.',
            'Tan includes base tan, stage coat as needed, touch-ups for up to 2 line-ups plus overalls, and shine/glaze if required.',
            'Athletes competing in more than 2 line-ups are charged R50 per additional line-up.',
            'Tanworx will not do any touch-ups or fixing of tans if not originally applied by Tanworx.',
            'Booking is essential.' ] },
  { name:'Studio Audacity', role:'Official event photography',
    contact:'Jay — 076 968 0184',
    items:[ ['Early bird — book and pay before the event','R400'], ['Normal package','R500'] ],
    rules:[ 'All stage photographs in high-resolution digital format, for all divisions.',
            'Minimum 2 weeks after the event for release, due to the number of participants.',
            'Delivered via WeTransfer.',
            'Studio Audacity retain the rights for first release of the official photos as watermarked previews.' ] }
];

export const SOCIAL_TROPHY = {
  hashtags:['#shayebest','#shayebestclassic','#shayebestclassicloading'],
  tag:'Tag shayebest on Facebook and Instagram, and shaye.best.classic on TikTok.',
  prize:'R2 000 and a unique #shayebestclassicloading trophy',
  opened:'1 December 2025',
  rule:'Post as many times as you like. The post with the most likes across all social media wins, awarded by Shaye Best at the athlete meeting.',
  winners:[ ['2023','Morne Smal'], ['2024','Jaco Jonker'], ['2025','Jaco Jonker'] ]
};

export const SPONSORS = [
  { slug:'research-peptides', name:'Research Peptides', tier:'title' },
  { slug:'browns',            name:'Browns The Diamond Store', tier:'partner' },
  { slug:'my-gym',            name:'My Gym', tier:'partner' },
  { slug:'refresche',         name:'Refresche Teeth Whitening', tier:'partner' },
  { slug:'planet-nails',      name:'Planet Nails Distribution', tier:'partner' },
  { slug:'sorbet-hairbar',    name:'Sorbet hairbar', tier:'partner' },
  { slug:'dryforce',          name:'DryForce', tier:'partner' },
  { slug:'psygro',            name:'Psygro', tier:'partner' },
  { slug:'tanworx',           name:'Tanworx', tier:'partner' },
  { slug:'fitfactory',        name:'FitFactory', tier:'partner', url:'https://fit-factory-app-production.up.railway.app' },
  { slug:'pocketlogic',       name:'PocketLogic', tier:'partner', url:'https://www.thepocketlogic.com' },
  { slug:'net-nutrition',     name:'N.E.T Nutrition', tier:'partner', url:'https://www.netnutrition.co.za' }
];

export const FAQ = [
  { q:'How do I enter?',
    a:'Send a WhatsApp to 082 406 2121 to join the athlete group. Shaye sends the registration form there. Entries are not taken on this page.' },
  { q:'Can I register on show day?',
    a:'No. Registration is Friday 28 August, 15h00 to 20h00 only. There is no late registration on show day under any circumstances.' },
  { q:'What does it cost to compete?',
    a:'R500 for your first line-up and R350 for each additional line-up.' },
  { q:'How much is it to watch?',
    a:'R200 at the door, all ages. A backstage and show combo is R700, with limited passes.' },
  { q:'Can I use my own tanning company?',
    a:'No. Tanworx is the only accredited company on show day and no other company is allowed at the venue. Tanworx will not fix or touch up a tan they did not apply.' },
  { q:'How do I know if I qualify for Classic Bodybuilding?',
    a:'Use the calculator on this page. Enter your height and it gives your maximum stage weight from the official ratio.' },
  { q:'When do I get my photos?',
    a:'Minimum two weeks after the event, sent via WeTransfer by Studio Audacity. R400 if you book and pay before the event, R500 after.' },
  { q:'Is there a prize for every line-up winner?',
    a:'Line-up winners receive a trophy, 2nd and 3rd receive medals, and 4th to 6th receive a unique participation medal. The R25 000 cash prizes are for the four overall titles.' }
];

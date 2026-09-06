import { Trail } from '../../types/index';

/**
 * What the Heath Was Watching
 * --------------------------------------------------------------------
 * Audience: family / dog-walk (Ross daily Upton Heath loop)
 * Status:   pending playtest — registered in Trails[]; game_config.status=pending
 *           (Coming Soon on home; direct URL still playable).
 * Images/audio: stubbed S3 paths — replace before polish pass.
 * MacGuffin: inventory token "A Borrowed Minute" (attention/time near
 *            Beacon Road) — NOT a literal Rolex.
 */

const IMG = 'https://trail-images.s3.eu-west-2.amazonaws.com/what-the-heath-was-watching';

// Location ids (stable for map markers)
const LOC = {
    carPark: '9f7285ee-fb11-40e1-b06f-21d883fd0706',
    fieldEntrance: 'c4e3219e-cbaf-493b-a0bb-f80f3523b0a3',
    fieldGate: '179b0646-cdb4-4561-b8fa-12a957f18c3e',
    viewpoint: 'ec3d2cdd-8cd8-458d-8083-740b8d75594d',
    heathPathEnd: 'add6cf45-080c-49cf-bc64-116b928a4a60',
    finalGate: 'e43f9259-61e8-4f23-87f9-e032a8116782',
} as const;

export const WhatTheHeathWasWatching: Trail = {
    ref: 'what-the-heath-was-watching',
    name: 'What the Heath Was Watching',
    type: 'WALK',
    content_pack: false,
    ownerId: null,
    ageSuitability: 'Family',
    attributes: ['DOG_ACCESSIBLE'],
    region: 'Dorset',
    tags: ['draft', 'dog-walk', 'upton-heath', 'family'],
    price: 0,
    isFree: true,
    tester: true,
    isValidating: true,
    image_url: `${IMG}/cover.png`, // STUB
    description: `A quiet family dog-walk story on Upton Heath — Pip the trail-dog, Briar at the gorse gates, and Merryn at the viewpoint. Story drips between pins; look for what the place is actually showing you.\n\nDistance: ~2.5 km OSM loop · about 33 minutes. Pushchair hops vary; dogs welcome.`,
    start_node_caption: 'Find the red pin at the car park — Pip is waiting.',
    items: [
        {
            key: 'borrowed_minute',
            name: 'A Borrowed Minute',
            image_url: `${IMG}/borrowed_minute.png`, // STUB — attention/time token, not a watch
            thumb_url: `${IMG}/borrowed_minute_thumb.png`, // STUB
        },
    ],
    steps: [
        // ------------------------------------------------------------------
        // 1. Car Park — Pip cold open + Storyteller brief
        // ------------------------------------------------------------------
        {
            index: 0,
            locationId: LOC.carPark,
            name: 'Car Park',
            type: 'TRAIL_NODE',
            hidden: false,
            can_revisit: false,
            trackingEnabled: true,
            on_search: { proximity_radius: 40 },
            tasks: [
                {
                    id: '0',
                    type: 'information',
                    content: `Pip skids onto the gravel, nose already west of the cars.\n\n"Same walk. Different day. Something's off."\n\nTail — a question mark.\n\n"Not spooky-off. Notice-me-off. I'm a trail-dog. I notice noticing."\n\nCold air. Car doors. The day hasn't decided yet.\n\n"Adults — quick huddle before we leave the tarmac."`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '1',
                    type: 'information',
                    content: `Hey Storyteller!\n\nThis is a ~2.5 km loop from the Beacon Road / Upton Heath car park: field → gate → viewpoint → heath path back → final gate → cars. Roughly 33 minutes of walking, plus stops.\n\nAt each pin you'll get layered screens:\n• first screen — young ears / short version\n• next screens — older kids & you\nRead what fits your group. Skip freely.\n\nBetween pins, Pip will leave you a walking question. Argue about it. That's the game working.\n\nCharacters (on the app, not "imagine a rabbit"):\n• Pip — virtual trail-dog, cold opens, glue across ages\n• Briar — gorse gatekeeper; dry, incomplete; never explains\n• Merryn — quiet viewpoint voice\n\nThere's a MacGuffin later — a feeling of time and attention borrowed near Beacon Road. It lands in the app inventory. It is *not* a Rolex.\n\nNext screen: map. Red pin = field entrance.`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    type: 'map',
                    content: 'Ready to go?',
                    markers: [LOC.fieldEntrance],
                    required: false,
                },
            ],
        },

        // ------------------------------------------------------------------
        // 2. Field entrance — Pip + walk challenge
        // ------------------------------------------------------------------
        {
            index: 1,
            locationId: LOC.fieldEntrance,
            name: 'Field Entrance',
            type: 'TRAIL_NODE',
            hidden: false,
            can_revisit: false,
            trackingEnabled: true,
            on_search: { proximity_radius: 35 },
            tasks: [
                {
                    id: '100',
                    type: 'information',
                    content: `Pip plants both paws on the threshold like a tiny customs officer.\n\n"Open. Big sky. Soft underfoot. Don't rush the latch ahead — Briar hates yankers."\n\nYoung ears: what colour does the open *feel* like? Then find three greens before the next pin — grass, leaf, something pricklier.`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '101',
                    type: 'information',
                    content: `While you walk, try the **Watch Challenge** — not a wristwatch.\n\nCount things that seem to *look back*:\n• a window\n• a bird that holds your stare\n• a path that feels like it chose you\n• anything that makes you slow down without knowing why\n\nPip: "Heath doesn't clap when you get it. It just… waits. Then pretends it wasn't watching."`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '102',
                    type: 'information',
                    content: `Older layer: Beacon Road sits behind you — a borrowed corridor of hurry. Out here the minutes stretch. Most people drag road-speed into the grass without noticing.\n\nPip tip: if anyone still walks like they're late for something — that's the first thing the heath clocks.`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    type: 'map',
                    content: 'Ready to go?',
                    markers: [LOC.fieldGate],
                    required: false,
                },
            ],
        },

        // ------------------------------------------------------------------
        // 3. Field gate onto path — Briar gate1
        // ------------------------------------------------------------------
        {
            index: 2,
            locationId: LOC.fieldGate,
            name: 'Field Gate onto Path',
            type: 'TRAIL_NODE',
            hidden: false,
            can_revisit: false,
            trackingEnabled: true,
            on_search: { proximity_radius: 30 },
            tasks: [
                {
                    id: '200',
                    type: 'information',
                    content: `Gorse crowds the latch like it grew there on purpose.\n\nA voice that could be wind through spines — Briar:\n\n"Latch remembers the hand that doesn't yank. Which side learned that?"\n\nYoung ears: soft hands on the gate. Look for yellow gorse flowers (even out of peak, the prickles stay honest).`,
                    image_url: `${IMG}/briar.png`, // STUB
                    required: false,
                },
                {
                    id: '201',
                    type: 'information',
                    content: `Briar does not explain. Briar never explains.\n\nPip, helpfully unhelpful: "I think Briar means the gate *and* the people. Or the people *and* the dogs. Or—"\n\nBriar: "…."\n\nLook-find: stand on the field side, then the path side. Same latch. Different promise. Which side feels like it was taught manners?`,
                    image_url: `${IMG}/briar.png`, // STUB
                    required: false,
                },
                {
                    id: '202',
                    type: 'information',
                    content: `Adult layer: gorse (*Ulex*) holds the heath's edge — nitrogen, fire ecology, a prickly kindness that keeps soft ground from being trampled into nowhere.\n\nBriar's riddle is incomplete on purpose. Carry it. Argue it between here and the viewpoint.\n\nPip: "Winner gets first sniff at the next pin. Loser still gets to walk. That's heath justice."`,
                    image_url: `${IMG}/briar.png`, // STUB
                    required: false,
                },
                {
                    type: 'map',
                    content: 'Ready to go?',
                    markers: [LOC.viewpoint],
                    required: false,
                },
            ],
        },

        // ------------------------------------------------------------------
        // 4. Viewpoint — Merryn + MacGuffin
        // ------------------------------------------------------------------
        {
            index: 3,
            locationId: LOC.viewpoint,
            name: 'Viewpoint',
            type: 'TRAIL_NODE',
            hidden: false,
            can_revisit: false,
            trackingEnabled: true,
            on_search: { proximity_radius: 45 },
            tasks: [
                {
                    id: '300',
                    type: 'information',
                    content: `The path opens. The air thins into distance.\n\nMerryn — quiet, almost not a voice:\n\n"Pockets open. West — pale scar, what the ground used to be. Out past the heath — coastline and hills when the air lets them. The watch wasn't on the path. It was on whether anyone looked *past* it."\n\nYoung ears: point west. Find the pale scar. Find something far that isn't a tree.`,
                    image_url: `${IMG}/merryn.png`, // STUB
                    required: false,
                },
                {
                    id: '301',
                    type: 'information',
                    content: `Pip sits. Actually sits. Rare.\n\n"There. That feeling — like a minute got borrowed from the rush near Beacon Road and left out here to cool."\n\nSomething settles into your pack that isn't metal and isn't ticking.\n\n**A Borrowed Minute** — inventory token. Attention you can spend. Not a Rolex. Never a Rolex.\n\nLook-find: without phones if you can manage it — hold the view for one full borrowed minute. Count slow. Notice who fidgets first.`,
                    image_url: `${IMG}/borrowed_minute.png`, // STUB
                    on_arrival: ['addItem -item borrowed_minute'],
                    required: false,
                },
                {
                    id: '302',
                    type: 'information',
                    content: `Older / adult layer: Merryn's "watch" is attention, not timekeeping. The pale scar is place-memory — quarried or worn ground, a reminder that heaths are worked landscapes, not empty wallpaper.\n\nIf the coast and hills show today, treat them as a gift of air clarity, not a guarantee. The heath keeps watching whether you only came for the selfie-pin or for the *past*.\n\nSpeculate on the walk back: who was watching whom — you, or the heath?`,
                    image_url: `${IMG}/merryn.png`, // STUB
                    required: false,
                },
                {
                    type: 'map',
                    content: 'Ready to go?',
                    markers: [LOC.heathPathEnd],
                    required: false,
                },
            ],
        },

        // ------------------------------------------------------------------
        // 5. Heath path end return — drip / synthesis
        // ------------------------------------------------------------------
        {
            index: 4,
            locationId: LOC.heathPathEnd,
            name: 'Heath Path End (Return)',
            type: 'TRAIL_NODE',
            hidden: false,
            can_revisit: false,
            trackingEnabled: true,
            on_search: { proximity_radius: 35 },
            tasks: [
                {
                    id: '400',
                    type: 'information',
                    content: `Pip trots a figure-eight where the path decides to behave again.\n\n"Return leg. Same dirt. Different eyes. That's the cheat code."\n\nYoung ears: one thing you didn't clock on the way out. Just one. Heather counts. Gorse counts. A silence counts.`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '401',
                    type: 'information',
                    content: `Story drip (don't spoil it out loud if kids are still guessing): the watcher wasn't a stranger in the gorse. It was the quiet test every dog-walk fails or passes — did road-speed come with you, or did you leave a minute behind on purpose?\n\nBriar would never say that. Merryn almost did. Pip mostly wanted biscuits and honesty.`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '402',
                    type: 'information',
                    content: `If you're carrying **A Borrowed Minute**, you don't have to "use" it. Possession is the point — proof you looked past the path.\n\nAdult aside: ordinary loops turn into stories when someone bothers to name the noticing. That's all this is.\n\nOne gate left. Briar gets the last word. Briar always wanted the last word.`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    type: 'map',
                    content: 'Ready to go?',
                    markers: [LOC.finalGate],
                    required: false,
                },
            ],
        },

        // ------------------------------------------------------------------
        // 6. Final gate before car park — Briar final + finish
        // ------------------------------------------------------------------
        {
            index: 5,
            locationId: LOC.finalGate,
            name: 'Final Gate before Car Park',
            type: 'TRAIL_NODE',
            hidden: false,
            can_revisit: false,
            trackingEnabled: true,
            on_search: { proximity_radius: 30 },
            tasks: [
                {
                    id: '500',
                    type: 'information',
                    content: `Latch again. Gravel hint of cars beyond.\n\nBriar — prickly-warm, unfinished as ever:\n\n"You brought the walk back quieter than you took it. That's enough. For today."\n\nYoung ears: soft hands. Thank the gate. Silly? Briar doesn't mind silly.`,
                    image_url: `${IMG}/briar.png`, // STUB
                    required: false,
                },
                {
                    id: '501',
                    type: 'information',
                    content: `Pip bumps a knee.\n\n"See? Watching isn't spooky. Watching is… checking you showed up properly."\n\nIf your Borrowed Minute is still in inventory — keep it. Or spend it on the drive home by not rushing the first red light. Pip's advice. Unverified.`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '502',
                    type: 'finish',
                    content: `That's the loop.\n\nWhat the heath was watching: whether anyone looked past the path.\n\nCars ahead. Water for dogs. Soft thank-you to Briar optional (recommended).\n\nCome back another day — the latch will remember the hand.\n\n— Pip, Briar, Merryn (draft trail · not live)`,
                    image_url: `${IMG}/cover.png`, // STUB
                    required: false,
                },
            ],
        },
    ],
    locations: [
        {
            index: 0,
            id: LOC.carPark,
            lat: 50.762012947626665,
            lng: -2.0202031483379357,
            name: 'Car Park',
        },
        {
            index: 1,
            id: LOC.fieldEntrance,
            lat: 50.76091533282281,
            lng: -2.023903538661342,
            name: 'Field Entrance',
        },
        {
            index: 2,
            id: LOC.fieldGate,
            lat: 50.75890153169216,
            lng: -2.0291648364341,
            name: 'Field Gate onto Path',
        },
        {
            index: 3,
            id: LOC.viewpoint,
            lat: 50.75665047258589,
            lng: -2.0238960223839038,
            name: 'Viewpoint',
        },
        {
            index: 4,
            id: LOC.heathPathEnd,
            lat: 50.757752670965544,
            lng: -2.0237197804462004,
            name: 'Heath Path End (Return)',
        },
        {
            index: 5,
            id: LOC.finalGate,
            lat: 50.76096551558284,
            lng: -2.020612977450314,
            name: 'Final Gate before Car Park',
        },
    ],
};

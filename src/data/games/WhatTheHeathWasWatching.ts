import { Trail } from '../../types/index';

/**
 * What the Heath Was Watching — rebuild: Pip's Bolt
 * --------------------------------------------------------------------
 * Audience: family / dog-walk (Ross daily Upton Heath loop)
 * Spine:   lost-dog adventure (NOT the abandoned Heath Watch fetch-quest)
 * Craft:   Jasmarina scenes + immersion rules — no fake broken props;
 *          temporary evidence via in-app photo / "this morning";
 *          look-finds on real place (scar, heather, latches, forks);
 *          choice sets state (SCAR vs HEATHER) and changes later copy;
 *          GPS path-fork waits until Ross spots a real fork on foot.
 * Status:  pending playtest — keep ref for URL stability
 * Images:  stubbed S3 — replace; paw-print / collar are PHOTO stubs
 */

const IMG = 'https://trail-images.s3.eu-west-2.amazonaws.com/what-the-heath-was-watching';

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
    name: "Pip's Bolt",
    type: 'WALK',
    content_pack: false,
    ownerId: null,
    ageSuitability: 'Family',
    attributes: ['DOG_ACCESSIBLE'],
    region: 'Dorset',
    tags: ['draft', 'dog-walk', 'upton-heath', 'family', 'adventure'],
    price: 0,
    isFree: true,
    tester: true,
    isValidating: true,
    image_url: `${IMG}/cover.png`, // STUB
    description: `TWIMP is an outdoor storytelling app — walk to pins on a map and the next chapter plays when you arrive.\n\nAt the Springdale Road car park on Upton Heath, Briar's trail-dog Pip has bolted into the gorse. Help search the loop: open field, gates, viewpoint, and home again. There will be clues, a choice, and a twist — and nothing that asks you to pretend a healthy latch is broken.\n\nRoughly 30–40 minutes. Dogs welcome.`,
    start_node_caption: 'Find the red pin at the Springdale Road car park — Briar is waiting.',
    items: [
        {
            key: 'collar_tag',
            name: "Pip's Collar Tag",
            image_url: `${IMG}/collar_tag.png`, // STUB
            thumb_url: `${IMG}/collar_tag_thumb.png`, // STUB
        },
    ],
    steps: [
        // 1. Car park — cold open + quest
        {
            index: 0,
            locationId: LOC.carPark,
            name: 'Car Park',
            type: 'TRAIL_NODE',
            hidden: false,
            can_revisit: false,
            trackingEnabled: true,
            on_search: { proximity_radius: 40 },
            on_arrival: ['setState -value SEARCH'],
            tasks: [
                {
                    id: '0',
                    type: 'information',
                    content: `A weathered figure in a moss-green coat is pacing the Springdale Road car park, soft lead dangling empty from one hand. Their cap is crooked. Their face is the particular shade of calm people use when they are absolutely not calm.\n\nThis is Briar.\n\n"You're walkers," Briar says, spotting you. Not a question. "Good. I need walkers."\n\nBriar holds up the empty lead. The clip still swings.\n\n"Pip. My trail-dog. Scruffy. Ears too big. White chest usually muddy by now. He bolted at first light — straight off the gravel toward the open grass. Fox scent, maybe. Or deer. Or pure Pip stubbornness."`,
                    image_url: `${IMG}/briar.png`, // STUB
                    required: false,
                },
                {
                    id: '1',
                    type: 'information',
                    content: `"I've checked the road," Briar continues. "He's not there. Which means he's on the heath loop — field, gates, high point, back. Same path half the dogs in Corfe Mullen know by heart."\n\nBriar's voice drops.\n\n"I need someone to walk it properly. Look. Listen. Don't rush. I'll take the far edges and meet you at the last gate before the cars. If you find him, soft voices. He's brave until he isn't."\n\nBriar digs in a pocket and shows you a phone photo: a clear paw print in soft mud, taken this morning where the gravel meets the grass.\n\n"That's him leaving. Heading south into the field. Will you help?"`,
                    image_url: `${IMG}/paw_print.png`, // STUB — in-app photo evidence
                    required: false,
                },
                {
                    id: '2',
                    type: 'information',
                    content: `Hey Storyteller!\n\nThis is a family adventure loop on Upton Heath (~30–40 min walking plus story stops). Dogs welcome.\n\nYou're helping Briar find Pip. At each pin the story continues. Some screens are for everyone; later ones add a bit more for older ears — read what fits.\n\nBetween pins, guess: why did Pip bolt? Where would *your* dog hide?\n\nImmersion note for you: look-finds point at real things (gates, scar, heather). Temporary clues (prints, tags) show as photos in the app — we won't ask anyone to pretend a fine latch is broken. If you spot a real detail on your walk, tell Nadia/Craig and we'll weave it in.\n\nNext: map. Field entrance. South into the open grass.`,
                    image_url: `${IMG}/briar.png`, // STUB
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

        // 2. Field entrance — clues + walking challenge
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
                    content: `The path spills into open grass. The sky feels suddenly huge.\n\nYou half-expect Pip to hurtle back already. He doesn't.\n\nBriar's photo matches the edge of the gravel behind you — but out here the ground hardens and prints vanish. A bolted dog could have run anywhere the grass allows.\n\nOn the app, Briar's voice-note crackles in:\n\n"If you're at the open field — good. Pip loves this bit. He runs like the day's too small. Check the edges as well as the middle. Dogs that are playing stay visible. Dogs that are worried hug the prickly stuff."`,
                    image_url: `${IMG}/briar.png`, // STUB
                    required: false,
                },
                {
                    id: '101',
                    type: 'information',
                    content: `Young ears — job while you walk to the next gate:\n\nFind three different greens before you arrive. Grass green. Leaf green. Pricklier green (gorse counts; look, don't hug).\n\nAnd listen: any bark that isn't yours? Any rustle that stops when you stop?\n\nOlder ears: Beacon Road sits behind you like a corridor of hurry. Pip didn't bolt toward the road. He bolted into space. That already tells you something about what he was chasing — or what he thought he was saving.`,
                    image_url: `${IMG}/pip.png`, // STUB — reminder of who you're seeking
                    required: false,
                },
                {
                    id: '102',
                    type: 'information',
                    content: `Ahead: a gate onto the heath path. Gorse will start claiming the edges.\n\nBriar again (voice-note): "Soft hands on the latch when you get there. And think — if you were Pip, and something small and scared was out on the heath, would you take the open pale ground… or the deep heather?"\n\nThat question matters. You'll answer it at the gate.`,
                    image_url: `${IMG}/briar.png`, // STUB
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

        // 3. Field gate — Briar fragment + CHOICE
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
                    content: `Gorse crowds the latch. Yellow flowers if the season's kind; prickles either way.\n\nTied to the gatepost with a bit of twine is a scrap of paper in Briar's handwriting — left for any helper on this loop:\n\nPIP — dawn bolt. Not on road. Check high point. Collar tag loose last week — may have come off.\nIf you find the tag, keep it. If you find Pip, soft voice.\n— B\n\nYoung ears: look at the real latch. Which way does it open? Soft hands. No yanking. (We're not asking you to invent damage — just notice how it works.)`,
                    image_url: `${IMG}/briar.png`, // STUB
                    required: false,
                },
                {
                    id: '201',
                    type: 'information',
                    content: `Beyond the gate the heath proper begins. To your left and right, living purple-green. Farther on, at the high point, you'll see a pale scar in the ground to the west — old workings, bare beside the heather.\n\nBriar's riddle from the voice-note lands properly now.\n\nIf Pip was *playing*, he'd take open ground — the scar side — where he can see forever.\nIf Pip was *protecting* something scared, he'd take the deep heather — cover, quiet, prickles to keep big feet away.`,
                    image_url: `${IMG}/briar.png`, // STUB
                    required: false,
                },
                                {
                    id: '202',
                    type: 'question_single',
                    content: `What do you think Pip was doing when he bolted?`,
                    image_url: `${IMG}/pip.png`, // STUB
                    options: [
                        {
                            index: 0,
                            content: 'Playing / chasing — he’ll be on the open pale scar',
                            response: {
                                title: 'Noted!',
                                subtitle: 'Open ground theory. Hold it for the viewpoint.',
                                sentiment: 'positive',
                            },
                        },
                        {
                            index: 1,
                            content: 'Protecting something — he’ll be deep in the heather',
                            response: {
                                title: 'Noted!',
                                subtitle: 'Cover theory. Hold it for the viewpoint.',
                                sentiment: 'positive',
                            },
                        },
                    ],
                    required: true,
                },
                {
                    id: '203',
                    type: 'information',
                    content: `Good. Hold that theory.\n\nNext pin is the viewpoint — the high place Briar mentioned. Look west for the pale scar. Look at the living heath. See which story the land tells you.\n\nIf your group disagrees, argue on the way up. That's allowed. Encouraged, even.`,
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

        // 4. Viewpoint — Merryn + tag + twist seed (state-aware copy via two info paths is hard without duplicate steps;
        //    we write one scene that validates BOTH theories then twists)
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
                    content: `The path opens. Distance arrives all at once.\n\nWest: pale scraped ground — the scar, empty of heather, like a page with the writing rubbed out.\nEast and around: living heath, purple-green, prickly, full of hiding places.\nOn a clear day the far line can show coastline and hills. Today, take what the air gives you.\n\nSomeone is already here with a thermos.\n\nMerryn. Coat the colour of winter sky. Notebook open. Not surprised to see you.`,
                    image_url: `${IMG}/merryn.png`, // STUB
                    required: false,
                },
                {
                    id: '301',
                    type: 'information',
                    content: `"Briar's helpers," Merryn says. "Good. Pip came through at dawn. I watched him."\n\nMerryn points — first to the pale scar, then to a darker seam of heather.\n\n"He ran the open ground like he was chasing. Then he doubled back into the heather like he was hiding something. So if your group picked *playing* or *protecting*… you were both half right. Pip was doing both."\n\nFrom the heather edge, Merryn holds up a small metal disc on a broken ring.\n\n"His collar tag. Caught on gorse. He didn't stop for it."\n\n**Pip's Collar Tag** goes into your inventory. Proof. Direction. Worry.`,
                    image_url: `${IMG}/collar_tag.png`, // STUB
                    on_arrival: ['addItem -item collar_tag'],
                    required: false,
                },
                {
                    id: '302',
                    type: 'information',
                    content: `Merryn's voice softens.\n\n"Here's the part Briar doesn't know yet. Pip wasn't alone when he left the scar. Something small was with him — low to the ground, pale, moving wrong for a fox. A pup, I think. Or a dog so young it still forgets its feet."\n\nMerryn caps the thermos.\n\n"They headed back along the return path toward the last gate. Pip was herding, not fleeing. If I'm right, he hasn't been lost for a single minute. He's been busy."\n\nYoung ears: look at the real scar. Look at the real heather. Can you see why a dog might use both?\n\nAdult aside: the scar is worked ground beside living heath — place-memory. Soft coast/hills if the air allows. No need to invent wreckage; the split is already the drama.`,
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

        // 5. Heath path end — tension before reveal
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
                    content: `The path narrows between heather and gorse. This is return-leg country — same loop, tighter shoulders.\n\nYou listen harder than you did on the way out.\n\nA rustle. Then nothing. Then — maybe — a tiny high sound that could be wind through spines… or a pup that doesn't know how to bark properly yet.`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '401',
                    type: 'information',
                    content: `Young ears: soft voices now. If Pip is herding something scared, shouting turns helpers into threats.\n\nLook-find (real): pick one hiding place a small dog could use — a gorse gap, a heather hollow, a shadow by the path edge. Point at it. Don't charge it.\n\nOlder ears: if Merryn is right, the story flipped. You weren't chasing a runaway. You were walking into the middle of a rescue already in progress.`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '402',
                    type: 'information',
                    content: `Briar's last gate is ahead — gravel-hint of cars beyond.\n\nYou've got Pip's tag. You've got Merryn's sighting. You've got a theory that might make Briar's empty lead feel very different in about three minutes.\n\nWalk in quiet. Let the heath keep its secret until the latch.`,
                    image_url: `${IMG}/briar.png`, // STUB
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

        // 6. Final gate — twist payoff
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
                    content: `Briar is at the latch, empty lead still in hand — and frozen.\n\nBecause sitting neatly on the path side of the gate is Pip: muddy white chest, ridiculous ears, eyes bright with the particular smugness of a dog who has been right all morning.\n\nPressed against Pip's side, trembling but upright, is a scrawny pup with a scrap of blue ribbon tangled round one paw. No collar. Too young for this heath alone.\n\nPip stands up, trots to you, and bumps your knee as if to say: *took you long enough.*`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '501',
                    type: 'information',
                    content: `You hold out the collar tag. Briar takes it, kneels, and refastens it with hands that aren't quite steady.\n\n"You weren't lost," Briar tells Pip. Soft. Rough. "You were working."\n\nPip's tail answers for him.\n\nBriar looks at you. "Merryn radioed. Said you had the tag. Said the land told the story if anyone bothered to look — open ground to spot the pup, heather to hide it, loop home to the gate. You bothered."\n\nYoung ears: soft hello to the pup. No sudden hands. Pip is in charge until Briar says otherwise.\n\nAdults: if you guessed *protecting* at the gate, enjoy being right-ish. If you guessed *playing*, enjoy being right about the scar dash. Pip used both. Good dogs often do.`,
                    image_url: `${IMG}/briar.png`, // STUB
                    required: false,
                },
                {
                    id: '502',
                    type: 'finish',
                    content: `That's the loop.\n\nPip wasn't missing. Pip was mid-rescue — a bolted dawn dash across the scar, a hide in the heather, a herding job all the way home. You brought the tag. Briar brought the lead. The pup brought the reminder that empty heath isn't empty if you're listening.\n\nCars ahead. Water for dogs. Soft thank-you to Briar. Biscuits for Pip non-negotiable.\n\nCome back another day — and if you spot a real detail we should weave in (a truly broken latch, a particular gorse tunnel, a desire-line fork), tell Nadia. We'll write it in the right way round: place first, story second.\n\n— Pip, Briar & Merryn`,
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

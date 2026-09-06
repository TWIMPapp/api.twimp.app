import { Trail } from '../../types/index';

/**
 * What the Heath Was Watching
 * --------------------------------------------------------------------
 * Audience: family / dog-walk (Ross daily Upton Heath loop)
 * Status:   pending playtest — registered in Trails[]; game_config.status=pending
 * Voice:    rewritten toward Jasmarina / Annie craft (scene + dialogue + quest)
 * Images:   stubbed S3 paths — replace before polish pass.
 * MacGuffin: inventory token "The Heath Watch" (small brass charm from Briar's gate)
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
    description: `TWIMP is an outdoor storytelling app — walk to pins on a map and the next chapter plays when you arrive.\n\nOn Upton Heath, a scruffy trail-dog called Pip needs your help. Briar's Heath Watch has gone missing from the gate, and without it the evening walkers will be locked out of their usual loop. Follow Pip across the field, through the gorse, up to the viewpoint, and bring the Watch home.\n\nRoughly 30–40 minutes. Dogs welcome. Play any time.`,
    start_node_caption: 'Find the red pin at the Springdale Road car park — Pip is waiting.',
    items: [
        {
            key: 'heath_watch',
            name: 'The Heath Watch',
            image_url: `${IMG}/heath_watch.png`, // STUB — small brass charm
            thumb_url: `${IMG}/heath_watch_thumb.png`, // STUB
        },
    ],
    steps: [
        // 1. Car Park — cold open + quest
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
                    content: `A scruffy little dog skids across the car park gravel and stops right in front of you, panting hard. His ears are too big for his head, one of them folded the wrong way, and there's a smear of mud on his white chest like he's already been exploring.\n\nHe looks up, tilts his head, and somehow — through the app — you hear him clear as anything.\n\n"Finally! I've been waiting for someone who looks like they actually listen."\n\nHe plants his paws. "The name's Pip. Trail-dog. Officially unofficial helper of Upton Heath. And we've got a problem."`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '1',
                    type: 'information',
                    content: `"Briar looks after the gates on this loop," Pip continues, glancing toward the path that leads south into the open grass. "Every morning Briar hangs the Heath Watch on the first latch — a little brass charm, warm from people's hands, shiny from years of dogs brushing past it. Walkers touch it for luck. Kids make a wish on it. Briar says it helps the heath remember who came through kindly."\n\nPip's tail droops.\n\n"This morning it was gone. Hook empty. Briar is… not happy. And Briar not happy means the last gate stays awkward until someone brings the Watch home."\n\nHe leans in, conspiratorial. "I caught a glint of something pale up near the high viewpoint yesterday — west side, where the ground looks scraped and empty. I think that's where it went. Will you help me get it back?"`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '2',
                    type: 'information',
                    content: `Hey Storyteller!\n\nThis is a family loop from the Springdale Road / Upton Heath car park: open field → gate onto the heath path → viewpoint → return along the heath → final gate → cars. Roughly half an hour of walking, plus stops for the story.\n\nAt each pin you may get more than one screen:\n• first screens — the story everyone can enjoy\n• later screens — a little more detail for older kids and adults\nRead what fits your group. Skip freely.\n\nBetween pins, talk about what you think happened to the Heath Watch. That's part of the fun.\n\nCharacters on the app (not "imagine a rabbit"):\n• Pip — scruffy trail-dog, your guide and friend\n• Briar — looks after the gorse gates; prickly but soft underneath\n• Merryn — quiet walker who knows the viewpoint\n\nNext screen: map. Head to the field entrance — Pip's already sniffing that way.`,
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

        // 2. Field entrance
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
                    content: `The path opens into a wide stretch of grass. The sky feels suddenly bigger here, as if someone rolled the ceiling back.\n\nPip trots ahead, then spins round to face you, ears bouncing.\n\n"See? This is where people stop rushing. Or they don't — and then Briar complains about muddy boots and yanked latches later."\n\nHe sniffs the edge of the grass. "If someone carried the Heath Watch this way, they'd have come through this open bit first. Brass catches the light. Keep your eyes soft. Not staring — noticing."`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '101',
                    type: 'information',
                    content: `Pip sits (briefly — he isn't good at sitting).\n\n"While we walk to the next gate, I've got a job for the young ones. Find three different greens before we get there. Grass green. Leaf green. And a pricklier green — that one's usually gorse or something that wants a hug but shouldn't get one."\n\nHe grins a dog grin. "Adults can help. Or pretend they're only counting for the kids. I won't tell."`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '102',
                    type: 'information',
                    content: `As you set off across the field, Pip falls in beside you.\n\n"Funny thing about Beacon Road back there," he says more quietly. "People arrive from it still walking like they're late for something. The heath notices. Briar notices. I notice because my paws get stepped on."\n\nHe glances up. "If anyone in your group is still in road-mode — too fast, not looking — that's a clue about the kind of morning that loses a charm from a gate hook."\n\nUp ahead: a gate onto the heath path. Pip's ears lift. "Briar's territory. Best behaviour. Soft hands on the latch."`,
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

        // 3. Field gate — Briar
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
                    content: `Gorse crowds the latch like it grew there on purpose — yellow flowers if you're lucky, prickles either way.\n\nOn the empty hook beside the gate hangs… nothing. Just a pale ring of cleaner wood where something used to sit.\n\nA voice arrives before a face does — dry as the spines, warm underneath.\n\n"So. Pip found helpers."\n\nBriar steps into view on the path side of the gate: a weathered figure in a moss-green coat, hair tucked under a soft cap, fingers stained the colour of gorse bark. Their eyes flick from you to the empty hook and back.\n\n"Heath Watch. Gone since first light. I don't lose things. Someone borrowed it without asking."`,
                    image_url: `${IMG}/briar.png`, // STUB
                    required: false,
                },
                {
                    id: '201',
                    type: 'information',
                    content: `Pip clears his throat. "We're going to the viewpoint. I saw a glint—"\n\n"I know what you think you saw," Briar cuts in, not unkindly. Then, to you: "Listen carefully. The Watch likes high places and pale ground. If a walker dropped it, or set it down 'just for a second', it'll be near where the heath opens and the old workings show — west of the path at the top. Merryn's usually up there. Merryn sees everything and says half of it."\n\nBriar rests a hand on the latch.\n\n"Before you go through: soft hands. This gate remembers yankers. Stand on the field side, then the path side. Same latch. Feels different, doesn't it? That's not magic. That's manners worn into metal."\n\nYoung ears: touch the latch gently. Look for yellow on the gorse. Count the prickles if you dare (from a safe distance!).`,
                    image_url: `${IMG}/briar.png`, // STUB
                    required: false,
                },
                {
                    id: '202',
                    type: 'information',
                    content: `Briar opens the gate just enough.\n\n"Bring my Watch home and I'll stop scowling at the evening dog-walkers. Fail, and I'll still let you back — I'm not a monster — but I'll sigh loudly. Pip hates the sighing."\n\nPip nods solemnly. "It's a very heavy sigh."\n\nBriar almost smiles. "Go on then. Viewpoint. Look west for the pale scar in the ground. Look for Merryn. And if you argue about what happened on the way up… good. Means you're paying attention."\n\nAdult layer, if you want it: gorse holds the edge of the heath — tough, nitrogen-fixing, fire-adapted. Briar's "manners in metal" is just a way of saying places remember how we treat them.`,
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

        // 4. Viewpoint — Merryn + MacGuffin
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
                    content: `The path opens. The air thins into distance. Behind you the heath is purple-green and living; to the west the ground pales into a scraped scar — old workings, empty of heather, like a page with the writing rubbed out.\n\nSomeone is already here.\n\nMerryn sits on a low rise with a thermos and a notebook, coat the colour of winter sky. They don't jump when Pip barrels over. They just mark a page and look up.\n\n"Pip. And company. I wondered when Briar would send a search party."`,
                    image_url: `${IMG}/merryn.png`, // STUB
                    required: false,
                },
                {
                    id: '301',
                    type: 'information',
                    content: `"We're looking for the Heath Watch," you explain.\n\nMerryn nods toward the pale ground to the west. "A runner came through at dawn. Dropped something shiny near the edge of the scar, swore, kept going. I picked it up so it wouldn't get trodden in. Brass. Warm. Hook-shaped wear on one side."\n\nFrom a coat pocket, Merryn draws a small brass charm on a short leather thong — polished bright where fingers have worried it for years.\n\n"I was going to walk it down to Briar after my notes. But since you're here…"\n\nMerryn holds it out.\n\n**The Heath Watch** settles into your pack (check inventory). It isn't magic. It is loved. That's close enough.\n\nYoung ears: point west. Find the pale scar. Find something far away that isn't a tree — coastline or hills if the air is kind today.`,
                    image_url: `${IMG}/heath_watch.png`, // STUB
                    on_arrival: ['addItem -item heath_watch'],
                    required: false,
                },
                {
                    id: '302',
                    type: 'information',
                    content: `Merryn closes the notebook.\n\n"People ask what the heath is watching from up here. It isn't watching the path. It's watching whether anyone looks past the path — at the scar, at the living heather, at the far line of coast and hills when the haze lets them through."\n\nPip sits. Actually sits. Rare.\n\n"So we weren't hunting a mystery villain," Pip says. "Just a dropped charm and a kind stranger with a thermos."\n\nMerryn smiles. "Villains are rarer than dropped things. Take it home to Briar. Soft hands on the last latch."\n\nAdult aside: the pale scar is place-memory — worked ground beside living heath. If the coast and Purbeck hills show today, treat them as a gift of clear air, not a promise. Speculate on the walk down: who needed the Watch more — Briar, or the people who touch it every morning?`,
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

        // 5. Heath path end — return drip
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
                    content: `The path narrows again between heather and gorse. Pip trots a happy figure-eight, glancing back to check the Heath Watch is still "with" you.\n\n"Return leg!" he announces. "Same ground, different eyes. That's the fun bit."\n\nHe stops beside a clump of heather. "Young ears — find one thing you didn't notice on the way out. A colour. A sound. A silence. Just one. I'll wait. I'm excellent at waiting. (This is a lie.)"`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '401',
                    type: 'information',
                    content: `As you walk, Pip talks half to himself.\n\n"Story so far, in case anyone's collecting it: Briar hangs the Watch. Someone runs at dawn. Charm slips near the scar. Merryn pockets it so it doesn't get crushed. We fetch it. Briar stops sighing. Dogs get their evening loop without a lecture."\n\nHe looks up at you. "Not every adventure needs a villain. Sometimes it needs a finder."\n\nIf you're carrying the Heath Watch, keep it safe for the last gate. Briar will want to see it on the hook where it belongs.`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '402',
                    type: 'information',
                    content: `Adult aside, if you want it: daily loops like this are ordinary magic. A brass charm on a gate is only a story because someone bothers to care when it's missing — and because you're standing on the exact path where it travels every morning.\n\nOne gate left. Pip's ears are already pointing toward the sound of distant cars.\n\n"Briar gets the last word," Pip warns. "Briar always wants the last word."`,
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

        // 6. Final gate — payoff
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
                    content: `The latch appears again. Beyond it, the hint of gravel and car doors — the ordinary world waiting.\n\nBriar is already there, arms folded, trying not to look hopeful.\n\nPip skids to a halt. "We found it! Well — Merryn found it. We fetched it. Team effort. Mostly me."\n\nYou hold out the Heath Watch. Briar takes it with both hands, turns it once in the light, and hangs it gently on the hook beside the gate. The brass settles with a tiny, satisfied click.\n\nBriar's shoulders drop.\n\n"You brought the walk back quieter than you took it," Briar says. "That's enough. For today."`,
                    image_url: `${IMG}/briar.png`, // STUB
                    required: false,
                },
                {
                    id: '501',
                    type: 'information',
                    content: `Pip bumps your knee, tail a blur.\n\n"See? Not spooky. Just… looking after a place properly."\n\nBriar opens the gate for you. Soft hands. No yanking.\n\n"Evening walkers will thank you, even if they never know why the latch felt friendly again. Touch the Watch once if you like — kids especially. Then home. Water for dogs. Biscuits for Pip optional but strongly recommended."\n\nPip strikes a heroic pose that lasts approximately one second.`,
                    image_url: `${IMG}/pip.png`, // STUB
                    required: false,
                },
                {
                    id: '502',
                    type: 'finish',
                    content: `That's the loop.\n\nThe Heath Watch is home. Briar is (mostly) smiling. Pip will absolutely claim this was his idea from the start.\n\nWhat the heath was watching: whether anyone would look past the path — and whether someone would bring a small brass kindness back where it belongs.\n\nCars ahead. Soft thank-you to Briar optional (recommended).\n\nCome back another day — the latch will remember the hand.\n\n— Pip, Briar & Merryn`,
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

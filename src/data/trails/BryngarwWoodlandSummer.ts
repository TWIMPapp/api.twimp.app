import { Trail } from '../../types/index.js';

export const BryngarwWoodlandSummer: Trail = {
    "ref": "bryngarw-woodland-summer-bridgend",
    "name": "Bryngarw Woodland Summer",
    "type": "WALK",
    "ownerId": null,
    "ageSuitability": "Family",
    "attributes": [],
    "content_pack": false,
    "region": "Bridgend",
    "partner": "Awen Cultural Trust",
    "energy_expires": 0,
    "price": 0,
    "tester": false,
    "isValidating": false,
    "isFree": true,
    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png",
    "description": `Join Tony on a tour of the Woodland and get to know more about the place he calls home.

You'll learn all about mallard ducks, squirrels, tawny owls and much more.`,
    "start_node_caption": "Ready? Let's go!",
    "steps": [
        {
            "index": 0,
            "locationId": "1677c8e2-49df-4120-9d5e-9d1bac2a6945",
            "name": "Byrngarw Park Public Toilets",
            "type": "TRAIL_NODE",
            "hidden": false,
            "can_revisit": false,
            "trackingEnabled": true,
            "on_search": {
                "proximity_radius": 30
            },
            "tasks": [
                {
                    "id": 0,
                    "type": "information",
                    "content": `Hello, young adventurers! I'm Tony, a storyteller Ant. Bryngarw Park wasn't always the beautiful place it is today. It was once damaged and neglected, but the Keepers used their magic to restore it. Now, it's your turn to protect this park and its magic.

After this trail, you'll become a Summer Woodland Wizard! But first, let me chat with the adults.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                },
                {
                    "id": 1,
                    "type": "information",
                    "content": `Hey Storyteller!

This is a walk that consists of locations that loop around the woodland, you will end up back here. The walk is little over half a mile in total.

At each location, I will tell you about something that you should be able to see.  The first screen will be for very young children and then each additional screen will get more complex.  Who knows, maybe I'll even tell you something you didn't know before.  Please just read out what you think is appropriate for your group.

On the next screen is a map. When you are ready, find the red pin and head towards it.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "27e437e8-8124-4d0c-984b-e05cef2952e3"
                    ]
                }
            ]
        },
        {
            "index": 1,
            "locationId": "27e437e8-8124-4d0c-984b-e05cef2952e3",
            "name": "The Lake",
            "type": "TRAIL_NODE",
            "hidden": false,
            "can_revisit": false,
            "trackingEnabled": true,
            "on_search": {
                "proximity_radius": 20,
                "path_regex": "0$"
            },
            "tasks": [
                {
                    "id": 100,
                    "type": "information",
                    "content": `I'm going to show you around and introduce you to the natural wonders you can find in the woodland, just follow the pins on your map.

While you are walking in between, why not try the Rainbow Challenge?

My challenge for you is to see whether you can find each colour of the rainbow.

- Red
- Orange
- Yellow
- Green
- Blue
- Indigo (Dark Blue)
- Violet (Purple)

You may even spot colours on the animals you spot around the park. Seeing as we are at the lake, let me first introduce you to the Mallard Duck!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                },
                {
                    "id": 101,
                    "type": "information",
                    "content": `The mallard duck is a beautiful bird that lives near ponds, lakes, and rivers. It has bright green feathers on its head and a quack that can be heard from far away. Mallard ducks love to swim in the water and eat plants and insects they find there.

Sometimes, you might see baby ducks, called ducklings, following their Mummy duck around the water.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/mallard.png",
                    "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/mallard.mp3"
                },
                {
                    "id": 102,
                    "type": "information",
                    "content": `Did you know that you can tell the difference between a male and female mallard duck by looking at their feathers? Male mallards, called drakes, have bright green heads and a yellowish bill, while females, called hens, have brown feathers with an orange bill.

Hmm... is orange one of the colours on your rainbow!?

Also, mallard ducks are one of the most common types of ducks in the world, and they can be found on every continent except Antarctica.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/mallard.png"
                },
                {
                    "id": 103,
                    "type": "information",
                    "content": `Beyond their appearance, mallard ducks have a fascinating social structure. They often form large flocks during migration, and they have complex courtship rituals involving intricate displays of behavior and vocalizations.

Additionally, mallard ducks play an essential role in their ecosystems, helping to control insect populations and dispersing seeds as they move from one habitat to another.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/mallard.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "fab502ee-314d-4961-9ac7-d462c4980148"
                    ]
                }
            ]
        },
        {
            "index": 2,
            "locationId": "fab502ee-314d-4961-9ac7-d462c4980148",
            "name": "Squirels Yard",
            "type": "TRAIL_NODE",
            "hidden": false,
            "can_revisit": false,
            "trackingEnabled": true,
            "on_search": {
                "proximity_radius": 20,
                "path_regex": "\\|1"
            },
            "tasks": [
                {
                    "id": 200,
                    "type": "information",
                    "content": `Next animal you may find is a a squirrel, a lovely furry animal that loves to climb trees and scurry around parks and forests. They have bushy tails that help them balance when up high. They like to eat nuts, seeds, fruits, and sometimes even bird eggs.

You might see them building nests in trees or digging little holes to hide our food for later.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png",
                    "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/squirrel.mp3"
                },
                {
                    "id": 201,
                    "type": "information",
                    "content": `One interesting fact about squirrels is that they have incredibly sharp teeth that never stop growing!

To keep their teeth from getting too long, they gnaw on things like tree bark and branches. Another cool thing about squirrels is that they have excellent memory and can remember where they've  hidden hundreds of nuts, even months later.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                },
                {
                    "id": 202,
                    "type": "information",
                    "content": `They also play a vital role in forest ecosystems. They are expert foragers and help disperse seeds by burying nuts and forgetting to dig them up, allowing new plants to grow.

In folklore and mythology, squirrels are sometimes depicted as clever and resourceful animals, known for their agility and quick thinking - that's pretty spot on. Almost as cool as us ants - the worlds most travelled animal!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                },
                {
                    "id": 203,
                    "type": "information",
                    "content": `Follow the path and cross over the boardwalk ahead of you.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "8314323f-61e4-41bd-a3d4-0815c1b1f2e0"
                    ]
                }
            ]
        },
        {
            "index": 3,
            "locationId": "8314323f-61e4-41bd-a3d4-0815c1b1f2e0",
            "name": "Root road",
            "type": "TRAIL_NODE",
            "hidden": false,
            "can_revisit": false,
            "trackingEnabled": true,
            "on_search": {
                "proximity_radius": 20,
                "path_regex": "\\|2"
            },
            "tasks": [
                {
                    "id": 300,
                    "type": "information",
                    "content": `This is a little place I call \"Root Road\", see how the roots criss-cross across the path.

Did you know the amount of roots a tree puts under the ground can go as far down into the ground as the leaves go into the sky!?

When you see a tree, you're only seeing the top half!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/rootroad.png"
                },
                {
                    "id": 301,
                    "type": "information",
                    "content": `So roots provide the tree the strength to stand up straight and strong. They all start with a tap root which grows straight down and from there some roots grow diagonally, some grow outwards, these are the ones you can see on the path, the lateral roots.

They all provide the tree more strength, later on I'll show you what happens when a tree get's knocked out of position.

As well as strength, roots are also how a tree gathers water and nutrients from the ground.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/rootroad.png"
                },
                {
                    "id": 302,
                    "type": "information",
                    "content": `Roots have one more very cool trick.

You see how they all seem to connect to each other, in your human homes you have the Worldwide Web, trees have the Woodland Web.  Off the lateral roots there are fine roots and off these is mycelium.

Through mycelium, plants communicate with each other and even share nutrients, an older parent tree can literally help it's seedlings to grow.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/rootroad.png"
                },
                {
                    "id": 303,
                    "type": "information",
                    "content": `Follow the path to the end where you will find a gate.

BE CAREFUL, on the other side of that gate is a small road that sometimes has cars.

Feel free to take a short break from this trail and visit the B-Leaf Garden Centre.

Otherwise turn right a few metres until you get to our Woodland Garden.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "9bfa25f8-c91d-45bc-bf5d-4d6cb3c29ee4"
                    ]
                }
            ]
        },
        {
            "index": 4,
            "locationId": "9bfa25f8-c91d-45bc-bf5d-4d6cb3c29ee4",
            "name": "Woodland Garden",
            "type": "TRAIL_NODE",
            "hidden": false,
            "can_revisit": false,
            "trackingEnabled": true,
            "on_search": {
                "proximity_radius": 20,
                "path_regex": "\\|3"
            },
            "tasks": [
                {
                    "id": 400,
                    "type": "information",
                    "content": `Welcome to the Woodland Garden, this is where the humans like to plant things, you'll also find some really cool wooden carvings, starting with The Green Man!

Have a good look around.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                },
                {
                    "id": 401,
                    "type": "information",
                    "content": `Quick game?

I took this photo from somewhere inside the Woodland Garden, see if you can figure out where!?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/woodlandbenchclose.png"
                },
                {
                    "id": 402,
                    "type": "information",
                    "content": `Right at the back of the Woodland Garden you will find this structure, it's called a dead hedge.

The hazel trees were trimmed back to open up the canopy and the wood gathered was used to make this barrier. Many creatures in the woodland just love this sort of habitat, bank voles, mice and many little birds.

If you can sit very still and quiet, there's a good chance you might see one of its habitants.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/deadfence.png"
                },
                {
                    "id": 403,
                    "type": "information",
                    "content": `Did you see a robin? They live in the dead hedge as well as other small birds like thrush, blue tits and grey tits.

To your left, you should see a couple of small bridges crossing over some small ponds.

As you head in that direction, see if you can spot a bright yellow flower with a unique 3 pronged shape to it's petals, it's called a Flag Iris and is thought to be the inspiration for the Scouts flag.

Once you think you've found it, press Next to see if you were right.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/robin.png"
                },
                {
                    "id": 404,
                    "type": "information",
                    "content": `Did you get it right?  If you spotted another yellow flower, it was probably a creeping buttercup, they are also common around here.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/flagiris.png"
                },
                {
                    "id": 405,
                    "type": "information",
                    "content": `When you're ready, continue past the ponds and head up the hill to the next pin.

See, if you can find this tree.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/tawnytree.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "c46ebe06-7099-453d-930c-3e30dd814dc5"
                    ]
                }
            ]
        },
        {
            "index": 5,
            "locationId": "c46ebe06-7099-453d-930c-3e30dd814dc5",
            "name": "Tawny Owls",
            "type": "TRAIL_NODE",
            "hidden": false,
            "can_revisit": false,
            "trackingEnabled": true,
            "on_search": {
                "proximity_radius": 20,
                "path_regex": "\\|4"
            },
            "tasks": [
                {
                    "id": 500,
                    "type": "information",
                    "content": `As you walk up the path, keep an eye out for Tawny Owls, I certainly do!

There are many Tawny Owls in the park and on one particular day, one family were on a day trip and were all gathered in the large Oak tree to the left of the path. When one of the rangers saw them, he couldn't believe it!

What else can I tell you about Tawny Owls?

`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                },
                {
                    "id": 501,
                    "type": "information",
                    "content": `You generally need to look high up in the trees to spot them. Tawny owls are big brown birds with round, dark brown eyes that seem to pierce the night. They're much bigger than your average garden bird!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/tawnyowl.png"
                },
                {
                    "id": 502,
                    "type": "information",
                    "content": `Tawny owls are masters of disguise. Their mottled brown feathers help them blend in perfectly with tree bark during the day.

But that's not all – they're also silent fliers! Special feathers on their wings muffle the sound as they fly, making them almost undetectable by their prey.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/tawnyowl.png"
                },
                {
                    "id": 503,
                    "type": "information",
                    "content": `Tawny owls can see really well in low light, thanks to their large dark brown eyes. These eyes are specially adapted to capture even the faintest glimmer of moonlight.

And that's not all – they can also turn their heads in a complete circle, almost like they're looking over their shoulder! This incredible neck flexibility helps them spot prey from any angle.

No wonder they're such successful hunters!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/tawnyowl.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "e43a8c7e-ad01-4020-915f-a41e808db0e6"
                    ]
                }
            ]
        },
        {
            "index": 6,
            "locationId": "e43a8c7e-ad01-4020-915f-a41e808db0e6",
            "name": "Crossroads",
            "type": "TRAIL_NODE",
            "hidden": false,
            "can_revisit": false,
            "trackingEnabled": true,
            "on_search": {
                "proximity_radius": 20,
                "path_regex": "\\|5"
            },
            "tasks": [
                {
                    "id": 600,
                    "type": "information",
                    "content": `You should now be near the top of the hill where the paths meet. We're going to turn right and head back down the path.

But before we do that, remember earlier we were talking about roots? Well, check this out.

On the left side of the path just where they meet, you will see a Beech tree that's very wonky. A while ago another tree fell into it and damaged it, making it lean heavily to the left but the roots held strong and have adapted to it's new position.

Then, in order to get the light that it needs for it's leaves, it's corrected itself. If you look up, you'll see it's bent in the middle.

In case you want to show off to your friends, human scientists call this \"phototropism\".`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                },
                {
                    "id": 601,
                    "type": "information",
                    "content": `Turn right, and take a few steps and see if you can find this tree.

There are 7 species of bat that live in the park and one of them has made a home in this tree. It's unlikely you'll spot one during the day so let me tell you about Daubenton's Bat.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/battree.png"
                },
                {
                    "id": 602,
                    "type": "information",
                    "content": `At dusk, keep an eye out for flitting shapes over the lake. These might be Daubenton's bats, small brown bats with big ears!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/daubenton.png"
                },
                {
                    "id": 603,
                    "type": "information",
                    "content": `Unlike most bats who gobble up insects in the air, Daubenton's bats are expert fishermen. They have special hairy fringes on their tail and feet that help them catch tasty insects skimming the water's surface. They can even scoop up prey with their big feet while flying!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/daubenton.png"
                },
                {
                    "id": 604,
                    "type": "information",
                    "content": `Daubenton's bats, like all bats, use echolocation to find food and navigate in the dark.

They emit high-pitched squeaks that bounce off objects like tiny radars. By listening to the echoes, they can build a \"picture\" of their surroundings, helping them find food and avoid obstacles – pretty amazing, right?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/daubenton.png"
                },
                {
                    "id": 605,
                    "type": "information",
                    "content": `As you head down the hill, let's play another little game.... fern or bracken!

This park is completely full of both ferns and bracken and they're often confused.

The easiest way to tell them apart is that bracken have a single stem from which the fern-like leaves grow. Whereas fern all grow their leaves from the centre. As you walk down the path, see if you can figure out which one is which.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "7221739c-f58f-453d-856c-78a50bd39b38"
                    ]
                }
            ]
        },
        {
            "index": 7,
            "locationId": "7221739c-f58f-453d-856c-78a50bd39b38",
            "name": "Ferns",
            "type": "TRAIL_NODE",
            "hidden": false,
            "can_revisit": false,
            "trackingEnabled": true,
            "on_search": {
                "proximity_radius": 20,
                "path_regex": "\\|6"
            },
            "tasks": [
                {
                    "id": 700,
                    "type": "question_multiple",
                    "content": `Fern or Bracken?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/fern.png",
                    "options": [
                        {
                            "index": 0,
                            "content": `Fern`,
                            "response": {
                                "title": "Correct!",
                                "sentiment": "positive"
                            }
                        },
                        {
                            "index": 1,
                            "content": `Bracken`,
                            "response": {
                                "title": "Incorrect",
                                "sentiment": "negative"
                            }
                        }
                    ]
                },
                {
                    "id": 701,
                    "type": "question_multiple",
                    "content": `Fern or Bracken?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/bracken.png",
                    "options": [
                        {
                            "index": 0,
                            "content": `Bracken`,
                            "response": {
                                "title": "Correct!",
                                "sentiment": "positive"
                            }
                        },
                        {
                            "index": 1,
                            "content": `Fern`,
                            "response": {
                                "title": "Incorrect",
                                "sentiment": "negative"
                            }
                        }
                    ]
                },
                {
                    "id": 702,
                    "type": "information",
                    "content": `Ferns are fascinating plants that grow in shady, damp places like forests and gardens and have been on Planet Earth since the time of the dinosaurs.

They have delicate, feathery leaves called fronds that unfurl as they grow.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ferns-1.png"
                },
                {
                    "id": 703,
                    "type": "information",
                    "content": `Ferns don't produce flowers or seeds like other plants; instead, they reproduce by spores, which are tiny dust-like particles found on the undersides of their fronds. They release the spores into the air and the wind carries them to new places.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ferns-1.png"
                },
                {
                    "id": 704,
                    "type": "information",
                    "content": `Ferns play an essential role in forest ecosystems, providing habitat and food for a variety of animals, including insects, birds, and small mammals.

They also help stabilise soil and prevent erosion with their extensive root systems.

They have inspired artists, poets, and storytellers throughout history and continue to captivate people with their beauty and ancient lineage. Just being around them makes you feel you've travelled back in time.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ferns-1.png"
                },
                {
                    "id": 705,
                    "type": "information",
                    "content": `Continue down the hill to the Woodland Disc and then turn right.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "21be2881-efc6-4d5f-a305-3b9a7f3b766f"
                    ]
                }
            ]
        },
        {
            "index": 8,
            "locationId": "21be2881-efc6-4d5f-a305-3b9a7f3b766f",
            "name": "Redwood",
            "type": "TRAIL_NODE",
            "hidden": false,
            "can_revisit": false,
            "trackingEnabled": true,
            "on_search": {
                "proximity_radius": 20,
                "path_regex": "\\|7"
            },
            "tasks": [
                {
                    "id": 800,
                    "type": "information",
                    "content": `The tree before you belongs to the breed of trees that is the largest in the whole world!  The redwood, it's huge isn't it!

For fun, why not all stand next to it and have a photo taken in front of it, see how many of you can fit side by side against it's trunk.

`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/redwood.png"
                },
                {
                    "id": 801,
                    "type": "information",
                    "content": `Well actually this particular redwood tree is just a baby, as you can see above, they can grow much much bigger!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/generalsherman.png"
                },
                {
                    "id": 802,
                    "type": "information",
                    "content": `We're nearly done but before you go, I wanted to show you the oldest and most deadly trees in our park!

Head back across the clearing towards the house.  While you are walking down the lane to the car park at the front of the house, notice the bank on the right.  It has lots of tiny holes in it, can you guess who made these?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                },
                {
                    "id": 803,
                    "type": "information",
                    "content": `It was this little guy, looks just like a slightly bigger mouse but it's actually a bank vole.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/bankvole.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "24390b09-a97f-4d11-8765-f70d40838d0a"
                    ]
                }
            ]
        },
        {
            "index": 9,
            "locationId": "24390b09-a97f-4d11-8765-f70d40838d0a",
            "name": "Yew Trees",
            "type": "TRAIL_NODE",
            "hidden": false,
            "can_revisit": false,
            "trackingEnabled": true,
            "on_search": {
                "proximity_radius": 20,
                "path_regex": "\\|8"
            },
            "tasks": [
                {
                    "id": 900,
                    "type": "information",
                    "content": `On the right side as you walk up to the house you will see two Yew trees.

I never eat anything that I find here, a scout from the colony once brought home a leaf from here and made us all sick!

Thankfully I've not seen humans eat trees before so just keep not doing that, especially this one.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/yews.png"
                },
                {
                    "id": 901,
                    "type": "finish",
                    "content": `Well thank you so much for joining me, I hope I was a good tour guide.

Please do come back in the Autumn, as everything completely changes so I will have much more to show you.

Go have a rest and maybe get yourself something from the Cafe, you've earned it!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-woodland-summer/bridgend/ant.png"
                }
            ]
        }
    ],
    "locations": [
        {
            "id": "1677c8e2-49df-4120-9d5e-9d1bac2a6945",
            "lat": 51.55685872294162,
            "lng": -3.5808396462784775,
            "name": "Byrngarw Park Public Toilets",
            "index": 0
        },
        {
            "id": "27e437e8-8124-4d0c-984b-e05cef2952e3",
            "lat": 51.5572173779008,
            "lng": -3.581383630068151,
            "name": "The Lake",
            "index": 1
        },
        {
            "id": "fab502ee-314d-4961-9ac7-d462c4980148",
            "lat": 51.55742492184743,
            "lng": -3.5831270659278314,
            "name": "Cyril's Yard",
            "index": 2
        },
        {
            "id": "7221739c-f58f-453d-856c-78a50bd39b38",
            "lat": 51.55905914997457,
            "lng": -3.582386776239721,
            "name": "Ferns",
            "index": 3
        },
        {
            "id": "21be2881-efc6-4d5f-a305-3b9a7f3b766f",
            "lat": 51.55896648841337,
            "lng": -3.5827141092620884,
            "name": "Redwood",
            "index": 4
        },
        {
            "id": "512b82a2-6516-4b21-8deb-2cb7eb1fbac2",
            "lat": 51.55933859703449,
            "lng": -3.582339457672117,
            "name": "Bracken or Fern",
            "index": 5
        },
        {
            "id": "8314323f-61e4-41bd-a3d4-0815c1b1f2e0",
            "lat": 51.557901,
            "lng": -3.5831991,
            "name": "Root road",
            "index": 6
        },
        {
            "id": "c46ebe06-7099-453d-930c-3e30dd814dc5",
            "lat": 51.55930878002051,
            "lng": -3.582931419323554,
            "name": "Tawny Tree",
            "index": 7
        },
        {
            "id": "9bfa25f8-c91d-45bc-bf5d-4d6cb3c29ee4",
            "lat": 51.55837244633037,
            "lng": -3.5826709830343795,
            "name": "Woodland Garden",
            "index": 8
        },
        {
            "id": "e43a8c7e-ad01-4020-915f-a41e808db0e6",
            "lat": 51.55987334745932,
            "lng": -3.582453689121796,
            "name": "Crossroads",
            "index": 9
        },
        {
            "id": "24390b09-a97f-4d11-8765-f70d40838d0a",
            "lat": 51.558321998633915,
            "lng": -3.581966383591788,
            "name": "Bryngarw House",
            "index": 10
        }
    ]
};

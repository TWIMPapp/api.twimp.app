import { Trail } from '../../types/index.js';

export const BryngarwMeadowSummer: Trail = {
    "ref": "bryngarw-meadow-summer-bridgend",
    "name": "Bryngarw Meadow Summer",
    "type": "WALK",
    "ownerId": null,
    "ageSuitability": "4-11",
    "attributes": ["Family"],
    "content_pack": false,
    "region": "Bridgend",
    "tags": [
        "Family"
    ],
    "partner": "Awen Cultural Trust",
    "energy_expires": 0,
    "price": 0,
    "tester": false,
    "isValidating": false,
    "isFree": true,
    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png",
    "description": `Join Geronimo on a tour of the Meadow and get to know more about the place he calls home.

You'll learn all about daisies, dandelion, foxglove and much more.

Distance: < 0.5 miles`,
    "start_node_caption": "Ready? Let's go!",
    "steps": [
        {
            "index": 0,
            "locationId": "0b9ab590-b98b-496b-aa35-57d717127cc0",
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
                    "content": `Greetings, young explorers!

I'm Geronimo, a humble grasshopper from Bryngarw Park. This park wasn't always the haven it is now. Once, it was polluted and dying, until magical Keepers restored it. Now, they're gone, and the park needs new protectors. Would you be able to answer the call?

Complete this trail, become a Summer Meadow Master, and safeguard this beauty. Before we start, I need a quick word with the grown-ups...`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "id": 1,
                    "type": "information",
                    "content": `Hey Storyteller!

This walk consists of 5 locations that loop around the meadow, you will end up at the playground coming from the top field.  The walk is less than half a mile in total.

At each location, I will tell you about something you should be able to see.  The first screen will be for very young children and then each additional screen will get more complex who knows, maybe I'll even tell you something you didn't know before.  Please just read out what you think is appropriate for your group.

On the next screen is a map.

Find the red pin and head towards it.
`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "a3207a47-e8a5-47ac-8a00-2816de98286e"
                    ]
                }
            ]
        },
        {
            "index": 1,
            "locationId": "a3207a47-e8a5-47ac-8a00-2816de98286e",
            "name": "Meadow Entrance",
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
                    "content": `I'm going to show you around and introduce you to the natural wonders you can find in the meadow, just follow the pins on your map.

While you are walking in between, why not try the Rainbow Challenge?

This time of year the flowers grow happily in the sun. My challenge for you is to see whether you can find each colour of the rainbow!

- Red
- Orange
- Yellow
- Green
- Blue
- Indigo (Dark Blue)
- Violet (Purple)

Let's get started, head to your next pin.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "54e4b7e0-affa-45c7-8748-d14499d24c7c"
                    ]
                }
            ]
        },
        {
            "index": 2,
            "locationId": "54e4b7e0-affa-45c7-8748-d14499d24c7c",
            "name": "Daisy",
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
                    "content": `Meet Daisy!

It doesn't matter how far from home I might travel, I'm always sure to find a daisy, with their white petals and their yellow centres, they're like mini suns shining up from the grass.

There should be some nearby, see if you can find them.

[Hint: There aren't so many around right now. Keep your eyes open but perhaps if you went for a climb...]`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "id": 201,
                    "type": "information",
                    "content": `What you might not know about a daisy is that it's not just one flower but a cluster of many tiny flowers, it could be more than 100 flowers!

Daisy gets it's name \"daisy\" from \"day's eye\" because it tends to open when the sun rises and close when it sets.

Have a closer look at the daisy's yellow centre.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/daisy.png"
                },
                {
                    "id": 202,
                    "type": "information",
                    "content": `You humans love to make daisy chains by making small slits in the stem of one daisy and passing another one through it.  You then wear them like bracelets or necklaces.

As much as I hate to see a wasted daisy, I must admit seeing humans make daisy chains does bring a smile to my face! After all, daisies are meant to bring joy to all creatures, and if humans find joy in making daisy chains, then who am I to hop about it?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "id": 203,
                    "type": "question_multiple",
                    "content": `What is the Latin name for the common daisy?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/daisy.png",
                    "options": [
                        {
                            "index": 0,
                            "content": `Leucanthemum vulgare`,
                            "response": {
                                "title": "Nope, that's close but its another type of daisy, an oxeye daisy.",
                                "actions": [
                                    null
                                ],
                                "sentiment": "negative"
                            }
                        },
                        {
                            "index": 1,
                            "content": `Trifolium repens`,
                            "response": {
                                "title": "Nope, that's a white clover!",
                                "actions": [
                                    null
                                ],
                                "sentiment": "negative"
                            }
                        },
                        {
                            "index": 2,
                            "content": `Taraxacum officinale`,
                            "response": {
                                "title": "Nope, that's a dandelion!",
                                "actions": [
                                    null
                                ],
                                "sentiment": "negative"
                            }
                        },
                        {
                            "index": 3,
                            "content": `Bellis perennis`,
                            "response": {
                                "title": "Correct!",
                                "sentiment": "positive"
                            }
                        }
                    ],
                    "hint": "The daisy is rather beautiful..."
                },
                {
                    "id": 204,
                    "type": "information",
                    "content": `That's right! The Latin name Bellis perennis perfectly describes the common daisy.

- Bellis:  meaning beautiful or pretty
- Perennis: meaning everlasting or perennial, reflecting the daisy's ability to bloom throughout the year`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "28a0ac56-6483-476e-8b73-bf356ec27a6a"
                    ]
                }
            ]
        },
        {
            "index": 3,
            "locationId": "28a0ac56-6483-476e-8b73-bf356ec27a6a",
            "name": "Celandine",
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
                    "content": `This beautiful wildflower is the Lesser Celandine!

I love Lesser Celandine, they're so bright and shiny which reflects the sunlight and makes them easy to see, they guide me in like beacons!

They are a little tricky to stand on as their petals are quite slippery though.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "id": 301,
                    "type": "information",
                    "content": `The Celandine flower is famous you know!  Have you ever read the book or seen the film, The Lion, the Witch and the Wardrobe, they're mentioned:

It was also so loved by one of your poets, Wordsworth, that he wrote several poems about it.

This is the start of one called \"The Small Celandine\".

There is a Flower, the Lesser Celandine,
That shrinks, like many more, from cold and rain;
And, the first moment that the sun may shine,
Bright as the sun itself, 'tis out again!

Or maybe you would like to check out another one of this poems, To the Small Celandine, as a song!?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/celandine.png",
                    "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/to-the-small-celandine.mp3"
                },
                {
                    "id": 302,
                    "type": "information",
                    "content": `OK, I've got lots more to show you. Head to the next pin on your map.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "id": 303,
                    "type": "question_multiple",
                    "content": `What is the Latin name for the lesser celandine?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png",
                    "options": [
                        {
                            "index": 0,
                            "content": `Ficaria verna`,
                            "response": {
                                "title": "Correct!",
                                "actions": [
                                    null
                                ],
                                "sentiment": "positive"
                            }
                        },
                        {
                            "index": 1,
                            "content": `Caltha palustris`,
                            "response": {
                                "title": "Nope, that's the marigold.",
                                "actions": [
                                    null
                                ],
                                "sentiment": "negative"
                            }
                        },
                        {
                            "index": 2,
                            "content": `Ranunculus acris`,
                            "response": {
                                "title": "Nope, that's the humble buttercup!",
                                "sentiment": "negative"
                            }
                        },
                        {
                            "index": 3,
                            "content": `Anemone nemorosa`,
                            "response": {
                                "title": "Nope, that would be the wood anemone.",
                                "actions": [
                                    null
                                ],
                                "sentiment": "negative"
                            }
                        }
                    ]
                },
                {
                    "id": 304,
                    "type": "information",
                    "content": `You got it!

Ficaria verna is the Latin name for the lesser celandine.

It's quite complicated why and I'll be honest, it goes over my head. But it's something you humans do a lot! It was previously grouped as a buttercup (they taste similar...) but it got changed based on its shape. Buttercups have 5 leaves and lesser celandines have less.

Ficaria = Fig
Verna = Spring

Fig Spring!?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "f3e4a2e0-a63c-4c6c-b49c-55be4d9abe34"
                    ]
                }
            ]
        },
        {
            "index": 4,
            "locationId": "f3e4a2e0-a63c-4c6c-b49c-55be4d9abe34",
            "name": "Red Campion",
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
                    "content": `Ah, my dear friends, let me tell you about the enchanting Red Campion.

Red campion is a cheerful wildflower often linked to fairies and folklore. It blooms bright pink in woodlands after bluebells fade. That's how I know summer is here!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "id": 401,
                    "type": "information",
                    "content": `There's a very special fairy assosciated with the Red Campion (The Red Campion Fariy of course!). And here's a little poem of theirs:

Here's a cheerful somebody,
By the woodland's edge;
Campion the many-named,
Robin-in-the-hedge.
Coming when the bluebells come,
When they're gone, he stays,
(Round Robin, Red Robin)
All the summer days.

Soldiers' Buttons, Robin Flower,
In the lane or wood;
Robin Redbreast, Red Jack,
Yes, and Robin Hood!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/wayside04.png"
                },
                {
                    "id": 402,
                    "type": "information",
                    "content": `A long time ago, humans used to use flowers as a language, it's called Floriography.  It came about in Victorian times as a way of expressing feelings that the etiquette of the era didn't allow to be openly expressed.

You could even answer a question, flowers in the right hand is \"Yes\", in the left hand, \"No\".

In the language of flowers, Red Campion symbolise Gentleness and kindness. Its delicate petals suggest a gentle nature.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "id": 403,
                    "type": "question_multiple",
                    "content": `What is the Latin name for the red campion?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png",
                    "options": [
                        {
                            "index": 0,
                            "content": `Silene dioica`,
                            "response": {
                                "title": "Correct!",
                                "sentiment": "positive"
                            }
                        },
                        {
                            "index": 1,
                            "content": `Lychnis flos-cuculi`,
                            "response": {
                                "title": "Nope, that's the ragged robin!",
                                "actions": [
                                    null
                                ],
                                "sentiment": "negative"
                            }
                        },
                        {
                            "index": 2,
                            "content": `Centaurea cyanus`,
                            "response": {
                                "title": "Nope, that's the cornflower!",
                                "actions": [
                                    null
                                ],
                                "sentiment": "negative"
                            }
                        },
                        {
                            "index": 3,
                            "content": `Papaver rhoeas`,
                            "response": {
                                "title": "Oh nope! That's the common poppy.",
                                "actions": [
                                    null
                                ],
                                "sentiment": "negative"
                            }
                        }
                    ]
                },
                {
                    "id": 404,
                    "type": "information",
                    "content": `Named after the Greek God Silenus.

He was the woodland god, known for his drunken revelry and often shown covered in foam. Red campions have sticky stems, so, I suppose that's a link...

And Dioica means \"two houses\" as red campions have seperate male and female bits (pretty cool?).`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "93493b9e-8201-4709-a704-b6b925e34eb6"
                    ]
                }
            ]
        },
        {
            "index": 5,
            "locationId": "93493b9e-8201-4709-a704-b6b925e34eb6",
            "name": "Ragwort",
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
                    "content": `The field is full of many different plants, see how many you can find!?

One of them you might see is the Ragwort!

Ragwort, a wildflower with bright yellow blooms, is a lifeline for many insects despite its reputation as a weed.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "id": 501,
                    "type": "information",
                    "content": `You won't catch me nibbling at these though. They are the sole food for the cinnabar moth caterpillar, known for its black and yellow stripes. Take a look, maybe you'll find one!

Ironically, these guys eat so much ragwort that they help control its spread, benefiting you humans who consider it a nuisance.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/ragwort.png"
                },
                {
                    "id": 502,
                    "type": "question_multiple",
                    "content": `What is the latin name for Ragwort?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png",
                    "options": [
                        {
                            "index": 0,
                            "content": `Taraxacum officinale`,
                            "response": {
                                "title": "That's the dandelion from earlier!",
                                "actions": [
                                    null
                                ],
                                "sentiment": "negative"
                            }
                        },
                        {
                            "index": 1,
                            "content": `Cirsium arvense`,
                            "response": {
                                "title": "Nope, that's a creeping thistle.",
                                "sentiment": "negative"
                            }
                        },
                        {
                            "index": 2,
                            "content": `Tussilago farfara`,
                            "response": {
                                "title": "Nope, that's a coltsfoot",
                                "actions": [
                                    null
                                ],
                                "sentiment": "negative"
                            }
                        },
                        {
                            "index": 3,
                            "content": `Senecio jacobaea`,
                            "response": {
                                "title": "Correct!",
                                "actions": [
                                    null
                                ],
                                "sentiment": "positive"
                            }
                        }
                    ]
                },
                {
                    "id": 503,
                    "type": "information",
                    "content": `That's right!

Senecio jacobaea is the Latin name for Ragwort.

- Senecio: meaning old man. It refers to the fluffy white seed heads that resemble an old man's beard
- Jacobeaea: This refers to Saint James the Greater, whose feast day is around the time when ragwort blooms.

I must say, these Latin names are fascinating!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "e21e8f87-03cc-4fd6-bb13-a51a9dbea735"
                    ]
                }
            ]
        },
        {
            "index": 6,
            "locationId": "e21e8f87-03cc-4fd6-bb13-a51a9dbea735",
            "name": "Top of the Field",
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
                    "content": `You've reached the farthest point on your journey and now it's time to head back but while you are here, this is a great place to find lots of different colours if you look closely.

As you walk into the next field, take the first path on the left, there's just one more flower I would like to show you.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "418a7990-4228-4197-b68e-98b08509870f"
                    ]
                }
            ]
        },
        {
            "index": 7,
            "locationId": "418a7990-4228-4197-b68e-98b08509870f",
            "name": "Meadow Thistle",
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
                    "type": "information",
                    "content": `Meadow thistle, despite its prickly reputation, is loved by my pollinator friends.

Its vibrant purple flowers are a magnet for bees, butterflies, and other insects seeking nectar.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "id": 701,
                    "type": "information",
                    "content": `One of those other insects is my friend Tony (the Ant) who you'll meet in the woodland trail.

Tony and his friends have what you call a symbiotic relationship. The thistle provides nectar at the base of its leaves, attracting ants that in turn protect the plant from other animals.

This is just one of the examples of how wonderful a meadow can be. There's a reason for everything.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/meadowthistle.png"
                },
                {
                    "id": 702,
                    "type": "information",
                    "content": `There's so much more to tell you but you may have spotted that there's a cool playground just on the other side of the hedgerow in front of you.

Next time, if you like, I'll tell you more about my life and what I do here in the meadow.

Oh and if you're not done looking at flowers, up ahead you may even find some violets.

Have fun!

Hopefully see you again soon.

`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                },
                {
                    "id": 703,
                    "type": "question_multiple",
                    "content": `What is the Latin name for the meadow thistle?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png",
                    "options": [
                        {
                            "index": 0,
                            "content": `Cirsium dissectum`,
                            "response": {
                                "title": "Correct!",
                                "sentiment": "positive"
                            }
                        },
                        {
                            "index": 1,
                            "content": `Centaurea nigra`,
                            "response": {
                                "title": "Ah, nowhere near! That's a common knapweed.",
                                "actions": [
                                    null
                                ],
                                "sentiment": "negative"
                            }
                        },
                        {
                            "index": 2,
                            "content": `Onopordum acanthium`,
                            "response": {
                                "title": "Close! That's a Scotch thistle.",
                                "actions": [
                                    null
                                ],
                                "sentiment": "negative"
                            }
                        },
                        {
                            "index": 3,
                            "content": `Carduus nutans`,
                            "response": {
                                "title": "Close, but that's a musk thistle!",
                                "actions": [
                                    null
                                ],
                                "sentiment": "negative"
                            }
                        }
                    ]
                },
                {
                    "id": 704,
                    "type": "finish",
                    "content": `That's right!

You are pretty great at these now.

- Cirsium: meaning a swollen vein (It was thought that thistles could be used to treat such conditions.)
- Dissectum: This means \"deeply cut\" or \"dissected,\" referring to the plant's characteristically divided leaves.

It all makes sense if you think about it. And know Latin.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/bryngarw-meadow-summer/bridgend/grasshopper.png"
                }
            ]
        }
    ],
    "locations": [
        {
            "id": "0b9ab590-b98b-496b-aa35-57d717127cc0",
            "lat": 51.55680450762989,
            "lng": -3.5807271584847578,
            "name": "Byrngarw Park Public Toilets",
            "index": 0
        },
        {
            "id": "54e4b7e0-affa-45c7-8748-d14499d24c7c",
            "lat": 51.55664597756805,
            "lng": -3.5816869918803818,
            "name": "Daisies",
            "index": 1
        },
        {
            "id": "28a0ac56-6483-476e-8b73-bf356ec27a6a",
            "lat": 51.556702411193676,
            "lng": -3.582414122824278,
            "name": "Yellow Road",
            "index": 2
        },
        {
            "id": "a3207a47-e8a5-47ac-8a00-2816de98286e",
            "lat": 51.55621882487366,
            "lng": -3.5811963999315166,
            "name": "Meadow Entrance",
            "index": 3
        },
        {
            "id": "e21e8f87-03cc-4fd6-bb13-a51a9dbea735",
            "lat": 51.5557151906063,
            "lng": -3.58472886920413,
            "name": "Top of the Field",
            "index": 4
        },
        {
            "id": "418a7990-4228-4197-b68e-98b08509870f",
            "lat": 51.55584526886515,
            "lng": -3.5835030996843242,
            "name": "Ground Ivy",
            "index": 5
        },
        {
            "id": "93493b9e-8201-4709-a704-b6b925e34eb6",
            "lat": 51.556225495488796,
            "lng": -3.584136101011839,
            "name": "Statue",
            "index": 6
        },
        {
            "id": "f3e4a2e0-a63c-4c6c-b49c-55be4d9abe34",
            "lat": 51.55630887809538,
            "lng": -3.582709165815916,
            "name": "Foxglove Woods",
            "index": 7
        }
    ]
};

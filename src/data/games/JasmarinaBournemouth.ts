import { Trail } from '../../types/index';

// Source: twimp_adalo/trails/json/jasmarina_bournemouth.js
export const JasmarinaBournemouth: Trail = {
    "ref": "jasmarina-bournemouth",
    "name": "Jasmarina",
    "type": "WALK",
    "description": "A pirate adventure in Bournemouth.",
    "ownerId": null,
    "ageSuitability": "Family",
    "attributes": ["PUSHCHAIR_ACCESSIBLE", "DOG_ACCESSIBLE"],
    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/jasmarina.png",
    "items": [
        {
            "key": "map",
            "name": "Map",
            "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/map.png",
            "thumb_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/map_thumb.png"
        }
    ],
    "steps": [
        {
            "locationId": "f932e215-90ba-4698-8f59-1a4ffa492c14",
            "name": "The Beach",
            "type": "TRAIL_NODE",
            "hidden": false, // Inferred default
            "tasks": [
                {
                    "id": "0",
                    "type": "information",
                    "content": `\"Give me back my lucky charm!!\"\n\nA short distance away in a quiet spot on the sand, two people were having a heated argument.\n\nThe loudest was Pirate Captain One-Eyed Olaf with his strong curly grey beard and a large patch over his right eye.  He proudly wore his bright blue coat with its golden buttons and a pirate captain hat.  The one other regular feature about this old pirate's face was the persistent scowl and his creased forehead.\n\nHe was arguing with Jasmarina.  Normally a sweet old fishing lady with her bright red sunny cheeks and her long white curly hair tied up in a blue bandana.  Today she was showing that when push came to shove, this particular lady had strong wrists, she was mad, very mad!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/jasmarina.png",
                    "required": false
                },
                {
                    "id": "1",
                    "type": "information",
                    "content": `\"Well, that be learnin ya for messing wi'me treasure map, won't it Jasmarina!\" said the Captain\n\n\"I haven't seen your hopeful rag ya silly old fool, no doubt it was taken from under your nose by your right hand man, or indeed anyone to your right!\", snapped back Jasmarina.\n\n\"Don't lie to me, ye landlubber! I saw ya snoopin around me ship!\" continued One-Eyed Olaf\n\n\"I've never set foot on your ship!\" said Jasmarina\n\n\"You were close!\" said Olaf\n\n\"I was fishing... ON MY BOAT!!  You parked your ship where the water is deep, that's where the best fish are!\" complained Jasmarina\n\n\"Deep?! Ha! Like you would know deep water if it splashed you in the face!\" snarled Olaf\n\n\"Says you ya one-eyed scoundrel, you literally can't see depth!\"  said Jasmarina`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/twimpgrumpypiratecaptainwithaneyepatchstaringouttoc87e4464d0144ed494616ad2d974c7081.png",
                    "required": false
                },
                {
                    "id": "2",
                    "type": "information",
                    "content": `Captivated, you forget yourself for a moment and approach the arguing pair, \"Is everything all right here?\".\n\nJasmarina turns to face you, she knows arguing with this man is a lost cause.  She sighs defeated but as she looks at you, like a strand of hair moving in a light breeze, she feels a little bit of hope.\n\n\"This excuse of a man stole my lucky charm, the one that ensures I get a good catch! And now they're wrongly accusing me of stealing their map!\".\n\nYou turn to face One-Eyed Olaf ,\"Perhaps there's some way we can solve this and return her lucky charm?\"\n\nThe pirate grunts, turns dismissively and grumbles \"You don't have anything I want!\" and walks away.  As he does so, a parrot jumps off a perch nearby and with a few flaps, lands on the pirate's shoulder and he walks away from the beach.  The parrot seems to start whispering in the pirate's ear.\n\n“Well thanks for trying!”, begins Jasmarina, “It's not often a stranger even tries. Unfortunately the only language that idiot understands is piracy so unless…”.\n\nAt that moment, you are interrupted by the sound of flapping.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/jasmarina.png",
                    "required": false
                },
                {
                    "id": "3",
                    "type": "information",
                    "content": `A parrot flies back and lands on the sand beside you. He looks up, tilts his head to one side and then announces.\n\nSquawk! Lucky charm, you want? I know where it be, oh yes I do! But not for free, oh no no! You scratch my back, I scratch yours, savvy?\n\n“Hmm… what do you want me to do?”, you reply suspiciously.\n\n“I got a little task, see. Fetch a boot from Flynn at the pier, take it to the old codger under the bridge. The boot's heavy, and that old man despises parrots, squawk! So you do it, and I'll get your charm. Deal?\n\n“Oh. Well that seems reasonable, OK parrot, you have a deal.”\n\n“Parrot? Squawk! I ain't just “Parrot”! The name's Scampington Percival Masterson the Third, if you please!  Deliver the boot, and I might let you call me Scamp!\n\n“Understood.  Don't worry Jasmarina, we'll get your lucky charm back.”\n`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/scamp.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "5cdcdac2-4465-4e8e-b530-23dc879f57e3"
                    ],
                    "required": false
                }
            ]
        },
        {
            "locationId": "5cdcdac2-4465-4e8e-b530-23dc879f57e3",
            "name": "The Pier",
            "type": "TRAIL_NODE",
            "hidden": false,
            "tasks": [
                {
                    "id": "100",
                    "type": "information",
                    "content": `You: “Hello!  I'm here to collect a boot?”\n\nFlynn: “Well I never!  I didn't expect anyone to come claiming for this one.  Couldn't ya foot the bill for a pair? Haha, here you go!”`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/flynn.png",
                    "required": false
                },
                {
                    "id": "101",
                    "type": "information",
                    "content": `Great, now head to the bridge and find the old man.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/flynn.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "001274d0-b026-4e35-9331-816142a2c732"
                    ],
                    "required": false
                }
            ]
        },
        {
            "locationId": "001274d0-b026-4e35-9331-816142a2c732",
            "name": "The Bridge",
            "type": "TRAIL_NODE",
            "hidden": false,
            "tasks": [
                {
                    "id": "200",
                    "type": "information",
                    "content": `You arrive at the bridge, to the left is an old man sat on a stool in front of a table.  Around him are slabs of driftwood that have been carved to depict rolling ocean waves.  The one he is working on has an ornate compass in the centre.  In front of the table is a row of baskets full of carrots and a handwritten sale sign.\n\nYou: “Hey there!  Sorry to disturb you, I believe this belongs to you”, you raise the boot out in front of you with a smile on your face.\n\nThe old man looks up, looks at you and then the boot.  Suddenly you notice his expression drop and the wrinkles of concentration straighten into anger.  His head drops, he seems to be reaching for something.  Then he reappears holding two large carrots in his left hand and another in his right.  With a flick of his right wrist, the carrot rockets towards you, striking you on the left shoulder causing you to reel back off balance.  The second carrot quickly follows, narrowly missing your right ear.  You're falling backwards, the entire world seems to roll away below you and you find yourself looking up at the sky.\nThen you hear a grumbling voice “If I ever lay eyes on ye again, ye'll be countin' barnacles!” and with that, an orange and green blur skims the pointy end of your nose.\nIn shock you lie still for a moment, you're not hurt, just a little shaken.  It suddenly occurs to you that more carrots might be on their way so you lift your neck cautiously so assess the situation.\nTo your relief, no carrots and in fact you notice the old man has gone.  You see something moving to your right, it's the old man walking off ... no wait, he's not walking, he's hobbling!\nSuddenly you feel sick, you couldn't see it when he was sat at the table, but seeing him hobble away, it's very obvious that this old man has a peg leg and it's attached to his right leg.  He hobbles down the steps towards the Lower Gardens  and takes the left path at the fork.\n\nYour head rolls back onto the floor and you stare at the sky in disbelief.\n“I was tricked! That deceitful pa….”\n`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/tom_grumpy.png",
                    "required": false
                },
                {
                    "id": "201",
                    "type": "information",
                    "content": `\"Squawk! Hahaha!! Ahhh, that was good, yes it was! And that second carrot, an inch to the left and you'd be out cold, oh yes! Hahaha!! Ahhh, I needed that, my feathers haven't been this tickled since my old captain stepped on a seal. Squawk! OK, OK, fair enough, you're committed, I'll give you that!\n\nYou really want this charm back, do you? Squawk! I'll tell you how. Captain One-Eyed Olaf wants his map back, oh yes he does. Ruined his special day and he's been foul ever since. Find that and he'll hand over the charm, he will. Rumour has it, it's in the woods somewhere, squawk! And if you want to track down a rumour, you'll need to speak to Doris. Follow the path on the right through the gardens until you get to a river bridge. That's where she'll be, savvy??\"\n\nWith that the parrot flies away.  In the distance, you can see the old man has stopped and sat down at the last bench on the left side of the path.\n`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/scamp.png",
                    "required": false
                },
                {
                    "id": "202",
                    "type": "information",
                    "content": `What will you do now?\n\n1) Follow the old man (path to the left)\n2) Go find Doris (path to the right)`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/path_choice.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "e65abf88-df57-4c65-8ba4-cc7def8406fb",
                        "533994ff-48fe-4816-8a37-0b895bd5ba79"
                    ],
                    "required": false
                }
            ]
        },
        {
            "locationId": "e65abf88-df57-4c65-8ba4-cc7def8406fb",
            "name": "Old Man First",
            "type": "TRAIL_NODE",
            "hidden": false,
            "state": "TOM",
            "tasks": [
                {
                    "id": "300",
                    "type": "information",
                    "content": `Slumped on a bench, you spot the old man, wistfully staring into space, he looks very sad.\n\nYou go to speak and then stop, remembering how quickly things turned under the bridge, you can still feel a bit of sting on the end of your nose from that third carrot.\n\nHolding your hands out before you, you quickly rehearse the words in your head to make sure you get them out in time and then you begin in earnest.\n\n“I'm sorry sir, the parrot tricked me!”\n\nThe old man doesn't move but you sense he's aware of your presence.  You continue…\n\n“I was trying to help someone get their lucky charm back and the parrot, Scamp, told me to bring you the boot, I didn't you know you… err… it was a cruel trick and I'm sorry.”\n\n“Scamp… about time someone taught that feathered rag a lesson. What kind of lucky charm?”\n\n“Oh, I don't actually know what it looks like, she says it helps her catch the best fish”.\n\n“A lucky fishing charm huh.  This lady, she doesn't happen to have a sharp tongue, blue bandana and eyes like mahogany?”.\n\n“Ummm yes I suppose, her name is Jas…”. The old man speaks in synch with you but while you say “Jasmarina”, he says “Jasmine”.  There's a moment of confusion on the old man's face, his eyes shift from side to side and then he looks up, directly into your eyes, a weight seems to have lifted from him, he stands taller, his eyes narrowed.\n\n“My name is Tom, we've got a lucky charm to get… and a parrot school to open.”\n\nFollow Tom to the next pin on your map.\n`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/tom_sad.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "25359375-75fe-48de-991d-7477acdf9702"
                    ],
                    "required": false
                }
            ]
        },
        {
            "locationId": "25359375-75fe-48de-991d-7477acdf9702",
            "name": "The Stash",
            "type": "TRAIL_NODE",
            "hidden": false,
            "tasks": [
                {
                    "id": "400",
                    "type": "information",
                    "content": `Tom stops in front of a large metallic cabinet.  “Here we are” he says.  “Scamp works for One-Eyed Olaf right?”\n\n“Yes, he is the one that took Jas… he took the lucky charm!”\n\n“Good, this is his private stash, there's a pretty good chance it's in here” and reaches to the inside of his jacket pocket and pulls out a lockpick and walks towards the large padlock securing the cabinet.\nAs he turns the padlock, you see that it's a  heavy duty combination lock with 6 numbers on the front.\n\n“Blast! He's changed it. Fallen short again”. Tom's demeanor seems to be fading and he once again looks like that man on the bench.\n\n“6 digits… hmm… hey maybe it's a date?  Could it be his date of birth?”\n\n“Nahh… nobody knows his date of birth, not even him.  Wait, you could be on to something. I've heard that tale from across the bar more times than I've had pedicures.”\n\n“You've had a lot of pedicures?”\n\n“Ummm…no, don't even know what they are. As I was saying, back when Olaf was a mere sprout, there were many bandit raids. They would set fire to buildings and kidnap people to work as slaves. New heather beds had just been planted in the gardens in time for the Spring Bank Holiday weekend that year and that's where Olaf's was found the following day, in a basket amongst the heather.\n\nThe way Olaf tells the story, the lands of Bournemouth protected him that day and every day since and that's why the town is his to do what he pleases.  Of course, if you ask the folk in the town, they'll tell it different.  He was left in the dirt and he's been dirty ever since.\n\nHe makes a big thing of it every year, May 31st, that's your date.  Not sure of the year though.  There are some signs in the gardens that might give you some history of the town, don't suppose it will mention the raid though, they were quite common in those days.  I would help but I'm afraid I don't do much reading.  See what you can find out, I'll stay here and see if I can find another way in.\n\nHead into the garden and see if you can find out the year Olaf was abandoned.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/cabinet.png",
                    "required": false
                },
                {
                    "id": "401",
                    "type": "question_single",
                    "content": `Enter the 6 digit combination code`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/cabinet.png",
                    "options": [
                        {
                            "index": 0,
                            "content": `310556`,
                            "response": {
                                "title": "Correct!",
                                "sentiment": "positive"
                            }
                        }
                    ],
                    "required": false
                },
                {
                    "id": "402",
                    "type": "information",
                    "content": `“HAHA!!! Great job!!” Tom seems ecstatic and enthusiastically starts patting you on the back. “Ahh, I could have done with a first mate like you.”  Tom enters the number and the padlock springs open and you both peer inside.\nIt's a little treasure trove of piracy, piles of coins, small chests full of maps, charts and the occasional jewel, all manner of strange tools and ornate daggers, even a small keg of rum”\n\nTom rifles through the chests frantically “Blast, it's not here!  He must still have it on him.  Hmm… let me ponder for a moment.”  Tom wanders off towards the back wall, bends his knee so his peg leg rests against the wall and leans onto it, stroking his beard rhythmically.\n\nInitially you just watch him but after a minute goes past you think maybe he needs a little help.\n\n“All I know is that what he really wants is his map, Scamp says he lost it in the Woodland somewhere and that we should go speak to Doris?”.\n\n“You can go searching for his map if you want to but like all pirates, Olaf likes money.  So let's make him an offer he can't refuse!”.  As Tom says this he starts grabbing handfuls of coins from the open chests and dumps them into his pockets before locking the cupboard.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/open_cabinet.png",
                    "required": false
                },
                {
                    "id": "403",
                    "type": "information",
                    "content": `What would you like to do?\n\n1) Follow Tom to Obscura\n2) Tell Tom you need to find the map and go off in search for Doris`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/path_choice.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "533994ff-48fe-4816-8a37-0b895bd5ba79",
                        "3de63b11-0285-4f84-891c-0e99732fab0f"
                    ],
                    "required": false
                }
            ]
        },
        {
            "locationId": "533994ff-48fe-4816-8a37-0b895bd5ba79",
            "name": "Doris First",
            "type": "TRAIL_NODE",
            "hidden": false,
            "state": "DORIS",
            "tasks": [
                {
                    "id": "500",
                    "type": "information",
                    "content": `Hanging out under the bridge you notice a duck, there's a few ducks but one just stands out.\n“Ummm… excuse me, are you… I'm looking for Doris?”\n\nThe duck tilts her head and with a soft gaze says “Ah, a seeker of the unknown, wandering the path of whispers and shadows. Doris, you say? Perhaps I am, perhaps I'm not. Names are but fleeting echoes in the wind, don't you think?”.\n\nYou: “OK, well if you were Doris I was hoping you might help me?  You see, the pirates have taken something that doesn't belong to them and to get it back, I need to find their map which is apparently in the woods.  Scamp the parrot sent me to you?”\n\nDoris chuckles, “The map, the map, where it could be? Can't see the woods, too many trees!”\n\n“A parrot shunned by his own kin, misusing kindness to conjure a win.\nOh the tangled nests of fate weave their patterns once more!”\n\nDoris is shaking her head from side to side as if a disappointed mother.  Then she pauses for a moment, completely motionless.  You're not sure whether she is thinking or whether she got distracted by her own reflection in the water. Then she speaks again, her wispy tone turns a little more serious.\n\n“The help you want is not what you need, that is yours to grapple\nGo see the sage in a cage, Pumpkin the Pineapple.”\n\nAnd with that Doris flaps her wings and twirls upwards and stretches out a wing in a northerly direction where the path crosses the bridge and heads up the hill towards the trees.\n`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/mallard.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "d1329dd0-652e-469d-b877-e1e45a43fe26"
                    ],
                    "required": false
                }
            ]
        },
        {
            "locationId": "d1329dd0-652e-469d-b877-e1e45a43fe26",
            "name": "Pumpkin",
            "type": "TRAIL_NODE",
            "hidden": false,
            "tasks": [
                {
                    "id": "600",
                    "type": "information",
                    "content": `You: “Hello.  In truth, I'm not sure I entirely know why I've been sent to speak to you”.\n\nPumpkin: “Clarity often follows curiosity.  What was your original intent?”\n\nYou: “I was just trying to help someone, her possessions were wrongly taken from her by a pirate”\n\nPumpkin: “Noble.  One must sometimes turn left to right a wrong. And was your first step guided by noble intent also?\"\n\nYou: \"Hmm... I guess Scamp guided my first step.  He tricked me into being mean to an old man so no, I don't think his intent was noble at all! He just wants me to find a map that the pirates lost\"\n\nPumpkin “The mischievous flight of that particular parrot leads to a thicket of his own making. What do you plan to do with the map once found?”\n\nYou: “I'm hoping if I give the map back to Captain Olaf, he'll return Jasmarina's lucky charm”\n\nPumpkin: “Relying on the honour of a thief? Or the word of a trickster?”\n\nYou: “Yes, it's not a good plan is it!  But what else can I do?”\n\nPumpkin: “A predicament indeed.  The good news is I have the map and you are welcome to have it.  We sent out scouts yesterday to investigate what the map points to -  I'm quite certain it's not what Captain Olaf thinks it is.  But it does indeed belong to him so it should be returned.\n\nBefore I give you the map, let me give you something else, a quick story...\"\n`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/pumpkin.png",
                    "required": false
                },
                {
                    "id": "601",
                    "type": "information",
                    "content": `With a quick clearing of the throat, Pumpkin begins...\n\n\"Captain Olaf and his crew, with Scamp in tow, stealthily threaded their way through the shadowed woods, their latest contraband concealed under the veil of night. In the hushed darkness, Scamp's incessant hunger clamoured for attention.\n\"I'm so hungry! Yes I am. Late night cracker?\" Scamp's voice pierced the quiet, prompting a sharp whisper from Olaf, \"Quiet, Scamp! We'll eat when the task is done.\"\nYet Scamp, ever the self-centred rogue, spotted a large beetle on a nearby log, and with a joyful squawk, he lunged from Olaf's shoulder to seize it. In his haste, a talon snagged on an unseen obstacle, threw him off balance and careening into a startled crew member. The wooden barrel he carried clattered to the ground, rolling noisily and shattering the silence like a cannon's roar.\n\nCaptain Olaf's frustration boiled over, his voice low and cutting, \"You there! Retrieve that barrel swiftly! And you, you flying mischief-maker,\" he glared at Scamp, \"another outburst and your next cracker will be your last.\"\n\nPerched once more upon Olaf's shoulder, Scamp puzzled over the snag in his talon. It dawned on him that it had been the string securing Captain Olaf's prized map, it had indeed disappeared into the night. Though tempted to highlight the problem, Scamp quickly reconsidered and opted for silence and plausible deniability instead, devouring the juicy beetle with gusto instead.\n\nAnd that is how the map came to be lost.\"\n\nAt that moment you see the map dropped from above, it falls slowly and you reach out and grab it.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/pumpkin.png",
                    "required": false
                },
                {
                    "id": "602",
                    "type": "information",
                    "content": `\"You now have possession and knowledge in equal measure.  But remember, as long as you are prepared to turn left to right a wrong, you'll always be on the right path.\"\n\nYou: \"Thank you Pumpkin!  I'm sorry to ask as you've already helped me so much but do you know where I could find Captain Olaf?\"\n\nPumpkin whistles over to another smaller bird who comes over and tweets in his ear.  “He's just arrived at Obscura Cafe in the Square.  Good luck!”`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/pumpkin.png",
                    "on_arrival": [
                        "addItem -item map"
                    ],
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "e65abf88-df57-4c65-8ba4-cc7def8406fb"
                    ],
                    "required": false
                }
            ]
        },
        {
            "locationId": "e65abf88-df57-4c65-8ba4-cc7def8406fb",
            "name": "Old Man With Map",
            "type": "TRAIL_NODE",
            "hidden": false,
            "state": "TOM_WITH_MAP",
            "tasks": [
                {
                    "id": "700",
                    "type": "information",
                    "content": `Slumped on a bench, you spot the old man, wistfully staring into space, he looks very sad.\n\nYou go to speak and then stop, remembering how quickly things turned under the bridge earlier.\n\nHolding your hands out before you, you quickly rehearse the words in your head to make sure you get them out in time and then you begin in earnest.\n\n“I'm sorry sir about earlier, the parrot tricked me!”\n\nThe old man doesn't move but you sense he's aware of your presence.  You continue…\n\n“I was trying to help someone get their lucky charm back and the parrot, Scamp, told me to bring you the boot, I didn't you know you… err… it was a cruel trick and I'm sorry.”\n\n“Scamp… about time someone taught that feathered rag a lesson. What kind of lucky charm?” asks the Old Man\n\n“Oh, I don't actually know what it looks like, she says it helps her catch the best fish”.\n\n“A lucky fishing charm huh.  This lady, she doesn't happen to have a sharp tongue, blue bandana and eyes like mahogany?”.\n\n“Ummm yes I suppose, her name is Jas…”. The old man speaks in synch with you but while you say “Jasmarina”, he says “Jasmine”.  There's a moment of confusion on the old man's face, his eyes shift from side to side and then he looks up, directly into your eyes, a weight seems to have lifted from him, he stands taller, his eyes narrowed.\n\n“My name is Tom, we've got a lucky charm to get… and a parrot school to open.”\n\nFollow Tom to the next pin on your map.\n`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/tom_sad.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "25359375-75fe-48de-991d-7477acdf9702"
                    ],
                    "required": false
                }
            ]
        },
        {
            "locationId": "25359375-75fe-48de-991d-7477acdf9702",
            "name": "The Stash With Map",
            "type": "TRAIL_NODE",
            "hidden": false,
            "tasks": [
                {
                    "id": "800",
                    "type": "information",
                    "content": `Tom stops in front of a large metallic cabinet.  “Here we are” he says.  “Scamp works for One-Eyed Olaf right?”\n\n“Yes, he is the one that took Jas… he took the lucky charm!”\n\n“Good, this is his private stash, there's a pretty good chance it's in here” and reaches to the inside of his jacket pocket and pulls out a lockpick and walks towards the large padlock securing the cabinet.\nAs he turns the padlock, you see that it's a  heavy duty combination lock with 6 numbers on the front.\n\n“Blast! He's changed it. Fallen short again”. Tom's demeanor seems to be fading and he once again looks like that man on the bench.\n\n“6 digits… hmm… hey maybe it's a date?  Could it be his date of birth?”\n\n“Nahh… nobody knows his date of birth, not even him.  Wait, you could be on to something. I've heard that tale from across the bar more times than I've had pedicures.”\n\n“You've had a lot of pedicures?”\n\n“Ummm…no, don't even know what they are. As I was saying, back when Olaf was a mere sprout, there were many bandit raids. They would set fire to buildings and kidnap people to work as slaves. New heather beds had just been planted in the gardens in time for the Spring Bank Holiday weekend that year and that's where Olaf's was found the following day, in a basket amongst the heather.\n\nThe way Olaf tells the story, the lands of Bournemouth protected him that day and every day since and that's why the town is his to do what he pleases.  Of course, if you ask the folk in the town, they'll tell it different.  He was left in the dirt and he's been dirty ever since.\n\nHe makes a big thing of it every year, May 31st, that's your date.  Not sure of the year though.  There are some signs in the gardens that might give you some history of the town, don't suppose it will mention the raid though, they were quite common in those days.  I would help but I'm afraid I don't do much reading.  See what you can find out, I'll stay here and see if I can find another way in.\n\nHead into the garden and see if you can find out the year Olaf was abandoned.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/cabinet.png",
                    "required": false
                },
                {
                    "id": "801",
                    "type": "question_single",
                    "content": `Enter the 6 digit combination code`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/cabinet.png",
                    "options": [
                        {
                            "index": 0,
                            "content": `310556`,
                            "response": {
                                "title": "Correct!",
                                "sentiment": "positive"
                            }
                        }
                    ],
                    "required": false
                },
                {
                    "id": "802",
                    "type": "information",
                    "content": `“HAHA!!! Great job!!” Tom seems ecstatic and enthusiastically starts patting you on the back. “Ahh, I could have done with a first mate like you.”  Tom enters the number and the padlock springs open and you both peer inside.\nIt's a little treasure trove of piracy, piles of coins, small chests full of maps, charts and the occasional jewel, all manner of strange tools and ornate daggers, even a small keg of rum”\n\nTom rifles through the chests frantically “Blast, it's not here!  He must still have it on him.  Hmm… let me ponder for a moment.”  Tom wanders off towards the back wall, bends his knee so his peg leg rests against the wall and leans onto it, stroking his beard rhythmically.\n\n“Hey, it's OK.  Scamp reckons if I give Captain Olaf his map back, he will trade it for the lucky charm - and I already found it.  We just need to go see him at the Obscura”.\n\n“Let's hope you're right but I wouldn't be relying on Olaf to keep his end of the bargain, best we have a backup plan!”.  As Tom says this he starts grabbing handfuls of coins from the open chests and dumps them into his pockets before locking the cabinet.\n\nHead to Obscura.\n`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/open_cabinet.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "3de63b11-0285-4f84-891c-0e99732fab0f"
                    ],
                    "required": false
                }
            ]
        },
        {
            "locationId": "3de63b11-0285-4f84-891c-0e99732fab0f",
            "name": "Obscura Cafe No Map",
            "type": "TRAIL_NODE",
            "hidden": false,
            "tasks": [
                {
                    "id": "900",
                    "type": "information",
                    "content": `You arrive at Obscura, Captain Olaf and his odd bunch band of pirate friends are sat on a large table with large metal tanks of ale in front of them.  You approach the table and Captain Olaf recognises you.\n\n“Ahh you again, I told ye before, you got nothing I want” grunts Olaf\n\nOld Man Tom steps up… “But you have something I want, that lucky fishing charm, I've got some fishing of my own that's long overdue.”\n\nCaptain Olaf leans back in his chair, he's trying to look casual but in truth he's aware of Tom's gift at throwing things and wants to ensure he can use someone else as a shield if needed.\n\n“Ahahahaha so we've found something the old man wants, what makes you think I'll part with it so easily!?” sneers Olaf.\n\nTom, confidently replies “Because we both know you don't have the skill or the patience for fishing and I'm willing to pay more than a fair sum for it.”.  And with that he placed 4 coins in a stack onto the table.\n\nCaptain Olaf raised an eyebrow, “Well well, so you are.  And how do you two know each other?”\n\n“I only met him today, Scamp… err.. introduced us” you reply.  You suddenly wonder whether you should have said anything but you couldn't resist.  You look at Tom for reassurance but he's still holding his gaze directly with Captain Olaf.\n\n“Squawk! Clever bird! Finders fee!”, Scamp is eager to join in too.\n\n“Ahh Scamp makes a great point, that'll have to go on top.\", Olaf's eyes are searching, trying to get a measure on Tom.\n\nQuick as a flash, Tom sends another coin skimming over the surface of the table, clanging into Captain Olaf's tank of ale and coming to a rest in front of him. The noise woke the pirate band up, they instinctively reached for their cutlasses.  The commotion made Captain Olaf jump slightly and lose his leaned back position balance bringing him back to the table.\nFeeling somewhat awkward that he had moved unintentionally and now aware he was vulnerable to a coin between the eyes, he took a moment to count how many there were against one, then reached out and pulled the coins towards him.\n\n“Pleasure doing business with you” and reached inside his jacket pocket to reveal the lucky charm and pushed it across the table.\n\n“Oh and Scamp, your finders fee!”\nWithout breaking eye contact and with a malicious smug look on his face, he pulls a small tin towards him and opens the lid, picks out a cracker and throws it at the bird.\n\nOld Tom turns as if to walk away, takes a couple of steps and then stops.  “That's weird, I saw pieces of those same crackers only this morning, right outside a cabinet next to the gardens.  Looks like Scamp is on a roll today huh?”.\n\n“The cabinet by the gardens, ye say? Scamp, ye double crossing feather duster, what have ye been up to?”\n\n“Squawk! No, Captain! Scamp loyal! Scamp good bird!”\n\n“GET HERE!!” growled Olaf\n\nPlacing his hand on your shoulder, Tom looks at you with a smile trying very hard not to burst from his face.\n\n“Time for us to go I think”.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/lucky_charm.png",
                    "required": false
                },
                {
                    "id": "901",
                    "type": "finish",
                    "content": `Congratulations, adventurer! Your journey was fraught with danger and cunning foes, yet you have triumphed. With the lucky charm now safe, you have not only aided in the quest but also unraveled a tale of lost love and redemption.\n\nLong before he became Old Man Tom, he was a notorious pirate captain, feared and respected on the high seas. Yet beneath his grizzled exterior beat a heart passionately in love with a woman named Jasmine. He dreamt of returning from his final voyage to marry her and leave his pirate life behind.\n\nBut fate had other plans. On that fateful day, as Tom prepared for his last voyage, Scamp the parrot, annoyed by the prospect of his captain abandoning piracy, was more irksome than ever. Distracted by Scamp's antics, Tom accidentally stepped on a large grey seal. The seal, startled and defensive, chomped down hard on Tom's foot. The injury left Tom unable to walk for some time, and the pain, coupled with his feelings of inadequacy, prevented him from returning to Jasmine.\n\nYears passed, and Tom, believing himself less of a man due to his injury, stayed away. When he finally returned about a year ago, he sought out Jasmine. However, she became known locally as Jasmarina and the connection was never made.\n\nNow, with your help, Tom has rediscovered his courage and resolve. As he holds the lucky charm, he knows what he must do. He will return the charm to Jasmarina, hoping to rekindle the love they once shared. The future is uncertain, but Tom is ready to face it, buoyed by the hope of a new beginning.\n\nAfter today, the tale of this quest will be retold many times.  Until a future adventure, farewell!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/tom_happy.png",
                    "required": false
                }
            ]
        },
        {
            "locationId": "3de63b11-0285-4f84-891c-0e99732fab0f",
            "name": "Obscura Cafe With Map",
            "type": "TRAIL_NODE",
            "hidden": false,
            "tasks": [
                {
                    "id": "1000",
                    "type": "information",
                    "content": `You arrive at Obscura, Captain Olaf and his odd bunch band of pirate friends are sat on a large table with large metal tanks of ale in front of them.  Tom hangs back while you approach the table and Captain Olaf recognises you.\n\n“Ahh you again, I told ye before, you got nothing I want” grunts Olaf\n\n\"That's not entirely true Captain, I have your map!\" you say a little nervously.\n\nCaptain Olaf eyes perk up and a smile starts to appear on his face before he catches it and tries to subdue it.\n\n\"You have me map?\", there's a quiver in his voice so he quickly coughs to cover it up.  \"HA! I knew it! That old woman stole me map and she's come to her senses. There'll be a penalty to pay for ya lies\".\n\n\"No Captain, Iit was in the woods, that is where you lost it isn't it?  And now I am here to trade it for Jasmarina's lucky charm, do we have a deal?\"\n\nCaptain Olaf looks around to his band of pirates, thinks for a moment and then barks \"NO!  You never know when you might be needing to catch a fish for dinner, I say I'll just be taking that map and keeping both\", the pirate band chorus a loud menacing \"Yeah!\" as all stare in your direction.\n\nAll of a sudden a coin whizzes past your left ear and then curves as it spins through the air and clangs against the metal tanker in front of Olaf.  The noise reverberates like a church bell, in shock one of the pirates to his left reaches for his cutlass so quickly he falls off his chair.\n\nTom steps forward… “Just a small gesture, something to sweeten the deal.”\n\nCaptain Olaf leans back in his chair, he's trying to look casual but in truth he's aware of Tom's gift at throwing things and wants to ensure he can use someone else as a shield if needed.\n\n“Ahahahaha so we've found something the old man wants!?” sneers Olaf.  \"One more coin and you've got yourself a deal?\"\n\nQuick as a flash, another coin is whipped from Tom's hand, this time it strikes Captain Olaf's hat knocking it clear off his head revealing an uneven bundle of curly grey hair.  Olaf growls angrily while he fumbles frantically for his hat, he's flustered for a moment until he gets his hat back on his head.  He reaches inside his jacket pocket and throws the lucky charm on the table.\n\n\"Now, give me my map and get out of my sight!\" he barks.\n\nYou step forward, place the map on the table and take the lucky charm in your hand and place it into your pocket and turn to walk away.\n\n\"Watch your back you two, I've got eyes on the ground and eyes in the sky!\" sneers Olaf.  His face visibly changing from pink to red.\n\nWith Tom by your side you suddenly rather confident and blurt back, \"Are you sure you can trust those eyes in the sky?  Remeber that night in the woods when your crew member dropped a barrel?\".  One of the pirates to the right suddenly looks scared and takes a couple of steps back, sensing danger.  “Well it was Scamp that snapped the string to your map that night, he had eyes in the sky then but he never told you did he?\"\n\n“Squawk! No, Captain! Scamp loyal! Scamp good bird!”\n\nAt this point Olaf's redness had turned magenta and a heat haze had appeared around his ears.  “SCAMP!!!!  GET HERE YOU GOOD FOR NOTHING.... !!”\n\nPlacing his hand on your shoulder, Tom looks at you proudly with a smile trying very hard not to burst from his face.\n\n“Time for us to go I think”.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/lucky_charm.png",
                    "required": false
                },
                {
                    "id": "1001",
                    "type": "finish",
                    "content": `Congratulations, adventurer! Your journey was fraught with danger and cunning foes, yet you have triumphed. With the lucky charm now safe, you have not only aided in the quest but also unraveled a tale of lost love and redemption.\n\nLong before he became Old Man Tom, he was a notorious pirate captain, feared and respected on the high seas. Yet beneath his grizzled exterior beat a heart passionately in love with a woman named Jasmine. He dreamt of returning from his final voyage to marry her and leave his pirate life behind.\n\nBut fate had other plans. On that fateful day, as Tom prepared for his last voyage, Scamp the parrot, annoyed by the prospect of his captain abandoning piracy, was more irksome than ever. Distracted by Scamp's antics, Tom accidentally stepped on a large grey seal. The seal, startled and defensive, chomped down hard on Tom's foot. The injury left Tom unable to walk for some time, and the pain, coupled with his feelings of inadequacy, prevented him from returning to Jasmine.\n\nYears passed, and Tom, believing himself less of a man due to his injury, stayed away. When he finally returned about a year ago, he sought out Jasmine. However, she became known locally as Jasmarina and the connection was never made.\n\nNow, with your help, Tom has rediscovered his courage and resolve. As he holds the lucky charm, he knows what he must do. He will return the charm to Jasmarina, hoping to rekindle the love they once shared. The future is uncertain, but Tom is ready to face it, buoyed by the hope of a new beginning.\n\nAfter today, the tale of this quest will be retold many times.  Until a future adventure, farewell!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/tom_happy.png",
                    "required": false
                }
            ]
        },
        {
            "locationId": "3de63b11-0285-4f84-891c-0e99732fab0f",
            "name": "Obscura Cafe Without Tom",
            "type": "TRAIL_NODE",
            "hidden": false,
            "tasks": [
                {
                    "id": "1100",
                    "type": "information",
                    "content": `You arrive at Obscura, Captain Olaf and his odd bunch band of pirate friends are sat on a large table with large metal tanks of ale in front of them.\n\n“Ahh you again, I told ye before, you got nothing I want” grunts Olaf\n\n\"That's not entirely true Captain, I have your map!\" you say a little nervously.\n\nCaptain Olaf eyes perk up and a smile starts to appear on his face before he catches it and tries to subdue it.\n\n\"You have me map?\", there's a quiver in his voice so he quickly coughs to cover it up.  \"HA! I knew it! That old woman stole me map and she's come to her senses. There'll be a penalty to pay for ya lies\".\n\n\"No Captain, it was in the woods.  And now I am here to trade it for Jasmarina's lucky charm, do we have a deal?\"\n\nCaptain Olaf looks around to his band of pirates, thinks for a moment and then barks \"NO!  You never know when you might be needing to catch a fish for dinner, I say I'll just be taking that map and keeping both\", the pirate band chorus a loud menacing \"Yeah!\" as all stare in your direction.\n\n\"I suppose you could do that but aren't you a little curious how it came to be that you lost it in the first place?  Honour the deal and I'll tell you.\"\n\nThis seems to have peaked Captain Olaf's interest, \"Hmm... and why should I be believing you?\" quizzed Olaf.\n\n\"Why would I lie? I would imagine trust is very important in your line of work Captain, don't you want to know who betrayed you?  And you get your map?  Seems like a good deal for you.\".\n\n\"Betrayal you say?\", Captain Olaf rises to his feet, reaches to the inside of his jacket and throws the lucky charm on the table.\n\n\"Squawk! Trickster! Trickster! You're being tricked Captain!\", Scamp was now fluttering about overhead, a little worried that you somehow found out what happened.\n\n\"Quiet ya beak!  Now hand over me map!\"\n\nYou approach the table, place the map on the table and reach out and touch the string of the lucky charm.  Captain Olaf slams one hand on the map and the other on the blue charm. He leans in close,\"Start talking!\"\n\nYou pull slightly on the charm string but the Captain's weight on it prevents it from moving, he's too close for you to escape from so you start telling the story.\n\n\"It was the night in the woods, when one of your crew dropped a barrel\".  Captain Olaf looks shocked and shifty, confused as to how you know anything about it.  One of the pirates to your right suddenly looks panicked, you realise it must be the crew member.  Captain Olaf stares at him. \"Yes, go on!\".\n\nYou continue, \"He dropped the barrel because Scamp flew into his face, at the same time he snapped the string to your map.\"\n\nAs his eyes redirected to find the bird his grip on the charm loosened but it wasn't enough to make it move.\n\n\"But that's not all\", you continue.  \"Scamp knew he had broken the string but didn't tell you\".\n\nWith that Captain Olaf roared in disgust, \"SCAMP!!!! YOU UNGRATEFUL...\".  As he screams, you hear a flap of wings as Scamp flies from behind the Captain knocking the hat over his eyes whilst he makes his escape.  In Olaf's disorientation, you feel the charm come loose.\n\nNow is your chance.  RUN!!!!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/lucky_charm.png",
                    "required": false
                },
                {
                    "id": "1101",
                    "type": "finish",
                    "content": `Congratulations, adventurer! Your journey was fraught with danger and cunning foes, yet you have triumphed. With the lucky charm now safely in hand, you have not only reclaimed a lost treasure but also uncovered a tale steeped in mystery and lost love.\n\nAs you prepare to return the lucky charm to Jasmarina, you find yourself reflecting on the many challenges you overcame. Your own wits and determination guided you through puzzles and perils, and now you stand ready to reunite Jasmarina with her treasured possession.\n\nUpon meeting Jasmarina, you recount the harrowing tale of retrieving the charm. As you describe the dangers faced and the foes vanquished, you recall a peculiar phrase you heard along the way: \"You'll be counting barnacles.\" The phrase lingers in the air, sparking a glimmer of recognition in Jasmarina's eyes.\n\nShe pauses, her expression softening. \"I remember those words,\" she says, her voice tinged with nostalgia. \"They remind me of someone I once knew...a man who spoke with the sea in his heart and a pirate's swagger in his step. He used to say that.\"\n\nCurious, you ask her about the man she remembers. Jasmarina's gaze grows distant as she recounts the story of Tom, a once-feared pirate captain who had captured her heart. \"He loved me dearly, and I him. But tragedy struck, and he never returned from his final voyage. I changed my name to Jasmarina, hoping to leave the past behind, but I never forgot him.\"\n\nYou share with her the little you know about Tom, the old pirate who had vanished from her life. Although you never met him, you piece together the fragments of the story and tell her where he might be found. Her eyes light up with hope and longing, and she clutches the lucky charm to her chest.\n\n\"Thank you,\" she says, her voice filled with emotion. \"You've given me more than just a lucky charm; you've given me a chance to find him again.\"\n\nWith that, you leave Jasmarina to her thoughts, knowing that your journey has not only restored a precious item but also rekindled a lost love. Your adventure has come to an end, but for Jasmarina and Tom, a new chapter may yet begin.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/jasmarina/bournemouth/jasmarina_smile.png",
                    "required": false
                }
            ]
        }
    ],
    "locations": [
        {
            "id": "f932e215-90ba-4698-8f59-1a4ffa492c14",
            "lat": 50.7156469242418,
            "lng": -1.8772676298528057,
            "name": "The Beach",
            "index": 0
        },
        {
            "id": "5cdcdac2-4465-4e8e-b530-23dc879f57e3",
            "lat": 50.71602054721182,
            "lng": -1.8754195878415447,
            "name": "The Pier",
            "index": 1
        },
        {
            "id": "001274d0-b026-4e35-9331-816142a2c732",
            "lat": 50.716750801689976,
            "lng": -1.875787050476585,
            "name": "The Bridge",
            "index": 2
        },
        {
            "id": "e65abf88-df57-4c65-8ba4-cc7def8406fb",
            "lat": 50.71747425188354,
            "lng": -1.8764978358655315,
            "name": "Old Man",
            "index": 3
        },
        {
            "id": "25359375-75fe-48de-991d-7477acdf9702",
            "lat": 50.71864978803126,
            "lng": -1.8780151289949099,
            "name": "The Stash",
            "index": 4
        },
        {
            "id": "ab43662a-513f-4e3a-9876-84e061c724d5",
            "lat": 50.71873860260198,
            "lng": -1.8771533358356352,
            "name": "Gardens History",
            "index": 5
        },
        {
            "id": "533994ff-48fe-4816-8a37-0b895bd5ba79",
            "lat": 50.71777075638943,
            "lng": -1.8757192250518284,
            "name": "Doris",
            "index": 6
        },
        {
            "id": "d1329dd0-652e-469d-b877-e1e45a43fe26",
            "lat": 50.7187860436749,
            "lng": -1.8760379182667863,
            "name": "Pumpkin",
            "index": 7
        },
        {
            "id": "3de63b11-0285-4f84-891c-0e99732fab0f",
            "lat": 50.72023966256901,
            "lng": -1.8800263630719316,
            "name": "Obscura Cafe",
            "index": 8
        }
    ]
};

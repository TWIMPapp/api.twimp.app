import { Trail } from '../../types/index';

// Translated from the authoritative external content (path_regex-era schema)
// into our Trail type. Branched flow preserved: PureGym + Library are sibling
// hidden steps after Meyrick Park Cafe; the final synthesis (Somewhere Cosy)
// only requires Library, so PureGym remains optional storytelling.
export const AnniesMurderBournemouth: Trail = {
    "ref": "annies-murder-bournemouth",
    "name": "Annie's Murder",
    "type": "WALK",
    "description": `Annie Sullivan has been killed!\n\nLast Tuesday morning at 08:54am, Annie Sullivan was involved in a traffic accident that took her life.\n\nWhilst walking to work, Annie was struck by a car on Dean Park Road by a man called Peter Sampson.  Annie died at the scene.\n\nYou need to find out why!`,
    "ownerId": null,
    "ageSuitability": "18+",
    "attributes": ["DOG_ACCESSIBLE", "PUSHCHAIR_ACCESSIBLE", "ALL_DAY", "PARKING_NEARBY"],
    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/deanparkpolice.png",
    "items": [],
    "steps": [
        // ───── Step 0: Start (south end of Dean Park Road) ──────────────────
        {
            "locationId": "4a7edf53-1bde-4f42-a5c9-99b6f327ae63",
            "name": "Start",
            "type": "TRAIL_NODE",
            "hidden": false,
            "tasks": [
                {
                    "id": "0",
                    "type": "information",
                    "content": `Last Tuesday morning at 08:54am, Annie Sullivan was involved in a traffic incident that took her life.\n\nThe nearby underpass is the route that Annie is believed to have taken.  Follow in her final footsteps north up Dean Park Road to the nearest junction and the scene of the incident.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/police.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "e2b02e51-4be2-4b4a-9190-fe027dd35016"
                    ],
                    "required": false
                }
            ]
        },
        // ───── Step 1: Scene of the Incident ─────────────────────────────────
        {
            "locationId": "e2b02e51-4be2-4b4a-9190-fe027dd35016",
            "name": "Scene of the Incident",
            "type": "TRAIL_NODE",
            "hidden": false,
            "requiredSteps": [0],
            "tasks": [
                {
                    "id": "100",
                    "type": "information",
                    "content": `This is where it happened.\n\nAccording to the report, Annie was crossing here to continue up Dean Park Road when a car driven by Peter Sampson heading south towards you turned right here towards Wimborne Road.\n\nThe following is the police interview that was taken with Peter Sampson shortly after the incident.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/deanparkpolice.png",
                    "required": false
                },
                {
                    "id": "101",
                    "type": "information",
                    "content": `Peter Sampson Interview\n\n1. Please state your name for the record.\n\nPeter James Sampson\n\n2. Do you have any relationship to the deceased Annie Sullivan?\n\nRelationship? No, but I knew her.  She works for my wife and I during the week.\n\n3. What sort of work does she do?\n\nAngela and I work quite long hours, she does shifts at the Nuffield Health Hospital, often late ones so we need help around the house and with the kids.\n\nShe's supposed to come round before I go to work, so about 08:45am, she then does a couple hours of cleaning and then comes back at around 7pm to put the kids to bed.\n\nOh god, the kids are going to be so upset.\n\n4. You said "supposed to"?\n\nWell, she's been a bit unreliable recently, turning up later than expected, keeps saying she's ill... she's probably just out late or hung over or something.\n\nLike this morning for example, there's a plug socket in the kitchen that's been sparking and I wanted to let her know when she arrived, not to use it.\n\nI waited until about 10 minutes to 9, any longer and I would have made myself late for work!\n\n5. So you believe Annie was on her way to your house when you hit her with your car at 08:54am?\n\nUmm... yes, I suppose she was.  But there was a man!\n\n6. A man? OK we'll come back to him. You said you were running late for work?\n\nYou're trying to suggest I was driving like a lunatic or something, aren't you!? I'm a very safe driver!\n\n7. And yet, you knocked down a woman in your car in broad daylight?\n\nWell yes but I'm pretty sure that man had something to do with it.  I think he must have pushed her into the road because she just appeared out of nowhere.\n\n8. OK, so you saw this man push Annie into the road?\n\nYes!  Well, sort of, it all happened so fast and I got a bit of glare from the sun in my eyes as I approached the crossroads so I couldn't really see him properly.\n\n9. Can you describe this man?  Could you work with a sketch artist?\n\nUmm..  yeah he was a bit taller than Annie, had a beard.  Not sure about his face though, like I said, I couldn't see him properly.\n\n10. OK, no problem, do you remember what he was wearing perhaps?\n\nJeans maybe? Look I'm sorry, I really don't know.  I was only thinking about Annie at the time.\n\n11. OK, do you know where he went after the accident?\n\nHe ran off behind me while I was trying to help Annie.  This is just awful!\n\nThat's all for now. Thank you for your time.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/police.png",
                    "required": false
                },
                {
                    "id": "102",
                    "type": "information",
                    "content": `This is what we know about Peter Sampson.\n\nName: Peter Sampson\n\nGender: Male\n\nAge: 33\n\nHeight: 181cm\n\nWeight: 82kg\n\nOccupation 1: Senior Treasury Analyst\n\nPlace of Work: 10 Old Christchurch Road, Bournemouth\n\nEmployer: Nationwide Building Society\n\nSpouse: Mrs Angela Sampson, 31`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/peter.png",
                    "required": false
                },
                {
                    "id": "103",
                    "type": "information",
                    "content": `We also interviewed Peter's wife.  She corroborated his schedule, the dodgy plug socket and even his claim that he's a safe driver, I believe 'boring' was the term she used.  So if Peter is lying, she's backing him all the way.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/peterwife.png",
                    "required": false
                },
                {
                    "id": "104",
                    "type": "information",
                    "content": `Over to you, we need to solve the case and select the correct verdict.\n\nIdeally we would have a coroner's report but they're backed up and we could be waiting a while.  In the meantime, let's focus on what we have.\n\nWas this just an accident?\n\nDoes Peter Sampson's story check out?\n\nWho is this bearded stranger?\n\nI want to do a bit of a background check on Annie, head to her address, Fairthorn Court, 27 Badorgan Road and let's see what we can find out.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/police.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "aa1ef713-c35f-4170-8cf5-5d83835ba1a2"
                    ],
                    "required": false
                }
            ]
        },
        // ───── Step 2: Fairthorn Court (Annie's flat — meet Nicky) ───────────
        {
            "locationId": "aa1ef713-c35f-4170-8cf5-5d83835ba1a2",
            "name": "Fairthorn Court",
            "type": "TRAIL_NODE",
            "hidden": false,
            "requiredSteps": [1],
            "tasks": [
                {
                    "id": "200",
                    "type": "information",
                    "content": `Let's start with the basic profile we've put together.\n\nAnnie Sullivan\n\nGender: Female\n\nAge: 27\n\nHeight: 167cm\n\nWeight: 67kg\n\nAddress: Fairthorn Court, 27 Badorgan Road\n\nOccupation 1: Cafe Waitress\n\nPlace of Work: Meyrick Park Cafe, Central Drive, BH2 6LH\n\nEmployer: Nigel Hampton\n\nOccupation 2: Au Pair / Cleaner\n\nPlace of Work: 32 Dean Park Road,\n\nEmployer: Mr and Mrs Sampson\n\nItems recovered at the scene:\n\nWallet containing:\n\nCards: Natwest Bank Debit Card, Tesco Clubcard, PureGym Member Pass, Bournemouth Library Card\n\nNotes: £10\n\nCoins: £1 x 2, 50p x 1, 10p x 1, 1p x 1\n\nTesco bag containing one pack of ginger biscuits and a bottle of water.  Receipt matches items in bag, dated Tuesday 08:41`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/annie.png",
                    "required": false
                },
                {
                    "id": "201",
                    "type": "information",
                    "content": `This is Nicky, Annie's neighbour, let's see what she has to say.\n\n1. Please state your name for the record.\n\nNicky Foster\n\n2. Do you have any relationship to the deceased Annie Sullivan?\n\nOh my gosh!  Deceased.  Err... yeah we were friends.\n\n3. Would you say you were close?\n\nWouldn't say we were besties but yeah, we would hang out.  Annie isn't really one for gossip though.\n\n4. How do you know each other?\n\nWell we live here in the same block of flats and we both worked at the Cafe for a few months before I left.\n\nAnnie is a bit of a bookworm but she used to come out quite a lot for drinks, not so much recently.\n\n5. So her behaviour recently has changed?  Do you know who she's been spending her time with?\n\nUmm... no not really, just don't think she's been out much.  She goes to the gym most mornings and I know she's been working more recently.  A bit too much in my opinion, she seemed tired when I saw her at the weekend.\n\n6. Working at the cafe?\n\nWell yes, she mentioned that she really needed to build up some savings so she's taken on an extra shift on Saturday mornings.\n\nBut she's been working later for that family too, trouble trying to get the kids to bed, in fairness I never wanted to go to bed when I was little either.\n\n7. A witness reported seeing her with a man, do you know of any men in her life?\n\nHmm... no, not since Sean.  Like I said, doesn't really talk about boys much.\n\nThere are these group of creepy guys that come in once a month, one asked her out months ago, she told him after that offer she was thinking of dating girls for a while!\n\nHahaha, it was so unlike her but I was so proud.  Nigel would have been livid!\n\nGosh, I still can't believe she's dead!\n\n8. Nigel?\n\nNigel Hampton, the owner of Meyrick Park cafe, he must be desperate for lunch staff now.\n\n9. I see.  And you mentioned someone called Sean, could you tell me more about him?\n\nOh, he's alright I guess, bit of your show-off type.  Always working out or doing something with cars with his mates.  He is kind of charming, works at PureGym but he kept playing games, not replying for days, stuff like that.  Think she just got fed up with it and so she dumped him a few months back.\n\n10. And do you know if she has heard from him since?\n\nShe hasn't mentioned him but him and his mates are usually playing football down Meyrick Park so no doubt they've bumped into each other.  You don't think he's got something to do with this do you?\n\n11. Final question.  Before going to work, Annie seems to have taken a detour to buy some ginger nuts and some water.  Is that normal?\n\nGinger nuts!?  That is a bit odd, she's normally a bit of a health freak.  Sorry, I don't know.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/nicky.png",
                    "required": false
                },
                {
                    "id": "202",
                    "type": "information",
                    "content": `We've just pulled up a photo of Nigel Hampton, the cafe owner.  He's a bearded man, it's a bit tenuous but it might be worth talking to him anyway, head down to Meyrick Park Cafe.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/nigel.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "a84f12bb-8bdc-4e31-a6bf-d3a7e49ed92d"
                    ],
                    "required": false
                }
            ]
        },
        // ───── Step 3: Meyrick Park Cafe (interview Nigel) ───────────────────
        {
            "locationId": "a84f12bb-8bdc-4e31-a6bf-d3a7e49ed92d",
            "name": "Meyrick Park Cafe",
            "type": "TRAIL_NODE",
            "hidden": false,
            "requiredSteps": [2],
            "tasks": [
                {
                    "id": "300",
                    "type": "information",
                    "content": `Cafe Owner Interview\n\n1. Please state your name for the record.\n\nNigel Warren Churchill\n\n2. Do you have any relationship to the deceased Annie Sullivan?\n\nYes, she's one of my lunch staff.\n\n3. When was the last time you saw Annie?\n\nMonday, her shift starts at 12 but she's always here 10 minutes early.  Wish I could say the same for my other staff\n\n4. How did Annie get on with the staff and the customers here?\n\nFine, possibly a bit quiet for some of our more elderly regulars who come in for a chat, but she's polite, quite a smart cookie that one.\n\n5. Did she have any problems with anyone here?  Was she perhaps receiving any unwanted attention?\n\nOnly old Harold but he gives everyone unwanted attention.  He's harmless though.  He's 85 and I've usually made his coffee in the time it takes him just to sit down\n\n6. Nigel, I have to ask.  A man fitting your description was seen at the scene of the accident.  Can you tell me where you were on Tuesday morning at exactly 08:54am?\n\nOh wow.  Yes, I was here... opening up.  I do the stock count in the morning so I would have been in the back.\n\n7. Can anyone verify that?\n\nUmm... well no!  But Maggie gets in just before 9am, she can tell you.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/nigel.png",
                    "required": false
                },
                {
                    "id": "301",
                    "type": "information",
                    "content": `Maggie confirmed that she arrived somewhere between 08:55am and 09:00am.  When she arrived, she called out to Nigel and said that although she didn't see him for approximately 10 minutes, she heard him reply from the direction of the stock room.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/maggie.png",
                    "required": false
                },
                {
                    "id": "302",
                    "type": "information",
                    "content": `Hmmm... I think we're going to need to find about more about Annie's recent behavour.  Sean at PureGym would be one option — and don't forget she had a Library card in her wallet too.  See what you can dig up.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/police.png",
                    "required": false
                },
                {
                    // PureGym + Library are hidden siblings unlocked here. Task
                    // 302 names both outright, so we mark both rather than make
                    // the player deduce it — blank markers just made navigation
                    // a guessing game. awty still activates each on arrival.
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "05c60b97-187f-418b-8ee1-1276fd380782",
                        "91faa350-d62e-4c39-911c-ecd850c6f004"
                    ],
                    "required": false
                }
            ]
        },
        // ───── Step 4: PureGym (optional — meet Sean) ────────────────────────
        {
            "locationId": "05c60b97-187f-418b-8ee1-1276fd380782",
            "name": "PureGym",
            "type": "TRAIL_NODE",
            "hidden": true,
            // Sibling to Bournemouth Library — both unlock after Meyrick Park
            // Cafe. Sean's interview adds story texture but is NOT required to
            // solve the case (Somewhere Cosy only requires Library). A player
            // who skips PureGym can still finish.
            "requiredSteps": [3],
            "tasks": [
                {
                    "id": "400",
                    "type": "information",
                    "content": `Sean Interview\n\n1. Please state your name for the record.\n\nSean, Sean Crawford\n\n2. Do you have any relationship to the deceased Annie Sullivan?\n\nNot any more, I dumped her months back.\n\n3. When was the last time you saw Annie?\n\nI dunno, a few weeks ago maybe.\n\n4. Are you aware that Annie was involved in a fatal accident?\n\nNah, I wasn't. Is she alright?\n\n5. No sir, it was a fatal accident, that means Annie has passed away.\n\nOh.  Um... crap... that's messed up.\n\n6. You said you haven't seen her for weeks, has she not been attending the gym?\n\nNot as much as she used to but I think she was in one morning last week just before my shift.  I only know cause Jo said she was feeling sick and went home, she probably just avoiding me.\n\n7. According to another testimony, it was in fact Annie that ended your relationship, not you?\n\nOh.  Well nah you see, I kinda just let her think it was her idea.  I was going to do it.  She never wanted to go out anywhere, was more interested in her books.\n\n8. On the morning of the accident, she was seen with a bearded man.  Any idea who that might be?\n\nNot really.  I think her Dad has a beard, never met him though, he lives in Southampton I think.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/sean.png",
                    "required": false
                },
                {
                    "id": "401",
                    "type": "information",
                    "content": `Let's get one final interview and then we can sit down and figure this out.  You are what you read... let's head to the library!`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/police.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "91faa350-d62e-4c39-911c-ecd850c6f004"
                    ],
                    "required": false
                }
            ]
        },
        // ───── Step 5: Bournemouth Library (mandatory — ginger clue) ─────────
        {
            "locationId": "91faa350-d62e-4c39-911c-ecd850c6f004",
            "name": "Bournemouth Library",
            "type": "TRAIL_NODE",
            "hidden": true,
            // Sibling to PureGym — both unlock after Meyrick Park Cafe. The
            // ginger-book clue links the Tesco ginger biscuits at the scene to
            // morning sickness, nudging the bonus "pregnant" motive answer.
            // Required by Somewhere Cosy.
            "requiredSteps": [3],
            "tasks": [
                {
                    "id": "500",
                    "type": "information",
                    "content": `Librarian Interview\n\n1. Please state your name for the record.\n\nSylvia Fording\n\n2. Good afternoon, Ms. Fording, I am investigating the recent traffic incident that led to the death of one of your library patrons, Annie Sullivan. Are you aware of the situation?\n\nOh no, that's terrible news. I had no idea. I hope she didn't suffer too much.\n\n3. Ms. Fording. can you tell me how well you knew Ms. Sullivan?\n\nWell, she was a regular at the library, but I wouldn't say we were close. I'm the head librarian, so I don't always have time to chat with everyone who comes in, but I do like to check-in with people when I can.\n\n4. I understand. Did you notice anything unusual about Ms. Sullivan's behavior or demeanor in the recent days or weeks?\n\nNot that I can recall. She always seemed like a nice, normal young woman. I do remember what books she checked out, though. Sometimes what people read can give you insight into their lives, you know?\n\n5. Yes, that can be helpful. Can you tell me what books Miss Sullivan checked out?\n\nWell, she was interested in a lot of different things. She checked out a few novels, some biographies, and some cookbooks. But I do remember one book in particular that she seemed very interested in. It was about the medicinal benefits of ginger if I recall correctly.\n\n6. Ginger? Can you tell me more about that book?\n\nI'm sorry, she didn't actually check the book out and I don't remember the title or author.  But I remember her being quite surprised at how ginger can be used to treat all sorts of ailments, from nausea to arthritis to migraines. I remember thinking it was an unusual choice for someone her age, but everyone has their own interests, I suppose.\n\n7. Thank you for that information, Ms. Fording. You've been very helpful. If you think of anything else that might be useful to our investigation, please don't hesitate to contact me.\n\nOf course, I'll keep my eyes and ears open. And please let me know if there's anything more I can do to help.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/library.jpg",
                    "required": false
                },
                {
                    "id": "501",
                    "type": "information",
                    "content": `Right, find somewhere cosy to sit down and let's figure this out.\n\nThere are plenty of options in Bournemouth Town Centre.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/police.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [],
                    "required": false
                }
            ]
        },
        // ───── Step 6: Somewhere Cosy (synthesis + verdict) ──────────────────
        {
            "locationId": "f7235c82-db02-4b78-8d53-08cbd38899a1",
            "name": "Somewhere Cosy",
            "type": "TRAIL_NODE",
            "hidden": false,
            // Synthesis step. Requires Library (the only step that teaches the
            // ginger/pregnancy chain). A generous proximity_radius lets the
            // player activate from any nearby bench or cafe in town centre.
            "requiredSteps": [5],
            "on_search": { "proximity_radius": 100 },
            "tasks": [
                {
                    "id": "600",
                    "type": "information",
                    "content": `You take a seat and spread your notes across the table.  Time to make sense of what you've gathered.\n\nTip: tap the journal icon at the top of the screen to swipe back through every clue you've collected.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/case_files.png",
                    "required": false
                },
                {
                    "id": "601",
                    "type": "question_single",
                    "content": `Who is the murderer?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/case_files.png",
                    "options": [
                        {
                            "index": 0,
                            "content": "Sean",
                            "response": { "title": "Incorrect", "sentiment": "negative" }
                        },
                        {
                            "index": 1,
                            "content": "Peter Sampson",
                            "response": { "title": "Correct!", "sentiment": "positive" }
                        },
                        {
                            "index": 2,
                            "content": "Nigel",
                            "response": { "title": "Incorrect", "sentiment": "negative" }
                        },
                        {
                            "index": 3,
                            "content": "None",
                            "response": { "title": "Incorrect", "sentiment": "negative" }
                        }
                    ],
                    "required": true
                },
                {
                    "id": "602",
                    "type": "question_single",
                    "content": `In Peter's interview, what question number received a response that proves that they were lying?`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/case_files.png",
                    "options": [
                        {
                            "index": 0,
                            "content": "8",
                            "response": { "title": "Correct!", "subtitle": "Glare from the sun.... really?", "sentiment": "positive" }
                        },
                        {
                            "index": 1,
                            "content": "7",
                            "response": { "title": "Liar!", "subtitle": "But that is not proof", "sentiment": "negative" }
                        },
                        {
                            "index": 2,
                            "content": "4",
                            "response": { "title": "All True!", "subtitle": "Even the plug socket", "sentiment": "negative" }
                        }
                    ],
                    "required": false
                },
                {
                    "id": "603",
                    "type": "information",
                    "content": `Peter's claim that the sun shone in his eyes just doesn't add up.  He was heading south down Dean Park Road and turning right towards Wimborne Road — so the sun, low in the eastern sky at that time of morning, would have been behind him and to his left.  No way it was in his eyes.\n\nLet's see if you've figured out the motive, it's something about Annie.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/case_files.png",
                    "required": false
                },
                {
                    "id": "604",
                    "type": "question_single",
                    "content": `Something about Annie, an 8 letter word beginning with P explains the motive`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/case_files.png",
                    "options": [
                        {
                            "index": 0,
                            "content": "pregnant",
                            "response": { "title": "Correct!", "sentiment": "positive" }
                        },
                        {
                            "index": 1,
                            "content": "pumpkin",
                            "response": { "title": "Not even 8 letters!?", "sentiment": "negative" }
                        }
                    ],
                    "required": false
                },
                {
                    "id": "605",
                    "type": "finish",
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/case_files.png",
                    "content": `Congratulations!  A terrible waste indeed and thanks to you, Peter will go to jail.  He didn't just kill a lovely hard working woman, but his own unborn child.  Annie had always had a soft spot for Peter, he was well dressed and charming.  With all the late nights at the house with Angela at work, one night, Peter made a move on Annie and she didn't turn him down.\n\nTwo months later, Annie had been at the house and had stayed a little too long, Angela was due home any minute so she hurriedly picked up her bag and rushed home.  As she ran out the door, a letter fell out of her bag but she didn't notice.  Peter recognised the Nuffield Health branding from his wife's job and picked it up.  When he saw the word "ultrasound" written on the letter, Peter freaked out, he didn't know what to do.\n\nAnnie was really starting to struggle with morning sickness and had been researching ginger to try and get on top of it.  It was so bad that morning though that she went to Tesco to get some ginger biscuits in the hope that would do something but just being around food made her feel worse.\n\nOn the morning of the incident, Peter waited around to confront her but when she was late, he couldn't wait any longer.  And as he drove to work, he just kept imagining Annie bumping into his wife, that she would find out, the kids would find out, he'd be a scandal at work and everything would fall apart.  All of a sudden, the walls felt like they were closing in fast.  And then as he approached the pedestrian crossing, he saw Annie step out to cross the road and in a split second, instead of hitting the brakes, he intentionally hit the accelerator.`,
                    "required": false
                }
            ]
        }
    ],
    "locations": [
        {
            "id": "4a7edf53-1bde-4f42-a5c9-99b6f327ae63",
            "lat": 50.723897913785024,
            "lng": -1.8763232812957131,
            "name": "Start",
            "index": 0
        },
        {
            "id": "e2b02e51-4be2-4b4a-9190-fe027dd35016",
            "lat": 50.72494047050906,
            "lng": -1.876250861652311,
            "name": "Scene of the Incident",
            "index": 1
        },
        {
            "id": "aa1ef713-c35f-4170-8cf5-5d83835ba1a2",
            "lat": 50.72669726074288,
            "lng": -1.8777676047947933,
            "name": "Fairthorn Court",
            "index": 2
        },
        {
            "id": "a84f12bb-8bdc-4e31-a6bf-d3a7e49ed92d",
            "lat": 50.72710266265441,
            "lng": -1.8824059873876275,
            "name": "Meyrick Park Cafe",
            "index": 3
        },
        {
            "id": "05c60b97-187f-418b-8ee1-1276fd380782",
            "lat": 50.72087264295929,
            "lng": -1.8841420341003534,
            "name": "PureGym",
            "index": 4
        },
        {
            "id": "91faa350-d62e-4c39-911c-ecd850c6f004",
            "lat": 50.72069361978557,
            "lng": -1.8847370829775456,
            "name": "Bournemouth Library",
            "index": 5
        },
        {
            "id": "f7235c82-db02-4b78-8d53-08cbd38899a1",
            "lat": 50.72039814769198,
            "lng": -1.882980236072791,
            "name": "Somewhere Cosy",
            "index": 6
        }
    ]
};

import { Trail } from '../../types/index';

// Source: ported from the original Dean Park Murder Mystery trail file
// (renamed Annie's Murder to keep the victim generic so the trail can be moved
// to other parks/locations later). No states wired up yet — the four steps
// run in a fixed linear order via the engine's existing "notBeenHereBefore"
// gate.
export const AnniesMurderBournemouth: Trail = {
    "ref": "annies-murder-bournemouth",
    "name": "Annie's Murder",
    "type": "WALK",
    "description": `Annie Sullivan has been killed!\n\nLast Tuesday morning at 08:54am, Annie Sullivan was involved in a traffic accident that took her life.\n\nWhilst walking to work, Annie was struck by a car on Dean Park Road by a man called Sam Peterson.  Annie died at the scene.\n\nSam Peterson was initially arrested and later that day, questioned...`,
    "ownerId": null,
    "ageSuitability": "18+",
    "attributes": ["DOG_ACCESSIBLE", "PUSHCHAIR_ACCESSIBLE", "ALL_DAY", "PARKING_NEARBY"],
    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/deanparkpolice.png",
    "items": [],
    "steps": [
        {
            "locationId": "1d7e0c4a-5b3f-4a8c-8d12-3e4f5a6b7c8d",
            "name": "Scene of the Crime",
            "type": "TRAIL_NODE",
            "hidden": false,
            "tasks": [
                {
                    "id": "0",
                    "type": "information",
                    "content": `Peter Samson Interview\n\n1. Please state your name for the record.\nPeter James Samson\n\n2. Do you have any relationship to the deceased Annie Sullivan?\nRelationship? No, but I knew her.  She works for my wife and I during the week.\n\n3. What sort of work does she do?\nWell, Angela and I work quite long hours, she does shifts at the Nuffield Health Hospital, often late ones so we need help around the house and with the kids.\nShe's supposed to come round before I go to work, so about 08:45am, she then does a couple hours of cleaning and then comes back at around 7pm to put the kids to bed.\nOh god, the kids are going to be so upset.\n\n4. You said "supposed to"?\nWell, she's been a bit unreliable recently, turning up later than expected, keeps saying she's ill... she's probably just out late or hung over or something.\nLike this morning for example, there's a plug socket in the kitchen that's been sparking and I wanted to let her know when she arrived, not to use it.\nI waited until about 10 minutes to 9, any longer and I would have made myself late for work!\n\n5. So you believe Annie was on her way to your house when you hit her with your car at 08:54am?\nUmm... yes, I suppose she was.  But there was a man!\n\n6. A man? OK we'll come back to him. You said you were running late for work?\nYou're trying to suggest I was driving like a lunatic or something, aren't you!? I'm a very safe driver!\n\n7. And yet, you knocked down a woman in your car in broad daylight?\nWell yes but I'm pretty sure that man had something to do with it.  I think he must have pushed her into the road because she just appeared out of nowhere.\n\n8. OK, so you saw this man push Annie into the road?\nYes!  Well, sort of, it all happened so fast and I got a bit of glare from the sun in my eyes as I turned the corner so I couldn't really see him properly.\n\n9. Can you describe this man?  Could you work with a sketch artist?\nUmm..  yeah he was a bit taller than Annie, had a beard.  Not sure about his face though, like I said, I couldn't see him properly.\n\n10. OK, no problem, do you remember what he was wearing perhaps?\nJeans maybe? Look I'm sorry, I really don't know.  I was only thinking about Annie at the time.\n\n11. OK, do you know where he went after the accident?\nHe ran off behind me while I was trying to help Annie.  This is just awful!\n\nThat's all for now. Thank you for your time.`,
                    "required": false
                },
                {
                    "id": "1",
                    "type": "information",
                    "content": `We also interviewed Peter's wife.  She corroborated his schedule, the dodgy plug socket and even his claim that he's a safe driver, I believe 'boring' was the term she used.  So if Peter is lying, she's backing him all the way.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/peterwife.png",
                    "required": false
                },
                {
                    "id": "2",
                    "type": "information",
                    "content": `Over to you, we need to solve the case and select the correct verdict.\nIdeally we would have a coroner's report but they're backed up and we could be waiting a while.  In the meantime, let's focus on what we have.\nWas this just an accident?\nDoes Sam Peterson's story check out?\nWho is this bearded stranger?\n\nWe've put together profile information for the victim and the key witness.`,
                    "required": false
                },
                {
                    "id": "3",
                    "type": "information",
                    "content": `Annie Sullivan\nGender: Female\nAge: 27\nHeight: 167cm\nWeight: 67kg\nAddress: Fairthorn Court, 27 Badorgan Road\n\nOccupation 1: Cafe Waitress\nPlace of Work: Meyrick Park Cafe, Central Drive, BH2 6LH\nEmployer: Nigel Hampton\n\nOccupation 2: Au Pair / Cleaner\nPlace of Work: 32 Dean Park Road,\nEmployer: Mr and Mrs Samson\n\nItems recovered at the scene:\nWallet containing:\nCards: Natwest Bank Debit Card, Tesco Clubcard, PureGym Member Pass, Bournemouth Library Card\nNotes: £10\nCoins: £1 x 2, 50p x 1, 10p x 1, 1p x 1\n\nTesco bag containing one pack of ginger biscuits and a bottle of water.  Receipt matches items in bag, dated Tuesday 08:41`,
                    "required": false
                },
                {
                    "id": "4",
                    "type": "information",
                    "content": `Annie Sullivan`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/annie.png",
                    "required": false
                },
                {
                    "id": "5",
                    "type": "information",
                    "content": `Peter Samson\n\nGender: Male\nAge: 33\nHeight: 181cm\nWeight: 82kg\n\nOccupation 1: Senior Treasury Analyst\nPlace of Work: 10 Old Christchurch Road, Bournemouth\nEmployer: Nationwide Building Society\n\nSpouse: Mrs Angela Samson, 31`,
                    "required": false
                },
                {
                    "id": "6",
                    "type": "information",
                    "content": `Peter Samson`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/peter.png",
                    "required": false
                },
                {
                    "id": "7",
                    "type": "information",
                    "content": `OK let's speak to someone who knew Annie outside of work, head over to her home address.`,
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "2e8f1d5b-6c4a-4b9d-9e23-4f5a6b7c8d9e"
                    ],
                    "required": false
                }
            ]
        },
        {
            "locationId": "2e8f1d5b-6c4a-4b9d-9e23-4f5a6b7c8d9e",
            "name": "Annie's House",
            "type": "TRAIL_NODE",
            "hidden": false,
            "requiredSteps": [0],
            "tasks": [
                {
                    "id": "100",
                    "type": "information",
                    "content": `Annie Sullivan's Neighbour Interview\n\n1. Please state your name for the record.\nNicky Foster\n\n2. Do you have any relationship to the deceased Annie Sullivan?\nOh my gosh!  Deceased.  Err... yeah we were friends.\n\n3. Would you say you were close?\nWouldn't say we were besties but yeah, we would hang out.  Annie isn't really one for gossip though.\n\n4. How do you know each other?\nWell we live here in the same block of flats and we both worked at the Cafe for a few months before I left.\nAnnie is a bit of a bookworm but she used to come out quite a lot for drinks, not so much recently.\n\n5. So her behaviour recently has changed?  Do you know who she's been spending her time with?\nUmm... no not really, just don't think she's been out much.  She goes to the gym most mornings and I know she's been working more recently.  A bit too much in my opinion, she seemed tired when I saw her at the weekend.\n\n6. Working at the cafe?\nWell yes, she mentioned that she really needed to build up some savings so she's taken on an extra shift on Saturday mornings.\nBut she's been working later for that family too, trouble trying to get the kids to bed, in fairness I never wanted to go to bed when I was little either.\n\n7. A witness reported seeing her with a man, do you know of any men in her life?\nHmm... no, like I said, doesn't really talk about boys much.\nOne of the regulars at the cafe asked her out months ago, she told him after that offer she was thinking of dating girls for a while!\nHahaha, oh my gosh, I still can't believe she's dead!\nI bet Nigel has been freaking out.\n\n8. Nigel?\nNigel Hampton, the owner of Meyrick Park cafe, he must be desperate for lunch staff now.\n\n9. OK, final question.  Before going to work, Annie seems to have taken a detour to buy some ginger nuts and some water.  Is that normal?\nGinger nuts!?  That is a bit odd, she's normally a bit of a health freak.  Sorry, I don't know.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/nicky.png",
                    "required": false
                },
                {
                    "id": "101",
                    "type": "information",
                    "content": `We've just pulled up a photo of Nigel Hampton, the cafe owner.  He's a bearded man, it's a bit tenuous but it might be worth talking to him anyway, head down to Meyrick Park Cafe.`,
                    "required": false
                },
                {
                    "id": "102",
                    "type": "information",
                    "content": `Nigel Hampton`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/nigel.png",
                    "required": false
                },
                {
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [
                        "3f902e6c-7d5b-4cae-af34-5a6b7c8d9e0f"
                    ],
                    "required": false
                }
            ]
        },
        {
            "locationId": "3f902e6c-7d5b-4cae-af34-5a6b7c8d9e0f",
            "name": "Meyrick Park Cafe",
            "type": "TRAIL_NODE",
            "hidden": false,
            "requiredSteps": [1],
            "tasks": [
                {
                    "id": "200",
                    "type": "information",
                    "content": `Cafe Owner Interview\n\n1. Please state your name for the record.\nNigel Warren Churchill\n\n2. Do you have any relationship to the deceased Annie Sullivan?\nYes, she's one of my lunch staff.\n\n3. When was the last time you saw Annie?\nMonday, her shift starts at 12 but she's always here 10 minutes early.  Wish I could say the same for my other staff\n\n4. How did Annie get on with the staff and the customers here?\nFine, possibly a bit quiet for some of our more elderly regulars who come in for a chat, but she's polite, quite a smart cookie that one.\n\n5. Did she have any problems with anyone here?  Was she perhaps receiving any unwanted attention?\nOnly old Harold but he gives everyone unwanted attention.  He's harmless though.  He's 85 and I've usually made his coffee in the time it takes him just to sit down\n\n6. Nigel, I have to ask.  A man fitting your description was seen at the scene of the accident.  Can you tell me where you were on Tuesday morning at exactly 08:54am?\nOh wow.  Yes, I was here... opening up.  I do the stock count in the morning so I would have been in the back.\n\n7. Can anyone verify that?\nUmm... well no!  But Maggie gets in just before 9am, she can tell you.`,
                    "required": false
                },
                {
                    "id": "201",
                    "type": "information",
                    "content": `Maggie confirmed that she arrived somewhere between 08:55am and 09:00am.  When she arrived, she called out to Nigel and said that although she didn't see him for approximately 10 minutes, she heard him reply from the direction of the stock room.`,
                    "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/annies-murder/bournemouth/maggie.png",
                    "required": false
                },
                {
                    "id": "202",
                    "type": "information",
                    "content": `The next part is up to you.  We need to find someone else who would have seen Annie on a regular basis.  Who could that be?`,
                    "required": false
                },
                {
                    // Pure Gym is intentionally hidden — the player has to deduce
                    // where to go from the clues (PureGym member pass at the
                    // scene, neighbour's "gym most mornings" line). Empty markers
                    // leave the map blank; awty still activates Pure Gym on arrival.
                    "type": "map",
                    "content": `Ready to go?`,
                    "markers": [],
                    "required": false
                }
            ]
        },
        {
            "locationId": "40a13f7d-8e6c-4dbf-b045-6b7c8d9e0f1a",
            "name": "Pure Gym",
            "type": "TRAIL_NODE",
            "hidden": true,
            // Sibling to The Library — both unlock after Meyrick Park Cafe.
            // Optional: the player can skip the Gym entirely. The synthesis
            // (questions + finish) lives at Flirt Cafe, which requires the
            // Library, so a player who skips the Library can't solve the case.
            "requiredSteps": [2],
            "tasks": [
                {
                    "id": "300",
                    "type": "information",
                    "content": `PureGym Reception Interview\n\n1. Please state your name for the record.\nCharles Barden\n\n2. How do you know Annie Sullivan?\nI just know her because she's a member, she's been coming here most days for the past 3 or 4 years.\n\n3. Would you describe her as a friend?\nUmm... I'm not sure, I don't think so.  We were friendly, we had chats at the reception from time to time.  For example, I knew that she wasn't planning on renewing her membership next month.  But outside of work, I never saw her.\n\n4. Do you know why she wasn't going to renew?\nNot exactly, she just said it was for personal reasons.  Last time she was here, I heard one of the other girls talking about someone throwing up in the bathroom, I think it must have been her.  Maybe that had something to do with it?`,
                    "required": false
                },
                {
                    "id": "301",
                    "type": "information",
                    "content": `Anywhere else we can go? Annie's wallet had a Bournemouth Library card — let's head over there next.`,
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
        {
            "locationId": "51b24f8e-9f7d-4ec0-8156-7c8d9e0f1a2b",
            "name": "The Library",
            "type": "TRAIL_NODE",
            "hidden": true,
            // Sibling to Pure Gym — both unlock after Meyrick Park Cafe.
            // The ginger-book clue links the Tesco ginger biscuits at the scene
            // to morning sickness, nudging the bonus "pregnant" answer.
            "requiredSteps": [2],
            "tasks": [
                {
                    "id": "400",
                    "type": "information",
                    "content": `Librarian Interview\n\n1. Please state your name for the record.\nSylvia Fording\n\n2. Good afternoon, Ms. Fording, I am investigating the recent traffic incident that led to the death of one of your library patrons, Annie Sullivan. Are you aware of the situation?\nOh no, that's terrible news. I had no idea. I hope she didn't suffer too much.\n\n3. Ms. Fording. can you tell me how well you knew Ms. Sullivan?\nWell, she was a regular at the library, but I wouldn't say we were close. I'm the head librarian, so I don't always have time to chat with everyone who comes in, but I do like to check-in with people when I can.\n\n4. I understand. Did you notice anything unusual about Ms. Sullivan's behavior or demeanor in the recent days or weeks?\nNot that I can recall. She always seemed like a nice, normal young woman. I do remember what books she checked out, though. Sometimes what people read can give you insight into their lives, you know?\n\n5. Yes, that can be helpful. Can you tell me what books Ms. Sullivan checked out?\nWell, she was interested in a lot of different things. She checked out a few novels, some biographies, and some cookbooks. But I do remember one book in particular that she seemed very interested in. It was about the medicinal benefits of ginger if I recall correctly.\n\n6. Ginger? Can you tell me more about that book?\nI'm sorry, she didn't actually check the book out and I don't remember the title or author.  But I remember her being quite surprised at how ginger can be used to treat all sorts of ailments, from nausea to arthritis to migraines. I remember thinking it was an unusual choice for someone her age, but everyone has their own interests, I suppose.\n\n7. Thank you for that information, Ms. Fording. You've been very helpful. If you think of anything else that might be useful to our investigation, please don't hesitate to contact me.\nOf course, I'll keep my eyes and ears open. And please let me know if there's anything more I can do to help.`,
                    "required": false
                },
                {
                    "id": "401",
                    "type": "information",
                    "content": `One more clue to find, another person that sees Annie regularly?`,
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
        {
            "locationId": "62c35a9f-af8d-4e1f-a156-8d9e0f1a2b3c",
            "name": "Flirt Cafe",
            "type": "TRAIL_NODE",
            "hidden": false,
            // Synthesis step. Requires The Library (the only step that teaches
            // the ginger/pregnancy chain). A generous proximity_radius lets the
            // player activate Flirt from any nearby bench or table — the
            // requiredSteps gate stops it firing before they've actually
            // visited the Library, even though the Library is right next door.
            "requiredSteps": [4],
            "on_search": { "proximity_radius": 100 },
            "tasks": [
                {
                    "id": "500",
                    "type": "information",
                    "content": `You take a seat at Flirt Cafe and spread your notes across the table.  Time to make sense of what you've gathered.\n\nTip: tap the journal icon at the top of the screen to swipe back through every clue you've collected.`,
                    "required": false
                },
                {
                    "id": "501",
                    "type": "question_multiple",
                    "content": `Which of the following do you believe?`,
                    "options": [
                        {
                            "index": 0,
                            "content": "It was just an accident",
                            "response": { "title": "Not quite", "sentiment": "negative" }
                        },
                        {
                            "index": 1,
                            "content": "Peter Samson hit her on purpose",
                            "response": { "title": "Correct!", "sentiment": "positive" }
                        },
                        {
                            "index": 2,
                            "content": "Nigel pushed her into the road",
                            "response": { "title": "Not quite", "sentiment": "negative" }
                        },
                        {
                            "index": 3,
                            "content": "Someone else pushed her",
                            "response": { "title": "Not quite", "sentiment": "negative" }
                        }
                    ],
                    "required": true
                },
                {
                    "id": "502",
                    "type": "question_single",
                    "content": `In their interview, what question number received a response that proves that they were lying?`,
                    "options": [
                        {
                            "index": 0,
                            "content": "8",
                            "response": { "title": "Correct!", "sentiment": "positive" }
                        }
                    ],
                    "required": false
                },
                {
                    "id": "503",
                    "type": "question_single",
                    "content": `For bonus points.  Can you summarise something about Annie that triggered the motive for her death into a single word.  This word begins with the first letter of the true killer and has the same number of letters as the question number from the previous question.`,
                    "options": [
                        {
                            "index": 0,
                            "content": "pregnant",
                            "response": { "title": "Correct!", "sentiment": "positive" }
                        }
                    ],
                    "required": false
                },
                {
                    "id": "504",
                    "type": "finish",
                    "content": `Congratulations!  A terrible waste indeed and thanks to you, Peter will go to jail.  He didn't just kill a lovely hard working woman, but his own unborn child.  Annie had always had a soft spot for Peter, he was well dressed and charming.  With all the late nights at the house with Angela at work, one night, Peter made a move on Annie and she didn't turn him down.\n\nTwo months later, Annie had been at the house and had stayed a little too long, Angela was due home any minute so she hurriedly picked up her bag and rushed home.  As she ran out the door, a letter fell out of her bag but she didn't notice.  Peter recognised the Nuffield Health branding from his wife's job and picked it up.  When he saw the word "ultrasound" written on the letter, Peter freaked out, he didn't know what to do.\n\nIn the morning, Peter waited around to confront her but when she was late, he couldn't wait any longer.  And as he drove to work, he just kept imagining Annie bumping into his wife, that she would find out, the kids would find out, he'd be a scandal at work and everything would fall apart.  All of a sudden, the walls felt like they were closing in fast.  And then as he approached the corner, he saw Annie step out to cross the road and in a split second, instead of hitting the brakes, he intentionally hit the accelerator.`,
                    "required": false
                }
            ]
        }
    ],
    "locations": [
        {
            "id": "1d7e0c4a-5b3f-4a8c-8d12-3e4f5a6b7c8d",
            "lat": 50.7249475,
            "lng": -1.8761684,
            "name": "Scene of the Crime",
            "index": 0
        },
        {
            "id": "2e8f1d5b-6c4a-4b9d-9e23-4f5a6b7c8d9e",
            "lat": 50.7265142,
            "lng": -1.8780528,
            "name": "Annie's House",
            "index": 1
        },
        {
            "id": "3f902e6c-7d5b-4cae-af34-5a6b7c8d9e0f",
            "lat": 50.7271073,
            "lng": -1.8823479,
            "name": "Meyrick Park Cafe",
            "index": 2
        },
        {
            "id": "40a13f7d-8e6c-4dbf-b045-6b7c8d9e0f1a",
            "lat": 50.7208604,
            "lng": -1.8841118,
            "name": "Pure Gym",
            "index": 3
        },
        {
            "id": "51b24f8e-9f7d-4ec0-8156-7c8d9e0f1a2b",
            "lat": 50.72069671483636,
            "lng": -1.8848280348040047,
            "name": "The Library",
            "index": 4
        },
        {
            "id": "62c35a9f-af8d-4e1f-a156-8d9e0f1a2b3c",
            "lat": 50.720542960091954,
            "lng": -1.8845902351446644,
            "name": "Flirt Cafe",
            "index": 5
        }
    ]
};

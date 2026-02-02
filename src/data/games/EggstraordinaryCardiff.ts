import { Trail } from '../../types/index';

export const EggstraordinaryCardiff: Trail = {
  "type": "WALK",
  "ownerId": null,
  "ageSuitability": "Family",
  "attributes": [],
  "ref": "the-eggstraordinary-case-of-the-missing-eggs",
  "name": "The Eggstraordinary Case of the Missing Eggs",
  "content_pack": false,
  "energy_expires": 0,
  "price": 0,
  "tester": false,
  "isValidating": false,
  "isFree": true,
  "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunny.png",
  "description": `Dear Parents,

Are you ready for an egg-citing Easter experience filled with mystery, fun, and adventure? Join us on a captivating journey through stunning park scenery, where every step brings a new challenge and excitement awaits around every corner!

Embark on a quest with Detective Fergus Dunce, the most enthusiastic (if slightly clueless) detective in town, as he transforms traditional Easter Egg hunts into thrilling detective missions. ðŸ•µï¸â€â™‚ï¸ðŸ¥š Get ready to put your problem-solving skills to the test as you uncover hidden eggs, each containing a tricky question or riddle waiting to be solved.

As you follow Fergus out of the city centre, past majestic castles ðŸ°âœ¨ and on to lush open grass areas, enchanting blossom trees and vibrant flower gardens. You'll also discover ancient stone circles, where mysteries of the past whisper secrets to those who listen, and stumble upon musical instruments waiting to be played in harmony with nature's symphony.

And for the little adventurers seeking an extra thrill, challenge yourselves on adventure courses designed to test your agility and courage, adding an adrenaline-pumping twist to your Easter escapade.

Don't miss outâ€”let's make this Easter a truly unforgettable experience for the whole family. ðŸ£ðŸŒ³</p>`,
  "start_node_caption": "Ready? Let's go!",
  "items": [
    {
      "key": "egg-1",
      "name": "Egg 1",
      "image_url": "1.png",
      "thumb_url": "1_thumb.png"
    },
    {
      "key": "egg-2",
      "name": "Egg 2",
      "image_url": "2.png",
      "thumb_url": "2_thumb.png"
    },
    {
      "key": "egg-3",
      "name": "Egg 3",
      "image_url": "3.png",
      "thumb_url": "3_thumb.png"
    },
    {
      "key": "egg-4",
      "name": "Egg 4",
      "image_url": "4.png",
      "thumb_url": "4_thumb.png"
    },
    {
      "key": "egg-5",
      "name": "Egg 5",
      "image_url": "5.png",
      "thumb_url": "5_thumb.png"
    },
    {
      "key": "egg-6",
      "name": "Egg 6",
      "image_url": "6.png",
      "thumb_url": "6_thumb.png"
    },
    {
      "key": "egg-7",
      "name": "Egg 7",
      "image_url": "7.png",
      "thumb_url": "7_thumb.png"
    },
    {
      "key": "egg-8",
      "name": "Egg 8",
      "image_url": "8.png",
      "thumb_url": "8_thumb.png"
    },
    {
      "key": "egg-9",
      "name": "Egg 9",
      "image_url": "9.png",
      "thumb_url": "9_thumb.png"
    },
    {
      "key": "egg-10",
      "name": "Egg 10",
      "image_url": "10.png",
      "thumb_url": "10_thumb.png"
    }
  ],
  "steps": [
    {
      "index": 0,
      "locationId": "219c8dcf-cfcb-4feb-a0f3-fb76dd331d34",
      "name": "Start",
      "can_revisit": false,
      "trackingEnabled": true,
      "on_search": {
        "proximity_radius": 30
      },
      "tasks": [
        {
          "id": 0,
          "type": "information",
          "content": `Hey Storyteller!

A little bit of house keeping before we start. Any time you see the story book picture above, this is a message from us at Twimp to you the Story teller, they're not intended to be read out to participating children.

Safety is obviously paramount, the real world has real dangers. Whilst this is an app and will require your attention from time to time, you don't need to look at your device the whole time, in fact we encourage you not to.

Any time there's a predictable danger that our creators noticed whilst creating the story, we will use these Storyteller screens to let you know but we can't predict everything so please remain vigilant throughout.

To assist those who may have parked in St David's or John Lewis, the trail has been designed to loop you back here.

Right, let's get on with the story shall we, over to you Easter Bunny.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/storybook.png"
        },
        {
          "id": 1,
          "type": "information",
          "content": `Oh goodness, thank you so much for coming!!



Last night someone took a whole bunch of my eggs! Easter Egg hunts are about to start so I need to replace them but we need to find out where they are, and fast! I don't have time to explain right now but you need to get to the digitiser, we only have 20 minutes left.



Oh right, you don't know what the digitiser looks like, I'll put on your map.



Please hurry!

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunny.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/thanksforcoming.mp3"
        },
        {
          "type": "map",
          "content": `Ready to go?`,
          "markers": [
            "8eb7c819-a780-48f6-b5b0-245f85d6e742"
          ]
        }
      ]
    },
    {
      "index": 1,
      "locationId": "8eb7c819-a780-48f6-b5b0-245f85d6e742",
      "name": "John Batchelor Statue",
      "can_revisit": false,
      "trackingEnabled": true,
      "on_search": {
        "proximity_radius": 30,
        "path_regex": "0$"
      },
      "tasks": [
        {
          "id": 100,
          "type": "information",
          "content": `Ahh well done, we've got a little time left. Let me explain.

Have you ever wondered why Easter Egg hunts that I've set out aren't completely melted by the time that you go out to find them? Well, I have a little secret, they're digitised! Sometimes I set out the Easter Egg Hunts the night before, I place the eggs down, digitise them in place and then set a timer. And when that timer goes off, they turn back into chocolate, just in time for your hunt! Clever huh!?

Well I set out a whole bunch last night and by this morning, they were gone, someone stole them! In a few minutes they will turn back into chocolate and then they'll be gone for good. I need to find out who is doing this and stop them before they ruin any more Easter Egg Hunts.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunny.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/iwillexplain.mp3"
        },
        {
          "id": 101,
          "type": "information",
          "content": `You probably don't know this but magical creatures like me use statues and sculptures for all sorts of things.&nbsp;For example, any statue of a mythical creature is actually hooked up to the MCP (that's the Magical Creature Police), it's their version of CCTV and it keeps an eye out for magical creatures out in public places.&nbsp;One time, we had a problem with The Grinch interfering with Easter in Bristol but that's another story.

Anyway, inside this one is a digitiser. It's used in emergencies like this one where something is due to appear where it shouldn't, when it shouldn't. If you activate it, it will send out a signal to any digitised items in the city. When the signal bounces back, we will also know roughly where the eggs are and we can go collect them.

I just need to enter the 4 digit pin to activate it. I can't remember what the code is but you should be able to see it from where you are, usually up high and if there is more than one option, check the statue, it's probably looking at it or pointing towards it.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunny.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/statuesandsculptures.mp3"
        },
        {
          "id": 102,
          "type": "question_multiple",
          "content": `What is the 4 digit pin?`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunnydetermined.png",
          "on_answer": ["tally"],
          "options": [
            {
              "index": 0,
              "content": `1899`,
              "response": {
                "title": "Incorrect",
                "subtitle": "Thought you had it that time",
                "sentiment": "negative"
              }
            },
            {
              "index": 1,
              "content": `1820`,
              "response": {
                "title": "Incorrect",
                "subtitle": "Look above the statue",
                "sentiment": "negative"
              }
            },
            {
              "index": 2,
              "content": `1912`,
              "response": {
                "title": "Correct!",
                "sentiment": "positive",
                "actions": ["go_to_204"]
              }
            },
            {
              "index": 3,
              "content": `1883`,
              "response": {
                "title": "Incorrect",
                "subtitle": "Look above the statue",
                "sentiment": "negative"
              }
            }
          ]
        },
        {
          "id": 103,
          "type": "information",
          "content": `Great, that worked. I'm logged in.

OK, now I need to select how long to extend the timer. I'm afraid I'm not very good at maths, I'll show you the options, try and pick the one that gives us the most time.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunnydetermined.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/loggedin.mp3"
        },
        {
          "id": 104,
          "type": "question_multiple",
          "content": `Which gives us the most time?`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunnydetermined.png",
          "options": [
            {
              "index": 0,
              "content": `Four and a half hours`,
              "response": {
                "title": "Close",
                "subtitle": "0.2 days was an extra 18 minutes",
                "sentiment": "positive"
              }
            },
            {
              "index": 1,
              "content": `0.2 days`,
              "response": {
                "title": "Correct!",
                "sentiment": "positive"
              }
            },
            {
              "index": 2,
              "content": `3.75 hours`,
              "response": {
                "title": "Incorrect",
                "sentiment": "negative"
              }
            },
            {
              "index": 3,
              "content": `260 minutes`,
              "response": {
                "title": "Incorrect",
                "sentiment": "negative"
              }
            }
          ]
        },
        {
          "id": 105,
          "type": "information",
          "content": `OK, the signal is sending out now. Yes, it's working! Great job!

That should give us enough time to get them all.

Hmmm but that's odd.&nbsp;I was expecting them to be all stashed together but they're all spaced out in some sort of line!! Why would that be?&nbsp;It's as if someone is making their own Easter Egg trail, but who is it for?

Something is going on here and I don't like it.&nbsp;I'm going to pop back to where my eggs were stolen and see if I can find some clues of my own. I've put a pin on your map where the nearest egg should be, speak to you when you get there.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunnydetermined.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/signalsending.mp3"
        },
        {
          "id": 106,
          "type": "information",
          "content": `Easter Bunny could be a while.

Up ahead is the Cardiff Story Museum, they often have use for smart detectives like yourselves.

Feel free to pop in for a bit and then head to the castle when you're ready.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/cardiffstorymuseum.png"
        },
        {
          "type": "map",
          "content": `Ready to go?`,
          "markers": [
            "3bf6c172-4d0d-4eb0-bf0b-6775d517c00d"
          ]
        }
      ]
    },
    {
      "index": 2,
      "locationId": "3bf6c172-4d0d-4eb0-bf0b-6775d517c00d",
      "name": "Castle",
      "can_revisit": false,
      "trackingEnabled": true,
      "on_search": {
        "proximity_radius": 30,
        "path_regex": "\\|1"
      },
      "tasks": [
        {
          "id": 200,
          "type": "information",
          "content": `OK, I'm afraid the situation is even worse than I thought. Like disappointing children wasn't bad enough, it seems the eggs are placed all around Bute Park and that means little doggies on their walks might find them. We can't let that happen!! Chocolate is poisonous for doggies, it can make them very very sick!

I also found something else.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunny.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/doggies.mp3"
        },
        {
          "id": 201,
          "type": "information",
          "content": `I've made a discovery, right next to where I placed a few of my eggs I found a footprint, well a paw print actually.  It's unmistakably from a fox. I'm a bunny, I know these things.



I asked some of my cousins who live nearby and they said they saw a fox there just this morning, probably looking for more of my eggs!



And that's not all, I also found one muddy purple glove and there's only one fox that I know of that wears purple gloves like these - none other than Detective Fergus Dunce!

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/foot_print.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/pawprint.mp3"
        },
        {
          "id": 202,
          "type": "information",
          "content": `Well he thinks he's a detective, I've never met him but recently he accused Farmer Brown of stealing his neighbour's prize-winning cow, Clover, but it turned out she was just taking a spa day at the local mud bath, a Moo-thers Day treat to herself! He hasn't been able to live that one down, now everyone calls him Defective Dunce.

So we know who it is but we still don't know why or who the trail is for. Either way, with the eggs digitised, they're safe for now. Let's go get them back.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/fergus.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/defectivedunce.mp3"
        },
        {
          "id": 203,
          "type": "information",
          "content": `The first one should be right by the castle gate. I've activated the scanner, you just need to press Next and boom, we should have our first egg.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunnydetermined.png"
        },
        {
          "id": 204,
          "type": "information",
          "content": `Error!! WHAT!? It's not working, he seems to have put a lock on it somehow!?!?

It's a question, I'll send it over...

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunny.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/locked.mp3"
        },
        {
          "id": 205,
          "type": "question_single",
          "content": `A Welsh welcome`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/castlefront.png",
          "options": [
            {
              "index": 0,
              "content": `Croeso`,
              "response": {
                "title": "Correct!",
                "sentiment": "positive"
              }
            }
          ]
        },
        {
          "id": 206,
          "type": "information",
          "content": `Excellent work! Well done, we've got our first egg.

Clearly collecting the eggs might be trickier than I first thought. I'm detecting another egg nearby, head towards the pin on your map.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/1.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/firstegg.mp3"
        },
        {
          "type": "map",
          "content": `Ready to go?`,
          "markers": [
            "f5bd08a0-6d75-465e-a563-7918f924cc23"
          ]
        }
      ]
    },
    {
      "index": 3,
      "locationId": "f5bd08a0-6d75-465e-a563-7918f924cc23",
      "name": "Inside Cardiff Castle",
      "can_revisit": false,
      "trackingEnabled": true,
      "on_search": {
        "proximity_radius": 30,
        "path_regex": "\\|2"
      },
      "tasks": [
        {
          "id": 300,
          "type": "information",
          "content": `Uhoh, this one is locked too, I'll send it over.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunny.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/locked2.mp3"
        },
        {
          "id": 301,
          "type": "question_multiple",
          "content": `A French sounding weapon`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/castleinside.png",
          "options": [
            {
              "index": 0,
              "content": `Bec de corbin`,
              "response": {
                "title": "Incorrect",
                "sentiment": "negative"
              }
            },
            {
              "index": 1,
              "content": `Goeland`,
              "response": {
                "title": "Definitely not that one",
                "subtitle": "That means seagull",
                "sentiment": "negative"
              }
            },
            {
              "index": 2,
              "content": `Trebuchet`,
              "response": {
                "title": "Correct!",
                "sentiment": "positive"
              }
            },
            {
              "index": 3,
              "content": `Bardiche`,
              "response": {
                "title": "Incorrect",
                "sentiment": "negative"
              }
            }
          ]
        },
        {
          "id": 302,
          "type": "information",
          "content": `Wow, you're really good at this! I would be lost without you!

OK. two eggs and... oh wait... what's this?

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/3.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/twoeggs.mp3"
        },
        {
          "id": 303,
          "type": "information",
          "content": `These two numbers were digitised along with the egg!

How strange! What does it mean?!!?

Well we don't have time to find out, we need to keep collecting the eggs, I'm putting the next location on your map.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/code1.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/numbersdigitsed.mp3"
        },
        {
          "type": "map",
          "content": `Ready to go?`,
          "markers": [
            "ae05ddfa-28e5-4312-b253-14ec62084fa1"
          ]
        }
      ]
    },
    {
      "index": 4,
      "locationId": "ae05ddfa-28e5-4312-b253-14ec62084fa1",
      "name": "Bridge",
      "can_revisit": false,
      "trackingEnabled": true,
      "on_search": {
        "proximity_radius": 30,
        "path_regex": "\\|3"
      },
      "tasks": [
        {
          "id": 400,
          "type": "question_multiple",
          "content": `What is the name of this bridge?`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/bridge.png",
          "options": [
            {
              "index": 0,
              "content": `Lady Bute's Bridge`,
              "response": {
                "title": "Correct!",
                "sentiment": "positive"
              }
            },
            {
              "index": 1,
              "content": `Millennium Bridge`,
              "response": {
                "title": "Incorrect",
                "sentiment": "negative"
              }
            },
            {
              "index": 2,
              "content": `Blackweir Bridge`,
              "response": {
                "title": "Incorrect",
                "sentiment": "negative"
              }
            },
            {
              "index": 3,
              "content": `The Swiss Bridge`,
              "response": {
                "title": "Incorrect",
                "sentiment": "negative"
              }
            }
          ]
        },
        {
          "id": 401,
          "type": "information",
          "content": `Amazing!!!! Another egg.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/3.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/anotheregg.mp3"
        },
        {
          "id": 402,
          "type": "information",
          "content": `Oh and another one of these number things!

I'm starting to get the impression that these might be important somehow. I'm going to keep a note of them and we can look at them later. You can also view them in your journal.

After the bridge, turn left and head towards the next pin.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/code2.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/anothernumber.mp3"
        },
        {
          "id": 403,
          "type": "information",
          "content": `Hey Storyteller!

Just to let you know, coming up after this next egg is a musical walk and then the woodland play trail which could involve lots of climbing on things, balancing and general physical activity.

There will be a built-in opportunity for a break after that.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/storybook.png"
        },
        {
          "type": "map",
          "content": `Ready to go?`,
          "markers": [
            "fa1e18c2-8700-432a-b696-16314853b3f2"
          ]
        }
      ]
    },
    {
      "index": 5,
      "locationId": "fa1e18c2-8700-432a-b696-16314853b3f2",
      "name": "Tree Charter",
      "can_revisit": false,
      "trackingEnabled": true,
      "on_search": {
        "proximity_radius": 30,
        "path_regex": "\\|4"
      },
      "tasks": [
        {
          "id": 500,
          "type": "question_single",
          "content": `We are the words in your _____?`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/stonecircle.png",
          "options": [
            {
              "index": 0,
              "content": `lungs`,
              "response": {
                "title": "Correct!",
                "sentiment": "positive"
              }
            }
          ],
          "hint": "Charter of Trees"
        },
        {
          "id": 501,
          "type": "information",
          "content": `You know what this is? This is a great eggsample of team work!

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/4.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/eggsample.mp3"
        },
        {
          "id": 502,
          "type": "information",
          "content": `And some more numbers!?

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/code3.png"
        },
        {
          "type": "map",
          "content": `Ready to go?`,
          "markers": [
            "3ddd9079-c261-4b8c-9e92-12c67543540b"
          ]
        }
      ]
    },
    {
      "index": 6,
      "locationId": "3ddd9079-c261-4b8c-9e92-12c67543540b",
      "name": "Woodland Trail",
      "can_revisit": false,
      "trackingEnabled": true,
      "on_search": {
        "proximity_radius": 30,
        "path_regex": "\\|5"
      },
      "tasks": [
        {
          "id": 600,
          "type": "question_multiple",
          "content": `Simba's friend?`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/woodlandtrail.png",
          "options": [
            {
              "index": 0,
              "content": `Nala`,
              "response": {
                "title": "Not this one",
                "sentiment": "negative"
              }
            },
            {
              "index": 1,
              "content": `Pumba`,
              "response": {
                "title": "Correct!",
                "sentiment": "positive"
              }
            },
            {
              "index": 2,
              "content": `Scar`,
              "response": {
                "title": "I said friend!",
                "sentiment": "negative"
              }
            },
            {
              "index": 3,
              "content": `Rafiki`,
              "response": {
                "title": "Not this one",
                "sentiment": "negative"
              }
            }
          ]
        },
        {
          "id": 601,
          "type": "information",
          "content": `And another one in the bag!

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/5.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/anotheroneinthebag.mp3"
        },
        {
          "id": 602,
          "type": "information",
          "content": `There's always an orange one and a purple one, do you think that matters?

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/code4.png"
        },
        {
          "id": 603,
          "type": "information",
          "content": `I'm so excited!! We are doing super well.

The next one is a little strange though. It seems to be near the Millennium Bridge but I'm not getting a clear location.

I'm going to check my scanner. If you need a drink or a snack, now is probably a good time, you should find that there is a cafe just by the bridge.

When you're ready, I'll meet you at the centre of the bridge and we will go from there.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunnyhappy.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/eggsitednobacking.mp3"
        },
        {
          "type": "map",
          "content": `Ready to go?`,
          "markers": [
            "c07d5963-24bf-4c50-8dd4-90bb5ded270a"
          ]
        }
      ]
    },
    {
      "index": 7,
      "locationId": "c07d5963-24bf-4c50-8dd4-90bb5ded270a",
      "name": "Millennium Bridge",
      "can_revisit": false,
      "trackingEnabled": true,
      "on_search": {
        "proximity_radius": 30,
        "path_regex": "\\|6"
      },
      "tasks": [
        {
          "id": 700,
          "type": "information",
          "content": `This one is super strange, the signal keeps dropping out.



It seems to be working now though, here's the question.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunnydetermined.png"
        },
        {
          "id": 701,
          "type": "question_single",
          "content": `Name of this river`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/millennium.png",
          "options": [
            {
              "index": 0,
              "content": `Taff`,
              "response": {
                "title": "Correct!",
                "sentiment": "positive"
              }
            }
          ],
          "hint": "If only we had a map!"
        },
        {
          "id": 702,
          "type": "information",
          "content": `Ummm.... problem.

The egg has moved! To collect the egg we have to be within a few metres but it's just out of range, I can't pick it up!!! How?

OK, cross to the other side of the bridge, I'll keep a track of it.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunny.png"
        },
        {
          "id": 703,
          "type": "information",
          "content": `Storytellers! Sorry to interrupt the immersion but safety first so we need your help with this part.



We're going to follow the path on the other side of the bridge, south (left) all the way to Cardiff Bridge, about 200 metres away.

Just before you get to the bridge, there is a path that gets a bit closer to the river, from where you are, it's on the opposite side of the jetty. This is where we will collect the egg from.

Also, please note that just beyond the bridge is a main road.

Here are a couple of suggestions as to how the next part of the story goes.

1) The egg has dropped in the river and is floating away, you all need to run to the end of the path and get there before the egg goes under the bridge and is lost for good.

2) The egg is meandering slowly down the river, you keep checking whether you are close enough but you are just out of reach. And then luckily just as you get to the bridge, it floats into range... phew!!!

What we do not want is anyone trying to climb down the river bank or running dangerously into roads or car parks etc so please make an appropriate choice for your team.

When you do arrive at the bridge, the range is set wide enough so you can safely collect the egg from the path or the bridge if you prefer.

Over to you Storyteller, see you at the bridge.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/storybook.png"
        },
        {
          "type": "map",
          "content": `Ready to go?`,
          "markers": [
            "b3c0f2d0-e417-4711-a081-27b0dfccef63"
          ]
        }
      ]
    },
    {
      "index": 8,
      "locationId": "b3c0f2d0-e417-4711-a081-27b0dfccef63",
      "name": "Cardiff Bridge",
      "can_revisit": false,
      "trackingEnabled": true,
      "on_search": {
        "proximity_radius": 30,
        "path_regex": "\\|7"
      },
      "tasks": [
        {
          "id": 800,
          "type": "information",
          "content": `We got it!! Great job.

Well that took some additional effort didn't it! On the plus side, we're pretty close to the next one. Walk across Cardiff Bridge, make sure to take good care though, it's a main road.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/7.png"
        },
        {
          "id": 801,
          "type": "information",
          "content": `Have you noticed that each orange number is bigger than the last one, same for the purple numbers too.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/code5.png"
        },
        {
          "type": "map",
          "content": `Ready to go?`,
          "markers": [
            "64f60a74-967a-452f-a726-92b1c3c834e6"
          ]
        }
      ]
    },
    {
      "index": 9,
      "locationId": "64f60a74-967a-452f-a726-92b1c3c834e6",
      "name": "Animal Wall",
      "can_revisit": false,
      "trackingEnabled": true,
      "on_search": {
        "proximity_radius": 30,
        "path_regex": "\\|8"
      },
      "tasks": [
        {
          "id": 900,
          "type": "question_single",
          "content": `ALEGE`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/animalwall.png",
          "options": [
            {
              "index": 0,
              "content": `eagle`,
              "response": {
                "title": "Correct!",
                "sentiment": "positive"
              }
            }
          ],
          "hint": "Maybe the letters are jumbled?"
        },
        {
          "id": 901,
          "type": "information",
          "content": `Awesome!! We just need one more.

Follow the road back down towards the castle, see what other animals you can find on the wall. Our last egg should be right at the end.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/8.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/justneedonemore.mp3"
        },
        {
          "id": 902,
          "type": "information",
          "content": `And of course, another number!  I'm hoping these are going to make sense at some point.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/code6.png"
        },
        {
          "type": "map",
          "content": `Ready to go?`,
          "markers": [
            "c369985b-0012-49f9-aeb2-d14859592205"
          ]
        }
      ]
    },
    {
      "index": 10,
      "locationId": "c369985b-0012-49f9-aeb2-d14859592205",
      "name": "End of Animal Wall",
      "can_revisit": false,
      "trackingEnabled": true,
      "on_search": {
        "proximity_radius": 30,
        "path_regex": "\\|9"
      },
      "tasks": [
        {
          "id": 1000,
          "type": "information",
          "content": `Oh no, what's happening now?

It's disappeared, no, it's moved. No correction it's moving, what is going on!?

I'm so sorry guys, I know you must be getting tired by now. Up ahead, by the castle entrance is a pedestrian crossing, use that to safely cross over to the High Street, it's gone that way. Maybe Fergus knows we are on to him and he's trying to run off with the last one? You should all stay together!

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunny.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/itsdisappeared.mp3"
        },
        {
          "id": 1001,
          "type": "information",
          "content": `Storyteller, we have reached the end of our trail, albeit not the end of the story.

The last egg will appear as soon as you hit \"Next\" but before you do that....

You probably want to take a well earned break at this point, maybe even grab some food. The High Street leads to St Mary's Street and both have ample options.

You can go all the way down past Tesco Express, McDonalds and Subway but the left turn of Caroline Street is the last one that would return you back toward St David's where you started.

So we recommend you had into town and then when you get somewhere you want to stop, click Next.

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/storybook.png"
        },
        {
          "id": 1002,
          "type": "information",
          "content": `Look, it's right here! It's not even locked this time. He must have dropped it and escaped.

Oh my goodness, you did it!! You got them all back.

I'm so so happy, thank you so much for your help.



Go celebrate your victory, I'm going to put these digital eggs somewhere safe, I'll check in with you soon.





`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/9.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/complete.mp3"
        },
        {
          "type": "map",
          "content": `Ready to go?`,
          "markers": [
            "12bcbbcd-de61-425d-9226-186764dc799f"
          ]
        }
      ]
    },
    {
      "index": 11,
      "locationId": "12bcbbcd-de61-425d-9226-186764dc799f",
      "name": "St Marys Street",
      "can_revisit": false,
      "trackingEnabled": true,
      "on_search": {
        "proximity_radius": 200,
        "path_regex": "\\|10"
      },
      "tasks": [
        {
          "id": 1100,
          "type": "information",
          "content": `Hey guys!

Something has just appeared on my scanner. I don't think it's one of my eggs though, I don't know what it is.

I realised we still don't know what all those numbers were about. Do you think maybe it's related? Should we check it out?

`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/easterbunny.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/checkitout.mp3"
        },
        {
          "type": "map",
          "content": `Ready to go?`,
          "markers": [
            "219c8dcf-cfcb-4feb-a0f3-fb76dd331d34"
          ]
        }
      ]
    },
    {
      "index": 12,
      "locationId": "219c8dcf-cfcb-4feb-a0f3-fb76dd331d34",
      "name": "Alliance",
      "can_revisit": false,
      "trackingEnabled": true,
      "on_search": {
        "proximity_radius": 30,
        "path_regex": "\\|11"
      },
      "tasks": [
        {
          "id": 1200,
          "type": "information",
          "content": `Hmmm... it's just this picture.  Strange.

OK I've already notified the MCP as if Fergus has actually been stealing my eggs, he needs to be stopped. So far, not a peep, no one has seen anything.

I'm afraid I have a lot more Easter Egg Hunts to deliver so I have to go now but if you figure out what any of this means, do let me know OK.  You can email me at eb@twimp.app.

Click next to finish.`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/alliance.png",
          "audio_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/emailme.mp3"
        },
        {
          "id": 1201,
          "type": "finish",
          "content": `Email your theories to eb@twimp.app

Orange numbers:
5 - 75 - 83 - 86 - 105 - 107

Purple numbers:
39 - 43 - 45 - 120 - 171 - 185

The first 10 families to solve this will receive an exciting Easter surprise.  Will that be you? Good luck.`,
          "image_url": "https://trail-images.s3.eu-west-2.amazonaws.com/the-eggstraordinary-case-of-the-missing-eggs/alliance.png"
        }
      ]
    }
  ],
  "locations": [
    {
      "index": 0,
      "id": "219c8dcf-cfcb-4feb-a0f3-fb76dd331d34",
      "lat": 51.478000491265995,
      "lng": -3.175447695988718,
      "name": "Alliance"
    },
    {
      "index": 1,
      "id": "8eb7c819-a780-48f6-b5b0-245f85d6e742",
      "lat": 51.47955823416932,
      "lng": -3.1764638997622874,
      "name": "John Batchelor Statue"
    },
    {
      "index": 2,
      "id": "3bf6c172-4d0d-4eb0-bf0b-6775d517c00d",
      "lat": 51.48139300390212,
      "lng": -3.1806853325726414,
      "name": "Castle"
    },
    {
      "index": 3,
      "id": "f5bd08a0-6d75-465e-a563-7918f924cc23",
      "lat": 51.48208456645572,
      "lng": -3.1810286553265477,
      "name": "Inside Cardiff Castle"
    },
    {
      "index": 4,
      "id": "ae05ddfa-28e5-4312-b253-14ec62084fa1",
      "lat": 51.48327114737055,
      "lng": -3.183124764442846,
      "name": "Bridge"
    },
    {
      "index": 5,
      "id": "fa1e18c2-8700-432a-b696-16314853b3f2",
      "lat": 51.48214602880495,
      "lng": -3.184775314052435,
      "name": "Gorsedd Stone Circle"
    },
    {
      "index": 6,
      "id": "3ddd9079-c261-4b8c-9e92-12c67543540b",
      "lat": 51.48516368378484,
      "lng": -3.1864037853479066,
      "name": "Woodland Trail"
    },
    {
      "index": 7,
      "id": "c07d5963-24bf-4c50-8dd4-90bb5ded270a",
      "lat": 51.48412272472248,
      "lng": -3.1881578548200373,
      "name": "Millennium Bridge"
    },
    {
      "index": 8,
      "id": "b3c0f2d0-e417-4711-a081-27b0dfccef63",
      "lat": 51.48115218487723,
      "lng": -3.186236790142163,
      "name": "Cardiff Bridge"
    },
    {
      "index": 9,
      "id": "64f60a74-967a-452f-a726-92b1c3c834e6",
      "lat": 51.48111438807867,
      "lng": -3.183300441824768,
      "name": "Animal Wall"
    },
    {
      "index": 10,
      "id": "c369985b-0012-49f9-aeb2-d14859592205",
      "lat": 51.48117118185351,
      "lng": -3.1818359557026366,
      "name": "End of Animal Wall"
    },
    {
      "index": 11,
      "id": "12bcbbcd-de61-425d-9226-186764dc799f",
      "lat": 51.479222441321305,
      "lng": -3.1785758543618914,
      "name": "St Marys Street"
    }
  ]
}

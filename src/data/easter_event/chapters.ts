import { StoryChapter } from '../../types/EasterEventTypes';

// Story chapters for the Easter Event
// Adapted from "The Eggstraordinary Case of the Missing Eggs"
// Now a nationwide event where the Easter Bunny recruits children everywhere

export const STORY_CHAPTERS: StoryChapter[] = [
    {
        id: 1,
        title: "The Ransacking",
        dayOffset: 0,  // Day 1 - Available from start
        scenes: [
            {
                id: "ch1_s1",
                character: "easter_bunny",
                characterImage: "easterbunny.png",
                emotion: "worried",
                narration: `Oh goodness, thank you so much for coming!

Last night, something terrible happened. Someone broke into my warehouse and took ALL of my Easter eggs! Every single one of them!

Easter Egg hunts are about to start all over the country and I have nothing to give the children!`
            },
            {
                id: "ch1_s2",
                character: "easter_bunny",
                characterImage: "easterbunny.png",
                emotion: "worried",
                narration: `You probably don't know this, but my eggs are special. They're digitised!

That means I can place them anywhere and they won't melt until the timer goes off. It's how I set up Easter Egg hunts the night before without the chocolate going bad.

But now someone has stolen them all, and if I don't get them back before the timers expire, they'll turn into chocolate and be gone forever!`
            },
            {
                id: "ch1_s3",
                character: "easter_bunny",
                characterImage: "easterbunnydetermined.png",
                emotion: "determined",
                narration: `I've managed to track some of the eggs - they've been scattered all over the country!

Some are in safe places like parks and neighbourhoods, but others are in dangerous locations where children shouldn't go.

I need YOUR help! Can you collect the eggs that are in safe areas near you while I go after the dangerous ones?`
            },
            {
                id: "ch1_s4",
                character: "easter_bunny",
                characterImage: "easterbunnydetermined.png",
                emotion: "determined",
                narration: `Here's the strange thing - whoever took my eggs has put questions on them! You'll need to answer a question to collect each egg.

I don't know why they've done this, but we don't have time to figure it out now. Will you help me save Easter?

Go out with a grown-up, stay safe, and collect as many eggs as you can! I'll be in touch with updates.`
            }
        ]
    },
    {
        id: 2,
        title: "The Purple Glove",
        dayOffset: 3,  // Day 4
        scenes: [
            {
                id: "ch2_s1",
                character: "easter_bunny",
                characterImage: "easterbunny.png",
                emotion: "default",
                narration: `I've made a discovery! I went back to the warehouse to look for clues, and guess what I found?

Right next to where I stored my eggs, there was a footprint... well, a paw print actually. It's unmistakably from a fox. I'm a bunny, I know these things!`
            },
            {
                id: "ch2_s2",
                character: "easter_bunny",
                characterImage: "easterbunny.png",
                emotion: "default",
                narration: `And that's not all! I also found one muddy purple glove nearby.

There's only one fox I know of that wears purple gloves like these - Detective Fergus Dunce!`
            },
            {
                id: "ch2_s3",
                character: "narrator",
                narration: `Detective Fergus Dunce... well, he THINKS he's a detective.

He once accused Farmer Brown of stealing his neighbour's prize-winning cow, Clover. But it turned out she was just taking a spa day at the local mud bath - a Moo-thers Day treat to herself!

Ever since, everyone calls him "Defective Dunce."`
            },
            {
                id: "ch2_s4",
                character: "easter_bunny",
                characterImage: "easterbunny.png",
                emotion: "worried",
                narration: `Children from all over the country have been reporting something strange about the eggs they're collecting.

Each egg seems to have a symbol on it - like a secret code! I don't know what they mean yet, but I'm keeping track of them.

Keep collecting eggs and let's see if we can figure out what's going on!`
            }
        ]
    },
    {
        id: 3,
        title: "The Recipe Mystery",
        dayOffset: 5,  // Day 6
        scenes: [
            {
                id: "ch3_s1",
                character: "easter_bunny",
                characterImage: "easterbunnyhappy.png",
                emotion: "happy",
                narration: `Amazing news! Thanks to all the children helping out, we've collected thousands of eggs!

And we've figured something out about those symbols - they're LETTERS! Each symbol represents a letter of the alphabet!

Check your Codex to see which letters you've unlocked.`
            },
            {
                id: "ch3_s2",
                character: "easter_bunny",
                characterImage: "easterbunny.png",
                emotion: "default",
                narration: `But here's where it gets really strange...

The clues we've been finding seem to spell out INGREDIENTS. Like for a recipe! Flour, butter, eggs...

Someone isn't just stealing my Easter eggs - they're trying to MAKE something!`
            },
            {
                id: "ch3_s3",
                character: "easter_bunny",
                characterImage: "easterbunnydetermined.png",
                emotion: "determined",
                narration: `But wait... if Detective Fergus Dunce is behind this, that doesn't make sense.

Anyone who's ever been invited to Fergus's house for dinner will tell you - he is a TERRIBLE cook! He once burned a salad!

So if he can't cook, why would he need recipe ingredients? Something doesn't add up here...`
            },
            {
                id: "ch3_s4",
                character: "easter_bunny",
                characterImage: "easterbunnydetermined.png",
                emotion: "determined",
                narration: `Keep collecting eggs and solving puzzles! The more of the Codex we unlock, the more of the clues we can read.

I have a feeling we're getting close to discovering who's REALLY behind all this...

Easter is almost here. We need to solve this mystery!`
            }
        ]
    }
];

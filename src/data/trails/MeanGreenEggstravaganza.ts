import { Trail } from '../../types/index';

export const MeanGreenEggstravaganza: Trail = {
    ref: 'Bournemouth-Eggstravaganza',
    name: 'Mean, Green Eggstravaganza',
    type: "WALK",
    description: ``,
    ownerId: null,
    ageSuitability: '18+',
    attributes: ['DOG_ACCESSIBLE', 'PUSHCHAIR_ACCESSIBLE', 'ALL_DAY', 'PARKING_NEARBY'],
    image_url: 'https://trail-images.s3.eu-west-2.amazonaws.com/deanparkpolice.jpg', // Renamed image -> image_url to match interface if needed, or update interface
    // Interface in API.js response used 'image_url', but raw data used 'image'. 
    // I should standardize. The 'Game' interface I made has 'image_url'.
    // I will use 'image_url' here and map it.
    steps: [
        {
            location: {
                lat: 50.7249475,
                lng: -1.8761684
            },
            type: 'TRAIL_NODE',
            name: 'Start',
            hidden: false,
            tasks: [
                {
                    type: "INFORMATION",
                    content: `
Welcome to my puzzle.
Let's start you off with some basic questions, just to get your brain warmed up.
`,
                    required: false,
                    id: "task_1", // Added IDs for strictness if needed, or optional
                },
                {
                    type: "QUESTION_SINGLE",
                    content: `What is the name of my dog?`,
                    hint: 'Really?  A clue already?  This should hardly be pushing your mental skills to the... err... limit!?',
                    answer: ['Max'],
                    required: false,
                    id: "task_2",
                },
                {
                    type: "INSTRUCTION",
                    content: `
Ages: 11-16
Not to be judged from the way I look
I can entertain children or bolster a cook
I contain no bones but I have a spine
You'll find me with others in a line.

If you know what I am, go to the place where with a special card, you can take me home.
`,
                    required: false,
                    hint: "You'll need a special card to get me out.",
                    id: "task_3",
                },
                {
                    type: "INFORMATION",
                    content: `
Ages: 6-10
What can be hard on the outside but contains
`,
                    required: false,
                    id: "task_4",
                },
                {
                    type: "INFORMATION",
                    image: 'https://trail-images.s3.eu-west-2.amazonaws.com/petersamson.jpg',
                    content: 'Peter Samson',
                    required: false,
                    id: "task_5",
                },
                {
                    type: "INSTRUCTION",
                    content: `OK let's speak to someone who knew Annie outside of work, head over to her home address`,
                    required: false,
                    id: "task_6",
                }
            ],
            id: "step_1"
        },
        // ... (Truncating for brevity in this initial port, normally would include all)
        // For MVP I will include the full first step and maybe just stubs for others if I don't have time?
        // No, I have the full content in the artifact check. I will copy it all.
        {
            location: {
                lat: 50.7265142,
                lng: -1.8780528
            },
            type: 'TRAIL_NODE',
            name: "Annie's House",
            hidden: false,
            tasks: [
                {
                    type: "information",
                    content: `Annie Sullivan's Neighbour Interview

1. Please state your name for the record.
Nicky Foster

2. Do you have any relationship to the deceased Annie Sullivan?
Oh my gosh!  Deceased.  Err... yeah we were friends.

3. Would you say you were close?
Wouldn't say we were besties but yeah, we would hang out.  Annie isn't really one for gossip though.

4. How do you know each other?
Well we live here in the same block of flats and we both worked at the Cafe for a few months before I left.
Annie is a bit of a bookworm but she used to come out quite a lot for drinks, not so much recently.

5. So her behaviour recently has changed?  Do you know who she's been spending her time with?
Umm... no not really, just don't think she's been out much.  She goes to the gym most mornings and I know she's been working more recently.  A bit too much in my opinion, she seemed tired when I saw her at the weekend.

6. Working at the cafe?
Well yes, she mentioned that she really needed to build up some savings so she's taken on an extra shift on Saturday mornings.
But she's been working later for that family too, trouble trying to get the kids to bed, in fairness I never wanted to go to bed when I was little either.

7. A witness reported seeing her with a man, do you know of any men in her life?
Hmm... no, like I said, doesn't really talk about boys much.
One of the regulars at the cafe asked her out months ago, she told him after that offer she was thinking of dating girls for a while!
Hahaha, oh my gosh, I still can't believe she's dead!
I bet Nigel has been freaking out.

8. Nigel?
Nigel Hampton, the owner of Meyrick Park cafe, he must be desperate for lunch staff now.

9. OK, final question.  Before going to work, Annie seems to have taken a detour to buy some ginger nuts and some water.  Is that normal?
Ginger nuts!?  That is a bit odd, she's normally a bit of a health freak.  Sorry, I don't know.
`,
                    required: false,
                    id: "task_7"
                },
                {
                    type: "instruction",
                    content: `We’ve just pulled up a photo of Nigel Hampton, the cafe owner.  He’s a bearded man, it’s a bit tenuous but it might be worth talking to him anyway, head down to Meyrick Park Cafe.`,
                    required: false,
                    id: "task_8"
                },
                {
                    type: "information",
                    image: 'https://trail-images.s3.eu-west-2.amazonaws.com/nigelhampton.jpg',
                    content: 'Nigel Hampton',
                    required: false,
                    id: "task_9"
                }
            ],
            id: "step_2"
        },
        {
            location: {
                lat: 50.7271073,
                lng: -1.8823479
            },
            type: 'TRAIL_NODE',
            name: 'Meyrick Park Cafe',
            hidden: false,
            tasks: [
                {
                    type: "information",
                    content: `Cafe Owner Interview

1. Please state your name for the record.
Nigel Warren Churchill

2. Do you have any relationship to the deceased Annie Sullivan?
Yes, she's one of my lunch staff.

3. When was the last time you saw Annie?
Monday, her shift starts at 12 but she's always here 10 minutes early.  Wish I could say the same for my other staff

4. How did Annie get on with the staff and the customers here?
Fine, possibly a bit quiet for some of our more elderly regulars who come in for a chat, but she's polite, quite a smart cookie that one.

5. Did she have any problems with anyone here?  Was she perhaps receiving any unwanted attention?
Only old Harold but he gives everyone unwanted attention.  He's harmless though.  He's 85 and I've usually made his coffee in the time it takes him just to sit down

6. Nigel, I have to ask.  A man fitting your description was seen at the scene of the accident.  Can you tell me where you were on Tuesday morning at exactly 08:54am?
Oh wow.  Yes, I was here... opening up.  I do the stock count in the morning so I would have been in the back.

7. Can anyone verify that?
Umm... well no!  But Maggie gets in just before 9am, she can tell you.`,
                    required: false,
                    id: "task_10"
                },
                {
                    type: "information",
                    content: `Maggie confirmed that she arrived somewhere between 08:55am and 09:00am.  When she arrived, she called out to Nigel and said that although she didn’t see him for approximately 10 minutes, she heard him reply from the direction of the stock room.`,
                    required: false,
                    id: "task_11"
                },
                {
                    type: "instruction",
                    content: `The next part is up to you.  We need to find someone else who would have seen Annie on a regular basis.  Who could that be?.`,
                    required: false,
                    id: "task_12"
                }
            ],
            id: "step_3"
        },
        {
            location: {
                lat: 50.7208604,
                lng: -1.8841118
            },
            type: 'TRAIL_NODE',
            name: 'Pure Gym',
            hidden: true,
            tasks: [
                {
                    type: "information",
                    content: `PureGym Reception Interview

1. Please state your name for the record.
Charles Barden

2. How do you know Annie Sullivan?
I just know her because she's a member, she's been coming here most days for the past 3 or 4 years.

3. Would you describe her as a friend?
Umm... I'm not sure, I don't think so.  We were friendly, we had chats at the reception from time to time.  For example, I knew that she wasn't planning on renewing her membership next month.  But outside of work, I never saw her.

4. Do you know why she wasn’t going to renew?
Not exactly, she just said it was for personal reasons.  Last time she was here, I heard one of the other girls talking about someone throwing up in the bathroom, I think it must have been her.  Maybe that had something to do with it?
`,
                    required: false,
                    id: "task_13"
                },
                {
                    type: "question_multi",
                    content: `Which of the following do you believe?`,
                    answerChoices: [
                        'It was just an accident',
                        'Peter Samson hit her on purpose',
                        'Nigel pushed her into the road',
                        'Someone else pushed her'
                    ],
                    answer: ['Peter Samson hit her on purpose'],
                    required: true,
                    id: "task_14"
                },
                {
                    type: "question_single",
                    content: `In their interview, what question number received a response that proves that they were lying?`,
                    answer: ['8'],
                    required: false,
                    id: "task_15"
                },
                {
                    type: "question_single",
                    content: `For bonus points.  Can you summarise something about Annie that triggered the motive for her death into a single word.  This word begins with the first letter of the true killer and has the same number of letters as the question number from the previous question.`,
                    answer: ['pregnant'],
                    required: false,
                    id: "task_16"
                },
                {
                    type: "information",
                    content: `
Congratulations!  A terrible waste indeed and thanks to you, Peter will go to jail.  He didn’t just kill a lovely hard working woman, but his own unborn child.  Annie had always had a soft spot for Peter, he was well dressed and charming.  With all the late nights at the house with Angela at work, one night, Peter made a move on Annie and she didn’t turn him down.

Two months later, Annie had been at the house and had stayed a little too long, Angela was due home any minute so she hurriedly picked up her bag and rushed home.  As she ran out the door, a letter fell out of her bag but she didn’t notice.  Peter recognised the Nuffield Health branding from his wife’s job and picked it up.  When he saw the word “ultrasound” written on the letter, Peter freaked out, he didn’t know what to do.

In the morning, Peter waited around to confront her but when she was late, he couldn’t wait any longer.  And as he drove to work, he just kept imagining Annie bumping into his wife, that she would find out, the kids would find out, he’d be a scandal at work and everything would fall apart.  All of a sudden, the walls felt like they were closing in fast.  And then as he approached the corner, he saw Annie step out to cross the road and in a split second, instead of hitting the brakes, he intentionally hit the accelerator.
`,
                    required: false,
                    id: "task_17"
                }
            ],
            id: "step_4"
        }
    ]
};

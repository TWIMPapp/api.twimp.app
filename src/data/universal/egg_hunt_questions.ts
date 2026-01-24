import { EggHuntQuestion } from '../../types/UniversalGameTypes.js';

export const EggHuntQuestions: EggHuntQuestion[] = [
    // Phase 1: Levels 1-6 (KS2)
    { id: 'q1', phase: 1, level: 1, subject: 'MATH', question: 'What is 15 + 27?', answer: '42' },
    { id: 'q2', phase: 1, level: 2, subject: 'ENGLISH', question: 'What is the plural of "Child"?', answer: 'children' },
    { id: 'q3', phase: 1, level: 3, subject: 'SCIENCE', question: 'Which planet is known as the Red Planet?', answer: 'Mars' },
    { id: 'q4', phase: 1, level: 4, subject: 'MATH', question: 'What is 12 x 8?', answer: '96' },
    { id: 'q5', phase: 1, level: 5, subject: 'ENGLISH', question: 'Identify the verb in: "The quick brown fox jumps over the lazy dog."', answer: 'jumps' },
    { id: 'q6', phase: 1, level: 6, subject: 'SCIENCE', question: 'What gas do plants absorb from the atmosphere?', answer: 'carbon dioxide' },

    // Phase 2: Levels 7-16 (KS3)
    { id: 'q7_math', phase: 2, level: 7, subject: 'MATH', question: 'What is the square root of 144?', answer: '12' },
    { id: 'q7_english', phase: 2, level: 7, subject: 'ENGLISH', question: 'Who wrote "Romeo and Juliet"?', answer: 'Shakespeare' },
    { id: 'q7_science', phase: 2, level: 7, subject: 'SCIENCE', question: 'What is the chemical symbol for Gold?', answer: 'Au' },

    { id: 'q8_math', phase: 2, level: 8, subject: 'MATH', question: 'What is 15% of 200?', answer: '30' },
    { id: 'q8_english', phase: 2, level: 8, subject: 'ENGLISH', question: 'What is a metaphor?', answer: 'comparison' },
    { id: 'q8_science', phase: 2, level: 8, subject: 'SCIENCE', question: 'What is the process by which plants make food?', answer: 'photosynthesis' },

    { id: 'q9_math', phase: 2, level: 9, subject: 'MATH', question: 'What is the area of a circle with radius 5? (Use π ≈ 3.14)', answer: '78.5' },
    { id: 'q9_english', phase: 2, level: 9, subject: 'ENGLISH', question: 'What language did the ancient Romans speak?', answer: 'Latin' },
    { id: 'q9_science', phase: 2, level: 9, subject: 'SCIENCE', question: 'What organ pumps blood around the body?', answer: 'heart' },

    { id: 'q10_math', phase: 2, level: 10, subject: 'MATH', question: 'Solve: 3x = 21', answer: '7' },
    { id: 'q10_english', phase: 2, level: 10, subject: 'ENGLISH', question: 'Who was the first Tudor monarch?', answer: 'Henry VII' },
    { id: 'q10_science', phase: 2, level: 10, subject: 'SCIENCE', question: 'What is H2O commonly known as?', answer: 'water' },

    { id: 'q11_math', phase: 2, level: 11, subject: 'MATH', question: 'What is 7 squared?', answer: '49' },
    { id: 'q11_english', phase: 2, level: 11, subject: 'ENGLISH', question: 'What is the capital of France?', answer: 'Paris' },
    { id: 'q11_science', phase: 2, level: 11, subject: 'SCIENCE', question: 'What gas makes up most of Earth\'s atmosphere?', answer: 'nitrogen' },

    { id: 'q12_math', phase: 2, level: 12, subject: 'MATH', question: 'What is 0.5 as a fraction?', answer: '1/2' },
    { id: 'q12_english', phase: 2, level: 12, subject: 'ENGLISH', question: 'What is the plural of "goose"?', answer: 'geese' },
    { id: 'q12_science', phase: 2, level: 12, subject: 'SCIENCE', question: 'What is the chemical symbol for water?', answer: 'H2O' },

    { id: 'q13_math', phase: 2, level: 13, subject: 'MATH', question: 'What is the sum of angles in a triangle?', answer: '180' },
    { id: 'q13_english', phase: 2, level: 13, subject: 'ENGLISH', question: 'Who wrote "A Christmas Carol"?', answer: 'Dickens' },
    { id: 'q13_science', phase: 2, level: 13, subject: 'SCIENCE', question: 'What is the largest planet in our solar system?', answer: 'Jupiter' },

    { id: 'q14_math', phase: 2, level: 14, subject: 'MATH', question: 'What is 25% of 80?', answer: '20' },
    { id: 'q14_english', phase: 2, level: 14, subject: 'ENGLISH', question: 'In which year did World War II end?', answer: '1945' },
    { id: 'q14_science', phase: 2, level: 14, subject: 'SCIENCE', question: 'What is the boiling point of water in Celsius?', answer: '100' },

    { id: 'q15_math', phase: 2, level: 15, subject: 'MATH', question: 'What is the perimeter of a square with side length 6?', answer: '24' },
    { id: 'q15_english', phase: 2, level: 15, subject: 'ENGLISH', question: 'What is an adjective?', answer: 'describing word' },
    { id: 'q15_science', phase: 2, level: 15, subject: 'SCIENCE', question: 'How many bones are in the adult human body?', answer: '206' },

    { id: 'q16_math', phase: 2, level: 16, subject: 'MATH', question: 'Solve: 2x + 3 = 11', answer: '4' },
    { id: 'q16_english', phase: 2, level: 16, subject: 'ENGLISH', question: 'Who painted the Mona Lisa?', answer: 'da Vinci' },
    { id: 'q16_science', phase: 2, level: 16, subject: 'SCIENCE', question: 'What is the speed of light in m/s?', answer: '300000000' },

    // Phase 3: Levels 17-26 (KS4)
    { id: 'q17_math', phase: 3, level: 17, subject: 'MATH', question: 'Solve for x: 2x + 5 = 15', answer: '5' },
    { id: 'q17_english', phase: 3, level: 17, subject: 'ENGLISH', question: 'What is an oxymoron?', answer: 'contradiction' },
    { id: 'q17_science', phase: 3, level: 17, subject: 'SCIENCE', question: 'What is the power source of a cell?', answer: 'mitochondria' },

    { id: 'q18_math', phase: 3, level: 18, subject: 'MATH', question: 'What is the quadratic formula used for?', answer: 'solving quadratics' },
    { id: 'q18_english', phase: 3, level: 18, subject: 'ENGLISH', question: 'Who wrote "Pride and Prejudice"?', answer: 'Austen' },
    { id: 'q18_science', phase: 3, level: 18, subject: 'SCIENCE', question: 'What is the first element on the periodic table?', answer: 'hydrogen' },

    { id: 'q19_math', phase: 3, level: 19, subject: 'MATH', question: 'What is the value of π to 2 decimal places?', answer: '3.14' },
    { id: 'q19_english', phase: 3, level: 19, subject: 'ENGLISH', question: 'What year did the Battle of Hastings occur?', answer: '1066' },
    { id: 'q19_science', phase: 3, level: 19, subject: 'SCIENCE', question: 'What is the chemical formula for table salt?', answer: 'NaCl' },

    { id: 'q20_math', phase: 3, level: 20, subject: 'MATH', question: 'What is the next prime number after 7?', answer: '11' },
    { id: 'q20_english', phase: 3, level: 20, subject: 'ENGLISH', question: 'What is alliteration?', answer: 'repeated consonant sounds' },
    { id: 'q20_science', phase: 3, level: 20, subject: 'SCIENCE', question: 'What is the formula for force?', answer: 'mass times acceleration' },

    { id: 'q21_math', phase: 3, level: 21, subject: 'MATH', question: 'Solve: x² = 25', answer: '5' },
    { id: 'q21_english', phase: 3, level: 21, subject: 'ENGLISH', question: 'Who discovered penicillin?', answer: 'Fleming' },
    { id: 'q21_science', phase: 3, level: 21, subject: 'SCIENCE', question: 'What is the atomic number of carbon?', answer: '6' },

    { id: 'q22_math', phase: 3, level: 22, subject: 'MATH', question: 'What is 3 cubed?', answer: '27' },
    { id: 'q22_english', phase: 3, level: 22, subject: 'ENGLISH', question: 'What is personification?', answer: 'giving human qualities to non-human things' },
    { id: 'q22_science', phase: 3, level: 22, subject: 'SCIENCE', question: 'What is the powerhouse of the cell?', answer: 'mitochondria' },

    { id: 'q23_math', phase: 3, level: 23, subject: 'MATH', question: 'What is the Pythagorean theorem?', answer: 'a² + b² = c²' },
    { id: 'q23_english', phase: 3, level: 23, subject: 'ENGLISH', question: 'Who was the first female Prime Minister of the UK?', answer: 'Thatcher' },
    { id: 'q23_science', phase: 3, level: 23, subject: 'SCIENCE', question: 'What is the study of living organisms called?', answer: 'biology' },

    { id: 'q24_math', phase: 3, level: 24, subject: 'MATH', question: 'Convert 50% to a decimal', answer: '0.5' },
    { id: 'q24_english', phase: 3, level: 24, subject: 'ENGLISH', question: 'What is the capital of Germany?', answer: 'Berlin' },
    { id: 'q24_science', phase: 3, level: 24, subject: 'SCIENCE', question: 'What is the centre of an atom called?', answer: 'nucleus' },

    { id: 'q25_math', phase: 3, level: 25, subject: 'MATH', question: 'What is the interior angle sum of a hexagon?', answer: '720' },
    { id: 'q25_english', phase: 3, level: 25, subject: 'ENGLISH', question: 'What literary device compares using "like" or "as"?', answer: 'simile' },
    { id: 'q25_science', phase: 3, level: 25, subject: 'SCIENCE', question: 'What is the unit of electrical resistance?', answer: 'ohm' },

    { id: 'q26_math', phase: 3, level: 26, subject: 'MATH', question: 'Simplify: 8/12', answer: '2/3' },
    { id: 'q26_english', phase: 3, level: 26, subject: 'ENGLISH', question: 'Who wrote "Macbeth"?', answer: 'Shakespeare' },
    { id: 'q26_science', phase: 3, level: 26, subject: 'SCIENCE', question: 'What is the freezing point of water in Fahrenheit?', answer: '32' },

    // Phase 4: Special Eggs (27-30)
    { id: 'q27', phase: 4, level: 27, subject: 'SPECIAL', question: 'Translate the symbols back to English.', answer: 'DYNAMIC' },
    { id: 'q28', phase: 4, level: 28, subject: 'SPECIAL', question: 'What building are you at? (Enter the type: Library, Post Office, etc.)', answer: 'PLACEHOLDER' },
    { id: 'q29', phase: 4, level: 29, subject: 'SPECIAL', question: 'Find the missing word from the landmark image.', answer: 'PLACEHOLDER' },
    { id: 'q30', phase: 4, level: 30, subject: 'SPECIAL', question: 'You found the Golden Egg! Enter the final code.', answer: 'VICTORY' }
];

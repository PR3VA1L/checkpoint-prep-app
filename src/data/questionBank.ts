export interface BankQuestion {
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Generated cleanly by scripts/generate-cambridge.js
export const QUESTION_BANK: BankQuestion[] = [
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Medium",
    "question": "Which of the following sentences is punctuated correctly for direct speech?",
    "options": [
      "\"I cannot believe we are lost\" whispered Maya, \"and the map is in the car.\"",
      "\"I cannot believe we are lost,\" whispered Maya, \"And the map is in the car.\"",
      "\"I cannot believe we are lost,\" whispered Maya, \"and the map is in the car.\"",
      "\"I cannot believe we are lost\", whispered Maya, \"and the map is in the car.\""
    ],
    "correctIndex": 2,
    "explanation": "Option 2 is correct because when a reporting clause (such as 'whispered Maya') interrupts a single continuous sentence of spoken words, we must use a comma inside the first closing inverted commas and a comma after the reporting clause. The spoken sentence then continues with a lower-case letter ('and'). Option 3 is incorrect because the comma is placed outside the inverted commas. Option 1 is incorrect because 'And' starts with a capital letter, which is only used if a brand new spoken sentence begins. Option 0 is missing the comma inside the first set of inverted commas."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Medium",
    "question": "Read this sentence: 'The explorer _______ courage was legendary set off into the deep jungle.' Which relative pronoun correctly completes this sentence?",
    "options": [
      "who's",
      "whose",
      "whom",
      "which"
    ],
    "correctIndex": 1,
    "explanation": "The correct relative pronoun is 'whose' (Option 1) because it is a possessive pronoun indicating that the courage belonged to the explorer. A common misconception for Year 6 students is confusing 'whose' with the homophone 'who's' (Option 0). However, 'who's' is a contraction of 'who is' or 'who has', which would make the sentence incorrect ('The explorer who is courage was legendary...'). 'Whom' (Option 2) is an object pronoun and 'which' (Option 3) is only used for non-human subjects."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Medium",
    "question": "Read this sentence: 'The headteacher cast a stern glance at the noisy queue, and the chatter instantly subsided.' What does the word 'subsided' mean in this context?",
    "options": [
      "became louder and more excited",
      "continued at a steady pace",
      "sank or became quiet and less active",
      "stopped completely because of a sudden shock"
    ],
    "correctIndex": 2,
    "explanation": "In this context, 'subsided' (Option 2) means that the chatter died down, lessened, or became quiet. It comes from the root word meaning to sink or settle to a lower level. Students might be tempted to choose Option 3 because they assume the noise stopped completely, but 'subside' specifically means to diminish in intensity rather than vanish instantly. Option 0 is the antonym (opposite meaning), and Option 1 describes no change at all."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Medium",
    "question": "Read this line from a poem: 'The wind was a torrent of darkness among the gusty trees.' Which literary device is used in this line?",
    "options": [
      "Simile",
      "Personification",
      "Alliteration",
      "Metaphor"
    ],
    "correctIndex": 3,
    "explanation": "This line is a metaphor (Option 3) because it directly describes the wind as being something else ('a torrent of darkness') to create a vivid image. It does not use 'like' or 'as', which rules out a simile (Option 0). While the trees are described as 'gusty', there is no human quality given to them, meaning it is not personification (Option 1). While there is some soft repetition of sounds, the dominant literary device driving the imagery is the metaphor."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Medium",
    "question": "Which sentence is written in the most appropriate formal register for a persuasive letter to a local council?",
    "options": [
      "I reckon you guys need to fix up the park because it's looking rubbish.",
      "Please could you tidy the park up, as it would be super cool for us to play there.",
      "We are totally fed up with the state of the park and want you to sort it out now.",
      "It is crucial that the local authority allocates funds to renovate our community park."
    ],
    "correctIndex": 3,
    "explanation": "Option 3 uses a highly formal register with sophisticated, precise vocabulary suitable for addressing local government officials (such as 'crucial', 'local authority', 'allocates funds', and 'renovate'). Options 0, 1, and 2 contain colloquialisms and informal language ('reckon', 'guys', 'rubbish', 'super cool', 'totally fed up', 'sort it out') which are conversational and inappropriate for a formal, persuasive letter."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Medium",
    "question": "Which of the following sentences contains NO spelling errors?",
    "options": [
      "It is necessary to separate the recycling into different bins.",
      "It is neccessary to separate the recycling into different bins.",
      "It is necessary to seperate the recycling into different bins.",
      "It is neccessary to seperate the recycling into different bins."
    ],
    "correctIndex": 0,
    "explanation": "Option 0 is completely correct. The word 'necessary' is frequently misspelt; a helpful trick to remember is that a shirt has one collar ('c') and two sleeves ('ss'). The word 'separate' is also a common target for spelling errors because of its unstressed middle vowel. Students often write 'seperate' (Option 2 and 3) instead of 'separate'. Remembering that there is 'a rat' in 'sep-a-rat-e' helps to secure the correct spelling."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Medium",
    "question": "Which of the following sentences is written in the passive voice?",
    "options": [
      "The sneaky fox chased the frightened rabbit through the meadow.",
      "The frightened rabbit was chased through the meadow by the sneaky fox.",
      "Through the meadow, the frightened rabbit ran away from the sneaky fox.",
      "Having spotted the rabbit, the sneaky fox ran through the meadow."
    ],
    "correctIndex": 1,
    "explanation": "Option 1 is in the passive voice because the target of the action ('the frightened rabbit') is placed as the grammatical subject at the start of the sentence, followed by the auxiliary verb 'was' + the past participle 'chased', and the performer of the action is introduced by 'by'. Students often mistake Option 2 for the passive voice because it starts with 'the frightened rabbit', but 'ran' is an active verb and the rabbit is doing the running itself, making it active voice with a fronted adverbial. Options 0 and 3 are clearly in the active voice as the fox is the subject performing the actions."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Medium",
    "question": "Which sentence uses a semi-colon correctly to separate two independent clauses?",
    "options": [
      "The storm raged outside; we remained warm and safe by the fireplace.",
      "The storm raged outside; because we remained warm and safe by the fireplace.",
      "The storm raged outside; remaining warm and safe by the fireplace.",
      "The storm raged outside; and we remained warm and safe by the fireplace."
    ],
    "correctIndex": 0,
    "explanation": "A semi-colon is used to link two closely related independent clauses (clauses that make sense on their own as complete sentences) without a coordinating conjunction. Option 0 is correct because 'The storm raged outside' and 'we remained warm and safe by the fireplace' are both complete independent clauses. Option 1 is incorrect because 'because' turns the second part into a dependent clause. Option 2 is incorrect because the second part is a phrase, not a clause. Option 3 is incorrect because you do not use a coordinating conjunction ('and') immediately after a semi-colon."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Medium",
    "question": "Read this sentence: 'We decided to go for a walk in the forest __________ it was raining heavily.' Which conjunction should be used to show a relationship of concession (contrast)?",
    "options": [
      "although",
      "because",
      "therefore",
      "since"
    ],
    "correctIndex": 0,
    "explanation": "The subordinating conjunction 'although' (Option 0) is correct because it signals concession, showing that the decision to walk was made despite the contrasting obstacle of heavy rain. 'Because' (Option 1) and 'since' (Option 3) would imply cause and effect, suggesting the rain was the reason they went for a walk, which is illogical. 'Therefore' (Option 2) is a linking adverb, not a conjunction, and cannot be used to join these two clauses in this grammatical structure."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Medium",
    "question": "Read this sentence: 'Several children found those books on the top shelf.' Which word in the sentence is a demonstrative determiner?",
    "options": [
      "Several",
      "those",
      "the",
      "top"
    ],
    "correctIndex": 1,
    "explanation": "A demonstrative determiner is used to point out specific nouns (this, that, these, those) depending on how close or far away they are. In this sentence, 'those' (Option 1) is the demonstrative determiner because it points directly to 'books'. 'Several' (Option 0) is a quantifier, 'the' (Option 2) is a definite article, and 'top' (Option 3) is an adjective describing the location of the shelf. Year 6 students often confuse the different types of determiners, making 'several' and 'the' common distractor choices."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Hard",
    "question": "Four children write down a number.\nAmira writes 0.65.\nBen writes 2/3.\nCody writes 62%.\nDisha writes 5/8.\nWho has written the largest number?",
    "options": [
      "Disha",
      "Amira",
      "Ben",
      "Cody"
    ],
    "correctIndex": 2,
    "explanation": "To compare these numbers, we should convert them all to decimals. Amira's number is 0.65. Ben's number is 2/3, which is equal to 0.666... (recurring). Cody's number is 62%, which is equal to 0.62. Disha's number is 5/8, which is equal to 0.625. Comparing these decimals (0.65, 0.666..., 0.62, 0.625), Ben's number is the largest. A common mistake is to think 5/8 is larger because of the larger digits, or to round 2/3 down to 0.6."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Hard",
    "question": "An isosceles triangle has one angle of 40°. Which of these could be the difference between the largest and smallest angles of this triangle?",
    "options": [
      "100°",
      "60°",
      "40°",
      "80°"
    ],
    "correctIndex": 1,
    "explanation": "An isosceles triangle has two equal angles. There are two possible cases here: Case 1: The equal angles are 40° each. The third angle must be 180° - 40° - 40° = 100°. The difference between the largest (100°) and smallest (40°) is 60°. Case 2: The odd angle is 40°. The other two equal angles must be (180° - 40°) ÷ 2 = 70° each. The difference between the largest (70°) and smallest (40°) is 30°. Since 30° is not an option, 60° is the correct answer. Students often only consider one case or forget to find the difference between the angles."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Hard",
    "question": "A rectangle has a length of 12 cm and a width of 8 cm. A square with a side length of 3 cm is cut out from one of its corners. What is the perimeter of the new shape?",
    "options": [
      "34 cm",
      "40 cm",
      "37 cm",
      "46 cm"
    ],
    "correctIndex": 1,
    "explanation": "The perimeter of the original rectangle is 2 × (12 + 8) = 40 cm. When a square is cut out from a corner, the two outer boundary edges that are removed (each 3 cm) are replaced by two new inner edges of the exact same length (each 3 cm). Therefore, the overall perimeter remains unchanged at 40 cm. A common misconception is to subtract the perimeter or the side lengths of the cut-out square from the original perimeter, leading to incorrect working out such as 34 cm."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Hard",
    "question": "What is the value of this expression?\n24 - 4 x (5 - 2) + 6 ÷ 2",
    "options": [
      "9",
      "15",
      "33",
      "13"
    ],
    "correctIndex": 1,
    "explanation": "Using the correct order of operations (BIDMAS/BODMAS): First, solve the brackets: (5 - 2) = 3. The expression becomes 24 - 4 x 3 + 6 ÷ 2. Next, perform multiplication and division from left to right: 4 x 3 = 12 and 6 ÷ 2 = 3. The expression becomes 24 - 12 + 3. Finally, perform addition and subtraction from left to right: 24 - 12 = 12, then 12 + 3 = 15. A common error is doing addition before subtraction (12 + 3 = 15, then 24 - 15 = 9) or working strictly from left to right."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Hard",
    "question": "The mean mass of four bags of flour is 1.5 kg. A fifth bag is added, and the new mean mass is 1.6 kg. What is the mass of the fifth bag?",
    "options": [
      "1.7 kg",
      "2.4 kg",
      "0.1 kg",
      "2.0 kg"
    ],
    "correctIndex": 3,
    "explanation": "To solve this, work out the total mass before and after. The initial total mass of the 4 bags is 4 × 1.5 kg = 6.0 kg. When the fifth bag is added, the total mass of the 5 bags becomes 5 × 1.6 kg = 8.0 kg. The mass of the fifth bag is the difference: 8.0 kg - 6.0 kg = 2.0 kg. Students often mistakenly think the bag must weigh 1.7 kg by simply adding the 0.1 kg difference to the mean."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Hard",
    "question": "In a school, 3/5 of the students play a sport. Out of the students who play a sport, 2/3 play football. What fraction of the whole school plays football?",
    "options": [
      "2/5",
      "5/8",
      "3/10",
      "1/5"
    ],
    "correctIndex": 0,
    "explanation": "To find a fraction of a fraction, we multiply them together. We need to find 2/3 of 3/5. Working out: (2/3) x (3/5) = 6/15. Simplifying 6/15 by dividing the numerator and denominator by 3 gives 2/5. A common mistake is to add the fractions to get 5/8, or to subtract them."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Hard",
    "question": "A tap drips water at a steady rate of 20 millilitres per minute. How many litres of water will drip from the tap in exactly 24 hours?",
    "options": [
      "2.88 litres",
      "288 litres",
      "28.8 litres",
      "48.0 litres"
    ],
    "correctIndex": 2,
    "explanation": "First, calculate the total minutes in 24 hours: 24 × 60 = 1440 minutes. Next, find the total volume in millilitres: 1440 × 20 mL = 28,800 mL. Finally, convert millilitres to litres by dividing by 1000 (since 1 litre = 1000 mL): 28,800 ÷ 1000 = 28.8 litres. Common errors include multiplying 20 directly by 24 (480 mL, which is 0.48 litres) or dividing by 100 instead of 1000."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Hard",
    "question": "At 06:00, the temperature in Chicago was -8 °C. By 14:00, the temperature had risen by 15 °C. By 22:00, it had fallen by 9 °C from the 14:00 temperature. What was the temperature at 22:00?",
    "options": [
      "2 °C",
      "-14 °C",
      "16 °C",
      "-2 °C"
    ],
    "correctIndex": 3,
    "explanation": "Start at -8 °C. Add 15 °C to find the temperature at 14:00: -8 + 15 = 7 °C. From 7 °C, subtract 9 °C to find the temperature at 22:00: 7 - 9 = -2 °C. A common mistake is miscalculating the cross through zero, or incorrectly adding 9 instead of subtracting it."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Hard",
    "question": "The vertices of a triangle are at coordinates A(1, 2), B(4, 2) and C(1, 6). The triangle is translated 3 units left and 4 units down. What are the new coordinates of vertex C?",
    "options": [
      "(-2, 10)",
      "(4, 2)",
      "(-2, 2)",
      "(2, -2)"
    ],
    "correctIndex": 2,
    "explanation": "Vertex C is originally at (1, 6). Translating a shape 'left' affects the x-coordinate by subtracting. So, the new x-coordinate is 1 - 3 = -2. Translating 'down' affects the y-coordinate by subtracting. So, the new y-coordinate is 6 - 4 = 2. This gives the new coordinates as (-2, 2). Students often mistake the direction of the translation (adding instead of subtracting) or confuse the x and y axes."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Hard",
    "question": "A box contains red and blue pens in the ratio 3 : 5. If 40% of the red pens are gel pens, what percentage of the total number of pens in the box are red gel pens?",
    "options": [
      "15%",
      "12%",
      "24%",
      "40%"
    ],
    "correctIndex": 0,
    "explanation": "The ratio 3:5 means that for every 8 pens, 3 are red. As a fraction, red pens make up 3/8 of the total. Written as a decimal, 3/8 = 0.375 (or 37.5%). We need to find 40% of this amount. Working out: 40% of 37.5% = 0.4 × 37.5% = 15%. Alternatively, if there are 80 pens, 30 are red. 40% of 30 is 12 pens. 12 out of 80 is (12 ÷ 80) × 100 = 15%. A common mistake is to find 40% of 3/5 (60%), which gives 24%."
  }
];

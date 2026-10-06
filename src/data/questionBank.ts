export interface BankQuestion {
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUESTION_BANK: BankQuestion[] = [
  // ===========================
  // ENGLISH — Reading & Comprehension
  // ===========================
  { subject: 'english', topic: 'Vocabulary in Context', difficulty: 'Easy', question: 'What does the word "enormous" mean?', options: ['Very small', 'Very large', 'Very fast', 'Very old'], correctIndex: 1, explanation: '"Enormous" means extremely large or huge in size.' },
  { subject: 'english', topic: 'Vocabulary in Context', difficulty: 'Medium', question: 'In the sentence "The teacher commended the student for her hard work", what does "commended" mean?', options: ['Punished', 'Ignored', 'Praised', 'Questioned'], correctIndex: 2, explanation: '"Commended" means to praise someone formally for their achievement.' },
  { subject: 'english', topic: 'Vocabulary in Context', difficulty: 'Hard', question: '"The castle was shrouded in mist." What does "shrouded" mean here?', options: ['Lit up', 'Covered or hidden', 'Surrounded by walls', 'Painted'], correctIndex: 1, explanation: '"Shrouded" means covered or concealed, often creating a mysterious feeling.' },
  { subject: 'english', topic: 'Vocabulary in Context', difficulty: 'Medium', question: 'Which word is a synonym for "reluctant"?', options: ['Eager', 'Unwilling', 'Excited', 'Brave'], correctIndex: 1, explanation: '"Reluctant" means unwilling or hesitant to do something.' },
  { subject: 'english', topic: 'Vocabulary in Context', difficulty: 'Easy', question: 'What does the prefix "un-" do to a word?', options: ['Makes it bigger', 'Makes it opposite', 'Makes it past tense', 'Makes it plural'], correctIndex: 1, explanation: 'The prefix "un-" reverses the meaning of the word. For example, "happy" becomes "unhappy".' },

  { subject: 'english', topic: 'Purpose and Audience', difficulty: 'Medium', question: 'A letter written to persuade the headteacher to allow a school trip is written for which purpose?', options: ['To entertain', 'To inform', 'To persuade', 'To instruct'], correctIndex: 2, explanation: 'A letter asking for something is trying to persuade the reader to agree.' },
  { subject: 'english', topic: 'Purpose and Audience', difficulty: 'Easy', question: 'Who is the audience for a children\'s picture book?', options: ['Adults', 'Teenagers', 'Young children', 'Teachers only'], correctIndex: 2, explanation: 'Picture books use simple language and pictures designed for young children.' },
  { subject: 'english', topic: 'Purpose and Audience', difficulty: 'Hard', question: 'A recipe in a cookbook is an example of writing to:', options: ['Persuade', 'Entertain', 'Argue', 'Instruct'], correctIndex: 3, explanation: 'Recipes provide step-by-step instructions on how to make something.' },
  { subject: 'english', topic: 'Purpose and Audience', difficulty: 'Medium', question: 'Which feature would you expect in a newspaper report?', options: ['Rhyming words', 'A headline and quotes', 'Speech bubbles', 'A moral at the end'], correctIndex: 1, explanation: 'Newspaper reports use headlines, quotes from witnesses, and factual language.' },

  { subject: 'english', topic: 'Literary Devices', difficulty: 'Medium', question: '"The wind howled through the trees." This is an example of:', options: ['Simile', 'Alliteration', 'Personification', 'Metaphor'], correctIndex: 2, explanation: 'Personification gives human qualities to non-human things. Wind cannot actually "howl".' },
  { subject: 'english', topic: 'Literary Devices', difficulty: 'Easy', question: '"As brave as a lion" is an example of a:', options: ['Metaphor', 'Simile', 'Onomatopoeia', 'Hyperbole'], correctIndex: 1, explanation: 'A simile compares two things using "as" or "like".' },
  { subject: 'english', topic: 'Literary Devices', difficulty: 'Hard', question: '"The classroom was a zoo." This is an example of:', options: ['Simile', 'Metaphor', 'Alliteration', 'Personification'], correctIndex: 1, explanation: 'A metaphor says something IS something else without using "like" or "as".' },
  { subject: 'english', topic: 'Literary Devices', difficulty: 'Medium', question: '"Peter Piper picked a peck of pickled peppers." This is an example of:', options: ['Onomatopoeia', 'Alliteration', 'Hyperbole', 'Simile'], correctIndex: 1, explanation: 'Alliteration is when words close together start with the same sound.' },
  { subject: 'english', topic: 'Literary Devices', difficulty: 'Easy', question: '"Buzz", "crash", and "sizzle" are examples of:', options: ['Simile', 'Metaphor', 'Onomatopoeia', 'Alliteration'], correctIndex: 2, explanation: 'Onomatopoeia is when a word sounds like the noise it describes.' },

  // ===========================
  // ENGLISH — Writing & Grammar
  // ===========================
  { subject: 'english', topic: 'Punctuation', difficulty: 'Easy', question: 'Which sentence is punctuated correctly?', options: ['the cat sat on the mat.', 'The cat sat on the mat', 'The cat sat on the mat.', 'the Cat sat on the Mat.'], correctIndex: 2, explanation: 'A sentence must start with a capital letter and end with a full stop.' },
  { subject: 'english', topic: 'Punctuation', difficulty: 'Medium', question: 'Where should the comma go? "After eating the dog went for a walk."', options: ['After "After"', 'After "eating"', 'After "dog"', 'After "went"'], correctIndex: 1, explanation: 'A comma is needed after the introductory clause: "After eating, the dog went for a walk."' },
  { subject: 'english', topic: 'Punctuation', difficulty: 'Hard', question: 'Which sentence uses apostrophes correctly?', options: ["The dogs' bone was buried.", "The dog's bone was buried.", "The dogs bone's was buried.", "The dogs bones' was buried."], correctIndex: 1, explanation: 'For one dog owning one bone, use apostrophe-s: "dog\'s".' },
  { subject: 'english', topic: 'Punctuation', difficulty: 'Medium', question: 'Which sentence uses speech marks correctly?', options: ['"Hello, said Tom."', '"Hello," said Tom.', 'Hello, "said Tom."', '"Hello", "said" "Tom".'], correctIndex: 1, explanation: 'Speech marks go around the spoken words, and a comma separates them from the reporting clause.' },
  { subject: 'english', topic: 'Punctuation', difficulty: 'Easy', question: 'What punctuation mark goes at the end of a question?', options: ['Full stop', 'Exclamation mark', 'Question mark', 'Comma'], correctIndex: 2, explanation: 'Questions always end with a question mark (?).' },

  { subject: 'english', topic: 'Grammar', difficulty: 'Medium', question: 'Which sentence uses the correct tense?', options: ['Yesterday I go to the shop.', 'Yesterday I went to the shop.', 'Yesterday I going to the shop.', 'Yesterday I goed to the shop.'], correctIndex: 1, explanation: '"Went" is the correct past tense of "go".' },
  { subject: 'english', topic: 'Grammar', difficulty: 'Easy', question: 'Which word is a conjunction?', options: ['Quickly', 'And', 'Beautiful', 'Running'], correctIndex: 1, explanation: 'Conjunctions like "and", "but", and "or" join words or sentences together.' },
  { subject: 'english', topic: 'Grammar', difficulty: 'Hard', question: 'Which sentence uses a subordinate clause?', options: ['The dog barked loudly.', 'I ate lunch and went outside.', 'Although it was raining, we played outside.', 'She is tall.'], correctIndex: 2, explanation: '"Although it was raining" is a subordinate clause — it cannot stand alone as a sentence.' },
  { subject: 'english', topic: 'Grammar', difficulty: 'Medium', question: 'What is the plural of "child"?', options: ['Childs', 'Childrens', 'Children', 'Childer'], correctIndex: 2, explanation: '"Children" is an irregular plural — it does not follow the usual rule of adding -s.' },

  { subject: 'english', topic: 'Word Classes', difficulty: 'Easy', question: 'Which word is a noun?', options: ['Run', 'Quickly', 'Dog', 'Beautiful'], correctIndex: 2, explanation: 'A noun is a person, place, or thing. "Dog" is a thing.' },
  { subject: 'english', topic: 'Word Classes', difficulty: 'Medium', question: 'Identify the ADVERB: "The dog barked loudly at the mailman."', options: ['dog', 'barked', 'loudly', 'mailman'], correctIndex: 2, explanation: 'An adverb describes a verb. "Loudly" describes HOW the dog barked.' },
  { subject: 'english', topic: 'Word Classes', difficulty: 'Hard', question: 'Which word is a preposition? "The cat sat under the table."', options: ['cat', 'sat', 'under', 'table'], correctIndex: 2, explanation: 'A preposition shows the position or relationship between things. "Under" shows where the cat sat.' },
  { subject: 'english', topic: 'Word Classes', difficulty: 'Medium', question: 'Which word is an adjective? "The tall building collapsed."', options: ['The', 'tall', 'building', 'collapsed'], correctIndex: 1, explanation: 'An adjective describes a noun. "Tall" describes the building.' },

  { subject: 'english', topic: 'Sentence Structure', difficulty: 'Easy', question: 'Which is a complete sentence?', options: ['Running fast.', 'The big dog.', 'She ran home.', 'Very quickly indeed.'], correctIndex: 2, explanation: 'A sentence needs a subject (she) and a verb (ran) to be complete.' },
  { subject: 'english', topic: 'Sentence Structure', difficulty: 'Medium', question: 'What type of sentence is: "Close the door!"', options: ['Question', 'Statement', 'Command', 'Exclamation'], correctIndex: 2, explanation: 'A command (imperative sentence) tells someone to do something.' },
  { subject: 'english', topic: 'Sentence Structure', difficulty: 'Hard', question: '"I like cake, but my sister prefers biscuits." This is a:', options: ['Simple sentence', 'Compound sentence', 'Complex sentence', 'Fragment'], correctIndex: 1, explanation: 'A compound sentence joins two main clauses with a conjunction like "but".' },

  // ===========================
  // MATH — Number
  // ===========================
  { subject: 'math', topic: 'Fractions', difficulty: 'Easy', question: 'What is 1/2 of 20?', options: ['5', '10', '15', '20'], correctIndex: 1, explanation: 'Half of 20 is 20 ÷ 2 = 10.' },
  { subject: 'math', topic: 'Fractions', difficulty: 'Medium', question: 'What is 1/4 written as a decimal?', options: ['0.14', '0.25', '0.4', '1.4'], correctIndex: 1, explanation: '1 ÷ 4 = 0.25.' },
  { subject: 'math', topic: 'Fractions', difficulty: 'Hard', question: 'What is 3/5 + 1/5?', options: ['4/10', '4/5', '3/10', '2/5'], correctIndex: 1, explanation: 'When fractions have the same denominator, add the numerators: 3 + 1 = 4, so 4/5.' },
  { subject: 'math', topic: 'Fractions', difficulty: 'Medium', question: 'Which fraction is equivalent to 2/4?', options: ['1/3', '1/2', '3/4', '2/3'], correctIndex: 1, explanation: '2/4 simplified (divide top and bottom by 2) gives 1/2.' },
  { subject: 'math', topic: 'Fractions', difficulty: 'Easy', question: 'Which fraction is larger: 1/3 or 1/2?', options: ['1/3', '1/2', 'They are equal', 'Cannot tell'], correctIndex: 1, explanation: '1/2 is larger. The smaller the denominator, the larger the fraction.' },

  { subject: 'math', topic: 'Decimals', difficulty: 'Easy', question: 'What is 0.5 as a fraction?', options: ['1/5', '1/2', '5/10', 'Both B and C'], correctIndex: 3, explanation: '0.5 = 5/10 = 1/2. Both answers are correct.' },
  { subject: 'math', topic: 'Decimals', difficulty: 'Medium', question: 'What is 3.7 + 2.5?', options: ['5.2', '6.2', '5.12', '6.12'], correctIndex: 1, explanation: '3.7 + 2.5 = 6.2. Line up the decimal points and add.' },
  { subject: 'math', topic: 'Decimals', difficulty: 'Hard', question: 'Round 4.867 to 1 decimal place.', options: ['4.8', '4.9', '4.87', '5.0'], correctIndex: 1, explanation: 'Look at the second decimal digit (6). Since 6 ≥ 5, round up: 4.9.' },

  { subject: 'math', topic: 'Percentages', difficulty: 'Easy', question: 'What is 50% of 80?', options: ['20', '30', '40', '60'], correctIndex: 2, explanation: '50% means half. Half of 80 is 40.' },
  { subject: 'math', topic: 'Percentages', difficulty: 'Medium', question: 'What is 25% of 120?', options: ['25', '30', '35', '40'], correctIndex: 1, explanation: '25% = 1/4. 120 ÷ 4 = 30.' },
  { subject: 'math', topic: 'Percentages', difficulty: 'Hard', question: 'What is 20% of 150?', options: ['15', '20', '30', '45'], correctIndex: 2, explanation: '10% of 150 is 15. So 20% is 15 × 2 = 30.' },

  { subject: 'math', topic: 'Mental Math', difficulty: 'Easy', question: 'What is 99 + 47?', options: ['136', '146', '156', '147'], correctIndex: 1, explanation: '99 + 47: think 100 + 47 = 147, then subtract 1 = 146.' },
  { subject: 'math', topic: 'Mental Math', difficulty: 'Medium', question: 'What is 250 × 4?', options: ['750', '900', '1000', '1250'], correctIndex: 2, explanation: '250 × 4 = 1000. Think: 25 × 4 = 100, then add a zero.' },

  { subject: 'math', topic: 'Ratio', difficulty: 'Medium', question: 'In a bag of 12 sweets, the ratio of red to blue is 1:2. How many blue sweets are there?', options: ['4', '6', '8', '10'], correctIndex: 2, explanation: 'Ratio 1:2 means 3 parts total. 12 ÷ 3 = 4 per part. Blue = 2 × 4 = 8.' },
  { subject: 'math', topic: 'Ratio', difficulty: 'Hard', question: 'Simplify the ratio 15:25.', options: ['3:5', '5:3', '1:2', '15:25'], correctIndex: 0, explanation: 'Divide both by the HCF (5): 15÷5 = 3, 25÷5 = 5. So 3:5.' },

  // ===========================
  // MATH — Geometry
  // ===========================
  { subject: 'math', topic: '2D Shapes', difficulty: 'Easy', question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correctIndex: 1, explanation: 'A hexagon has 6 sides. "Hex" means six.' },
  { subject: 'math', topic: '2D Shapes', difficulty: 'Medium', question: 'What is the name of a 4-sided shape with all sides equal and all angles 90°?', options: ['Rectangle', 'Rhombus', 'Square', 'Parallelogram'], correctIndex: 2, explanation: 'A square has 4 equal sides and 4 right angles (90°).' },

  { subject: 'math', topic: '3D Shapes', difficulty: 'Medium', question: 'How many faces does a cube have?', options: ['4', '6', '8', '12'], correctIndex: 1, explanation: 'A cube has 6 square faces.' },
  { subject: 'math', topic: '3D Shapes', difficulty: 'Hard', question: 'How many edges does a triangular prism have?', options: ['6', '8', '9', '12'], correctIndex: 2, explanation: 'A triangular prism has 9 edges: 3 on each triangular face (6) plus 3 connecting them.' },

  { subject: 'math', topic: 'Symmetry', difficulty: 'Easy', question: 'How many lines of symmetry does a square have?', options: ['1', '2', '4', '8'], correctIndex: 2, explanation: 'A square has 4 lines of symmetry: 2 diagonal and 2 through the midpoints of opposite sides.' },

  { subject: 'math', topic: 'Angles', difficulty: 'Easy', question: 'What type of angle is exactly 90°?', options: ['Acute', 'Right angle', 'Obtuse', 'Reflex'], correctIndex: 1, explanation: 'A right angle is exactly 90 degrees.' },
  { subject: 'math', topic: 'Angles', difficulty: 'Medium', question: 'What is the sum of angles in a triangle?', options: ['90°', '180°', '270°', '360°'], correctIndex: 1, explanation: 'The angles in any triangle always add up to 180°.' },
  { subject: 'math', topic: 'Angles', difficulty: 'Hard', question: 'One angle in a triangle is 90° and another is 35°. What is the third angle?', options: ['45°', '55°', '65°', '35°'], correctIndex: 1, explanation: '180 - 90 - 35 = 55°.' },

  { subject: 'math', topic: 'Coordinates', difficulty: 'Medium', question: 'What are the coordinates of a point 3 right and 5 up from the origin?', options: ['(5, 3)', '(3, 5)', '(3, -5)', '(-3, 5)'], correctIndex: 1, explanation: 'Coordinates are written as (x, y). 3 right = x=3, 5 up = y=5, so (3, 5).' },

  // ===========================
  // MATH — Measure
  // ===========================
  { subject: 'math', topic: 'Time', difficulty: 'Easy', question: 'How many minutes are in 1 hour?', options: ['30', '45', '60', '100'], correctIndex: 2, explanation: 'There are 60 minutes in 1 hour.' },
  { subject: 'math', topic: 'Time', difficulty: 'Medium', question: 'A film starts at 14:35 and lasts 1 hour 45 minutes. What time does it end?', options: ['15:20', '16:10', '16:20', '15:45'], correctIndex: 2, explanation: '14:35 + 1:45 = 16:20. Add the hours (14+1=15), then the minutes (35+45=80, which is 1h20). 15:00 + 1:20 = 16:20.' },

  { subject: 'math', topic: 'Mass', difficulty: 'Easy', question: 'How many grams are in 1 kilogram?', options: ['10', '100', '1000', '10000'], correctIndex: 2, explanation: '"Kilo" means 1000. So 1 kilogram = 1000 grams.' },

  { subject: 'math', topic: 'Capacity', difficulty: 'Medium', question: 'How many millilitres are in 2.5 litres?', options: ['250', '2500', '25', '25000'], correctIndex: 1, explanation: '1 litre = 1000 ml. So 2.5 × 1000 = 2500 ml.' },

  { subject: 'math', topic: 'Length', difficulty: 'Easy', question: 'How many centimetres are in 1 metre?', options: ['10', '100', '1000', '50'], correctIndex: 1, explanation: '1 metre = 100 centimetres.' },

  { subject: 'math', topic: 'Area & Perimeter', difficulty: 'Medium', question: 'What is the area of a rectangle with length 8cm and width 5cm?', options: ['13 cm²', '26 cm²', '40 cm²', '80 cm²'], correctIndex: 2, explanation: 'Area = length × width = 8 × 5 = 40 cm².' },
  { subject: 'math', topic: 'Area & Perimeter', difficulty: 'Easy', question: 'What is the perimeter of a square with sides of 6cm?', options: ['12 cm', '24 cm', '36 cm', '6 cm'], correctIndex: 1, explanation: 'Perimeter = 4 × side = 4 × 6 = 24 cm.' },

  // ===========================
  // MATH — Data Handling
  // ===========================
  { subject: 'math', topic: 'Bar charts', difficulty: 'Easy', question: 'What does the height of a bar in a bar chart represent?', options: ['The colour of data', 'The frequency or amount', 'The label', 'The total of all data'], correctIndex: 1, explanation: 'The height (or length) of each bar shows how many or how much.' },
  { subject: 'math', topic: 'Line graphs', difficulty: 'Medium', question: 'Line graphs are best used to show:', options: ['Categories', 'Changes over time', 'Parts of a whole', 'Comparisons between groups'], correctIndex: 1, explanation: 'Line graphs show how data changes over time, like temperature during a day.' },
  { subject: 'math', topic: 'Probability', difficulty: 'Easy', question: 'A fair coin is flipped. What is the probability of getting heads?', options: ['1/4', '1/3', '1/2', '1'], correctIndex: 2, explanation: 'A coin has 2 sides. The chance of heads is 1 out of 2 = 1/2.' },
  { subject: 'math', topic: 'Probability', difficulty: 'Medium', question: 'A bag has 3 red and 7 blue balls. What is the probability of picking a red ball?', options: ['3/7', '7/10', '3/10', '1/3'], correctIndex: 2, explanation: 'Total = 10 balls. Probability of red = 3/10.' },
  { subject: 'math', topic: 'Averages', difficulty: 'Medium', question: 'What is the mean of 4, 6, 8, 10, 12?', options: ['6', '8', '10', '12'], correctIndex: 1, explanation: 'Mean = sum ÷ count = (4+6+8+10+12) ÷ 5 = 40 ÷ 5 = 8.' },

  // ===========================
  // SCIENCE — Biology
  // ===========================
  { subject: 'science', topic: 'Plants', difficulty: 'Easy', question: 'What do plants need to make their own food?', options: ['Soil, water, darkness', 'Light, water, carbon dioxide', 'Oxygen, soil, shade', 'Wind, rain, heat'], correctIndex: 1, explanation: 'Plants use light energy, water, and carbon dioxide for photosynthesis.' },
  { subject: 'science', topic: 'Plants', difficulty: 'Medium', question: 'Which part of a plant is primarily responsible for photosynthesis?', options: ['Roots', 'Stem', 'Leaves', 'Flowers'], correctIndex: 2, explanation: 'Leaves contain chloroplasts with chlorophyll, which capture sunlight.' },
  { subject: 'science', topic: 'Plants', difficulty: 'Hard', question: 'What is the function of the root hairs in a plant?', options: ['To produce seeds', 'To absorb water and minerals', 'To attract insects', 'To store food'], correctIndex: 1, explanation: 'Root hairs increase the surface area for absorbing water and minerals from the soil.' },
  { subject: 'science', topic: 'Plants', difficulty: 'Medium', question: 'What gas do plants release during photosynthesis?', options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], correctIndex: 2, explanation: 'Plants take in CO₂ and release oxygen as a waste product of photosynthesis.' },
  { subject: 'science', topic: 'Plants', difficulty: 'Easy', question: 'Which part of a flower makes pollen?', options: ['Petal', 'Stamen', 'Sepal', 'Stem'], correctIndex: 1, explanation: 'The stamen is the male part of the flower that produces pollen.' },

  { subject: 'science', topic: 'Human Systems', difficulty: 'Easy', question: 'Which organ pumps blood throughout the body?', options: ['Lungs', 'Brain', 'Heart', 'Stomach'], correctIndex: 2, explanation: 'The heart is a muscular organ that pumps blood around the body.' },
  { subject: 'science', topic: 'Human Systems', difficulty: 'Medium', question: 'What is the main function of the lungs?', options: ['To digest food', 'To filter blood', 'To exchange oxygen and carbon dioxide', 'To produce hormones'], correctIndex: 2, explanation: 'Lungs take in oxygen from the air and release carbon dioxide.' },
  { subject: 'science', topic: 'Human Systems', difficulty: 'Hard', question: 'Which part of the digestive system absorbs most nutrients?', options: ['Stomach', 'Large intestine', 'Small intestine', 'Oesophagus'], correctIndex: 2, explanation: 'The small intestine has a large surface area with villi that absorb nutrients into the blood.' },
  { subject: 'science', topic: 'Human Systems', difficulty: 'Easy', question: 'What does the skeleton do?', options: ['Digests food', 'Supports and protects the body', 'Pumps blood', 'Filters air'], correctIndex: 1, explanation: 'The skeleton provides support, protects organs, and allows movement.' },

  { subject: 'science', topic: 'Habitats', difficulty: 'Easy', question: 'What is a habitat?', options: ['A type of food', 'The natural home of an organism', 'A weather pattern', 'A body part'], correctIndex: 1, explanation: 'A habitat is the place where an animal or plant normally lives and grows.' },
  { subject: 'science', topic: 'Habitats', difficulty: 'Medium', question: 'What adaptation helps a camel survive in the desert?', options: ['Thick fur for warmth', 'Large humps to store fat', 'Gills for breathing', 'Webbed feet'], correctIndex: 1, explanation: 'Camels store fat in their humps for energy and water when resources are scarce.' },
  { subject: 'science', topic: 'Habitats', difficulty: 'Hard', question: 'A polar bear has white fur. This is an example of:', options: ['Migration', 'Camouflage', 'Hibernation', 'Metamorphosis'], correctIndex: 1, explanation: 'White fur helps polar bears blend in with snow, making it easier to hunt prey.' },

  { subject: 'science', topic: 'Food Chains', difficulty: 'Easy', question: 'In a food chain, what is a producer?', options: ['An animal that eats other animals', 'A plant that makes its own food', 'An animal that eats plants', 'A decomposer'], correctIndex: 1, explanation: 'Producers (plants) make their own food using sunlight through photosynthesis.' },
  { subject: 'science', topic: 'Food Chains', difficulty: 'Medium', question: 'Grass → Rabbit → Fox. What is the rabbit in this food chain?', options: ['Producer', 'Primary consumer', 'Secondary consumer', 'Decomposer'], correctIndex: 1, explanation: 'The rabbit eats the producer (grass), making it a primary consumer (herbivore).' },
  { subject: 'science', topic: 'Food Chains', difficulty: 'Hard', question: 'If all the rabbits in a food chain die, what happens to the fox population?', options: ['It increases', 'It stays the same', 'It decreases', 'The foxes become herbivores'], correctIndex: 2, explanation: 'Without rabbits as a food source, foxes would struggle and their population would decrease.' },

  { subject: 'science', topic: 'Microorganisms', difficulty: 'Medium', question: 'Which of these is caused by bacteria?', options: ['A broken bone', 'Food poisoning', 'A sunburn', 'An allergy'], correctIndex: 1, explanation: 'Some bacteria, like Salmonella, can contaminate food and cause food poisoning.' },
  { subject: 'science', topic: 'Microorganisms', difficulty: 'Easy', question: 'Microorganisms are:', options: ['Always harmful', 'Too small to see without a microscope', 'Only found in water', 'The same as insects'], correctIndex: 1, explanation: 'Microorganisms are living things too small to see with the naked eye.' },

  // ===========================
  // SCIENCE — Chemistry
  // ===========================
  { subject: 'science', topic: 'Materials', difficulty: 'Easy', question: 'Which material is a good conductor of electricity?', options: ['Wood', 'Rubber', 'Metal', 'Plastic'], correctIndex: 2, explanation: 'Metals like copper and iron are good conductors of electricity.' },
  { subject: 'science', topic: 'Materials', difficulty: 'Medium', question: 'Which property makes glass useful for windows?', options: ['Flexibility', 'Transparency', 'Magnetism', 'Softness'], correctIndex: 1, explanation: 'Glass is transparent (see-through), which makes it ideal for windows.' },
  { subject: 'science', topic: 'Materials', difficulty: 'Hard', question: 'Why is rubber used to insulate electrical wires?', options: ['It is cheap', 'It does not conduct electricity', 'It is colourful', 'It is waterproof'], correctIndex: 1, explanation: 'Rubber is an electrical insulator — it stops electricity from passing through.' },

  { subject: 'science', topic: 'States of Matter', difficulty: 'Easy', question: 'What are the three states of matter?', options: ['Hot, warm, cold', 'Solid, liquid, gas', 'Small, medium, large', 'Light, dark, bright'], correctIndex: 1, explanation: 'The three states of matter are solid, liquid, and gas.' },
  { subject: 'science', topic: 'States of Matter', difficulty: 'Medium', question: 'What happens to water when it is heated to 100°C?', options: ['It freezes', 'It evaporates/boils', 'It stays the same', 'It becomes a solid'], correctIndex: 1, explanation: 'Water boils at 100°C and changes from a liquid to a gas (steam).' },
  { subject: 'science', topic: 'States of Matter', difficulty: 'Hard', question: 'When water vapour touches a cold window, it turns into water droplets. This is called:', options: ['Evaporation', 'Melting', 'Condensation', 'Freezing'], correctIndex: 2, explanation: 'Condensation is when a gas cools down and changes back into a liquid.' },

  { subject: 'science', topic: 'Reversible Changes', difficulty: 'Medium', question: 'Which of these is a reversible change?', options: ['Burning wood', 'Melting ice', 'Cooking an egg', 'Baking a cake'], correctIndex: 1, explanation: 'Melting ice can be reversed by freezing the water back into ice.' },
  { subject: 'science', topic: 'Reversible Changes', difficulty: 'Hard', question: 'Burning paper is an irreversible change because:', options: ['It gets wet', 'New substances are formed that cannot change back', 'It melts', 'It dissolves'], correctIndex: 1, explanation: 'Burning creates ash, smoke, and CO₂ — new substances that cannot become paper again.' },

  { subject: 'science', topic: 'Properties', difficulty: 'Easy', question: 'Which of these is a property of metals?', options: ['Transparent', 'Flexible like rubber', 'Shiny and hard', 'Absorbs light'], correctIndex: 2, explanation: 'Most metals are shiny, hard, and good conductors of heat and electricity.' },
  { subject: 'science', topic: 'Properties', difficulty: 'Medium', question: 'A material that returns to its original shape after being stretched is described as:', options: ['Rigid', 'Elastic', 'Brittle', 'Opaque'], correctIndex: 1, explanation: 'Elastic materials can stretch and return to their original shape, like a rubber band.' },

  // ===========================
  // SCIENCE — Physics
  // ===========================
  { subject: 'science', topic: 'Forces', difficulty: 'Easy', question: 'What force pulls objects towards the Earth?', options: ['Magnetism', 'Friction', 'Gravity', 'Air Resistance'], correctIndex: 2, explanation: 'Gravity pulls all objects towards the center of the Earth.' },
  { subject: 'science', topic: 'Forces', difficulty: 'Medium', question: 'What force slows down a sliding box on a rough floor?', options: ['Gravity', 'Friction', 'Magnetism', 'Upthrust'], correctIndex: 1, explanation: 'Friction acts between surfaces in contact and opposes movement.' },
  { subject: 'science', topic: 'Forces', difficulty: 'Hard', question: 'A skydiver reaches terminal velocity when:', options: ['They jump from the plane', 'Air resistance equals gravity', 'They open the parachute', 'They land'], correctIndex: 1, explanation: 'Terminal velocity is reached when air resistance balances gravity, so speed stays constant.' },

  { subject: 'science', topic: 'Light', difficulty: 'Easy', question: 'Light travels in:', options: ['Curved lines', 'Straight lines', 'Zig-zag lines', 'Circles'], correctIndex: 1, explanation: 'Light always travels in straight lines. This is why shadows have sharp edges.' },
  { subject: 'science', topic: 'Light', difficulty: 'Medium', question: 'What happens when light hits a mirror?', options: ['It is absorbed', 'It is reflected', 'It passes through', 'It disappears'], correctIndex: 1, explanation: 'Mirrors have a shiny surface that reflects light, creating an image.' },
  { subject: 'science', topic: 'Light', difficulty: 'Hard', question: 'A shadow is formed because:', options: ['Light bends around objects', 'Light cannot pass through opaque objects', 'Objects absorb all light', 'Light changes colour'], correctIndex: 1, explanation: 'Opaque objects block light, creating a dark shadow on the other side.' },

  { subject: 'science', topic: 'Sound', difficulty: 'Easy', question: 'Sound is made by:', options: ['Light', 'Heat', 'Vibrations', 'Gravity'], correctIndex: 2, explanation: 'All sounds are caused by vibrations. When something vibrates, it creates sound waves.' },
  { subject: 'science', topic: 'Sound', difficulty: 'Medium', question: 'Sound cannot travel through:', options: ['Water', 'Air', 'Metal', 'A vacuum (empty space)'], correctIndex: 3, explanation: 'Sound needs particles to travel. In a vacuum there are no particles, so sound cannot travel.' },

  { subject: 'science', topic: 'Electricity', difficulty: 'Easy', question: 'What is needed for a simple circuit to work?', options: ['A battery, wire, and bulb', 'Just a battery', 'Only a wire', 'A switch only'], correctIndex: 0, explanation: 'A complete circuit needs a power source (battery), wires, and a component (bulb).' },
  { subject: 'science', topic: 'Electricity', difficulty: 'Medium', question: 'What does a switch do in a circuit?', options: ['Increases voltage', 'Breaks or completes the circuit', 'Changes the colour of light', 'Makes the battery last longer'], correctIndex: 1, explanation: 'A switch opens (breaks) or closes (completes) the circuit, controlling the flow of electricity.' },
  { subject: 'science', topic: 'Electricity', difficulty: 'Hard', question: 'In a series circuit, what happens if one bulb breaks?', options: ['Other bulbs get brighter', 'Other bulbs stay the same', 'All bulbs go out', 'Only the broken bulb goes out'], correctIndex: 2, explanation: 'In a series circuit, there is only one path. If it breaks, the whole circuit stops.' },

  { subject: 'science', topic: 'Magnetism', difficulty: 'Easy', question: 'Which material is attracted to a magnet?', options: ['Wood', 'Plastic', 'Iron', 'Glass'], correctIndex: 2, explanation: 'Iron (and steel, cobalt, nickel) are magnetic materials attracted to magnets.' },
  { subject: 'science', topic: 'Magnetism', difficulty: 'Medium', question: 'What happens when two north poles of magnets are brought together?', options: ['They attract', 'They repel', 'Nothing happens', 'They stick together'], correctIndex: 1, explanation: 'Like poles (N-N or S-S) repel each other. Opposite poles attract.' },

  // ===========================
  // SCIENCE — Earth & Space
  // ===========================
  { subject: 'science', topic: 'Earth', difficulty: 'Easy', question: 'What causes day and night?', options: ['The Moon orbiting Earth', 'The Earth spinning on its axis', 'The Sun moving around Earth', 'Clouds blocking the Sun'], correctIndex: 1, explanation: 'Earth rotates (spins) on its axis once every 24 hours, causing day and night.' },
  { subject: 'science', topic: 'Earth', difficulty: 'Medium', question: 'What causes the seasons?', options: ['Distance from the Sun', 'The tilt of the Earth\'s axis', 'The speed of Earth\'s rotation', 'The Moon\'s gravity'], correctIndex: 1, explanation: 'The Earth is tilted at 23.5°. This tilt causes different parts to receive more or less sunlight during the year.' },

  { subject: 'science', topic: 'Solar System', difficulty: 'Easy', question: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctIndex: 2, explanation: 'Mercury is the closest planet to the Sun in our solar system.' },
  { subject: 'science', topic: 'Solar System', difficulty: 'Medium', question: 'How long does it take Earth to orbit the Sun?', options: ['1 day', '1 month', '1 year', '1 week'], correctIndex: 2, explanation: 'Earth takes approximately 365.25 days (1 year) to complete one orbit around the Sun.' },

  { subject: 'science', topic: 'Moon Phases', difficulty: 'Medium', question: 'Why does the Moon appear to change shape?', options: ['The Moon shrinks and grows', 'We see different amounts of the sunlit side', 'Earth\'s shadow covers it', 'Clouds cover parts of it'], correctIndex: 1, explanation: 'The Moon doesn\'t change shape. As it orbits Earth, we see different amounts of its sunlit half.' },
  { subject: 'science', topic: 'Moon Phases', difficulty: 'Hard', question: 'What is a full moon?', options: ['When the Moon is between Earth and Sun', 'When Earth is between the Sun and Moon', 'When the Moon is behind the Sun', 'When no sunlight hits the Moon'], correctIndex: 1, explanation: 'A full moon occurs when Earth is between the Sun and Moon, so we see the entire sunlit face.' },
];

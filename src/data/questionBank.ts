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
  // Science - Biology
  {
    subject: 'science',
    topic: 'Plants',
    difficulty: 'Medium',
    question: 'Which part of a plant is primarily responsible for photosynthesis?',
    options: ['Roots', 'Stem', 'Leaves', 'Flowers'],
    correctIndex: 2,
    explanation: 'Leaves contain chloroplasts with chlorophyll, which capture sunlight to make food for the plant.'
  },
  {
    subject: 'science',
    topic: 'Human Systems',
    difficulty: 'Easy',
    question: 'Which organ pumps blood throughout the human body?',
    options: ['Lungs', 'Brain', 'Heart', 'Stomach'],
    correctIndex: 2,
    explanation: 'The heart is a muscular organ that pumps blood to provide oxygen and nutrients to all parts of the body.'
  },
  {
    subject: 'science',
    topic: 'Habitats',
    difficulty: 'Medium',
    question: 'What adaptation helps a camel survive in a hot, dry desert?',
    options: ['Thick fur for warmth', 'Large humps to store fat', 'Gills for breathing', 'Webbed feet'],
    correctIndex: 1,
    explanation: 'Camels store fat in their humps, which they can break down for energy and water when resources are scarce.'
  },
  
  // Science - Physics
  {
    subject: 'science',
    topic: 'Forces',
    difficulty: 'Medium',
    question: 'What force pulls objects towards the center of the Earth?',
    options: ['Magnetism', 'Friction', 'Gravity', 'Air Resistance'],
    correctIndex: 2,
    explanation: 'Gravity is the invisible force that pulls all objects with mass towards each other.'
  },
  {
    subject: 'science',
    topic: 'Electricity',
    difficulty: 'Hard',
    question: 'In a series circuit, what happens if one bulb breaks?',
    options: ['The other bulbs get brighter', 'The other bulbs stay the same', 'All bulbs go out', 'Only the broken bulb goes out'],
    correctIndex: 2,
    explanation: 'In a series circuit, electricity has only one path to flow. If the path is broken by one bulb, the whole circuit stops working.'
  },

  // Math - Number
  {
    subject: 'math',
    topic: 'Fractions',
    difficulty: 'Medium',
    question: 'What is 1/4 written as a decimal?',
    options: ['0.14', '0.25', '0.4', '1.4'],
    correctIndex: 1,
    explanation: 'To convert 1/4 to a decimal, divide 1 by 4, which equals 0.25.'
  },
  {
    subject: 'math',
    topic: 'Percentages',
    difficulty: 'Hard',
    question: 'What is 20% of 150?',
    options: ['15', '20', '30', '45'],
    correctIndex: 2,
    explanation: '10% of 150 is 15. So, 20% is 15 x 2 = 30.'
  },

  // Math - Geometry
  {
    subject: 'math',
    topic: 'Angles',
    difficulty: 'Medium',
    question: 'What is the sum of angles in a triangle?',
    options: ['90 degrees', '180 degrees', '270 degrees', '360 degrees'],
    correctIndex: 1,
    explanation: 'The interior angles of any flat triangle always add up to exactly 180 degrees.'
  },
  
  // English - Grammar
  {
    subject: 'english',
    topic: 'Word Classes',
    difficulty: 'Medium',
    question: 'Identify the ADVERB in this sentence: "The dog barked loudly at the mailman."',
    options: ['dog', 'barked', 'loudly', 'mailman'],
    correctIndex: 2,
    explanation: 'An adverb describes a verb. "Loudly" describes HOW the dog barked.'
  },
  {
    subject: 'english',
    topic: 'Punctuation',
    difficulty: 'Hard',
    question: 'Which sentence uses apostrophes correctly?',
    options: ["The dogs' bone was buried.", "The dog's bone was buried.", "The dogs bone's was buried.", "The dogs bones' was buried."],
    correctIndex: 1,
    explanation: 'If there is one dog, the possessive is formed by adding apostrophe S: "dog\'s".'
  }
];

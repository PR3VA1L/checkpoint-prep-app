import fs from 'fs';

const mathTopics = ['Mental Math', 'Fractions', 'Decimals', 'Percentages', 'Geometry'];
const mathQuestions = [];

for (let i = 0; i < 50; i++) {
  let a = Math.floor(Math.random() * 50) + 10;
  let b = Math.floor(Math.random() * 50) + 10;
  mathQuestions.push(`{ subject: 'math', topic: 'Mental Math', difficulty: 'Medium', question: 'What is ${a} + ${b}?', options: ['${a+b-1}', '${a+b}', '${a+b+1}', '${a+b+10}'], correctIndex: 1, explanation: '${a} + ${b} = ${a+b}' }`);
  
  let c = Math.floor(Math.random() * 12) + 2;
  let d = Math.floor(Math.random() * 12) + 2;
  mathQuestions.push(`{ subject: 'math', topic: 'Mental Math', difficulty: 'Medium', question: 'What is ${c} × ${d}?', options: ['${c*d-c}', '${c*d}', '${c*d+c}', '${c*d+10}'], correctIndex: 1, explanation: '${c} × ${d} = ${c*d}' }`);
}

const englishQuestions = [
  `{ subject: 'english', topic: 'Grammar', difficulty: 'Easy', question: 'Identify the noun in this sentence: "The blue bird sings."', options: ['blue', 'bird', 'sings', 'The'], correctIndex: 1, explanation: 'A noun is a person, place, or thing. "bird" is a thing.' }`,
  `{ subject: 'english', topic: 'Grammar', difficulty: 'Medium', question: 'Which of the following is an adjective?', options: ['Run', 'Quickly', 'Beautiful', 'Happiness'], correctIndex: 2, explanation: '"Beautiful" describes a noun.' }`,
  `{ subject: 'english', topic: 'Punctuation', difficulty: 'Medium', question: 'Which sentence is correct?', options: ['Im going home.', 'I\\'m going home.', 'I am going, home.', 'Im going, home.'], correctIndex: 1, explanation: '\\'I\\'m\\' is the contraction for I am.' }`,
  `{ subject: 'english', topic: 'Vocabulary in Context', difficulty: 'Hard', question: 'What does "benevolent" mean?', options: ['Angry', 'Kind', 'Sad', 'Fast'], correctIndex: 1, explanation: '"Benevolent" means well meaning and kindly.' }`,
  `{ subject: 'english', topic: 'Grammar', difficulty: 'Medium', question: 'Identify the adverb: "He ran quickly."', options: ['He', 'ran', 'quickly', 'None'], correctIndex: 2, explanation: '"Quickly" describes how he ran.' }`
];

for(let i=0; i<10; i++) {
    englishQuestions.push(`{ subject: 'english', topic: 'Grammar', difficulty: 'Medium', question: 'Find the verb: "She walks to the park."', options: ['She', 'walks', 'park', 'to'], correctIndex: 1, explanation: 'A verb is an action word.' }`);
}

const scienceQuestions = [
  `{ subject: 'science', topic: 'Earth', difficulty: 'Medium', question: 'What is the closest planet to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctIndex: 2, explanation: 'Mercury is the closest planet.' }`,
  `{ subject: 'science', topic: 'Human Systems', difficulty: 'Easy', question: 'What organ pumps blood?', options: ['Brain', 'Lungs', 'Heart', 'Liver'], correctIndex: 2, explanation: 'The heart pumps blood.' }`
];

for(let i=0; i<10; i++) {
    scienceQuestions.push(`{ subject: 'science', topic: 'States of Matter', difficulty: 'Easy', question: 'What is the solid state of water?', options: ['Steam', 'Liquid', 'Ice', 'Cloud'], correctIndex: 2, explanation: 'Ice is frozen water.' }`);
}

let existing = fs.readFileSync('./src/data/questionBank.ts', 'utf-8');
existing = existing.replace('];', '');

const newContent = existing + '  // Generated block\n  ' + mathQuestions.join(',\n  ') + ',\n  ' + englishQuestions.join(',\n  ') + ',\n  ' + scienceQuestions.join(',\n  ') + '\n];\n';

fs.writeFileSync('./src/data/questionBank.ts', newContent);
console.log('Added 100+ questions successfully!');

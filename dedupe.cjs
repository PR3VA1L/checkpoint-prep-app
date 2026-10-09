const fs = require('fs');

const content = fs.readFileSync('./src/data/questionBank.ts', 'utf-8');
const lines = content.split('\n');

const seen = new Set();
const newLines = [];
let removedCount = 0;

for (let line of lines) {
  // Try to match a question string: question: '...' or question: "..."
  const match = line.match(/"?question"?\s*:\s*(['"])(.*?)\1/);
  if (match) {
    const questionText = match[2].toLowerCase().trim();
    if (seen.has(questionText)) {
      removedCount++;
      continue;
    } else {
      seen.add(questionText);
      newLines.push(line);
    }
  } else {
    newLines.push(line);
  }
}

fs.writeFileSync('./src/data/questionBank.ts', newLines.join('\n'));
console.log('Removed duplicates:', removedCount);
console.log('Unique questions remaining:', seen.size);

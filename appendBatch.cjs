const fs = require('fs');
const path = require('path');

const qPath = path.join(__dirname, 'src', 'data', 'questionBank.ts');
let qb = fs.readFileSync(qPath, 'utf8');

const newQuestions = JSON.parse(fs.readFileSync(path.join(__dirname, 'additional_questions.json'), 'utf8'));

// Format new questions to a string
const qsStr = newQuestions.map(q => `  ${JSON.stringify(q)},`).join('\n');

// Find the last closing bracket of the array
const closingBracketIndex = qb.lastIndexOf('];');

if (closingBracketIndex !== -1) {
    const before = qb.substring(0, closingBracketIndex).trimEnd();
    const after = qb.substring(closingBracketIndex + 2);
    
    // Ensure there is a comma after the last item if it doesn't have one
    let newBefore = before;
    if (!newBefore.endsWith(',')) {
        newBefore += ',';
    }

    const finalFile = `${newBefore}\n  // Batch 2 generated directly by Antigravity\n${qsStr}\n];\n${after}`;
    fs.writeFileSync(qPath, finalFile);
    console.log(`Successfully added ${newQuestions.length} questions to questionBank.ts`);
} else {
    console.error('Could not find closing bracket ]; in questionBank.ts');
}

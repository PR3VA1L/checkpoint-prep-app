const fs = require('fs');
const path = require('path');

const qPath = path.join(__dirname, 'src', 'data', 'questionBank.ts');
let qb = fs.readFileSync(qPath, 'utf8');

const q = {
  subject: "science",
  topic: "Electricity",
  difficulty: "Medium",
  imageUrl: "/images/circuit.jpg",
  question: "Look at the circuit diagram shown. What will happen if the open switch is closed?",
  options: [
    "Both Light Bulb 1 and Light Bulb 2 will turn on.",
    "Only Light Bulb 1 will turn on.",
    "Only Light Bulb 2 will turn on.",
    "The battery will explode."
  ],
  correctIndex: 0,
  explanation: "When the switch is closed, it completes the path for the electrons to flow from the battery. Since both bulbs are connected in parallel, current will flow through both branches and turn on both Light Bulb 1 and Light Bulb 2."
};

const closingBracketIndex = qb.lastIndexOf('];');

if (closingBracketIndex !== -1) {
    const before = qb.substring(0, closingBracketIndex).trimEnd();
    const after = qb.substring(closingBracketIndex + 2);
    
    let newBefore = before;
    if (!newBefore.endsWith(',')) {
        newBefore += ',';
    }

    const finalFile = `${newBefore}\n  // Image Question Test\n  ${JSON.stringify(q)}\n];\n${after}`;
    fs.writeFileSync(qPath, finalFile);
    console.log("Successfully added image question!");
}

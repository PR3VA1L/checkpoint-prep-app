import type { Question } from "./types";

const steps: Record<string, string> = {
  "math:number": "Underline the numbers and the operation the question asks for. Estimate first, then calculate and check the units.",
  "math:fractions": "Check whether the parts are the same size. Use a common denominator or find the fraction of the whole before comparing.",
  "math:decimals": "Line up the place values. Check tenths, hundredths and thousandths before you calculate.",
  "math:ratio": "Find the value of one equal part first, then scale to the number of parts asked for.",
  "math:sequences": "Write the change between each pair of terms. Check the rule works for more than one step.",
  "math:geometry": "Sketch and label what is known. Decide whether you need a length, area, angle or volume before choosing a rule.",
  "math:coordinates": "Read x across and y up or down. For a move, change one coordinate at a time.",
  "math:statistics": "Identify what each data value represents. For a mean, find the total and divide by the number of values.",
  "science:body": "Name the organ or process involved, then link its job to the change described in the question.",
  "science:ecosystems": "Trace each arrow from food to eater. Ask what other food sources are available before predicting a change.",
  "science:materials": "Look for evidence of a change in state or a new substance. Temperature and time may matter.",
  "science:forces": "Draw arrows for the forces and compare their size and direction before predicting movement.",
  "science:light": "Trace the light from its source to the object and then to the eye. Check the direction carefully.",
  "science:electricity": "Follow the complete path from one battery terminal to the other. Check each switch and component.",
  "science:earth": "Use the clues about how the rock or soil formed; do not choose from colour alone.",
  "science:space": "Think about the positions and movement of the Sun, Earth and Moon, not just what they look like from Earth.",
  "science:enquiry": "Identify what was changed, what was measured and what was kept the same. Use the results as evidence.",
  "english:inference": "Find two exact clues in the text. Choose the conclusion they support without adding a fact that is not stated.",
  "english:vocabulary": "Replace the word with each option in the sentence. Which keeps the meaning of the surrounding words?",
  "english:language": "Find the particular word or image. Ask what picture or feeling it creates for the reader.",
  "english:grammar": "Read each group of words alone. Does it make a complete thought, or does it depend on the main clause?",
  "english:punctuation": "Locate the named punctuation mark first. Read the words immediately before and after it to see what it separates or introduces.",
  "english:spelling": "Break the word into parts and check the root, prefix or suffix before choosing a spelling.",
};
export function usefulHint(q: Question): string {
  if (q.subject === "math" && /percentage|percent|%/i.test(q.stem))
    return "Find 10% or 1% first, then build the percentage asked for. Check whether the question asks for the part or the new total.";
  if (q.subject === "math" && /reflect|reflection/i.test(q.stem))
    return "A reflection keeps the point the same distance from the mirror line. Which coordinate changes sign?";
  if (q.subject === "science" && /fair test|variable/i.test(q.stem))
    return "A fair test changes one thing at a time. Identify that change, what is measured and what stays the same.";
  return steps[`${q.subject}:${q.topic}`] || q.hint;
}

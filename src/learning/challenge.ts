import { make } from "./math.js";
import { family } from "./science.js";
import type { Family, Question, Difficulty } from "./types";

// Stage 6 challenge items require several linked steps or careful use of evidence.
// The easier levels keep the same contexts without labelling a harder task Easy.
const englishCases = [
  {
    text: "Mina checked the dark clouds, then moved the picnic blankets into the hall. She left the invitations on the table.",
    easy: ["Where did Mina move the blankets?", "Into the hall", "Onto the field", "Into a car", "Under a tree"],
    medium: ["Why might Mina have moved the blankets?", "She thinks it may rain", "The hall is being repaired", "The picnic has ended", "The invitations are missing"],
    hard: ["Which inference uses both the clouds and Mina's action without claiming too much?", "Mina is preparing an indoor option in case it rains", "Mina has cancelled the picnic", "Rain has already soaked the blankets", "Mina knows the hall will be closed"],
  },
  {
    text: "Eli wrote 'I'm sorry' on a card. When he heard Sam at the door, he slipped the card into his pocket but stayed to greet him.",
    easy: ["What did Eli put in his pocket?", "A card", "A key", "A book", "A photograph"],
    medium: ["What might Eli be feeling?", "Unsure about giving Sam the card", "Certain Sam has read the card", "Angry that the door is locked", "Pleased that Sam has gone"],
    hard: ["Which inference is supported by both the card and Eli's actions?", "Eli wants to apologise but is hesitant to give Sam the card", "Sam has already forgiven Eli", "Eli has decided never to speak to Sam", "Sam asked Eli to hide the card"],
  },
  {
    text: "The sign said that the library would close at four. Asha glanced at the clock, chose one book instead of three and joined the short queue.",
    easy: ["How many books did Asha choose?", "One", "Two", "Three", "Four"],
    medium: ["Why did Asha choose fewer books?", "She noticed the library would soon close", "She had already read every other book", "The queue was closed", "She was told to buy a book"],
    hard: ["Which conclusion is best supported by the sign, clock and Asha's choice?", "Asha changed her plan because she thought time was limited", "Asha knew the library had already closed", "Asha disliked all three books", "Asha was not allowed to borrow more than one book"],
  },
  {
    text: "The first seedling had bent towards the window. Theo turned its pot and marked the new position in his notebook before watering it.",
    easy: ["What did Theo mark in his notebook?", "The pot's new position", "The window's size", "The seed's price", "The watering can's colour"],
    medium: ["Why might Theo have turned the pot?", "To see whether the seedling bends towards the window again", "To stop all growth", "To make the window brighter", "To remove the soil"],
    hard: ["Which inference is supported by the plant's movement and Theo's notes?", "Theo is investigating whether the seedling bends towards the light", "Theo has proved that every plant needs the same amount of water", "Theo knows the seedling will not bend again", "Theo has measured the window's temperature"],
  },
] as const;

const englishChallenge: Family = {
  id: "challenge-two-clues",
  subject: "english",
  topic: "inference",
  objective: "6Ri.10",
  variants: englishCases.length,
  make(variant: number, difficulty: Difficulty): Question {
    const example = englishCases[variant % englishCases.length];
    const [prompt, answer, ...wrong] = example[difficulty.toLowerCase() as "easy" | "medium" | "hard"];
    return {
      id: `v3-challenge-two-clues-${difficulty}-${variant}`,
      family: "challenge-two-clues",
      subject: "english",
      topic: "inference",
      objective: "6Ri.10",
      difficulty,
      context: example.text,
      stem: `${example.text}\n\n${prompt}`,
      options: [answer, ...wrong],
      correctIndex: 0,
      explanation: `The text supports "${answer}". The other choices add details that the text does not establish.`,
      hint: "Use the exact clues in the passage. Be careful with claims the writer has not made.",
      parts: [{ id: "a", text: prompt, marks: 1, answer, guidance: `Accept an answer equivalent to: ${answer}` }],
    };
  },
};

export const CHALLENGE_FAMILIES: Family[] = [
  make("challenge-ratio-equal", "ratio", "6Nf.13", (v, d) => {
    const red = 2 + (v % 4);
    const blue = red + 1 + (Math.floor(v / 4) % 3);
    const groups = 2 + (Math.floor(v / 12) % 10);
    const redCount = red * groups;
    const blueCount = blue * groups;
    const extra = blueCount - redCount;
    const answer = d === "Easy" ? redCount : d === "Medium" ? extra : redCount + blueCount;
    return {
      stem: d === "Easy"
        ? `Red and blue counters are in the ratio ${red}:${blue}. There are ${blueCount} blue counters. How many red counters are there?`
        : d === "Medium"
          ? `Red and blue counters are in the ratio ${red}:${blue}. There are ${blueCount} blue counters. How many more red counters are needed to make the two colours equal?`
          : `Red and blue counters are in the ratio ${red}:${blue}. Adding ${extra} red counters would make the colours equal. How many counters were there before any were added?`,
      answer,
      wrong: [extra, blueCount, redCount + blueCount + extra],
      explanation: `The difference of ${blue - red} ratio parts represents ${extra} counters, so one part is ${groups}. Originally there were ${redCount} red and ${blueCount} blue counters: ${redCount + blueCount} altogether.`,
    };
  }),
  make("challenge-fraction-remainder", "fractions", "6Nf.02", (v, d) => {
    const first = 3 + (v % 3);
    const second = 2 + (Math.floor(v / 3) % 3);
    const unit = 3 + (Math.floor(v / 9) % 14);
    const total = first * second * unit;
    const firstUsed = second * unit;
    const afterFirst = total - firstUsed;
    const secondUsed = afterFirst / second;
    const answer = d === "Easy" ? firstUsed : d === "Medium" ? afterFirst : afterFirst - secondUsed;
    return {
      stem: d === "Easy"
        ? `A box contains ${total} beads. ${`1/${first}`} of the beads are used. How many are used?`
        : d === "Medium"
          ? `A box contains ${total} beads. ${`1/${first}`} of the beads are used. How many remain?`
          : `A box contains ${total} beads. First, 1/${first} of them are used. Then 1/${second} of the REMAINING beads are used. How many beads are left?`,
      answer,
      wrong: [total - firstUsed - total / second, afterFirst, secondUsed],
      explanation: `First use ${firstUsed} of ${total}, leaving ${afterFirst}. The second fraction is of ${afterFirst}, not of the original amount: ${secondUsed} more are used, leaving ${afterFirst - secondUsed}.`,
    };
  }),
  make("challenge-mean-reverse", "statistics", "6Ss.03", (v, d) => {
    const mean = 8 + (v % 18);
    const rise = 1 + (Math.floor(v / 18) % 7);
    const fifth = mean + 5 * rise;
    return {
      stem: d === "Easy"
        ? `Four pupils have a mean score of ${mean}. What is their total score?`
        : d === "Medium"
          ? `Four pupils have a mean score of ${mean}. A fifth pupil scores ${fifth}. What is the mean score of all five pupils?`
          : `The mean score of four pupils is ${mean}. After a fifth pupil's score is included, the mean rises by ${rise}. What did the fifth pupil score?`,
      answer: d === "Easy" ? mean * 4 : d === "Medium" ? mean + rise : fifth,
      wrong: [mean + rise, mean * 4, fifth - rise],
      explanation: `The first four scores total 4 × ${mean} = ${mean * 4}. Five pupils with mean ${mean + rise} total 5 × ${mean + rise} = ${5 * (mean + rise)}. The fifth score is ${fifth}.`,
    };
  }),
  family("challenge-fair-evaporation", "enquiry", "6TWSa.04", 80, (v, d) => {
    const startA = 70 + v;
    const startB = startA + 10;
    const lostA = 8 + (v % 6);
    const lostB = lostA + 4;
    const endA = startA - lostA;
    const endB = startB - lostB;
    return {
      context: `Two trays of water were left in the same room for a day. Tray A was wide: ${startA} mL at the start and ${endA} mL at the end. Tray B was narrow: ${startB} mL at the start and ${endB} mL at the end.`,
      question: d === "Easy" ? "How much water did tray A lose?" : d === "Medium" ? "Which tray lost more water?" : "Can these results alone show that tray shape caused the difference in water lost?",
      answer: d === "Easy" ? `${lostA} mL` : d === "Medium" ? "Tray B" : "No. The trays started with different amounts of water, so shape was not the only changed factor.",
      wrong: d === "Easy" ? [`${lostB} mL`, `${endA} mL`, `${startA} mL`] : d === "Medium" ? ["Tray A", "Both lost the same amount", "Neither lost any water"] : ["Yes. Tray B lost more, proving its shape caused the difference.", "Yes. Different starting amounts make the comparison fairer.", "No. Water cannot evaporate indoors."],
      why: `Tray A lost ${lostA} mL and tray B lost ${lostB} mL. But they began with different volumes. To investigate shape fairly, start with equal amounts and keep other conditions the same.`,
      follow: "Name one change that would make a comparison of tray shape fairer.",
      followAnswer: "Start both trays with the same volume of water.",
    };
  }),
  family("challenge-foodweb-alternative", "ecosystems", "6Be.01", 5, (v, d) => {
    const [prey, other, predator] = [
      ["mice", "rabbits", "foxes"],
      ["mice", "small birds", "owls"],
      ["beetles", "grasshoppers", "lizards"],
      ["flies", "beetles", "frogs"],
      ["mice", "small birds", "hawks"],
    ][v];
    return {
      context: `A food web shows plants eaten by ${prey} and ${other}. Both ${prey} and ${other} are eaten by ${predator}. The number of ${prey} falls sharply.`,
      question: d === "Easy" ? `Name one food source for ${predator}.` : d === "Medium" ? `Why might the number of ${predator} change?` : `A pupil claims that all ${predator} must die because ${prey} became fewer. What is the strongest response using this food web?`,
      answer: d === "Easy" ? prey : d === "Medium" ? `There are fewer ${prey} for them to eat.` : `That is not certain: ${predator} can also eat ${other}, although less ${prey} may affect them.`,
      wrong: d === "Easy" ? ["Plants", "Sunlight", "Soil"] : d === "Medium" ? ["They will stop needing food.", "The plants will start eating them.", `They cannot eat ${other}.`] : [`Yes, because ${predator} can only eat ${prey}.`, `No, because the number of ${prey} cannot affect ${predator}.`, `Yes, because plants eat ${predator}.`],
      why: `The web shows two food sources for ${predator}: ${prey} and ${other}. Fewer ${prey} could affect the predator, but the web does not prove that all of them will die.`,
      follow: `What other food source for ${predator} is shown?`,
      followAnswer: other,
      diagram: { kind: "foodweb", nodes: ["plants", prey, other, predator], edges: [[0, 1], [0, 2], [1, 3], [2, 3]] },
    };
  }),
  englishChallenge,
];

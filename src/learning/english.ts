import type { Family, Question, Difficulty, Part } from "./types";
import { passageParts } from "./readingDetails";
const names = [
  "Maya",
  "Leo",
  "Aisha",
  "Sam",
  "Nia",
  "Ravi",
  "Zara",
  "Eli",
  "Tara",
  "Noah",
  "Amir",
  "Lena",
];
function family(
  id: string,
  topic: string,
  objective: string,
  variants: number,
  build: (v: number, d: Difficulty) => [string, string, string[], string],
): Family {
  return {
    id,
    subject: "english",
    topic,
    objective,
    variants,
    make(v, d) {
      const [stem, answer, wrong, explanation] = build(v, d);
      return {
        id: `v3-${id}-${d}-${v}`,
        family: id,
        subject: "english",
        topic,
        objective,
        difficulty: d,
        stem,
        context: stem,
        options: [answer, ...wrong],
        correctIndex: 0,
        explanation,
        hint: "Read the whole sentence or extract. Use the words around the clue to check your idea.",
        parts: [
          { id: "a", text: stem, answer, guidance: explanation, marks: 1 },
        ],
      };
    },
  };
}
export const ENGLISH_FAMILIES: Family[] = [
  family("inference-action", "inference", "6Ri.10", 12, (v, d) => {
    const n = names[v];
    return [
      `${n} checked the clock for the fourth time and moved the unopened envelope to the bottom of the pile. ${d === "Easy" ? "What had not been opened?" : d === "Medium" ? `What does this suggest about ${n}?` : `Which inference is best supported by both actions, rather than by an invented event?`}`,
      d === "Easy"
        ? "The envelope"
        : `${n} seems uneasy and is delaying reading the letter.`,
      [
        "The letter definitely contains bad news.",
        "The clock has stopped working.",
        "The envelope has already been read.",
      ],
      "Checking repeatedly and hiding the unopened envelope suggest unease or delay. We cannot know what the letter says: the text does not tell us.",
    ];
  }),
  family("inference-dialogue", "inference", "6Ri.14", 12, (v, d) => {
    const n = names[v];
    return [
      `“Of course I am ready,” said ${n}, tightening an already tight grip on the rope. ${d === "Easy" ? "What is the character holding?" : d === "Medium" ? "What feeling is suggested by the action?" : "Which comparison between the words and the action is best supported?"}`,
      d === "Easy"
        ? "A rope"
        : d === "Medium"
          ? "Nervousness"
          : "The words sound confident, but the action suggests nervousness.",
      [
        "The character has no worries at all.",
        "The rope has broken.",
        "The character is angry with the narrator.",
      ],
      "A tight grip can suggest tension. The action makes us question the confident words. Explain the clue rather than just naming a feeling.",
    ];
  }),
  family("fact-opinion", "inference", "6Ri.12", 12, (v, d) => {
    const count = 12 + v;
    return [
      `A report says: “${count} pupils joined the clean-up. It was the finest event our school has ever held. The group collected ${count * 2} bags.” ${d === "Easy" ? "How many pupils joined?" : d === "Medium" ? "Which statement is an opinion?" : "Which statement would need a judgement rather than simply checking the recorded counts?"}`,
      d === "Easy"
        ? String(count)
        : "It was the finest event our school has ever held.",
      [
        `The group collected ${count * 2} bags.`,
        `${count} pupils joined.`,
        "The text gives two counts.",
      ],
      "Counts can be checked. “Finest” expresses a judgement; another person could reasonably disagree.",
    ];
  }),
  family("vocab-context", "vocabulary", "6Rv.01", 12, (v, d) => {
    const rows = [
      [
        "reluctant",
        "She stayed by the door while everyone else volunteered.",
        "unwilling",
      ],
      [
        "fragile",
        "He carried it in both hands so it would not break.",
        "easily broken",
      ],
      [
        "scarce",
        "The last two buckets had to supply the whole village.",
        "in short supply",
      ],
      [
        "cautious",
        "She tested each stepping stone before moving her foot.",
        "careful to avoid danger",
      ],
      [
        "weary",
        "After the long walk, he could hardly keep his eyes open.",
        "very tired",
      ],
      [
        "persistent",
        "Even after three failed attempts, she tried again.",
        "not giving up",
      ],
      [
        "sheltered",
        "The wall kept the fierce wind away from the seedlings.",
        "protected",
      ],
      [
        "faint",
        "They had to stay silent to hear the distant sound.",
        "not strong or clear",
      ],
      [
        "abrupt",
        "Without warning, the music stopped halfway through a note.",
        "sudden",
      ],
      [
        "ample",
        "There was enough food for everyone, with plenty left over.",
        "more than enough",
      ],
      ["hesitant", "He began to speak, stopped, and tried again.", "uncertain"],
      [
        "vivid",
        "The description made the market seem to appear before her eyes.",
        "clear and lively",
      ],
    ][v];
    return [
      `${rows[1]} The writer uses “${rows[0]}”. ${d === "Hard" ? "Which meaning fits the evidence in this context, rather than just sounding similar to the word?" : "What does the word mean here?"}`,
      rows[2],
      [
        ["eager to begin", "unsure what to do", "too tired to continue"],
        [
          "flexible enough to bend",
          "able to last a long time",
          "valuable to its owner",
        ],
        ["available only in one place", "unsafe to use", "difficult to carry"],
        [
          "frightened of everything",
          "slow because of tiredness",
          "unwilling to take part",
        ],
        [
          "disappointed by the result",
          "ill with a fever",
          "bored by the journey",
        ],
        ["unwilling to listen", "sure of success", "working without a plan"],
        ["hidden from view", "warmer than every other place", "unable to grow"],
        [
          "far away but clearly heard",
          "regular and repeated",
          "pleasant to hear",
        ],
        ["deliberately quiet", "gradually fading", "too loud"],
        [
          "exactly the amount needed",
          "more expensive than expected",
          "only just enough",
        ],
        [
          "unwilling to speak the truth",
          "unable to speak at all",
          "careful to speak loudly",
        ],
        [
          "unusual but unclear",
          "colourful but impossible",
          "accurate but dull",
        ],
      ][v],
      `Use the action or detail as your clue: ${rows[1]} Here “${rows[0]}” means ${rows[2]}.`,
    ];
  }),
  family("language-personification", "language", "6Rv.06", 12, (v, d) => {
    const noun = [
      "wind",
      "rain",
      "gate",
      "river",
      "storm",
      "sea",
      "sun",
      "window",
      "fire",
      "branch",
      "fog",
      "old house",
    ][v];
    return [
      `“The ${noun} whispered a warning.” ${d === "Easy" ? "Which word describes a human action?" : d === "Medium" ? "Which language feature is used?" : "What is the main effect of giving this thing a human action?"}`,
      d === "Easy"
        ? "whispered"
        : d === "Medium"
          ? "Personification"
          : "It makes the setting seem alive and quietly threatening.",
      [
        "It proves a person is hidden inside it.",
        "It gives an exact scientific measurement.",
        "It says the setting is cheerful and safe.",
      ],
      "Personification gives a non-human thing a human action. “Whispered a warning” makes the setting seem alive and hints at danger.",
    ];
  }),
  family("language-simile", "language", "6Rv.04", 12, (v, d) => {
    const n = names[v];
    return [
      `“The thought circled in ${n}’s mind like a trapped moth.” ${d === "Easy" ? "What is the thought compared to?" : d === "Medium" ? "Which feature makes this a simile?" : "Which interpretation best explains the effect of this comparison?"}`,
      d === "Easy"
        ? "A trapped moth"
        : d === "Medium"
          ? "It compares two things using “like”."
          : "The thought keeps returning and is difficult to escape.",
      [
        "A real moth is inside the character’s head.",
        "The character has forgotten the thought.",
        "The comparison tells us the exact size of the thought.",
      ],
      "A trapped moth keeps moving without getting free. The comparison suggests a restless thought that will not go away.",
    ];
  }),
  family("purpose-reader", "language", "6Ri.05", 12, (v, d) => {
    const places = [
      "library",
      "playground",
      "garden",
      "sports field",
      "music room",
      "pond",
      "cycle track",
      "reading corner",
      "museum",
      "community hall",
      "park",
      "school kitchen",
    ];
    return [
      `“Imagine a safer ${places[v]}. Together, we can make it happen. Join our Saturday team!” ${d === "Easy" ? "When does the team meet?" : d === "Medium" ? "What is the main purpose?" : "Why does the writer combine “we” with an instruction to “Join”?"}`,
      d === "Easy"
        ? "Saturday"
        : d === "Medium"
          ? "To persuade readers to help."
          : "To include the reader in a shared goal and encourage action.",
      [
        "To describe an event that has already finished.",
        "To give a balanced list of arguments on both sides.",
        "To keep the reader separate from the writer.",
      ],
      "“We” includes the reader. “Join” asks for action. These choices support the purpose of persuading people to help.",
    ];
  }),
  family("main-clause", "grammar", "6Rg.02", 12, (v, d) => {
    const n = names[v];
    return [
      `“Although the rain had stopped, ${n} kept the coat on because the wind was cold.” ${d === "Easy" ? "Who kept the coat on?" : d === "Medium" ? "Which words form the main clause?" : "Which part can stand as a complete sentence without changing or adding words?"}`,
      d === "Easy" ? n : `${n} kept the coat on`,
      [
        "Although the rain had stopped",
        "because the wind was cold",
        "Although the rain",
      ],
      "The main clause makes sense on its own. The clauses beginning “although” and “because” add information but depend on the main clause.",
    ];
  }),
  family("passive", "grammar", "6Rg.06", 12, (v, d) => {
    const n = names[v];
    return [
      `“${n} repaired the broken gate.” ${d === "Easy" ? "Who did the action?" : d === "Medium" ? "Which version is in the passive voice and keeps the original past tense?" : "Which passive version keeps both the original meaning and the past tense?"}`,
      d === "Easy" ? n : `The broken gate was repaired by ${n}.`,
      [
        `The broken gate is repaired by ${n}.`,
        `${n} was repairing the broken gate.`,
        `The broken gate repaired ${n}.`,
      ],
      "In the passive version, the gate receives the action and comes first. “Was repaired” keeps the action in the past.",
    ];
  }),
  family("word-class", "grammar", "6Rg.05", 12, (v, d) => {
    const n = names[v];
    return [
      `“${n} worked extremely carefully.” ${d === "Easy" ? "Which word is the verb?" : d === "Medium" ? "What word class is “extremely”?" : "What is the job of “extremely” in this sentence?"}`,
      d === "Easy"
        ? "worked"
        : d === "Medium"
          ? "Adverb"
          : "It strengthens the meaning of the adverb “carefully”.",
      [
        "It names the person.",
        "It changes the tense of “worked”.",
        "It describes a noun called “carefully”.",
      ],
      "“Carefully” tells us how the person worked. “Extremely” tells us how carefully, so it modifies another adverb.",
    ];
  }),
  family("punctuation-parenthesis", "punctuation", "6Rg.01", 12, (v, d) => {
    const n = names[v];
    return [
      `“${n}, the youngest member of the team, volunteered first.” ${d === "Easy" ? "Which punctuation marks surround the extra information?" : d === "Medium" ? "Why are the two commas used?" : "Which explanation accounts for both commas and the remaining sentence?"}`,
      d === "Easy"
        ? "Commas"
        : "They separate extra information; the sentence still works if that part is removed.",
      [
        "They separate three items in a list.",
        "They show the exact words spoken.",
        "They indicate a missing letter.",
      ],
      `The extra information is “the youngest member of the team”. Without it, “${n} volunteered first” is still a complete sentence.`,
    ];
  }),
  family("punctuation-possession", "punctuation", "6Wg.03", 12, (v, d) => {
    const things = [
      "bags",
      "coats",
      "books",
      "boots",
      "desks",
      "bikes",
      "hats",
      "notebooks",
      "pencils",
      "lunchboxes",
      "gloves",
      "drawings",
    ][v];
    return [
      `The ${things} belong to several girls. ${d === "Hard" ? "Which phrase shows plural possession, rather than one owner or an apostrophe on the thing owned?" : "Which phrase is correct?"}`,
      `the girls’ ${things}`,
      [`the girl’s ${things}`, `the girls ${things}’`, `the girls ${things}`],
      "More than one girl is “girls”. Put the apostrophe after the plural s to show the girls own the things.",
    ];
  }),
  family("homophones", "spelling", "6Ww.04", 12, (v) => {
    const rows = [
      ["The pupils were ___ to use the library.", "allowed", "aloud"],
      ["Please read the final sentence ___.", "aloud", "allowed"],
      ["She asked for some useful ___.", "advice", "advise"],
      ["Can you ___ me on the best route?", "advise", "advice"],
      ["They walked ___ the closed shop.", "past", "passed"],
      ["He ___ the book to his friend.", "passed", "past"],
      ["The camel crossed the ___.", "desert", "dessert"],
      ["Fruit was served for ___.", "dessert", "desert"],
      ["The team will practise ___ tomorrow.", "there", "their"],
      ["The pupils carried ___ books.", "their", "there"],
      ["___ going to finish the project.", "They’re", "Their"],
      ["The bicycle lost ___ front light.", "its", "it’s"],
    ][v];
    return [
      `Choose the word that completes the sentence correctly: ${rows[0]}`,
      rows[1],
      [rows[2], rows[1] + "s", rows[2] + "s"],
      `Read the complete sentence. “${rows[1]}” fits the meaning and grammar here; “${rows[2]}” has a different use.`,
    ];
  }),
];

export interface Reading {
  id: string;
  paper: 1 | 2;
  title: string;
  paragraphs: string[];
  word: string;
  meaning: string;
  quote: string;
  effect: string;
  inference: string;
  detail: string;
}
export const READINGS: Reading[] = [
  {
    id: "seed-library",
    paper: 1,
    title: "A library that grows",
    word: "dormant",
    meaning: "alive but not actively growing",
    quote: "a library that grows",
    effect:
      "It connects borrowing books with sharing seeds and suggests the project can spread.",
    detail:
      "People borrow seeds, grow plants, and return some seeds from their harvest.",
    inference: "The organiser values sharing knowledge as well as seeds.",
    paragraphs: [
      "On a shelf between the gardening books and the local maps, a row of small paper envelopes waits for visitors. Each carries a plant name, a planting month and a few careful notes. These are not packets for sale. They belong to the town’s seed library, where the things people borrow can produce more of themselves.",
      "The idea began when librarian Jo noticed neighbours throwing away spare seeds while other families bought new packets. Some packets contained far more seeds than a small garden could use. Jo asked three experienced gardeners to help label a donated collection. Within a month, the shelf held beans, tomatoes, sunflowers and herbs. Every variety had been chosen because it could grow in local conditions.",
      "Borrowers take a small envelope and record what they have chosen. If their plants produce suitable seeds, they dry a few and return them in a labelled packet. Nobody is fined if a crop fails. “A cold spring can surprise even the best gardener,” Jo explains. “We want people to learn, not to worry about paying a debt.” Beginners can attend a free demonstration before planting.",
      "A seed may look like a lifeless speck, but it can remain dormant until conditions are right. The library keeps its collection cool and dry. Volunteers test a few seeds from older packets to see whether they still grow. If only a small number sprout, the label warns borrowers that they may need to plant more. The volunteers record results rather than guessing from a seed’s appearance.",
      "The project is not without difficulties. Returned packets sometimes lack dates, and volunteers must check them before placing them on the shelf. Jo is also careful not to promise that every plant will thrive. A windowsill and a large garden offer different conditions. Advice must fit the space that a borrower actually has.",
      "This year, the library added a notebook in which growers can describe successes and mistakes. One child wrote that a bean plant outgrew its support and toppled over. Another visitor suggested a taller frame. Jo says these pages are as valuable as the envelopes. A library that grows, she believes, should help ideas grow too.",
    ],
  },
  {
    id: "repair-cafe",
    paper: 1,
    title: "Before you throw it away",
    word: "hesitated",
    meaning: "paused because of uncertainty",
    quote: "a second life",
    effect:
      "It makes repairing an object sound like a fresh chance rather than simply fixing damage.",
    detail:
      "Volunteers help owners repair objects and explain the repair process.",
    inference:
      "The organisers want people to learn, not just leave their possessions for someone else to fix.",
    paragraphs: [
      "At nine on Saturday morning, the community hall looks more like a workshop than a meeting room. Lamps, wooden stools and bags with broken zips cover the tables. Their owners sit beside volunteer repairers, watching carefully. A sign by the door reads: “Before you throw it away, let’s look at it together.”",
      "The repair café began with a simple problem. Local residents were discarding useful objects because a small part had failed. Buying a replacement often seemed easier than finding a repairer. Engineer Ana suggested a monthly meeting where people could share skills. The first session attracted six visitors. Now the organisers ask people to book a time so nobody has to wait all morning.",
      "At one table, a boy called Ben brings a stool with a loose leg. He has painted it himself and does not want a new one. Volunteer Malik asks Ben to show him where it moves. They check each joint before deciding what to do. Malik explains that guessing too quickly can hide another fault. Together they tighten a fitting and test the stool on a level floor.",
      "Not everything can be repaired. Some objects need specialist tools, and electrical work is handled only by appropriately qualified volunteers. When a repair is unsafe or impractical, the owner is told why. “We do not promise miracles,” Ana says. “A clear explanation is better than a repair that puts somebody at risk.”",
      "At first, one visitor hesitated at the entrance with a torn bag. She thought the damage was too small to bother anyone. Ten minutes later, she was practising a stitch on a scrap of cloth. Her bag had been useful for years; now it could have a second life. She left knowing how to deal with a similar tear herself.",
      "The café records which objects are repaired and which cannot be saved. These notes help the team choose future demonstrations. They also show that keeping something useful is not always a matter of spending money. Often it begins with time, patience and a person willing to explain what they know.",
    ],
  },
  {
    id: "rain-garden",
    paper: 1,
    title: "Making room for rain",
    word: "gradually",
    meaning: "slowly over time",
    quote: "making room for rain",
    effect:
      "It presents rain as something to plan for and accommodate rather than only a problem.",
    detail:
      "A shallow planted area collects runoff and lets it soak into the ground.",
    inference:
      "The planners care about testing the idea and listening to people affected by it.",
    paragraphs: [
      "After heavy rain, the path beside the sports centre used to disappear beneath a broad puddle. Water ran quickly from the roof and car park, carrying grit towards the nearest drain. When the drain could not cope, visitors had to make a long detour. A proposed solution was not a larger pipe but a shallow garden.",
      "The new rain garden sits slightly lower than the surrounding path. A small channel guides runoff into it. Plants chosen for changing wet and dry conditions grow in loose soil. Water can collect there temporarily, then soak gradually into the ground. The garden is not a permanent pond, and its depth has been planned so that paths remain accessible.",
      "Before construction, the designers watched where water travelled during several storms. They checked the soil and measured the available space. Copying another garden’s shape would not have been enough. “The water does not read our drawings,” jokes planner Imani. “We have to design around what happens here.”",
      "Some neighbours worried that the area would look untidy or attract litter. Others wanted flowers that would be bright throughout the year. The team held a meeting and changed the planting plan. Low plants were placed near the path so that visitors could see clearly across the space. A small sign explains why the ground is sometimes wet.",
      "Volunteers now inspect the inlet after storms and remove leaves that might block it. They record how long standing water remains. If it stays longer than expected, the team investigates rather than assuming that every puddle is harmless. A garden needs maintenance just as a drain does.",
      "The sports centre has fewer flooded-path complaints, but the planners are cautious about making broad claims. One garden cannot prevent every flood. What it can do is manage water at a particular place while adding a useful green space. Making room for rain is one local step, not a promise that weather can be controlled.",
    ],
  },
  {
    id: "night-train",
    paper: 2,
    title: "The last light",
    word: "reluctantly",
    meaning: "unwillingly or with hesitation",
    quote: "the station held its breath",
    effect:
      "It personifies the station, making the quiet moment feel tense and expectant.",
    detail:
      "Mira returns to the bench to retrieve a tin for the station keeper.",
    inference:
      "Mira chooses to help even though she is afraid of missing the train.",
    paragraphs: [
      "The station held its breath. Beyond the lamps, the rails disappeared into a dark fold of hills. Mira stood beside the final carriage, one foot already on the step, and searched her pocket for the ticket. At last she was leaving. All afternoon she had imagined this moment; now her fingers would not keep still.",
      "“Anything forgotten?” the station keeper asked. He was closing the wooden shutters of his little office. Mira shook her head. Then she noticed his eyes move towards the bench at the far end of the platform. A small blue tin stood beneath it, almost hidden by a fallen timetable. He reached for his walking stick, but the conductor had already raised a whistle.",
      "Mira knew the tin. Earlier, while she waited, the keeper had shown her the old photographs inside: a young woman beside a bicycle, two children on a beach, this same station with trees no taller than the roof. He had said nothing about their value. He had simply placed each photograph back as gently as if it were made of frost.",
      "“I can get it,” Mira said. The words surprised her. She stepped down reluctantly, leaving the warm rectangle of carriage light behind. Her bag knocked against her knees as she ran. The bench seemed farther away than it had in daylight. Behind her, a door shut with a sound like a handclap.",
      "She snatched up the tin, but the lid slid sideways. For one terrible second the photographs shifted towards the edge. Mira pressed both hands around the box and stopped. Running carelessly now would undo the whole journey. She fitted the lid firmly before turning back.",
      "The conductor was watching her. He had lowered the whistle. “No need to break your neck,” he called, and held the door. Mira passed the tin to the keeper. His answer was only a nod, yet his hands were trembling. As the train finally moved, she saw him beneath the last lamp, holding the blue box close. This time, when Mira found her ticket, her fingers were steady.",
    ],
  },
  {
    id: "glass-house",
    paper: 2,
    title: "The missing pane",
    word: "brittle",
    meaning: "easily broken or snapped",
    quote: "an empty eye",
    effect:
      "It makes the broken window seem unsettling and draws attention to the missing glass.",
    detail: "Tomas admits he broke the pane before a storm arrives.",
    inference:
      "Tomas learns that admitting his mistake allows others to help repair it.",
    paragraphs: [
      "The missing pane stared from the greenhouse like an empty eye. Tomas stood outside with the football under his arm. The ball had bounced once against the wall, once against the paving stones, and then exactly where he had hoped it would not. The brittle glass lay in bright pieces on the floor.",
      "His grandmother was still in the house. Through the kitchen window he could see her filling a jug. In a moment she would come to water the seedlings. Tomas looked at the narrow gap behind the shed where he could hide the ball. If he said nothing, perhaps she would think the wind had done it.",
      "A gust lifted the corner of a newspaper on the bench. Tomas remembered the weather warning on the radio. Rain was due before evening. In the greenhouse, rows of small plants leaned towards the light. They had taken weeks to grow, and he had helped label every pot. Hiding the ball would not close the hole.",
      "He opened the kitchen door. “I need to tell you something,” he began. His grandmother set down the jug and waited. That was worse than a question. The words came slowly at first, then all at once. He described the kick, the bounce and the noise. He did not mention the wind.",
      "She looked at him for a long moment. “Thank you for telling me now,” she said. “First, we keep everyone away from the glass.” She found thick gloves for herself and asked Tomas to fetch a board. He wanted to clear the floor, to make the damage disappear quickly, but she explained why that part was not his job.",
      "By the time the rain arrived, the gap was covered and the plants had been moved away from the wall. The greenhouse looked patched and imperfect, but it was safe. Tomas placed the football in the cupboard. His grandmother handed him the jug. “The seedlings still need you,” she said. The ordinary task felt, somehow, like being trusted with something new.",
    ],
  },
  {
    id: "map-room",
    paper: 2,
    title: "A different route",
    word: "familiar",
    meaning: "known from previous experience",
    quote: "the map was certain; the river was not",
    effect: "It contrasts the fixed map with a changing real landscape.",
    detail:
      "Leila compares the old map with present evidence before choosing the bridge.",
    inference:
      "Leila is willing to change her plan when evidence contradicts it.",
    paragraphs: [
      "On her grandfather’s map, the route was simple: follow the river, cross the stepping stones, and climb the lane to the old mill. Leila had traced the line so often that it felt familiar before she had walked a single step. She folded the paper carefully and slipped it into the clear pocket of her bag.",
      "For the first hour everything matched. The crooked oak leaned over the path; the stone wall ended beside a gate. Her younger brother, Finn, checked each landmark as if he were ticking answers in a book. “The stones will be next,” he announced. Leila nodded, pleased that she had planned so well.",
      "Then the path widened into mud. Where the map showed stepping stones, brown water hurried over a low ridge. One rounded top appeared for an instant and vanished again. Finn took a step forward, but Leila caught his sleeve. The map was certain; the river was not. Rain in the hills had changed the crossing.",
      "“Grandad went this way,” Finn protested. Leila looked at the date in the corner of the paper. It was older than either of them. For a moment she wanted to prove that her route still worked. She imagined returning with no story except that they had turned back. Then a branch swept past the hidden stones and struck the bank with a sharp crack.",
      "They walked back to a sign they had passed earlier. It pointed towards a footbridge, adding half an hour to the journey. Leila marked the new route lightly in pencil. Finn complained about the extra distance, then began counting the birds above the reeds. By the bridge, he had forgotten to be disappointed.",
      "At the mill, Leila opened the map again. Her pencilled line curved away from her grandfather’s neat original. It did not look as tidy, but it showed where they had actually been. She decided she would not rub it out. When Grandad asked about the journey, there would be a story after all.",
    ],
  },
];
export function readingQuestion(
  reading: Reading,
  difficulty: Difficulty,
): Question {
  const parts: Part[] = [
    ...passageParts(reading.id, difficulty),
    {
      id: "9",
      text: `Explain the meaning of “${reading.word}” in this text, then give a detail that supports your meaning.`,
      marks: 2,
      answer: reading.meaning,
      guidance:
        "One mark for the contextual meaning; one for a supporting action or detail from the text.",
    },
    {
      id: "10",
      text: `Explain the effect of “${reading.quote}”. Do not just name a language feature.`,
      marks: 2,
      answer: reading.effect,
      guidance:
        "One mark for a plausible interpretation; one for explaining the effect of a specific word/image.",
    },
    {
      id: "11",
      text:
        difficulty === "Easy"
          ? "What does the main person or organiser learn or believe? Give a supporting detail."
          : difficulty === "Medium"
            ? "What can you infer about the main person or organiser? Support your inference with a detail."
            : "What does a choice reveal about the main person or organiser? Explain how a precise detail supports your inference.",
      marks: 2,
      answer: reading.inference,
      guidance:
        "One mark for a valid inference, one for relevant evidence linked to it.",
    },
    {
      id: "12",
      text:
        reading.paper === 1
          ? "Explain the main purpose of this text. Give two choices the writer makes to achieve that purpose."
          : "Explain how the mood changes in this story. Give two details that help create the change.",
      marks: 3,
      answer:
        reading.paper === 1
          ? "To inform interested readers about the project; accept another supported interpretation, with two relevant choices such as explanation, examples or quotations."
          : "A supported account of changing mood, with two distinct details from the story.",
      guidance:
        "One mark for an appropriate purpose/mood; one for each relevant detail linked to it.",
    },
    {
      id: "13",
      text: "Give two quotations that show a person responding thoughtfully to a problem. Explain what each quotation shows.",
      marks: 4,
      answer:
        reading.inference +
        " Accept two different relevant quotations and reasoned explanations.",
      guidance:
        "One mark per relevant quotation and one per linked explanation. Do not award the same point twice.",
    },
  ];
  return {
    id: `v3-reading-${reading.id}`,
    family: `reading-paper-${reading.paper}`,
    subject: "english",
    topic: "inference",
    objective: "6Ri.14",
    difficulty,
    stem: reading.title,
    context:
      "Read the original practice text, then answer each question. Refer to paragraph numbers when useful.",
    options: [],
    correctIndex: 0,
    explanation:
      "Use the passage as evidence. Explain how the words support your answer.",
    hint: "An inference is an idea you work out from clues in the text.",
    parts,
  };
}
export function writingTask(
  paper: 1 | 2,
  variant: number,
  difficulty: Difficulty,
): Question {
  const places = [
    "a community garden",
    "a school library",
    "a wildlife centre",
    "a public playground",
    "a local museum",
    "a walking route",
    "a sports club",
    "a riverside park",
    "a music room",
    "a neighbourhood market",
  ];
  const purposes = [
    "Write a persuasive article for local families explaining a change you would make to",
    "Write a balanced argument for your school magazine about spending money on",
    "Write an informative article for younger pupils introducing",
    "Write a recount for a community newsletter about a memorable visit to",
  ];
  const sparks = [
    "an unexpected message",
    "a key that does not fit the expected door",
    "a promise that is difficult to keep",
    "a sound nobody else seems to hear",
    "a mistaken accusation",
    "an unusual gift",
    "a journey that changes direction",
    "a small act of courage",
    "a missing object",
    "an unexpected visitor",
  ];
  const settings = [
    "on the last day of term",
    "during a journey",
    "before an important event",
    "in a place that used to feel familiar",
  ];
  const prompt =
    paper === 1
      ? `${purposes[Math.floor(variant / 10) % purposes.length]} ${places[variant % 10]}.`
      : `Write a story about ${sparks[variant % 10]} ${settings[Math.floor(variant / 10) % settings.length]}.`;
  const demand =
    difficulty === "Hard"
      ? paper === 1
        ? "Address a reasonable opposing view and connect your conclusion to your opening."
        : "Reveal a change in the character through actions; connect the ending to a detail near the start."
      : difficulty === "Medium"
        ? "Develop your ideas with relevant detail and organise them in paragraphs."
        : "Plan a clear beginning, middle and ending. Explain your main ideas clearly.";
  return {
    id: `v3-writing-${paper}-${variant}`,
    family: `writing-${paper}-genre-${Math.floor(variant / 10)}`,
    subject: "english",
    topic: "language",
    objective: "6Wc.07",
    difficulty,
    stem: prompt,
    context: prompt + " " + demand,
    options: [],
    correctIndex: 0,
    explanation:
      "Write for the stated purpose and reader. Use clear, accurate language; unusual words alone do not improve writing.",
    hint: "Plan your main ideas before writing. Leave time to check your work.",
    parts: [],
  };
}

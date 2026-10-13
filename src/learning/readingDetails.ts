import type { Part, Difficulty } from "./types";
type Row = [string, string, number];
const details: Record<string, Row[]> = {
  "seed-library": [
    [
      "Where is the seed collection kept?",
      "On a shelf between the gardening books and local maps.",
      1,
    ],
    [
      "Name one item of information written on each envelope.",
      "Plant name, planting month or notes about growing it.",
      1,
    ],
    [
      "Give two reasons why Jo started the seed library.",
      "Some neighbours threw spare seeds away; other families bought packets containing more than they needed.",
      2,
    ],
    [
      "Why are borrowers not fined if a crop fails?",
      "Weather can defeat even experienced gardeners; the purpose is learning, not worry about a debt.",
      2,
    ],
    [
      "What do volunteers do before deciding whether older seeds still grow?",
      "They plant/test a few and observe how many sprout.",
      1,
    ],
    [
      "Explain why Jo cannot give exactly the same growing advice to every borrower.",
      "Borrowers have different growing spaces/conditions; advice must suit the actual space.",
      2,
    ],
    [
      "In the final paragraph, why does Jo say the notebook is as valuable as the envelopes?",
      "It shares experience and helps other growers solve problems, as well as sharing seeds.",
      2,
    ],
    ["Copy the word from paragraph 4 meaning “begin to grow”.", "sprout", 1],
  ],
  "repair-cafe": [
    ["Where does the repair café meet?", "The community hall.", 1],
    [
      "How often was the meeting planned to take place?",
      "Monthly / once a month.",
      1,
    ],
    [
      "Give two reasons why residents were throwing away useful objects.",
      "A small part had failed; buying a replacement seemed easier than finding a repairer.",
      2,
    ],
    [
      "Why does Malik check every joint before repairing Ben’s stool?",
      "A quick guess could miss another fault; checking identifies what actually needs repair.",
      2,
    ],
    [
      "Who is allowed to handle electrical work at the café?",
      "Appropriately qualified volunteers.",
      1,
    ],
    [
      "Explain why Ana thinks a clear explanation can be better than a repair.",
      "A repair may be unsafe or impractical; explaining this avoids putting someone at risk.",
      2,
    ],
    [
      "What two benefits does the visitor with the bag gain?",
      "Her bag is repaired/can be used again; she learns how to repair a similar tear herself.",
      2,
    ],
    [
      "Copy one word from paragraph 4 that shows the café cannot promise impossible results.",
      "miracles",
      1,
    ],
  ],
  "rain-garden": [
    [
      "Name one place from which water ran towards the drain.",
      "The roof or car park.",
      1,
    ],
    ["Is the rain garden intended to be a permanent pond?", "No.", 1],
    [
      "Give two things designers did before construction.",
      "Watched water during storms; checked the soil; measured available space. Any two.",
      2,
    ],
    [
      "Why would copying the shape of another garden not be enough?",
      "Water movement and soil/space differ between places; the design must fit this site.",
      2,
    ],
    [
      "What do volunteers remove from the inlet after storms?",
      "Leaves that might block it.",
      1,
    ],
    [
      "Give two ways the design considers visitors using the path.",
      "Depth keeps paths accessible; low plants allow a clear view across the space.",
      2,
    ],
    [
      "Explain why the planners do not claim that one garden can prevent every flood.",
      "It manages water at one place; storms and other locations can still produce flooding.",
      2,
    ],
    [
      "Copy a word from paragraph 1 meaning a longer route around a problem.",
      "detour",
      1,
    ],
  ],
  "night-train": [
    [
      "Where is the blue tin when Mira notices it?",
      "Beneath the bench at the far end of the platform.",
      1,
    ],
    ["What is inside the tin?", "Old photographs.", 1],
    [
      "Give two details showing that the train is close to leaving.",
      "Mira is at the carriage step; the conductor raises a whistle; a door shuts. Any two.",
      2,
    ],
    [
      "Why does Mira stop instead of continuing to run with the tin?",
      "The lid slips and the photographs may fall out; she secures it so helping does not damage them.",
      2,
    ],
    [
      "What does the conductor lower while waiting for Mira?",
      "The whistle.",
      1,
    ],
    [
      "Explain what the keeper’s careful handling of the photographs suggests about them.",
      "They are personally valuable/precious to him; his gentle handling supports this.",
      2,
    ],
    [
      "How do Mira’s fingers change between the opening and ending? What does this suggest?",
      "They are unsteady at first and steady at the end; she seems calmer/more confident after helping.",
      2,
    ],
    [
      "What is the job of the question mark in “Anything forgotten?”",
      "It ends a direct question asked by the keeper.",
      1,
    ],
  ],
  "glass-house": [
    ["What breaks the greenhouse pane?", "The football.", 1],
    [
      "What is Tomas’s grandmother doing when he first looks towards the house?",
      "Filling a jug.",
      1,
    ],
    [
      "Give two reasons why the broken pane needs attention soon.",
      "A storm/rain is expected; fragile seedlings/plants need protection; broken glass is dangerous. Any two.",
      2,
    ],
    [
      "Why does “Hiding the ball would not close the hole” matter to Tomas’s decision?",
      "Concealing the cause cannot repair/protect the greenhouse; admitting the mistake allows action.",
      2,
    ],
    [
      "Who handles the dangerous broken glass?",
      "The grandmother / an adult, not Tomas.",
      1,
    ],
    [
      "Why does the grandmother thank Tomas for telling her “now”?",
      "They still have time to make the greenhouse safe/protect the plants before rain; he is honest promptly.",
      2,
    ],
    [
      "Explain why giving Tomas the jug at the end is important.",
      "He is still trusted to care for the plants despite the mistake; it shows he can help responsibly.",
      2,
    ],
    [
      "What do the speech marks around “I need to tell you something” show?",
      "The exact words Tomas says / direct speech.",
      1,
    ],
  ],
  "map-room": [
    ["Where are Leila and Finn going?", "The old mill.", 1],
    [
      "What is covering most of the stepping stones?",
      "High/muddy/brown river water.",
      1,
    ],
    [
      "Give two details suggesting the old crossing is unsafe now.",
      "Water covers the stones; a stone appears then disappears; a branch strikes the bank; mud/high flow. Any two.",
      2,
    ],
    [
      "Why does the date on the map make Leila question her original plan?",
      "The map is old; present river conditions may differ from those when it was made.",
      2,
    ],
    [
      "How much extra time does the footbridge route add?",
      "Half an hour / 30 minutes.",
      1,
    ],
    [
      "Explain why Leila keeps the pencilled route rather than rubbing it out.",
      "It records where they really travelled and the sensible change she made using new evidence.",
      2,
    ],
    [
      "How does Finn’s mood change on the alternative route? Give evidence.",
      "He is initially disappointed/complains about distance; later he counts birds and forgets the disappointment.",
      2,
    ],
    [
      "What does the apostrophe in “grandfather’s map” show?",
      "Possession: the map belongs to her grandfather.",
      1,
    ],
  ],
};
export function passageParts(id: string, difficulty: Difficulty): Part[] {
  return (details[id] || []).map(([text, answer, marks], i) => ({
    id: String(i + 1),
    text:
      text +
      (difficulty === "Hard" && marks === 2
        ? " Use precise details from the text."
        : ""),
    answer,
    marks,
    guidance:
      marks === 1
        ? "Award 1 mark for the correct detail or equivalent wording."
        : "Award 1 mark for each distinct correct point. Where an explanation is requested, award 1 for the valid idea and 1 for supporting detail. Do not require the model wording.",
  }));
}

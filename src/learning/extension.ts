import { make } from "./math.js";
import { family } from "./science.js";
import type { Family } from "./types";
import { num } from "./random.js";
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const frac = (a: number, b: number) => {
  const g = gcd(a, b);
  return b / g === 1 ? String(a / g) : `${a / g}/${b / g}`;
};
export const EXTENSION_FAMILIES: Family[] = [
  make("common-multiples", "number", "6Ni.06", (v, d) => {
    const a = 3 + (v % 8),
      b = 4 + (Math.floor(v / 8) % 8),
      lcm = (a * b) / gcd(a, b),
      after = lcm + (v % 6);
    const answer =
      d === "Easy"
        ? lcm
        : d === "Medium"
          ? lcm * 2
          : Math.floor(after / lcm + 1) * lcm;
    return {
      stem:
        d === "Easy"
          ? `Two lights flash every ${a} seconds and every ${b} seconds. They flash together now. In how many seconds will they next flash together?`
          : d === "Medium"
            ? `Two bells ring every ${a} and ${b} minutes. They ring together at time 0. At what time in minutes will they ring together for the SECOND time after time 0?`
            : `Two alarms beep every ${a} and ${b} minutes from time 0. A pupil arrives ${after} minutes after time 0. At what time, in minutes after time 0, will both NEXT beep together, strictly after the pupil arrives?`,
      answer,
      wrong: [a + b, a * b, answer + lcm],
      explanation: `Common beeps occur at multiples of both ${a} and ${b}: every ${lcm} minutes (or seconds in the first question). Count those shared times carefully; the required time is ${answer}.`,
    };
  }),
  make("fraction-combine", "fractions", "6Nf.05", (v, d) => {
    const a = 1 + (v % 3),
      b = 1 + (Math.floor(v / 3) % 5);
    const answer =
      d === "Easy"
        ? frac(a, 4)
        : d === "Medium"
          ? frac(a * 3 + b * 2, 12)
          : frac(24 - a * 3 - b * 2, 12);
    return {
      stem:
        d === "Easy"
          ? `Write ${a * 3}/12 in its simplest form.`
          : d === "Medium"
            ? `Calculate ${a}/4 + ${b}/6. Give a fraction in its simplest form.`
            : `A jug holds 2 litres. ${a}/4 litre and then ${b}/6 litre are poured out. What fraction of a litre is left? Give your answer in its simplest form.`,
      answer,
      wrong: [frac(a + b, 10), frac(a + b, 12), frac(a * 3 + b * 2, 24)],
      explanation:
        d === "Easy"
          ? `Divide the numerator and denominator by their common factor: ${answer}.`
          : `Use twelfths: ${a}/4 = ${a * 3}/12 and ${b}/6 = ${b * 2}/12. ${d === "Hard" ? "Start with 24/12 and subtract both amounts." : "Add the numerators, keeping denominator 12."} Simplify to ${answer}.`,
    };
  }),
  make("fraction-scale", "fractions", "6Nf.06", (v, d) => {
    const a = 1 + (v % 4),
      den = a + 2,
      k = 2 + (Math.floor(v / 4) % 7);
    const answer =
      d === "Easy"
        ? frac(a * k, den)
        : d === "Medium"
          ? frac(a, den * k)
          : frac(a * (k - 1), den * k);
    return {
      stem:
        d === "Easy"
          ? `Each ribbon uses ${a}/${den} metre. How many metres do ${k} ribbons use?`
          : d === "Medium"
            ? `${a}/${den} metre of ribbon is shared equally among ${k} pupils. How much does each receive?`
            : `${a}/${den} metre of ribbon is cut into ${k} equal pieces. One piece is used. What fraction of a metre remains?`,
      answer,
      wrong: [frac(a * k, den), frac(a, den + k), frac(a, den * k)],
      explanation:
        d === "Easy"
          ? `Multiply the numerator by ${k}: ${answer} m.`
          : `One piece is ${a}/(${den} × ${k}) = ${frac(a, den * k)} m.${d === "Hard" ? ` There are ${k - 1} pieces left, totalling ${answer} m.` : ""}`,
    };
  }),
  make("rounding-boundary", "decimals", "6Np.04", (v, d) => {
    const a = 2 + (v % 30);
    const answer =
      d === "Easy"
        ? num(a + 0.4)
        : d === "Medium"
          ? num(a + 0.35)
          : num(a + 0.44);
    return {
      stem:
        d === "Easy"
          ? `Round ${num(a + 0.37)} to the nearest tenth.`
          : d === "Medium"
            ? `A length is written to two decimal places. It rounds to ${num(a + 0.4)} m to the nearest tenth. What is the smallest possible length in metres?`
            : `A length is written to two decimal places. It rounds to ${num(a + 0.4)} m to the nearest tenth. What is the largest possible length in metres?`,
      answer,
      wrong: [num(a + 0.45), num(a + 0.39), num(a + 0.49)],
      explanation: `Values from ${num(a + 0.35)} to ${num(a + 0.44)}, written to two decimal places, round to ${num(a + 0.4)}. At ${num(a + 0.45)} the rounded value becomes ${num(a + 0.5)}.`,
    };
  }),
  make("change-money", "decimals", "6Nf.10", (v, d, p) => {
    const cost = (p === 1 ? 125 + 5 * (v % 15) : 137 + 7 * (v % 30)) / 100,
      count = 3 + (v % 5),
      pay = Math.ceil((cost * count) / 10) * 10,
      extra = (25 + (v % 30)) / 100;
    const answer =
      d === "Easy"
        ? num(cost * count)
        : d === "Medium"
          ? num(pay - cost * count)
          : num(pay - cost * count - extra);
    return {
      stem:
        d === "Easy"
          ? `${count} notebooks each cost $${cost.toFixed(2)}. What is their total price?`
          : d === "Medium"
            ? `${count} notebooks cost $${cost.toFixed(2)} each. What change is due from $${pay}?`
            : `A pupil buys ${count} notebooks at $${cost.toFixed(2)} each and an eraser for $${extra.toFixed(2)}. What change is due from $${pay}?`,
      answer,
      wrong: [
        num(pay - cost - extra),
        num(cost * count),
        num(pay - (cost + extra) * count),
      ],
      explanation: `Notebooks: ${count} × ${cost.toFixed(2)} = ${(cost * count).toFixed(2)}.${d === "Easy" ? "" : d === "Medium" ? ` Subtract from ${pay} to get ${answer}.` : ` Add ${extra.toFixed(2)} for the eraser, then subtract the total from ${pay}: $${answer}.`}`,
    };
  }),
  make("time-conversion", "geometry", "6Gt.01", (v, d) => {
    const start = 1 + (v % 5),
      mins = [15, 30, 45][v % 3],
      breakM = 5 + (Math.floor(v / 3) % 20);
    const total = start * 60 + mins;
    return {
      stem:
        d === "Easy"
          ? `How many minutes are in ${start + mins / 60} hours?`
          : d === "Medium"
            ? `Write ${start} hours ${mins} minutes as a decimal number of hours.`
            : `A journey lasts ${start + mins / 60} hours including a ${breakM}-minute break. How many minutes are spent travelling?`,
      answer:
        d === "Easy"
          ? total
          : d === "Medium"
            ? start + mins / 60
            : total - breakM,
      wrong: [start * 100 + mins, total + breakM, start + mins / 100],
      explanation: `One hour is 60 minutes, so ${start} hours ${mins} minutes is ${total} minutes or ${start + mins / 60} hours.${d === "Hard" ? ` Subtract the ${breakM}-minute break: ${total - breakM} minutes.` : ""}`,
    };
  }),
  make("square-sequence", "sequences", "6Nc.04", (v, d) => {
    const n = 2 + (v % 10),
      shift = 1 + Math.floor(v / 10);
    return {
      stem:
        d === "Easy"
          ? `Term n is the square of n. Find term ${n}.`
          : d === "Medium"
            ? `Term n is n squared plus ${shift}. Find term ${n}.`
            : `A sequence has term n equal to n squared plus ${shift}. A term equals ${n * n + shift}. What is its position n?`,
      answer: d === "Easy" ? n * n : d === "Medium" ? n * n + shift : n,
      wrong: [n + shift, 2 * n + shift, n * n],
      explanation: `Square means multiply a number by itself: ${n} × ${n} = ${n * n}.${d === "Easy" ? "" : ` Adding ${shift} gives ${n * n + shift}. Work backwards by subtracting ${shift} and identifying the square number.`}`,
    };
  }),
  make("circle-radius", "geometry", "6Gg.02", (v, d) => {
    const radius = 2 + (v % 40);
    return {
      stem:
        d === "Easy"
          ? `A circle has radius ${radius} cm. What is its diameter?`
          : d === "Medium"
            ? `A circle has diameter ${2 * radius} cm. How far should the compass points be apart to draw it?`
            : `Two circles have diameters ${2 * radius} cm and ${2 * (radius + 3)} cm. How much larger is the second circle's radius?`,
      answer: d === "Easy" ? 2 * radius : d === "Medium" ? radius : 3,
      wrong: [radius + 3, 6, 4 * radius],
      explanation: `The diameter passes through the centre and is twice the radius. Divide a diameter by 2 to find the radius.${d === "Hard" ? ` The radii are ${radius} and ${radius + 3} cm: a difference of 3 cm.` : ""}`,
    };
  }),
  make("reflect-grid", "coordinates", "6Gp.04", (v, d) => {
    const x = 1 + (v % 7),
      y = 1 + (Math.floor(v / 7) % 7);
    const answer =
      d === "Easy"
        ? `(${-x}, ${y})`
        : d === "Medium"
          ? `(${x}, ${-y})`
          : `(${-x + 2}, ${y - 3})`;
    return {
      stem:
        d === "Easy"
          ? `Reflect A (${x}, ${y}) in the y-axis. Give the reflected coordinates.`
          : d === "Medium"
            ? `Reflect A (${x}, ${y}) in the x-axis. Give the reflected coordinates.`
            : `Reflect A (${x}, ${y}) in the y-axis, then move the reflected point 2 squares right and 3 squares down. Give the final coordinates.`,
      answer,
      wrong: [`(${x}, ${y})`, `(${-x}, ${-y})`, `(${x + 2}, ${y - 3})`],
      explanation: `Reflection in the y-axis reverses x; reflection in the x-axis reverses y.${d === "Hard" ? ` First get (${-x}, ${y}); then add 2 to x and subtract 3 from y.` : ""} The answer is ${answer}.`,
      diagram: { kind: "grid", points: [[x, y, "A"]] },
    };
  }),
  make("median-change", "statistics", "6Ss.03", (v, d) => {
    const n = 3 + v;
    const list = [n, n + 2, n + 3, n + 5, n + 8];
    return {
      stem:
        d === "Easy"
          ? `Find the range of ${list.join(", ")}.`
          : d === "Medium"
            ? `Find the median of ${[n + 5, n, n + 8, n + 2, n + 3].join(", ")}.`
            : `The values are ${list.join(", ")}. The largest value is replaced by ${n + 30}. By how much does the median increase?`,
      answer: d === "Easy" ? 8 : d === "Medium" ? n + 3 : 0,
      wrong: [n + 3, 22, 30],
      explanation: `Order the five values. The middle (third) value is ${n + 3}. Changing only the largest value to a larger number does not change this middle value. The original range is ${n + 8} − ${n} = 8.`,
    };
  }),
  make("probability-bags", "statistics", "6Sp.01", (v, d) => {
    const k = 2 + (v % 15);
    return {
      stem:
        d === "Easy"
          ? `A bag has ${2 * k} red and ${k} blue counters. Which colour is more likely in one random draw?`
          : d === "Medium"
            ? `Bag A has ${2 * k} red and ${k} blue counters. Bag B has ${2 * k} red and ${2 * k} blue. Which bag gives a greater chance of drawing red?`
            : `Bag A has ${2 * k} red and ${k} blue counters. Bag B has ${4 * k} red and ${2 * k} blue. A pupil chooses B because it has more red counters. Compare the chances of red in one random draw.`,
      answer:
        d === "Easy"
          ? "Red"
          : d === "Medium"
            ? "Bag A"
            : "The chances are equal.",
      wrong:
        d === "Easy"
          ? ["Blue", "Both colours are equally likely.", "Red is certain."]
          : d === "Medium"
            ? [
                "Bag B",
                "Both bags give the same chance.",
                "Neither bag can give red.",
              ]
            : [
                "Bag B has the greater chance.",
                "Bag A has the greater chance.",
                "Red is certain from Bag B.",
              ],
      explanation: `Compare the proportion, not just the number of red counters. Bag A has 2 red for every 1 blue. ${d === "Hard" ? "Bag B has the same ratio, so the chances match." : d === "Medium" ? "Bag B has equal red and blue counters, so A gives the greater chance of red." : "Red is more likely than blue, but not certain."}`,
    };
  }),
  family("gas-mass", "materials", "6Cp.02", 30, (v, d) => {
    const empty = 120 + v,
      full = empty + 4;
    return {
      context: `A sealed rigid container has mass ${empty} g. After more air is pumped in and it is sealed again, it has mass ${full} g. Its outer size is unchanged.`,
      question:
        d === "Easy"
          ? "How much mass has been added?"
          : d === "Medium"
            ? "Which conclusion is supported by the measurements?"
            : "A pupil says gases have no mass because we cannot see them. Which evidence challenges that claim?",
      answer:
        d === "Easy"
          ? "4 g"
          : d === "Medium"
            ? "The added air has mass."
            : "The same container becomes heavier when extra air is added.",
      wrong:
        d === "Easy"
          ? [`${empty} g`, `${full} g`, "0 g"]
          : [
              "The container must have become larger.",
              "Only solids can affect a balance reading.",
              "Air makes the container lighter.",
            ],
      why: "Gas has mass. The same rigid container gains 4 g after air is added, so the increase is evidence of the added air’s mass.",
      follow:
        "Why is it useful to use the same rigid container before and after?",
      followAnswer:
        "It keeps the container itself the same, so its different material or size cannot explain the mass change.",
    };
  }),
  family("thermal-test", "materials", "6Cp.03", 24, (v, d) => ({
    context: `Three equal-size rods are tested in the same warm water. Wax falls from rod A after ${20 + v} s, B after ${50 + v} s and C after ${90 + v} s. The wax begins at the same distance from the water.`,
    question:
      d === "Easy"
        ? "Which rod transfers heat to the wax fastest?"
        : d === "Medium"
          ? "Which material would be the best thermal insulator of these three?"
          : "A pupil wants to compare materials but uses a shorter rod B. Why does that weaken the conclusion?",
    answer:
      d === "Easy"
        ? "A"
        : d === "Medium"
          ? "C"
          : "The distance heat travels changes as well as the material.",
    wrong:
      d === "Easy"
        ? ["B", "C", "All are equally fast."]
        : d === "Medium"
          ? ["A", "B", "They are equally good insulators."]
          : [
              "A shorter rod always proves the material is a better conductor.",
              "Rod length cannot affect this comparison.",
              "Repeating the unfair test makes it fair.",
            ],
    why: "Shorter melting time means heat reached the wax sooner. For a fair material comparison, the size and the distance to the wax must be the same.",
    follow: "State one safety precaution for this investigation.",
    followAnswer:
      "Use warm rather than dangerously hot water, handle heated equipment carefully, or use suitable protection with adult supervision.",
  })),
  family("floating-shape", "forces", "6Pf.05", 12, (v, d) => ({
    context: `A ${30 + v * 5} g piece of modelling clay sinks as a compact ball. The same clay is shaped into a wide hollow boat, which floats.`,
    question:
      d === "Easy"
        ? "Which property was deliberately changed?"
        : d === "Medium"
          ? "Which conclusion is supported by this comparison?"
          : "A pupil claims that everything made of this clay must sink. Why is that claim not supported?",
    answer:
      d === "Easy"
        ? "Shape"
        : d === "Medium"
          ? "Shape can affect whether the clay floats."
          : "The same material and mass floated after its shape changed.",
    wrong:
      d === "Easy"
        ? ["Material", "Mass of clay", "Type of water"]
        : [
            "The clay changed into a different material.",
            "The floating boat must contain less clay.",
            "The ball and boat have the same shape.",
          ],
    why: "The mass and material stayed the same, but the shape changed. A hollow shape can push aside more water and may float even when a compact ball sinks.",
    follow: "Name one thing to keep the same when comparing the two shapes.",
    followAnswer: "Mass of clay, clay material, or the water used.",
  })),
  family("fossil-evidence", "earth", "6ESp.02", 5, (v, d) => {
    const fossils = [
      "shell",
      "leaf",
      "fish skeleton",
      "fern imprint",
      "small bone",
    ];
    return {
      context: `A ${fossils[v]} is found preserved between layers of sedimentary rock.`,
      question:
        d === "Easy"
          ? "What do we call preserved remains or traces of past living things?"
          : d === "Medium"
            ? "Which sequence could have formed this fossil?"
            : "Why is gentle burial in sediment a better explanation here than complete melting of the remains?",
      answer:
        d === "Easy"
          ? "Fossils"
          : d === "Medium"
            ? "Remains are buried; more sediment accumulates; rock forms."
            : "Burial can preserve a trace, while complete melting would destroy its shape.",
      wrong:
        d === "Easy"
          ? ["Crystals", "Magma", "Soil grains"]
          : [
              "The remains first became molten magma.",
              "An animal drew the shape after the rock formed.",
              "All layers must have formed at exactly the same moment.",
            ],
      why: "Sediment can cover remains or impressions. As layers build and become rock, a trace may be preserved. Not every buried organism forms a fossil.",
      follow:
        "Why does finding one fossil not tell us about every living thing from that time?",
      followAnswer:
        "Many organisms left no preserved trace; the fossil record is incomplete.",
    };
  }),
  family("classification-key", "enquiry", "6TWSc.02", 4, (v, d) => {
    const objects = [
      ["ant", "six legs", "no wings"],
      ["butterfly", "six legs", "wings"],
      ["spider", "eight legs", "no wings"],
      ["beetle", "six legs", "hard wing cases"],
    ][v];
    return {
      context: `A pupil describes an animal: ${objects[1]}, ${objects[2]}. A key first separates six-legged animals from eight-legged animals.`,
      question:
        d === "Easy"
          ? "Which feature is used for the first split?"
          : d === "Medium"
            ? "Which question would next separate a butterfly from a beetle?"
            : "Why would “Is it a beautiful animal?” be unsuitable for a scientific identification key?",
      answer:
        d === "Easy"
          ? "Number of legs"
          : d === "Medium"
            ? "Does it have hard wing cases?"
            : "Different people could judge beauty differently; the key needs observable features.",
      wrong:
        d === "Easy"
          ? [
              "Whether it is beautiful",
              "Where its name appears in the alphabet",
              "How much someone likes it",
            ]
          : d === "Medium"
            ? ["Does it have six legs?", "Is it an animal?", "Can it move?"]
            : [
                "Keys should use only opinions.",
                "All animals have the same observable features.",
                "Keys cannot contain questions.",
              ],
      why: "A key uses clear observable differences. Both a butterfly and beetle have six legs, so that question cannot separate those two; hard wing cases can.",
      follow:
        "Explain why the same question must be applied consistently to every specimen.",
      followAnswer:
        "Otherwise the grouping depends on changing rules rather than the animals’ features.",
    };
  }),
  family("body-defences", "body", "6Bp.04", 4, (v, d) => {
    const features = ["skin", "mucus", "stomach acid", "unbroken skin"];
    return {
      context: `A class is discussing how ${features[v]} helps protect the body.`,
      question:
        d === "Easy"
          ? "Which is a natural defence against infection?"
          : d === "Medium"
            ? v === 2
              ? "How can stomach acid help protect the body?"
              : "How do skin or mucus help protect the body?"
            : "Why is the statement “Our defences mean we never need good hygiene” incorrect?",
      answer:
        d === "Easy"
          ? features[v]
          : d === "Medium"
            ? v === 2
              ? "It can destroy many swallowed microorganisms."
              : "They help stop or trap microorganisms entering the body."
            : "Defences reduce risk but do not prevent every infection.",
      wrong:
        d === "Easy"
          ? ["A favourite colour", "The sound of speech", "An exercise book"]
          : [
              "Every microorganism is harmless.",
              "Defences always prevent every disease.",
              "Hygiene removes the need for any body defences.",
            ],
      why: "Skin acts as a barrier, mucus traps particles and microorganisms, and stomach acid can destroy many microorganisms. None is a guarantee, so hygiene still matters.",
      follow:
        "Name one other natural defence, different from the one in the context.",
      followAnswer:
        v === 2
          ? "Skin or mucus."
          : v === 1
            ? "Skin or stomach acid."
            : "Mucus or stomach acid.",
    };
  }),
  family("puberty-changes", "body", "6Bp.01", 4, (v, d) => ({
    context: `A pupil makes a poster about physical changes during puberty. Poster section ${v + 1} compares changes in different people.`,
    question:
      d === "Easy"
        ? "Which is a physical change that can happen during puberty?"
        : d === "Medium"
          ? "Which statement about the timing of puberty is accurate?"
          : "Why should the poster not give one exact age at which every person has each change?",
    answer:
      d === "Easy"
        ? "Body hair develops."
        : d === "Medium"
          ? "The timing and rate of changes vary between people."
          : "People develop at different rates, so one fixed timetable would be misleading.",
    wrong:
      d === "Easy"
        ? [
            "Bones turn into muscle.",
            "People stop needing sleep.",
            "The heart stops pumping blood.",
          ]
        : [
            "Everyone has every change on the same birthday.",
            "No physical changes happen during puberty.",
            "A different timetable always means a person is unwell.",
          ],
    why: "Puberty involves physical changes as the body develops. Growth, body hair and changes in reproductive organs are examples. Timing varies; people should not be compared using one fixed timetable.",
    follow: "Name another physical change that can happen during puberty.",
    followAnswer:
      "A growth spurt, voice deepening, breasts developing, menstruation starting, or reproductive organs maturing. Accept an accurate example.",
  })),
  family("reproductive-parts", "body", "6Bs.03", 4, (v, d) => {
    const items = [
      ["ovaries", "egg cells"],
      ["testes", "sperm cells"],
      ["uterus", "a developing baby"],
      ["penis", "the tube carrying urine out of the male body"],
    ];
    const [organ, clue] = items[v];
    return {
      context:
        "A science diagram uses standard names for parts of the human reproductive system.",
      question:
        d === "Easy"
          ? `Which label names a reproductive organ: ${organ}, heart, lung or stomach?`
          : v === 2
            ? "Which organ is where a baby can develop during pregnancy?"
            : v === 0
              ? "Which organs produce egg cells?"
              : v === 1
                ? "Which organs produce sperm cells?"
                : "Which external male reproductive organ contains the tube through which urine leaves the body?",
      answer: organ,
      wrong: ["Heart", "Lungs", "Stomach"],
      why: `The correct label is ${organ}. It is associated with ${clue}; the heart, lungs and stomach have different functions.`,
      follow:
        "Why should a scientific diagram use clear labels rather than nicknames?",
      followAnswer:
        "Clear, standard names allow people to identify the same part accurately.",
    };
  }),
  family("orbit-model", "space", "6ESs.01", 12, (v, d) => ({
    context: `Model ${v + 1} uses a large ball for the Sun, a smaller ball for Earth and a small bead for the Moon. The model is not to scale.`,
    question:
      d === "Easy"
        ? "Which object does Earth orbit?"
        : d === "Medium"
          ? "Which movement correctly represents the Moon?"
          : "The balls are equally spaced and very close together. Which limitation should be explained?",
    answer:
      d === "Easy"
        ? "The Sun"
        : d === "Medium"
          ? "The Moon orbits Earth while Earth orbits the Sun."
          : "The model can show movement but does not show real relative distances accurately.",
    wrong:
      d === "Easy"
        ? ["The Moon", "Mars", "A cloud"]
        : [
            "Earth stays still at the centre of every orbit.",
            "The Moon orbits Earth once every day.",
            "Every distance in the model is automatically accurate.",
          ],
    why: "Earth orbits the Sun; the Moon orbits Earth. A model can help show these movements while having inaccurate sizes or distances.",
    follow:
      "Explain why the word “model” does not mean that every feature is an exact copy.",
    followAnswer:
      "A model simplifies reality and may represent some features accurately but not others, such as size or distance.",
  })),
];

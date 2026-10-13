import type { Family, Question, Part, Difficulty, Diagram } from "./types";
import { num } from "./random.js";
const part = (
  id: string,
  text: string,
  answer: string,
  guidance = answer,
  exact = true,
): Part => ({
  id,
  text,
  answer,
  guidance,
  marks: 1,
  ...(exact ? { exact: [answer] } : {}),
});
export function make(
  id: string,
  topic: string,
  objective: string,
  build: (
    v: number,
    d: Difficulty,
    p: 1 | 2,
  ) => {
    stem: string;
    answer: number | string;
    wrong: (number | string)[];
    explanation: string;
    context?: string;
    parts?: Part[];
    diagram?: Diagram;
  },
): Family {
  return {
    id,
    subject: "math",
    topic,
    objective,
    variants: 120,
    make(v, d, p) {
      const q = build(v, d, p);
      const answer =
        typeof q.answer === "number" ? num(q.answer) : String(q.answer);
      const options = [
        answer,
        ...q.wrong.map((x) => (typeof x === "number" ? num(x) : String(x))),
      ]
        .filter((x, i, a) => a.indexOf(x) === i)
        .slice(0, 4);
      let n = 1;
      while (options.length < 4) {
        const candidate = Number.isFinite(Number(answer))
          ? num(Number(answer) + n)
          : n === 1
            ? "Cannot be determined from the information given."
            : String(n - 2);
        if (!options.includes(candidate)) options.push(candidate);
        n++;
      }
      return {
        id: `v3-${id}-${d}-${p}-${v}`,
        family: id,
        subject: "math",
        topic,
        objective,
        difficulty: d,
        stem: q.stem,
        options,
        correctIndex: 0,
        explanation: q.explanation,
        hint: "Work out what is known and what is missing. Write one step at a time; then check your answer in the question.",
        context: q.context || q.stem,
        parts: q.parts || [
          {
            id: "a",
            text: q.stem + " Show your working.",
            answer,
            guidance:
              "Award 2 marks for a correct answer. If the final answer is wrong, award 1 mark for a correct method shown: " +
              q.explanation,
            marks: 2,
          },
        ],
        ...(q.diagram ? { diagram: q.diagram } : {}),
      } satisfies Question;
    },
  };
}
export const MATH_FAMILIES: Family[] = [
  make("order", "number", "6Ni.02", (v, d) => {
    const a = 12 + v,
      b = 3 + (v % 7),
      c = 2 + (v % 5);
    const hard = d === "Hard";
    const ans = hard ? a - b * c : d === "Easy" ? a + b * c : (a + b) * c;
    return {
      stem: hard
        ? `A pupil calculates ${a} − ${b} × ${c} by subtracting first. What is the correct answer?`
        : `Calculate ${d === "Easy" ? `${a} + ${b} × ${c}` : `(${a} + ${b}) × ${c}`}.`,
      answer: ans,
      wrong: [(a - b) * c, a + b * c, a - b - c],
      explanation: hard
        ? `Multiply first: ${b} × ${c} = ${b * c}. Then ${a} − ${b * c} = ${ans}. A subtraction sign does not change the order of operations.`
        : d === "Easy"
          ? `Multiply ${b} by ${c} first. Add ${a} to get ${ans}.`
          : `Work inside the brackets first: ${a}+${b}=${a + b}. Multiply by ${c} to get ${ans}.`,
    };
  }),
  make("negative", "number", "6Ni.01", (v, d) => {
    const start = -(3 + v),
      rise = 4 + (v % 11),
      drop = 2 + (v % 6),
      answer = d === "Easy" ? start + rise : start + rise - drop;
    return {
      stem:
        d === "Hard"
          ? `The temperature starts at ${start}°C. It rises by ${rise}°C and then falls by ${drop}°C. A pupil says it must finish above 0°C because it rose first. What is the final temperature?`
          : `The temperature is ${start}°C. It rises by ${rise}°C${d === "Easy" ? "" : `, then falls by ${drop}°C`}. What is the final temperature?`,
      answer,
      wrong: [Math.abs(answer), start - rise - drop, start + rise + drop],
      explanation: `Start at ${start}. Moving up ${rise} gives ${start + rise}.${d === "Easy" ? "" : ` Moving down ${drop} gives ${answer}.`} Keep the minus sign if the result is below zero.`,
    };
  }),
  make("packing", "number", "6Ni.05", (v, d) => {
    const size = 6 + (v % 9),
      boxes = 8 + (v % 60),
      extra = 1 + (v % (size - 1)),
      total = size * boxes + extra;
    return {
      stem:
        d === "Easy"
          ? `${boxes} boxes each hold ${size} pencils. How many pencils is that?`
          : d === "Hard"
            ? `${total} pencils must all be packed into boxes holding ${size} pencils. A pupil divides and rounds down. What is the smallest number of boxes actually needed?`
            : `There are ${total} pencils. Each full box holds ${size}. How many pencils remain after making as many full boxes as possible?`,
      answer: d === "Easy" ? boxes * size : d === "Hard" ? boxes + 1 : extra,
      wrong: [boxes, boxes + 2, total - size],
      explanation: `${size} × ${boxes} = ${size * boxes}.${d === "Easy" ? "" : ` This leaves ${extra} pencils. ${d === "Hard" ? "They need one more box, even though it is not full." : "These are the remainder."}`}`,
    };
  }),
  make("fraction-remaining", "fractions", "6Nf.02", (v, d) => {
    const total = 24 + 24 * v,
      a = total / 3,
      b = total / 4;
    return {
      stem:
        d === "Easy"
          ? `Find 1/3 of ${total}.`
          : d === "Medium"
            ? `A club has ${total} counters. It gives away 1/3 of them. How many remain?`
            : `A club has ${total} counters. It gives 1/3 of the original total to one group and 1/4 of the original total to another. How many remain?`,
      answer: d === "Easy" ? a : d === "Medium" ? total - a : total - a - b,
      wrong: [a + b, total - b, total / 12],
      explanation: `One third is ${total} ÷ 3 = ${a}.${d === "Easy" ? "" : d === "Medium" ? ` Subtract this from ${total} to get ${total - a}.` : ` One quarter of the original total is ${b}. Subtract both amounts: ${total} − ${a} − ${b} = ${total - a - b}.`}`,
    };
  }),
  make("percentage", "fractions", "6Nf.07", (v, d) => {
    const price = (v + 4) * 20,
      rate = [10, 20, 25, 50][v % 4],
      discount = (price * rate) / 100;
    return {
      stem:
        d === "Easy"
          ? `Find ${rate}% of ${price}.`
          : d === "Medium"
            ? `A coat costs $${price}. Its price is reduced by ${rate}%. What is its new price?`
            : `A coat originally costs $${price}. Shop A takes ${rate}% off; Shop B takes $${discount - 5} off. How many dollars cheaper is Shop A?`,
      answer: d === "Easy" ? discount : d === "Medium" ? price - discount : 5,
      wrong: [discount, price - discount, rate + 5],
      explanation: `${rate}% of ${price} is ${discount}.${d === "Easy" ? "" : ` Shop A's price is ${price - discount}.${d === "Hard" ? ` Shop B's price is ${price - (discount - 5)}. The difference is $5.` : ""}`}`,
    };
  }),
  make("equivalent", "fractions", "6Nf.04", (v, d) => {
    const n = 1 + (v % 19),
      percent = n * 5,
      decimal = percent / 100;
    return {
      stem:
        d === "Easy"
          ? `Write ${percent}% as a decimal.`
          : d === "Medium"
            ? `Which decimal has the same value as ${n}/20?`
            : `A pupil claims ${n}/20 is greater than ${num(decimal + 0.01)} because ${n} is greater than the digits after the decimal point. What decimal is actually equal to ${n}/20?`,
      answer: decimal,
      wrong: [n / 10, n / 100, decimal + 0.1],
      explanation: `Multiply top and bottom by 5: ${n}/20 = ${percent}/100 = ${num(decimal)}. Compare numbers using the same form, not their separate digits.`,
    };
  }),
  make("decimal-missing", "decimals", "6Nf.09", (v, d) => {
    const a = (240 + v * 17) / 100,
      b = (31 + (v % 25)) / 100,
      answer = d === "Easy" ? a + b : a - b;
    return {
      stem:
        d === "Easy"
          ? `Calculate ${num(a)} + ${num(b)}.`
          : d === "Medium"
            ? `Complete: ${num(b)} + □ = ${num(a)}.`
            : `A strip is ${num(a)} m long. Two pieces measuring ${num(b / 2)} m each are removed. What length remains?`,
      answer: num(answer),
      wrong: [num(a + b), num(a - b / 10), num(a - b * 2)],
      explanation: `Line up the decimal points. ${d === "Easy" ? `${num(a)} + ${num(b)} = ${num(answer)}` : `${num(a)} − ${num(b)} = ${num(answer)}`}. Check by reversing the calculation.`,
    };
  }),
  make("place-value", "decimals", "6Np.02", (v, d) => {
    const a = 1234 + v * 13;
    const scale = d === "Easy" ? 10 : d === "Medium" ? 100 : 1000;
    return {
      stem:
        d === "Hard"
          ? `A pupil multiplies ${num(a)} by 10, then divides by 100 and divides by 100 again. What is the final number?`
          : `Calculate ${num(a)} ÷ ${scale}.`,
      answer: num(a / scale),
      wrong: [num(a * scale), num(a / 10), num(a / 100)],
      explanation: `Dividing by ${scale} makes each digit worth ${scale} times less. The answer is ${num(a / scale)}.${d === "Hard" ? " Multiplying by 10 then dividing by 100 twice has the same effect as dividing by 1000." : ""}`,
    };
  }),
  make("ratio", "ratio", "6Nf.13", (v, d) => {
    const k = v + 2,
      a = 2 + (v % 3),
      b = a + 2,
      total = (a + b) * k;
    return {
      stem:
        d === "Easy"
          ? `Red : blue beads = ${a} : ${b}. There are ${a * k} red beads. How many blue beads are there?`
          : d === "Medium"
            ? `Red : blue beads = ${a} : ${b}. There are ${total} beads altogether. How many are blue?`
            : `Red : blue beads = ${a} : ${b}. There are ${total} beads altogether. How many blue beads must be removed so the numbers of red and blue beads are equal?`,
      answer: d === "Hard" ? (b - a) * k : b * k,
      wrong: [a * k, total - a, total / (a + b)],
      explanation: `There are ${a + b} equal parts. One part is ${total} ÷ ${a + b} = ${k}. Red: ${a * k}; blue: ${b * k}.${d === "Hard" ? ` Remove ${b * k} − ${a * k} = ${(b - a) * k} blue beads.` : ""}`,
    };
  }),
  make("recipe", "ratio", "6Nf.12", (v, d, p) => {
    const people = 4,
      grams = 80 + v * 4,
      target = d === "Easy" ? 8 : d === "Medium" ? 6 : 10,
      needed = (grams * target) / people;
    return {
      stem:
        d === "Hard"
          ? `A recipe for ${people} people needs ${grams} g of oats. You have ${needed + 25} g. How many grams will be left after making the recipe for ${target} people?`
          : `A recipe for ${people} people needs ${grams} g of oats. How many grams are needed for ${target} people?${p === 2 ? " You may use a calculator." : ""}`,
      answer: d === "Hard" ? 25 : needed,
      wrong: [grams * target, grams + target, needed + grams],
      explanation: `For one person: ${grams} ÷ ${people} = ${grams / people} g. For ${target}: ${grams / people} × ${target} = ${needed} g.${d === "Hard" ? ` Left over: ${needed + 25} − ${needed} = 25 g.` : ""}`,
    };
  }),
  make("sequence", "sequences", "6Nc.03", (v, d) => {
    const step = 2 + (v % 9),
      start = 7 + v,
      term = 6 + (v % 6);
    return {
      stem:
        d === "Easy"
          ? `The sequence starts ${start}, ${start + step}, ${start + 2 * step}. What is the next term?`
          : d === "Medium"
            ? `A sequence starts at ${start} and increases by ${step}. What is term ${term}?`
            : `Term 2 is ${start + step}; term 5 is ${start + 4 * step}. The step is constant. What is term ${term}?`,
      answer: d === "Easy" ? start + 3 * step : start + (term - 1) * step,
      wrong: [start + term * step, term * step, start + (term - 2) * step],
      explanation: `The step is ${step}.${d === "Hard" ? ` There are three steps from term 2 to term 5: (${start + 4 * step} − ${start + step}) ÷ 3 = ${step}.` : ""} Term ${d === "Easy" ? 4 : term} is ${start} + ${d === "Easy" ? 3 : term - 1} × ${step} = ${d === "Easy" ? start + 3 * step : start + (term - 1) * step}.`,
    };
  }),
  make("area", "geometry", "6Gg.03", (v, d) => {
    const b = 6 + 2 * (v % 15),
      h = 4 + 2 * Math.floor(v / 15),
      area = (b * h) / 2;
    return {
      stem:
        d === "Easy"
          ? `Find the area of this right-angled triangle.`
          : d === "Medium"
            ? `Two identical copies of this triangle make a rectangle. What is the area of one triangle?`
            : `A pupil says the area of this triangle is ${b * h} cm². What is the correct area?`,
      answer: area,
      wrong: [b * h, b + h, 2 * (b + h)],
      explanation: `A rectangle with base ${b} cm and height ${h} cm has area ${b * h} cm². The triangle is half: ${b * h} ÷ 2 = ${area} cm².`,
      diagram: { kind: "triangle", base: b, height: h },
      parts: [
        part("a", "Calculate the area of the triangle in cm².", String(area)),
        part(
          "b",
          "Explain why multiplying the base by the height is not the final answer.",
          `It gives the whole rectangle; divide by 2 for the triangle.`,
          undefined,
          false,
        ),
      ],
    };
  }),
  make("angles", "geometry", "6Gg.10", (v, d) => {
    const a = 25 + (v % 50),
      b = 35 + Math.floor(v / 5),
      c = 180 - a - b;
    return {
      stem:
        d === "Easy"
          ? `A triangle has angles ${a}° and ${b}°. Find its third angle.`
          : d === "Medium"
            ? `Two angles in a triangle total ${a + b}°. What is the missing angle?`
            : `A pupil draws a triangle with angles ${a}°, ${b}° and ${c + 10}°. To make the angle total correct, what should the third angle be?`,
      answer: c,
      wrong: [a + b, 360 - a - b, c + 10],
      explanation: `Angles in a triangle total 180°. Add the known angles: ${a}+${b}=${a + b}. Subtract: 180−${a + b}=${c}°.`,
    };
  }),
  make("rectangle", "geometry", "6Gg.01", (v, d) => {
    const w = 4 + (v % 20),
      h = 3 + Math.floor(v / 20),
      p = 2 * (w + h);
    return {
      stem:
        d === "Easy"
          ? `A rectangle is ${w} cm long and ${h} cm wide. Find its perimeter.`
          : d === "Medium"
            ? `A rectangle has perimeter ${p} cm and length ${w} cm. Find its width.`
            : `A rectangle has perimeter ${p} cm. Its length is ${w} cm. A pupil says the width is ${p - w} cm. What is the correct width?`,
      answer: d === "Easy" ? p : h,
      wrong: [p - w, p / 2, w * h],
      explanation: `Perimeter is the distance around all four sides: 2 × (${w}+${h})=${p} cm. Half the perimeter is ${p / 2}; subtract length ${w} to find width ${h}.`,
      ...(d === "Easy"
        ? { diagram: { kind: "rectangle" as const, width: w, height: h } }
        : {}),
    };
  }),
  make("translation", "coordinates", "6Gp.03", (v, d) => {
    const x = (v % 15) - 7,
      y = Math.floor(v / 15) - 4,
      dx = 2 + (v % 4),
      dy = 1 + (v % 3);
    const answer = `(${x + dx}, ${y - dy})`;
    return {
      stem:
        d === "Easy"
          ? `Point A is (${x}, ${y}). Move it ${dx} squares right and ${dy} squares down. Where is it now?`
          : d === "Medium"
            ? `A translation moves B from (0, 0) to (${dx}, ${-dy}). Where does it move A (${x}, ${y})?`
            : `The same translation moves B (−2, 3) to (${dx - 2}, ${3 - dy}). Where does it move A (${x}, ${y})?`,
      answer,
      wrong: [
        `(${x - dx}, ${y + dy})`,
        `(${x + dx}, ${y + dy})`,
        `(${y - dy}, ${x + dx})`,
      ],
      explanation: `The movement is ${dx} right and ${dy} down. Add ${dx} to x and subtract ${dy} from y. The point is ${answer}.`,
      diagram: { kind: "grid", points: [[x, y, "A"]] },
    };
  }),
  make("mean", "statistics", "6Ss.03", (v, d) => {
    const a = 3 + v,
      b = a + 2,
      c = a + 4,
      sum = a + b + c;
    return {
      stem:
        d === "Easy"
          ? `Find the mean of ${a}, ${b} and ${c}.`
          : d === "Medium"
            ? `Three values have a mean of ${b}. Two are ${a} and ${c}. What is the missing value?`
            : `Four values have a mean of ${b + 1}. Three are ${a}, ${b} and ${c}. What is the missing value?`,
      answer: d === "Hard" ? (b + 1) * 4 - sum : b,
      wrong: [sum, (b + 1) * 4, b + 1],
      explanation:
        d === "Hard"
          ? `Total = mean × number of values = ${b + 1} × 4 = ${(b + 1) * 4}. Known total = ${sum}. Missing value = ${(b + 1) * 4 - sum}.`
          : `Add all three values to get ${sum}. Divide by 3 to get mean ${b}.`,
    };
  }),
  make("chart", "statistics", "6Ss.04", (v, d) => {
    const values = [4 + v, 7 + v, 5 + v, 10 + v],
      answer =
        d === "Easy"
          ? values[3]
          : d === "Medium"
            ? values[0] + values[2]
            : values[1] + values[3] - values[0] - values[2];
    return {
      stem:
        d === "Easy"
          ? "How many books were borrowed on Thursday?"
          : d === "Medium"
            ? "How many books were borrowed on Monday and Wednesday altogether?"
            : "The librarian compares Tuesday and Thursday together with Monday and Wednesday together. How many more books were borrowed on Tuesday and Thursday?",
      answer,
      wrong: [values.reduce((a, b) => a + b), values[1], values[3] + values[0]],
      explanation:
        d === "Easy"
          ? `Read Thursday's bar: ${answer} books.`
          : d === "Medium"
            ? `Monday has ${values[0]} and Wednesday has ${values[2]}. Add them: ${answer}.`
            : `Tuesday and Thursday total ${values[1] + values[3]}. Monday and Wednesday total ${values[0] + values[2]}. Subtract the two totals to get ${answer}.`,
      diagram: {
        kind: "bars",
        labels: ["Mon", "Tue", "Wed", "Thu"],
        values,
        unit: "Books",
      },
    };
  }),
];

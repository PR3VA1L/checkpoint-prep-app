import type { Family, Difficulty, Diagram, Part } from "./types";
interface Scenario {
  context: string;
  question: string;
  answer: string;
  exact?: string[];
  wrong: string[];
  why: string;
  follow: string;
  followAnswer: string;
  diagram?: Diagram;
}
export function family(
  id: string,
  topic: string,
  objective: string,
  variants: number,
  build: (v: number, d: Difficulty) => Scenario,
): Family {
  return {
    id,
    subject: "science",
    topic,
    objective,
    variants,
    make(v, d) {
      const q = build(v, d);
      const parts: Part[] = [
        {
          id: "a",
          text: q.question,
          marks: 1,
          answer: q.answer,
          ...(q.exact ? { exact: q.exact } : {}),
          guidance: q.why,
          ...(id === "evaporation" && d === "Medium" ? {
            markPoints: [{ alternatives: [
              "evaporate from its surface below its boiling point",
              "evaporation happens at the surface below boiling point",
            ] }],
          } : {}),
        },
        {
          id: "b",
          text: q.follow,
          marks: 1,
          answer: q.followAnswer,
          guidance: q.followAnswer,
        },
      ];
      return {
        id: `v3-${id}-${d}-${v}`,
        family: id,
        subject: "science",
        topic,
        objective,
        difficulty: d,
        context: q.context,
        stem: `${q.context}\n\n${q.question}`,
        options: [q.answer, ...q.wrong],
        correctIndex: 0,
        explanation: q.why,
        hint: "Use the information in the diagram or results. Separate what you observed from what you are explaining.",
        parts,
        ...(q.diagram ? { diagram: q.diagram } : {}),
      };
    },
  };
}
export const SCIENCE_FAMILIES: Family[] = [
  family("dissolving", "materials", "6Cc.02", 80, (v, d) => {
    const cool = 70 + v,
      warm = 40 + v,
      hot = 20 + v;
    return {
      context: `Equal masses of sugar are stirred into equal volumes of water. At 20°C the sugar takes ${cool} s to dissolve, at 40°C it takes ${warm} s, and at 60°C it takes ${hot} s.`,
      question:
        d === "Easy"
          ? "At which temperature did the sugar dissolve fastest?"
          : d === "Medium"
            ? "Which conclusion is supported by these results?"
            : "A pupil says, “The sugar disappeared, so it no longer exists.” Which explanation uses the results and the particle model correctly?",
      answer:
        d === "Easy"
          ? "60°C"
          : d === "Medium"
            ? "Warmer water made the sugar dissolve faster."
            : "The sugar particles spread through the water; warmer water helped this happen faster.",
      wrong: [
        "The sugar changed into water.",
        "The water temperature had no effect.",
        "The sugar was destroyed by stirring.",
      ],
      why: `A shorter time means faster dissolving. ${hot} s is the shortest time. Dissolved sugar is still present: its particles are spread through the water.`,
      follow:
        "State one thing that must be kept the same to make this a fair test.",
      followAnswer:
        "Keep the mass of sugar, volume of water, or stirring method the same.",
      diagram: {
        kind: "bars",
        labels: ["20°C", "40°C", "60°C"],
        values: [cool, warm, hot],
        unit: "Time (s)",
      },
    };
  }),
  family("change-state", "materials", "6Cp.01", 60, (v, d) => {
    const melt = 30 + v;
    return {
      context: `Material X melts at ${melt}°C and boils at ${melt + 100}°C. It is heated from ${melt - 10}°C to ${melt + 20}°C.`,
      question:
        d === "Easy"
          ? "What change of state occurs?"
          : d === "Medium"
            ? `What is the state of X at ${melt + 20}°C?`
            : "A pupil says that X must be a gas because it has been heated. Why is this conclusion wrong?",
      answer:
        d === "Easy"
          ? "Melting"
          : d === "Medium"
            ? "Liquid"
            : `The final temperature is above its melting point but below its boiling point.`,
      wrong: [
        "It is a gas whenever it is heated.",
        "It remains solid at every temperature.",
        "Its particles have been destroyed.",
      ],
      why: `${melt + 20}°C is above ${melt}°C but below ${melt + 100}°C, so X is liquid. Heating does not always produce a gas.`,
      follow: "Describe how X could be changed back into a solid.",
      followAnswer: `Cool it below its freezing/melting temperature, ${melt}°C.`,
    };
  }),
  family("reaction", "materials", "6Cc.04", 4, (v, d) => {
    const pair = [
      "two colourless liquids",
      "a powder and a liquid",
      "a solid and a solution",
      "two solutions",
    ][v];
    return {
      context: `A pupil mixes ${pair}. Bubbles form and the container becomes warmer without a heater.`,
      question:
        d === "Easy"
          ? "What do the bubbles suggest is being produced?"
          : d === "Medium"
            ? "What are the starting substances called?"
            : "Which pair of observations provides evidence of a chemical reaction?",
      answer:
        d === "Easy"
          ? "A gas"
          : d === "Medium"
            ? "Reactants"
            : "Gas is produced and the temperature changes.",
      wrong: [
        "Only the shape of the container changes.",
        "No new substances can form.",
        "Every change involving a liquid is melting.",
      ],
      why: "A chemical reaction forms new substances, called products. Gas production and a temperature change can be evidence of a reaction. The starting substances are reactants.",
      follow:
        "What are the new substances formed in a chemical reaction called?",
      followAnswer: "Products.",
    };
  }),
  family("evaporation", "materials", "6Cc.03", 30, (v, d) => ({
    context: `Two identical open dishes each contain ${40 + v} ml of water. One is placed in a warm room and one in a cool room. Neither boils.`,
    question:
      d === "Easy"
        ? "Which process can lower the water level?"
        : d === "Medium"
          ? "Why can water leave the dishes even though it is not boiling?"
          : "Which explanation correctly compares evaporation and boiling?",
    answer:
      d === "Easy"
        ? "Evaporation"
        : d === "Medium"
          ? "Water can evaporate from its surface below its boiling point."
          : "Evaporation happens at the surface; boiling happens throughout the liquid at its boiling point.",
    wrong: [
      "Evaporation only happens at 100°C.",
      "Boiling only happens at the surface.",
      "Water must freeze before becoming a gas.",
    ],
    why: "Evaporation can happen below the boiling point, at the surface. During boiling, gas bubbles form throughout the liquid.",
    follow: "Predict which dish will usually lose water faster. Give a reason.",
    followAnswer:
      "The warm-room dish; a higher temperature increases evaporation, if the other conditions stay the same.",
  })),
  family("foodweb", "ecosystems", "6Be.01", 4, (v, d) => {
    const sets = [
      ["grass", "grasshopper", "frog", "snake", "hawk"],
      ["leaves", "caterpillar", "small bird", "fox", "owl"],
      ["algae", "water flea", "small fish", "large fish", "heron"],
      ["seeds", "mouse", "snake", "eagle", "owl"],
    ];
    const n = sets[v];
    return {
      context:
        "The arrows show energy passing from food to the animal that eats it.",
      question:
        d === "Easy"
          ? "Which organism is a producer?"
          : d === "Medium"
            ? `Which organism is both predator and prey in the chain ${n[0]} → ${n[1]} → ${n[2]} → ${n[3]}?`
            : `If ${n[2]} becomes scarce, which direct effect is most likely, if other conditions do not change?`,
      answer:
        d === "Easy"
          ? n[0]
          : d === "Medium"
            ? n[2]
            : `${n[1]} may increase because fewer are eaten.`,
      wrong: [
        `${n[0]} hunts ${n[3]}.`,
        `${n[3]} gains more of its usual prey.`,
        `${n[1]} is a producer.`,
      ],
      why: `${n[0]} is a producer. ${n[2]} eats ${n[1]} and is eaten by ${n[3]}. With fewer ${n[2]}, fewer ${n[1]} are eaten. This is a prediction, not a certainty.`,
      follow: "What is the original energy source for this food web?",
      followAnswer: "The Sun. Producers use sunlight.",
      diagram: {
        kind: "foodweb",
        nodes: n,
        edges: [
          { from: 0, to: 1 },
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 1, to: 4 },
        ],
      },
    };
  }),
  family("toxic-food", "ecosystems", "6Be.02", 4, (v, d) => {
    const chains = [
      ["grass", "insect", "bird"],
      ["algae", "small fish", "heron"],
      ["leaves", "caterpillar", "bird"],
      ["seeds", "mouse", "owl"],
    ];
    const [a, b, c] = chains[v];
    return {
      context: `A toxic substance gets onto ${a}. The food chain is ${a} → ${b} → ${c}.`,
      question:
        d === "Easy"
          ? `Which organism eats ${a}?`
          : d === "Medium"
            ? `How can the toxic substance enter ${c}?`
            : `A pupil says only ${a} will be affected because ${c} never touches the polluted ground. What is the best reply?`,
      answer:
        d === "Easy"
          ? b
          : `${c} can take in the substance by eating contaminated ${b}.`,
      wrong: [
        `${c} is protected because it is an animal.`,
        "The arrows mean the substance cannot move.",
        "Toxic substances always become harmless when eaten.",
      ],
      why: `The substance can pass along the chain as organisms eat contaminated food. Direct contact with the original pollution is not necessary.`,
      follow:
        "Suggest one action that reduces pollution entering this food chain.",
      followAnswer:
        "Prevent the toxic waste/chemical entering the habitat; accept a suitable specific action.",
    };
  }),
  family("force-diagram", "forces", "6Pf.03", 100, (v, d) => {
    const left = 4 + v,
      right = left + (v % 2 ? 3 : 0);
    return {
      context:
        "The horizontal forces on a stationary trolley are shown. Consider only these horizontal forces.",
      question:
        d === "Easy"
          ? "Which labelled force acts to the right?"
          : d === "Medium"
            ? "Are the horizontal forces balanced?"
            : "What will happen when the trolley is released, based on these forces?",
      answer:
        d === "Easy"
          ? `${right} N`
          : d === "Medium"
            ? left === right
              ? "Yes; they are equal and opposite."
              : "No; the rightward force is larger."
            : left === right
              ? "It will remain at rest."
              : "It will start moving to the right.",
      wrong: [
        "It must move left.",
        "Balanced forces always make an object speed up.",
        "There are no forces acting.",
      ],
      why:
        left === right
          ? "The forces are equal and opposite, so they balance. A stationary object remains at rest."
          : "The rightward force is greater, so the forces do not balance and the trolley starts moving right.",
      follow: "What unit is used to measure force?",
      followAnswer: "Newtons (N).",
      diagram: { kind: "forces", left, right },
    };
  }),
  family("mass-weight", "forces", "6Pf.02", 60, (v, d) => ({
    context: `An object has mass ${v + 2} kg on Earth. It is taken to a place where gravity is weaker.`,
    question:
      d === "Easy"
        ? "Which quantity is measured in kilograms?"
        : d === "Medium"
          ? "What happens to the mass?"
          : "Which statement correctly describes both mass and weight?",
    answer:
      d === "Easy"
        ? "Mass"
        : d === "Medium"
          ? "It stays the same."
          : "Mass stays the same; weight decreases.",
    wrong: [
      "Both must decrease.",
      "Mass decreases but weight stays the same.",
      "Weight increases because gravity is weaker.",
    ],
    why: "Mass is the amount of matter and is measured in kilograms. Weight is the pull of gravity, measured in newtons. Weaker gravity means less weight, not less matter.",
    follow: "Name the force responsible for the weight of the object.",
    followAnswer: "Gravity.",
  })),
  family("reflection", "light", "6Ps.01", 6, (v, d) => ({
    context: `A ray from a torch strikes a flat mirror. The reflected ray reaches screen ${["A", "B", "C", "D", "E", "F"][v]}. The mirror is then turned slightly.`,
    question:
      d === "Easy"
        ? "What is the change in direction at a mirror called?"
        : d === "Medium"
          ? "What is likely to happen to the reflected ray when the mirror turns?"
          : "Why does turning the mirror move the bright spot even when the torch stays still?",
    answer:
      d === "Easy"
        ? "Reflection"
        : d === "Medium"
          ? "Its direction changes."
          : "The reflected direction depends on the direction of the mirror surface.",
    wrong: [
      "The mirror creates extra light.",
      "The light always continues straight through the mirror.",
      "Light stops travelling when it reaches a mirror.",
    ],
    why: "A mirror reflects light. Turning the mirror changes the direction of the reflected ray, so it can reach a different part of the screen.",
    follow:
      "Explain why a cleaner, smooth mirror usually gives a clearer image than a dirty, rough one.",
    followAnswer:
      "A smooth, clean surface reflects light in an orderly way; dirt or roughness scatters it.",
  })),
  family("refraction", "light", "6Ps.02", 4, (v, d) => ({
    context: `A straight ${["straw", "pencil", "glass rod", "plastic ruler"][v]} stands partly in water. Viewed from the side, it seems bent at the surface.`,
    question:
      d === "Easy"
        ? "What happens to the direction of some light rays at the water surface?"
        : d === "Medium"
          ? "What is this change in the direction of light called?"
          : "Which explanation avoids confusing the object with the light travelling from it?",
    answer:
      d === "Easy"
        ? "They change direction."
        : d === "Medium"
          ? "Refraction"
          : "The object stays straight; light changes direction between water and air.",
    wrong: [
      "Water breaks the object.",
      "The object becomes two objects.",
      "No light can pass through water.",
    ],
    why: "Light can change direction when it passes between water and air. This is refraction. The object only appears bent.",
    follow: "Name the two materials through which the light passes.",
    followAnswer: "Water and air.",
  })),
  family("circuits", "electricity", "6Pe.02", 4, (v, d) => {
    const parallel = v % 2 === 0,
      open = v > 1;
    return {
      context: `The diagram shows two identical lamps and a cell. The switch is ${open ? "open" : "closed"}.`,
      question:
        d === "Easy"
          ? "What arrangement are the lamps in?"
          : d === "Medium"
            ? "Will either lamp light with the switch as shown?"
            : parallel
              ? "With the main switch closed, one lamp is removed. Why can the other lamp still light?"
              : "With the main switch closed, one lamp is removed. Why do both lamps go out?",
      answer:
        d === "Easy"
          ? parallel
            ? "Parallel"
            : "Series"
          : d === "Medium"
            ? open
              ? "No; the main circuit has a gap."
              : "Yes; the paths are complete."
            : parallel
              ? "The other branch still has a complete path."
              : "There is a gap in the only path.",
      wrong: [
        "Lamps do not need a complete circuit.",
        "Current crosses any air gap.",
        "A cell only works with one lamp.",
      ],
      why: parallel
        ? "Parallel lamps have separate branches. A gap in one branch does not break the other, but opening the main switch breaks both."
        : "Series lamps share one path. A gap anywhere in that path stops both lamps lighting.",
      follow: "Name the component that supplies electrical energy.",
      followAnswer: "The cell/battery.",
      diagram: { kind: "circuit", parallel, open },
    };
  }),
  family("conductors", "electricity", "6Cp.03", 8, (v, d) => ({
    context: `A pupil tests four objects in a complete circuit: a ${["copper", "steel", "aluminium", "iron"][v % 4]} strip, a dry plastic strip, a rubber strip and a dry wooden strip.`,
    question:
      d === "Easy"
        ? "Which material is most likely to let the lamp light?"
        : d === "Medium"
          ? "What does the lamp lighting show about the tested object?"
          : "Why must all connections be checked before concluding that an object is an insulator?",
    answer:
      d === "Easy"
        ? "The metal strip"
        : d === "Medium"
          ? "It conducts electricity."
          : "A loose connection can also stop the lamp lighting.",
    wrong: [
      "Every dark-coloured object is a conductor.",
      "An insulator supplies energy to the lamp.",
      "The length of the test has no effect on a loose connection.",
    ],
    why: "A conductor allows current through. A lamp that does not light could mean an insulating material OR a break elsewhere, so first check the circuit.",
    follow: "Give one reason plastic is useful around an electrical wire.",
    followAnswer:
      "It is an electrical insulator and helps prevent contact with the conducting wire.",
  })),
  family("pulse", "body", "6Bs.01", 80, (v, d) => ({
    context: `A pupil records a pulse of ${60 + v} beats per minute at rest and ${90 + v} after running.`,
    question:
      d === "Easy"
        ? "Which organ pumps the blood?"
        : d === "Medium"
          ? "What happened to the pulse rate after running?"
          : "Why does a faster blood flow help working muscles?",
    answer:
      d === "Easy"
        ? "The heart"
        : d === "Medium"
          ? "It increased."
          : "Blood delivers oxygen and nutrients and carries away waste.",
    wrong: [
      "The lungs pump blood instead of the heart.",
      "Blood only transports water.",
      "Working muscles do not need oxygen.",
    ],
    why: "The heart pumps blood. Blood carries oxygen and nutrients to muscles and carries waste away. During exercise the body needs these transported faster.",
    follow: "Where does oxygen from breathed-in air enter the blood?",
    followAnswer: "In the lungs.",
  })),
  family("hygiene", "body", "6Bp.03", 4, (v, d) => {
    const c = [
      "preparing a shared meal",
      "using a shared sports bottle",
      "drinking untreated stream water",
      "being bitten by mosquitoes",
    ][v];
    const actions = [
      "Wash hands and use clean food-preparation equipment.",
      "Use individual clean bottles.",
      "Treat the water so it is safe to drink.",
      "Use suitable mosquito nets or repellent.",
    ];
    return {
      context: `A class discusses infection risks when ${c}.`,
      question:
        d === "Easy"
          ? "Which action can lower this risk?"
          : d === "Medium"
            ? "Which precaution directly reduces the route by which infection can spread?"
            : "A pupil says looking healthy proves a person cannot pass on an infection. Which is the safest scientific response?",
      answer:
        d === "Hard"
          ? "Appearance alone is not reliable; use appropriate hygiene precautions."
          : actions[v],
      wrong: [
        "Only visibly ill people can spread infection.",
        "All microorganisms are harmful.",
        "Hygiene never affects infection spread.",
      ],
      why: "Some infections can spread before clear signs appear. Suitable hygiene reduces transfer; it does not require guessing who looks ill.",
      follow: "Name one natural defence the body has against infection.",
      followAnswer: "Skin, stomach acid or mucus.",
    };
  }),
  family("rock-cycle", "earth", "6ESc.01", 3, (v, d) => {
    const descriptions = [
      "molten rock cools and becomes solid",
      "sediment is buried and pressed together",
      "existing rock is changed by heat and pressure without melting",
    ];
    const names = ["Igneous", "Sedimentary", "Metamorphic"];
    return {
      context: `A rock forms when ${descriptions[v]}.`,
      question:
        d === "Easy"
          ? "Name this type of rock."
          : d === "Medium"
            ? "Which rock group does this evidence support?"
            : "A pupil classifies this rock by colour alone. Which classification is supported by how it formed?",
      answer: names[v],
      exact: [`${names[v]} rock`],
      wrong: [
        ...names.filter((n) => n !== names[v]),
        "All rocks form in exactly the same way.",
      ],
      why: `Its formation is the evidence: ${descriptions[v]}, producing ${names[v].toLowerCase()} rock. Colour alone is not enough.`,
      follow: "Explain how fragments of an older rock can become sediment.",
      followAnswer:
        "The rock breaks down and fragments are carried away by erosion, such as moving water.",
    };
  }),
  family("soil", "earth", "6ESp.03", 80, (v, d) => ({
    context: `Equal volumes of water are poured through equal amounts of soil. In 5 minutes, soil A lets ${40 + v} ml through and soil B lets ${10 + v} ml through.`,
    question:
      d === "Easy"
        ? "Which soil lets more water through in this time?"
        : d === "Medium"
          ? "Which soil keeps more of the added water, if all other conditions are the same?"
          : "Which conclusion stays within the evidence rather than assuming every plant needs the same soil?",
    answer:
      d === "Easy"
        ? "Soil A"
        : d === "Medium"
          ? "Soil B"
          : "Soil B retains more water; the best soil also depends on the plant’s needs.",
    wrong: [
      "Soil A retains more because more drained out.",
      "Every plant grows best in waterlogged soil.",
      "These results prove both soils have identical composition.",
    ],
    why: "Less water draining out means more was retained in this test. Plant growth also depends on air, nutrients and the kind of plant.",
    follow: "State one condition to keep the same in a repeat investigation.",
    followAnswer:
      "Amount of soil, volume of water added, drainage time, or container/filter type.",
  })),
  family("moon", "space", "6ESs.02", 4, (v, d) => ({
    context: `A pupil observes the Moon at the same time on ${["Monday", "Tuesday", "Wednesday", "Thursday"][v]} and then on several later nights. Its lit shape appears to change.`,
    question:
      d === "Easy"
        ? "Where does the light we see from the Moon mainly come from?"
        : d === "Medium"
          ? "Which movement explains the regular cycle of phases?"
          : "Which explanation correctly distinguishes a Moon phase from an eclipse?",
    answer:
      d === "Easy"
        ? "The Sun"
        : d === "Medium"
          ? "The Moon moves around Earth."
          : "We see different amounts of the sunlit half as the Moon moves around Earth.",
    wrong: [
      "The Moon makes its own sunlight.",
      "Earth’s shadow causes every normal Moon phase.",
      "Clouds create the regular monthly cycle.",
    ],
    why: "The Sun lights half the Moon. As the Moon moves around Earth, we see different amounts of that lit half. An eclipse involves a shadow and is not the usual cause of phases.",
    follow: "What does Earth orbit?",
    followAnswer: "The Sun.",
  })),
  family("anomaly", "enquiry", "6TWSa.02", 80, (v, d) => {
    const n = 20 + v;
    return {
      context: `Four repeats of the same rolling-ball test give times ${n}, ${n + 1}, ${n + 20} and ${n - 1} seconds.`,
      question:
        d === "Easy"
          ? "Which result is very different from the others?"
          : d === "Medium"
            ? "Which result should be checked by repeating the measurement?"
            : "A pupil deletes the unusual result and says the experiment is now proved correct. What should they do instead?",
      answer:
        d === "Easy" || d === "Medium"
          ? `${n + 20} seconds`
          : "Check the method and repeat the measurement before deciding how to treat it.",
      wrong: [
        "Keep only the result that fits the prediction.",
        "Change every result to the same number.",
        "Never repeat any measurements.",
      ],
      why: `${n + 20} s is far from the others. It is an unusual (anomalous) result. Repeating and checking the method is better than hiding evidence.`,
      follow: "Explain why repeating measurements can be useful.",
      followAnswer:
        "It helps check consistency, identify unusual results and make the result more reliable.",
    };
  }),
  family("fair-test", "enquiry", "6TWSp.04", 6, (v, d) => {
    const setups = [
      ["ramp height", "distance travelled", "same toy car"],
      ["water temperature", "time for sugar to dissolve", "same mass of sugar"],
      [
        "soil type",
        "volume of water draining out",
        "same volume of added water",
      ],
      ["exercise type", "pulse rate", "same person and exercise time"],
      [
        "surface type",
        "distance a toy car travels",
        "same car and starting ramp",
      ],
      [
        "number of cells",
        "lamp brightness",
        "same lamp and circuit arrangement",
      ],
    ][v];
    return {
      context: `A pupil investigates how ${setups[0]} affects ${setups[1]}.`,
      question:
        d === "Easy"
          ? "What should the pupil change on purpose?"
          : d === "Medium"
            ? "What should the pupil measure?"
            : `The pupil also changes another condition. Which control would improve the test?`,
      answer: d === "Easy" ? setups[0] : d === "Medium" ? setups[1] : setups[2],
      wrong: [
        "Change every condition together.",
        "Record only the prediction, not results.",
        "Use a different method for each repeat.",
      ],
      why: `Change ${setups[0]} (the independent variable). Measure ${setups[1]} (the dependent variable). Keep ${setups[2]} so the comparison is fair.`,
      follow:
        "Explain why changing two conditions at once makes a conclusion less certain.",
      followAnswer:
        "You cannot tell which change caused the difference in the results.",
    };
  }),
];

export const MOCK_EXAM_BANK: Record<string, any> = {
  english: {
    comprehension: {
      title: "The Discovery of the Hidden Cave",
      passage: "The sun was beginning to set, casting long, spooky shadows across the dense forest. Lily and Sam had been walking for hours, their boots crunching on the dry autumn leaves. Just as they were about to turn back, Sam noticed a strange formation of rocks behind a thick curtain of ivy. Pulling the vines aside, a blast of cool, damp air hit their faces. They had uncovered a dark, gaping hole in the hillside. Inside, the walls glittered with what looked like tiny, embedded diamonds. Lily pulled a flashlight from her backpack, her hands trembling slightly with excitement. As the beam of light pierced the darkness, they saw ancient drawings etched into the stone walls—drawings of animals that hadn't roamed the earth for thousands of years. They knew, in that moment, that they had found something extraordinary.",
      questions: [
        { id: 1, text: "What time of day did Lily and Sam find the cave?", marks: 1 },
        { id: 2, text: "Write down the phrase from the text that shows Sam was the first to see the cave.", marks: 1 },
        { id: 3, text: "Why did Lily's hands tremble?", marks: 2 },
        { id: 4, text: "What did the children find inside the cave that proved it was very old?", marks: 1 },
        { id: 5, text: "Find and copy one word from the text that means 'covered or hidden'.", marks: 1 }
      ]
    },
    writing: {
      instructions: "Continue the story. Write about what Lily and Sam do next inside the cave. Remember to use descriptive language and build suspense. (150-200 words)"
    }
  },
  math: {
    comprehension: {
      title: "The School Bake Sale",
      passage: "Year 6 is organising a bake sale to raise money for a new school garden. They have baked 120 cupcakes, 85 brownies, and 40 giant cookies. They plan to sell the cupcakes for £1.50 each, the brownies for £2.00 each, and the cookies for £1.20 each. During the first hour, they sell half of the cupcakes, 30 brownies, and 15 cookies. They also spent £25 on ingredients before the sale began.",
      questions: [
        { id: 1, text: "How much money did they make from selling cupcakes in the first hour?", marks: 2 },
        { id: 2, text: "How many brownies do they have left to sell after the first hour?", marks: 1 },
        { id: 3, text: "What is the total amount of money collected from all sales in the first hour?", marks: 2 },
        { id: 4, text: "If they sell all remaining items at half price in the last hour, how much extra money will they make?", marks: 3 },
        { id: 5, text: "Taking into account the cost of ingredients, what would be their final profit if they sold everything (including the half-price items)?", marks: 2 }
      ]
    },
    writing: {
      instructions: "Investigation: A local bakery offers to supply 50 extra cupcakes for £40. Write a short report explaining whether Year 6 should accept this offer to increase their profits. Show all your mathematical reasoning."
    }
  },
  science: {
    comprehension: {
      title: "Investigating Plant Growth",
      passage: "A class of Year 6 students carried out an experiment to see how different amounts of light affect the growth of bean plants. They took three identical pots, each containing the same type of soil and one bean seed. Pot A was placed on a sunny windowsill. Pot B was placed in a cardboard box with a small hole cut in one side. Pot C was placed in a completely dark cupboard. All three plants were given 50ml of water every two days. After two weeks, they measured the height of the plants. Plant A was 15cm tall with green leaves. Plant B was 18cm tall, leaning towards the hole, with pale green leaves. Plant C was 22cm tall, very thin, with yellow leaves.",
      questions: [
        { id: 1, text: "What is the independent variable (the thing they changed) in this experiment?", marks: 1 },
        { id: 2, text: "Name two control variables (things they kept the same) to ensure a fair test.", marks: 2 },
        { id: 3, text: "Why did Plant B lean towards the hole in the box?", marks: 1 },
        { id: 4, text: "Explain why Plant C grew the tallest but had yellow leaves and a thin stem.", marks: 2 },
        { id: 5, text: "What conclusion can the students draw from this experiment about plants and light?", marks: 1 }
      ]
    },
    writing: {
      instructions: "Investigation: Design a new experiment to test how the AMOUNT OF WATER affects plant growth. Write down your method, clearly stating your independent, dependent, and control variables."
    }
  }
};

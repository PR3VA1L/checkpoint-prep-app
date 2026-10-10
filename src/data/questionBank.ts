export interface BankQuestion {
  id?: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Generated cleanly by scripts/generate-cambridge.js
// Total Questions: 175
export const QUESTION_BANK: BankQuestion[] = [
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Easy",
    "question": "Which sentence contains a relative clause?",
    "options": [
      "Although it was raining heavily, we played outside.",
      "The cat, which had a white paw, slept peacefully by the fire.",
      "She ran fast because she was late for the bus.",
      "Eating vegetables is good for your health."
    ],
    "correctIndex": 1,
    "explanation": "The second option contains the relative clause 'which had a white paw', introduced by the relative pronoun 'which'. Option 0 uses an adverbial subordinate clause ('Although it was raining heavily'), Option 2 uses a subordinating conjunction ('because'), and Option 3 contains a gerund phrase ('Eating vegetables')."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Easy",
    "question": "Which of the following sentences is written in the passive voice?",
    "options": [
      "The gardener planted bright yellow daffodils in the park.",
      "Bright yellow daffodils bloomed everywhere in the spring.",
      "Bright yellow daffodils were planted in the park by the gardener.",
      "The children were excited to see the yellow daffodils."
    ],
    "correctIndex": 2,
    "explanation": "In Option 2, the object 'bright yellow daffodils' becomes the subject receiving the action ('were planted'), making it passive. In Option 0, 'The gardener' performs the action directly (active voice). Option 1 features an intransitive verb ('bloomed'), and Option 3 uses 'were' as a linking verb with an adjective ('excited')."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Easy",
    "question": "Select the sentence that uses a modal verb expressing possibility rather than certainty.",
    "options": [
      "We might go to the beach if the sun comes out.",
      "We will visit the museum tomorrow morning.",
      "You must wear your school uniform on the trip.",
      "She can swim faster than anyone in the class."
    ],
    "correctIndex": 0,
    "explanation": "'Might' is a modal verb used to show possibility or uncertainty. 'Will' shows certainty, 'must' indicates obligation, and 'can' expresses ability."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Easy",
    "question": "Which sentence correctly uses a subordinating conjunction to join two clauses?",
    "options": [
      "The sun was shining brightly, but the wind was cold.",
      "I brought my coat, so it was cold outside.",
      "You can have an apple or you can have a banana.",
      "We decided to go home because the rain started to pour."
    ],
    "correctIndex": 3,
    "explanation": "'Because' is a subordinating conjunction introducing a subordinate clause of reason ('because the rain started to pour'). 'But', 'so', and 'or' in the other options are coordinating conjunctions."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Easy",
    "question": "Which sentence uses an apostrophe correctly for plural possession?",
    "options": [
      "The children's coats were hanging on the hooks.",
      "The childrens' coats were hanging on the hooks.",
      "The childrens coat's were hanging on the hooks.",
      "The childrens coats' were hanging on the hooks."
    ],
    "correctIndex": 0,
    "explanation": "'Children' is an irregular plural noun that does not end in 's'. To show possession for irregular plurals, add an apostrophe followed by 's' ('children's'). Putting the apostrophe after the 's' (as in 'childrens'') is a common error."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Easy",
    "question": "Which sentence is correctly punctuated for direct speech?",
    "options": [
      "\"Please pass the salt\" said Martha.",
      "\"Please pass the salt.\" said Martha.",
      "\"Please pass the salt,\" said Martha.",
      "\"Please pass the salt\", said Martha."
    ],
    "correctIndex": 2,
    "explanation": "In direct speech, a comma is placed inside the closing inverted commas when the speech is followed by a reporting clause ('said Martha'). Option 0 lacks punctuation, Option 1 incorrectly uses a full stop before the reporting clause, and Option 3 places the comma outside the inverted commas."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Easy",
    "question": "Which sentence uses a comma correctly to separate a fronted adverbial from the main clause?",
    "options": [
      "While eating the lion, watched us from afar.",
      "After we finished eating, the dog wanted to play.",
      "Let's eat Grandma!",
      "Slowly the dark grey, clouds gathered above the old oak tree."
    ],
    "correctIndex": 1,
    "explanation": "'After we finished eating' is a fronted adverbial clause, which must be followed by a comma before the main clause. Option 0 places a comma incorrectly creating confusion, Option 2 is missing a comma before 'Grandma', and Option 3 places a comma incorrectly between adjectives."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Easy",
    "question": "Which sentence uses brackets (parentheses) correctly to enclose extra information?",
    "options": [
      "My brother (who is ten years old) loves playing football.",
      "My brother who is ten (years old loves) playing football.",
      "My (brother who is ten years old) loves playing football.",
      "My brother who is ten years old (loves playing) football."
    ],
    "correctIndex": 0,
    "explanation": "Brackets should enclose extra non-essential information ('who is ten years old'). If removed, the main sentence 'My brother loves playing football' still makes complete sense. The other options split essential phrases awkwardly."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Easy",
    "question": "Read the sentence: 'The ancient ruins were remarkably intact, despite centuries of harsh weather.' What does the word 'intact' mean in this context?",
    "options": [
      "Completely ruined",
      "Covered in moss",
      "Hidden underground",
      "Undamaged and whole"
    ],
    "correctIndex": 3,
    "explanation": "'Intact' means remaining whole, complete, or uninjured. The contrast word 'despite' indicates that even after centuries of harsh weather, the ruins were surprisingly undamaged."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Easy",
    "question": "Read the sentence: 'The explorer moved cautiously through the dark, narrow cave.' Which word is an ANTONYM for 'cautiously'?",
    "options": [
      "Carefully",
      "Recklessly",
      "Quietly",
      "Slowly"
    ],
    "correctIndex": 1,
    "explanation": "'Cautiously' means taking care to avoid danger. 'Recklessly' is the exact opposite (antonym), meaning without caution or care for danger. 'Carefully', 'quietly', and 'slowly' are synonyms or related meanings."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Easy",
    "question": "Read the sentence: 'The young prince was reluctant to accept the crown.' What does 'reluctant' mean?",
    "options": [
      "Very eager and excited",
      "Proud and arrogant",
      "Unwilling or hesitant",
      "Fully prepared"
    ],
    "correctIndex": 2,
    "explanation": "'Reluctant' means feeling or showing hesitation, doubt, or unwillingness to do something. Distractors reflect opposite or unrelated characteristics."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Easy",
    "question": "Read the sentence: 'The teacher gave a concise summary of the historical event.' What does 'concise' mean?",
    "options": [
      "Short and clear",
      "Long and detailed",
      "Confusing and messy",
      "Humorous and lively"
    ],
    "correctIndex": 0,
    "explanation": "'Concise' means giving a lot of information clearly and in a few words (brief and to the point). 'Long and detailed' is an antonym."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Easy",
    "question": "Which text type is written primarily to persuade the reader?",
    "options": [
      "An entry in an encyclopedia about rainforest animals",
      "A recipe explaining how to bake a sponge cake",
      "An advert encouraging people to switch to renewable energy",
      "A newspaper report covering a local sports match"
    ],
    "correctIndex": 2,
    "explanation": "An advert is written to convince or persuade the audience to adopt an opinion or take action. An encyclopedia entry is informative, a recipe is instructional, and a newspaper report is recount/informational."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Easy",
    "question": "What is the primary purpose of an instructional text?",
    "options": [
      "To entertain the reader with an exciting story",
      "To guide the reader step-by-step on how to do or make something",
      "To express personal feelings and opinions",
      "To persuade the reader to buy a new product"
    ],
    "correctIndex": 1,
    "explanation": "Instructional texts (like recipes or manuals) aim to tell the reader how to perform a task using ordered steps, imperatives, and clear instructions."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Easy",
    "question": "Read the announcement: 'Attention students! Don't miss out on the summer gala this Friday. Fantastic rides, delicious snacks, and amazing prizes await you!' Who is the intended audience?",
    "options": [
      "School teachers",
      "Local business owners",
      "Professional event planners",
      "School pupils"
    ],
    "correctIndex": 3,
    "explanation": "The text directly addresses 'students' and uses informal, exciting language appealing to young pupils ('Fantastic rides, delicious snacks, and amazing prizes')."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Easy",
    "question": "Which set of language features would you expect to find in a formal non-chronological report?",
    "options": [
      "Subheadings, technical vocabulary, and objective third-person language",
      "Casual slang, bullet points, and first-person pronouns like 'I'",
      "Rhyming couplets, verses, and emotional metaphors",
      "Dialogue tags, exclamation marks, and informal speech"
    ],
    "correctIndex": 0,
    "explanation": "Formal non-chronological reports present facts logically using subheadings, subject-specific technical terms, and objective third-person grammar ('it', 'they'). First-person, slang, and poetic structures belong to other genres."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Easy",
    "question": "Read the sentence: 'The autumn leaves danced gracefully across the lawn.' Which literary device is used here?",
    "options": [
      "Simile",
      "Personification",
      "Alliteration",
      "Onomatopoeia"
    ],
    "correctIndex": 1,
    "explanation": "Giving human characteristics (dancing gracefully) to non-human things (leaves) is personification."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Easy",
    "question": "Which of the following sentences contains a simile?",
    "options": [
      "The stars were tiny diamonds scattered in the night sky.",
      "The wind whispered secrets through the trees.",
      "The engine roared like a hungry lion.",
      "Crash! The heavy vase shattered on the floor."
    ],
    "correctIndex": 2,
    "explanation": "A simile compares two things using 'like' or 'as' ('roared like a hungry lion'). Option 0 is a metaphor, Option 1 is personification, and Option 3 uses onomatopoeia ('Crash!')."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Easy",
    "question": "Which sentence contains an example of alliteration?",
    "options": [
      "She sells sea shells on the sea shore.",
      "The rain fell softly on the roof.",
      "Time flies when you are having fun.",
      "He was as brave as a mountain bear."
    ],
    "correctIndex": 0,
    "explanation": "Alliteration is the repetition of the same starting consonant sound in neighbouring words ('She sells sea shells...')."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Easy",
    "question": "Read the sentence: 'I have told you a million times to tidy your bedroom!' Which literary device is used for emphasis here?",
    "options": [
      "Onomatopoeia",
      "Personification",
      "Metaphor",
      "Hyperbole"
    ],
    "correctIndex": 3,
    "explanation": "Hyperbole is an intentional exaggeration not meant to be taken literally ('a million times'), used here to emphasize impatience."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Easy",
    "question": "Which word is spelled correctly?",
    "options": [
      "Accommodate",
      "Acommodate",
      "Accomodate",
      "Acomodate"
    ],
    "correctIndex": 0,
    "explanation": "'Accommodate' requires a double 'c' and a double 'm'. Missing one or both of these doubled consonants is a common spelling mistake."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Easy",
    "question": "Select the sentence with the correct spelling of 'necessary'.",
    "options": [
      "It is neccessary to pack extra warm clothing.",
      "It is necessary to pack extra warm clothing.",
      "It is necesary to pack extra warm clothing.",
      "It is neccesary to pack extra warm clothing."
    ],
    "correctIndex": 1,
    "explanation": "'Necessary' is spelled with one 'c' and double 's' (a helpful mnemonic is: 1 Collar, 2 Sleeves)."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Easy",
    "question": "Which of the following spellings is correct?",
    "options": [
      "Mischevious",
      "Mischivous",
      "Mischievous",
      "Mischeviouss"
    ],
    "correctIndex": 2,
    "explanation": "'Mischievous' has three syllables (mis-chiev-ous) and ends in '-ous'. People often mispronounce and misspell it as 'mischevious' with an extra 'i'."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Easy",
    "question": "In British English, which sentence uses the correct spelling for the verb form of 'practise'?",
    "options": [
      "I need to practice playing the piano every afternoon.",
      "The doctor's practise was located on High Street.",
      "She went to the football practise after school.",
      "I need to practise playing the piano every afternoon."
    ],
    "correctIndex": 3,
    "explanation": "In British English, 'practise' (with an 's') is the verb ('to practise'), whereas 'practice' (with a 'c') is the noun ('a practice'). In Option 3, 'practise' functions as a verb following 'need to'."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Easy",
    "question": "Which word is spelled correctly using the suffix '-tial'?",
    "options": [
      "Especial",
      "Essential",
      "Essencial",
      "Offitial"
    ],
    "correctIndex": 1,
    "explanation": "'Essential' ends with '-tial' (following a consonant 'n'). 'Official' ends with '-cial' (following a vowel), making Options 2 and 3 incorrect spellings."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Easy",
    "question": "Which word in the sentence below is a modal verb?\n\n'You must finish your homework before you go outside to play.'",
    "options": [
      "finish",
      "must",
      "homework",
      "outside"
    ],
    "correctIndex": 1,
    "explanation": "'Must' is a modal verb because it indicates necessity or obligation. 'Finish' is the main verb, 'homework' is a noun, and 'outside' is an adverb in this context."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Easy",
    "question": "Which word in the sentence below is a relative pronoun?\n\n'The boy who won the race was given a shiny trophy.'",
    "options": [
      "boy",
      "won",
      "who",
      "given"
    ],
    "correctIndex": 2,
    "explanation": "'Who' is a relative pronoun introducing the relative clause 'who won the race'. 'Boy' is a common noun, while 'won' and 'given' are main verbs."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Easy",
    "question": "Choose the correct past participle to complete this present perfect sentence:\n\n'They have ________ all the apples from the orchard.'",
    "options": [
      "picked",
      "picking",
      "picks",
      "pick"
    ],
    "correctIndex": 0,
    "explanation": "The present perfect tense is formed using 'have/has' plus the past participle ('picked'). 'Picking' is a present participle, 'picks' is third-person present tense, and 'pick' is the base verb."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Easy",
    "question": "Identify the fronted adverbial in the sentence below:\n\n'Quietly in the corner, the small kitten slept peacefully.'",
    "options": [
      "the small kitten",
      "slept peacefully",
      "Quietly in the corner",
      "in the corner"
    ],
    "correctIndex": 2,
    "explanation": "'Quietly in the corner' is a fronted adverbial because it comes at the start of the sentence before the main clause and describes how and where the action happened."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Easy",
    "question": "Which sentence uses inverted commas correctly for direct speech?",
    "options": [
      "\"I love reading books,\" said Maya.",
      "\"I love reading books\" said Maya.",
      "\"I love reading books, said Maya.\"",
      "I love reading \"books,\" said Maya."
    ],
    "correctIndex": 0,
    "explanation": "Inverted commas surround the spoken words only, and punctuation (such as the comma) must go inside the closing inverted comma before the reporting clause."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Easy",
    "question": "Which punctuation mark is missing to form the contraction of 'cannot'?\n\n'I can___t see the stage from here.'",
    "options": [
      ", (comma)",
      ". (full stop)",
      "' (apostrophe)",
      "; (semicolon)"
    ],
    "correctIndex": 2,
    "explanation": "An apostrophe is used in contractions to show where missing letters have been omitted (combining 'cannot' into 'can't')."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Easy",
    "question": "Which sentence uses a colon correctly to introduce a list?",
    "options": [
      "You will need the following items: a pencil, a ruler, and an eraser.",
      "You will need: the following items a pencil, a ruler, and an eraser.",
      "You: will need the following items a pencil, a ruler, and an eraser.",
      "You will need the following items a pencil: a ruler, and an eraser."
    ],
    "correctIndex": 0,
    "explanation": "A colon is placed directly after a complete main clause ('You will need the following items') to introduce the list of items that follows."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Easy",
    "question": "Which punctuation mark should be placed at the end of this exclamatory sentence?\n\n'What an amazing performance that was___'",
    "options": [
      "?",
      "!",
      ".",
      ","
    ],
    "correctIndex": 1,
    "explanation": "An exclamation mark (!) is used at the end of a sentence that expresses strong emotion or admiration."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Easy",
    "question": "What does the word 'famished' mean in this sentence?\n\n'After playing football all afternoon without lunch, Leo felt famished.'",
    "options": [
      "very tired",
      "extremely hungry",
      "slightly bored",
      "completely soaked"
    ],
    "correctIndex": 1,
    "explanation": "The context of playing sport all afternoon without eating lunch indicates extreme hunger. 'Famished' means very hungry."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Easy",
    "question": "What does 'cautiously' mean in the sentence below?\n\n'The explorer walked cautiously across the slippery, ice-covered bridge.'",
    "options": [
      "carefully and nervously",
      "quickly and excitedly",
      "noisily and rudely",
      "happily and carelessly"
    ],
    "correctIndex": 0,
    "explanation": "Crossing a slippery ice bridge requires careful attention to avoid falling. 'Cautiously' means taking great care to avoid risk or danger."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Easy",
    "question": "Which word is closest in meaning (a synonym) to 'ancient' in this sentence?\n\n'The ancient castle stood on top of the hill.'",
    "options": [
      "brand new",
      "enormous",
      "ruined",
      "very old"
    ],
    "correctIndex": 3,
    "explanation": "'Ancient' means belonging to the distant past or very old. 'Brand new' is the opposite, while 'enormous' refers to size and 'ruined' refers to condition."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Easy",
    "question": "Which word is an antonym (opposite) of 'polite' in the sentence below?\n\n'The teacher praised the student for her polite behavior.'",
    "options": [
      "kind",
      "rude",
      "helpful",
      "quiet"
    ],
    "correctIndex": 1,
    "explanation": "An antonym is a word opposite in meaning. The opposite of 'polite' (well-mannered) is 'rude'."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Easy",
    "question": "Read the text below:\n\n'Ingredients: 200g flour, 100g sugar, 2 eggs.\nMethod: 1. Mix flour and sugar. 2. Stir in eggs.'\n\nWhat is the main purpose of this text?",
    "options": [
      "to instruct how to make something",
      "to persuade people to buy ingredients",
      "to entertain with a fictional story",
      "to describe a bakery"
    ],
    "correctIndex": 0,
    "explanation": "The presence of an ingredients list and numbered sequential steps shows this is an instructional text (a recipe) designed to instruct the reader."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Easy",
    "question": "Read the letter extract:\n\n'Dear Parents, please ensure your child brings a packed lunch on Tuesday for our trip to the museum.'\n\nWho is the target audience for this letter?",
    "options": [
      "museum guides",
      "parents of pupils",
      "the school pupils",
      "bus drivers"
    ],
    "correctIndex": 1,
    "explanation": "The greeting 'Dear Parents' and the phrase 'your child' show that the letter is written specifically for parents of the pupils."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Easy",
    "question": "Read the text:\n\n'Visit Sunshine Island today! Enjoy pristine beaches and guaranteed warmth. Book your dream family holiday now!'\n\nWhat is the primary purpose of this text?",
    "options": [
      "to persuade readers to book a holiday",
      "to inform readers about island wildlife",
      "to recount a personal holiday experience",
      "to instruct how to travel by boat"
    ],
    "correctIndex": 0,
    "explanation": "The text uses persuasive language ('pristine', 'dream holiday') and imperative verbs ('Visit', 'Book... now!') to persuade the reader to purchase a holiday."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Easy",
    "question": "Which target audience is most appropriate for this informal sentence?\n\n'Hey mate, wanna come over later to play video games?'",
    "options": [
      "a headteacher",
      "a friend",
      "a police officer",
      "a shop assistant"
    ],
    "correctIndex": 1,
    "explanation": "Casual slang and informal contractions ('Hey mate', 'wanna') are suitable for an equal, familiar audience like a friend, rather than adults in formal roles."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Easy",
    "question": "Which literary device is used in the sentence below?\n\n'Her smile was as bright as the morning sun.'",
    "options": [
      "metaphor",
      "personification",
      "simile",
      "alliteration"
    ],
    "correctIndex": 2,
    "explanation": "A simile explicitly compares two things using the words 'as' or 'like' ('as bright as the morning sun')."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Easy",
    "question": "Identify the literary device used in this sentence:\n\n'The slippery snake slithered silently through the grass.'",
    "options": [
      "alliteration",
      "onomatopoeia",
      "rhyme",
      "personification"
    ],
    "correctIndex": 0,
    "explanation": "Alliteration is the repetition of the same starting consonant sound in close proximity (the 's' sound in slippery, snake, slithered, silently)."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Easy",
    "question": "Which word in the sentence below is an example of onomatopoeia?\n\n'The heavy wooden door closed with a loud bang.'",
    "options": [
      "heavy",
      "door",
      "bang",
      "loud"
    ],
    "correctIndex": 2,
    "explanation": "Onomatopoeia describes words that sound like the noise they represent. 'Bang' phonetically mimics the noise of a door shutting heavily."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Easy",
    "question": "Why is the sentence 'The wind whispered through the trees' an example of personification?",
    "options": [
      "It compares the wind to a person using 'like'.",
      "It gives human qualities (whispering) to non-human wind.",
      "It repeats the 'w' sound at the beginning of words.",
      "It uses sound words to describe the weather."
    ],
    "correctIndex": 1,
    "explanation": "Personification means giving human attributes, actions, or emotions (like 'whispering') to non-human objects or natural phenomena like the wind."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Easy",
    "question": "Choose the correct spelling of the word that means 'pleasing to look at'.",
    "options": [
      "beautifull",
      "beautiful",
      "beautifuyl",
      "beautifil"
    ],
    "correctIndex": 1,
    "explanation": "'Beautiful' ends with the suffix '-ful', which is spelled with a single 'l'. Distractors incorrectly double the 'l' or misspell the vowels."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Easy",
    "question": "Which is the correct spelling of the word meaning 'needed or essential'?",
    "options": [
      "necessary",
      "necesary",
      "neccessary",
      "necessery"
    ],
    "correctIndex": 0,
    "explanation": "'Necessary' is spelled with one 'c' and double 's'. A helpful memory aid is '1 Collar, 2 Sleeves'."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Easy",
    "question": "Select the correctly spelled UK English word for a local area where people live.",
    "options": [
      "neighborhead",
      "naighbourhood",
      "neighbourhood",
      "neighberhood"
    ],
    "correctIndex": 2,
    "explanation": "In standard UK English spelling, 'neighbourhood' contains 'eigh', 'our', and the suffix '-hood'."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Easy",
    "question": "What is the correct plural spelling of the word 'child'?",
    "options": [
      "childs",
      "children",
      "childrens",
      "childes"
    ],
    "correctIndex": 1,
    "explanation": "'Child' has an irregular plural form, 'children'. Adding an 's' to make 'childs' or 'childrens' is a common error."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Easy",
    "question": "Which word is spelled correctly according to the rule 'i before e except after c'?",
    "options": [
      "recieve",
      "receave",
      "receive",
      "receeve"
    ],
    "correctIndex": 2,
    "explanation": "After the letter 'c', the 'e' comes before 'i' ('receive'). A common mistake is writing 'recieve'."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Medium",
    "question": "Which sentence contains a relative clause?",
    "options": [
      "Walking through the dense forest, the explorer felt a sudden chill.",
      "The old cottage, which stood at the edge of the cliff, was abandoned years ago.",
      "Although it was raining heavily, the children insisted on playing outside.",
      "Before entering the cave, make sure you have a working torch."
    ],
    "correctIndex": 1,
    "explanation": "Option B contains the relative clause 'which stood at the edge of the cliff', introduced by the relative pronoun 'which' to give extra information about the cottage. Option A uses a present participle phrase ('Walking through...'), Option C uses an adverbial clause introduced by 'Although', and Option D uses a prepositional phrase/adverbial clause."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Medium",
    "question": "Read the sentence: 'The ancient parchment was meticulously restored by the museum curator.' Which option correctly identifies the passive verb form and its active voice equivalent?",
    "options": [
      "Passive: 'was meticulously' | Active: 'meticulously was'",
      "Passive: 'restored by' | Active: 'was restoring'",
      "Passive: 'was restored' | Active: 'restored'",
      "Passive: 'meticulously restored' | Active: 'had restored'"
    ],
    "correctIndex": 2,
    "explanation": "The passive verb phrase is 'was restored' (auxiliary 'was' + past participle 'restored'). In the active voice, the subject performs the action directly: 'The museum curator meticulously restored the ancient parchment.' Distractors confuse adverbs with the auxiliary verb or incorrectly change the verb tense."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Medium",
    "question": "Which modal verb best demonstrates absolute certainty about a future event?",
    "options": [
      "The flight might land on time despite the strong headwind.",
      "Passengers must present their passports at the boarding gate.",
      "You should pack an extra jumper in case the weather turns cold.",
      "The total solar eclipse will occur at precisely three o'clock tomorrow."
    ],
    "correctIndex": 3,
    "explanation": "'Will' in Option D expresses absolute certainty regarding a future event. 'Might' (Option A) expresses possibility, 'must' (Option B) expresses obligation/rule, and 'should' (Option C) expresses advice or likelihood."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Medium",
    "question": "Choose the sentence that displays correct subject-verb agreement.",
    "options": [
      "Every single one of the fragile glass jars was shattered in transit.",
      "Neither of the two lost hiking trails lead to the campsite.",
      "A swarm of aggressive wasps were circling the picnic basket.",
      "Either the captain or his sailors is responsible for steering the vessel."
    ],
    "correctIndex": 0,
    "explanation": "In Option A, 'Every single one' is a singular subject phrase, so it correctly takes the singular verb 'was'. In Option B, 'Neither' is singular and requires 'leads'. In Option C, 'swarm' is a singular collective noun requiring 'was'. In Option D, with 'either/or', the verb must agree with the nearer subject ('sailors'), requiring 'are'."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Medium",
    "question": "Which sentence uses a colon correctly to introduce an explanation?",
    "options": [
      "The expedition required essential supplies: warm coats, sturdy boots, and reliable compasses.",
      "The lighthouse keeper noticed a strange signal: the crimson beam was flashing three times faster than usual.",
      "She had three favourite subjects: namely English, History, and Science.",
      "The thunder crashed loudly: and the rain began to pour."
    ],
    "correctIndex": 1,
    "explanation": "A colon can link two independent clauses when the second clause explains or expands upon the first. In Option B, the second clause explains what the 'strange signal' was. Option A uses a colon to introduce a list (not an explanation clause). Option C incorrectly follows a colon with 'namely', and Option D incorrectly places a colon before a coordinating conjunction ('and')."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Medium",
    "question": "In which sentence is a hyphen required to form a compound adjective before a noun?",
    "options": [
      "The well-known author gave an inspiring speech at the local school.",
      "The author who gave the speech was well known throughout the country.",
      "The child was very well behaved during the long journey.",
      "The dog ran very fast down the well paved driveway."
    ],
    "correctIndex": 0,
    "explanation": "Compound adjectives placed before the noun they describe require a hyphen to avoid ambiguity (e.g., 'well-known author'). When the compound adjective comes after the noun (as in Options B and C), a hyphen is usually omitted. Option D requires a hyphen in 'well-paved' before 'driveway', making Option A the correct, fully accurate choice."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Medium",
    "question": "Which sentence uses punctuation for parenthesis correctly without creating a structural error?",
    "options": [
      "The rare blue orchid, discovered high in the Andes mountains bloom only once every decade.",
      "The rare blue orchid (discovered high in the Andes mountains blooms only once every decade).",
      "The rare blue orchid discovered high in the Andes mountains, blooms only once every decade.",
      "The rare blue orchid—discovered high in the Andes mountains—blooms only once every decade."
    ],
    "correctIndex": 3,
    "explanation": "Option D uses a pair of em-dashes correctly to enclose parenthetical information, leaving the main sentence ('The rare blue orchid blooms only once every decade') grammatically complete. Option A is missing a closing comma and has subject-verb agreement error ('bloom'). Option C incorrectly places a single comma between subject and verb. Option B includes the main verb inside the brackets."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Medium",
    "question": "Which sentence correctly uses apostrophes for plural possession?",
    "options": [
      "The two principal's offices were being repainted during the summer holidays.",
      "All the children's coats were hung neatly on the wooden pegs.",
      "The womens' football team celebrated their victory in the final match.",
      "Both of the bus's engines failed at the exact same moment."
    ],
    "correctIndex": 1,
    "explanation": "'Children' is an irregular plural noun that does not end in 's', so its possessive form requires -'s ('children's'). Option A refers to two principals, so it should be 'principals' offices'. Option C should be 'women's' (irregular plural). Option D refers to two buses, so it should be 'buses' engines'."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Medium",
    "question": "Read the sentence: 'The magistrate decided to discharge the accused man after fresh evidence came to light.' What does discharge mean in this context?",
    "options": [
      "To emit a liquid or gas from a container",
      "To fire a weapon or explosive device",
      "To release someone officially from custody or legal obligation",
      "To pay off a financial debt completely"
    ],
    "correctIndex": 2,
    "explanation": "In a legal context involving a court or magistrate, 'discharge' means to officially release a person from custody or criminal charges. Options A, B, and D are valid definitions of 'discharge' in other contexts (scientific, military, financial), which serve as distractors."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Medium",
    "question": "Read the passage: 'The detective scrutinized the footprint in the mud, carefully measuring its depth and angle.' Which word is the closest synonym for scrutinized in this sentence?",
    "options": [
      "glanced at",
      "spotted",
      "examined",
      "noticed"
    ],
    "correctIndex": 2,
    "explanation": "'Scrutinized' means to inspect or examine closely and thoroughly. 'Examined' is the closest synonym. 'Glanced at' implies a quick look (opposite), while 'spotted' and 'noticed' refer to becoming aware of something rather than conducting a detailed inspection."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Medium",
    "question": "Read the sentence: 'Despite the tempestuous weather at sea, the vessel reached the harbour safely.' Which word is an antonym of tempestuous as used in this sentence?",
    "options": [
      "stormy",
      "unpredictable",
      "treacherous",
      "serene"
    ],
    "correctIndex": 3,
    "explanation": "'Tempestuous' means wild, violent, or stormy. The antonym (opposite) is 'serene', which means calm and peaceful. 'Stormy', 'unpredictable', and 'treacherous' are synonyms or related words describing severe weather conditions."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Medium",
    "question": "What does the Latin prefix bene- mean in words such as benevolent, benefactor, and beneficial?",
    "options": [
      "Good or well",
      "Against or opposite",
      "Under or below",
      "Foreign or strange"
    ],
    "correctIndex": 0,
    "explanation": "The prefix 'bene-' comes from Latin meaning 'good' or 'well' (e.g., benevolent = well-wishing; benefactor = one who does good deeds; beneficial = producing good results). Option B corresponds to 'anti-', Option C to 'sub-', and Option D to 'xeno-'."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Medium",
    "question": "Which sentence is written in the most appropriate formal register for an official letter of complaint to a town council?",
    "options": [
      "I'm writing to let you know that the rubbish in the park is totally driving me mad.",
      "I am writing to express my dissatisfaction regarding the ongoing accumulation of litter in the public park.",
      "You really need to sort out the messy park because it looks completely awful.",
      "Just wanted to drop you a line about how gross the park has gotten recently."
    ],
    "correctIndex": 1,
    "explanation": "Option B uses formal vocabulary ('express my dissatisfaction', 'ongoing accumulation', 'public park') and contains no contractions or colloquial terms. Options A, C, and D use informal expressions ('driving me mad', 'sort out', 'gross', 'drop you a line') and contractions ('I'm'), which are unsuitable for formal correspondence."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Medium",
    "question": "Which text feature is most characteristic of a non-chronological report?",
    "options": [
      "First-person narration detailing personal emotional reflections",
      "Chronological step-by-step instructions using imperative verbs",
      "Dialogue tags indicating spoken interactions between characters",
      "Subheadings dividing content into thematic categories"
    ],
    "correctIndex": 3,
    "explanation": "Non-chronological reports organize factual information by topic or theme rather than by time, making subheadings an essential structural feature. Option A is characteristic of personal logs/autobiographies, Option B of instructional texts, and Option C of narrative fiction."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Medium",
    "question": "Which sentence uses a rhetorical question effectively to persuade an audience to save water?",
    "options": [
      "Did you know that turning off the tap while brushing your teeth saves six litres per minute?",
      "How can we stand by and watch our precious water supplies vanish forever?",
      "What time do you usually turn off the kitchen tap every evening?",
      "Where does the water from our domestic taps actually originate?"
    ],
    "correctIndex": 1,
    "explanation": "A rhetorical question is designed to make a dramatic point or provoke an emotional response rather than gather information. Option B challenges the audience's moral duty ('How can we stand by...'). Option A presents a factual statistic phrased as a question, while C and D are straightforward informational questions."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Medium",
    "question": "Read the excerpt: 'Ensure your helmet is securely fastened before mounting your bicycle. Always ride in single file when travelling in groups along busy roads.' Who is the intended target audience for this passage?",
    "options": [
      "Experienced motor mechanics repairing road vehicles",
      "Professional cyclists competing in international races",
      "Young cyclists learning essential road safety rules",
      "Highway engineers planning new urban cycle lanes"
    ],
    "correctIndex": 2,
    "explanation": "The instructional imperatives and basic safety advice ('helmet securely fastened', 'ride in single file') clearly target novice or young cyclists learning road safety. The other options involve specialized adult professionals who would not need basic cycling advice."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Medium",
    "question": "Read the line: 'The autumn leaves were a golden carpet covering the damp earth.' Which literary device is used here?",
    "options": [
      "Metaphor",
      "Simile",
      "Personification",
      "Onomatopoeia"
    ],
    "correctIndex": 0,
    "explanation": "A metaphor states that one thing IS another thing directly ('leaves were a golden carpet') to create a vivid visual comparison, without using 'like' or 'as' (which would make it a simile)."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Medium",
    "question": "Which sentence contains an example of personification?",
    "options": [
      "The old wooden door creaked loudly as the cold wind blew through the corridor.",
      "The persistent rain tapped its fingers impatiently against the windowpane.",
      "The slippery cobblestones were as slick as ice after the sudden downpour.",
      "The thunder rumbled like an angry giant sleeping beneath the mountains."
    ],
    "correctIndex": 1,
    "explanation": "Personification gives human traits or actions to non-human things. Describing rain as tapping 'its fingers impatiently' gives human anatomy and feelings (fingers, impatience) to rain. Option A uses sensory description, while C and D use similes ('as slick as ice', 'like an angry giant')."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Medium",
    "question": "Read the phrase: 'The silent snake slithered stealthily through the tall grass.' Which sound device is predominantly used here?",
    "options": [
      "Assonance",
      "Onomatopoeia",
      "Alliteration",
      "Rhyme"
    ],
    "correctIndex": 2,
    "explanation": "Alliteration is the repetition of initial consonant sounds in neighboring words. The repetition of the /s/ sound in 'silent snake slithered stealthily' is a clear example of alliteration (specifically sibilance)."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Medium",
    "question": "Which sentence uses hyperbole for dramatic effect?",
    "options": [
      "The suitcase weighed twenty kilograms when measured at the check-in desk.",
      "The wind whistled softly through the swaying branches of the willow tree.",
      "The castle tower was taller than any other building in the kingdom.",
      "I have told you a million times to hang your coat on the peg!"
    ],
    "correctIndex": 3,
    "explanation": "Hyperbole is an intentional and extreme exaggeration not meant to be taken literally. Saying 'told you a million times' is hyperbole. Option A is a factual measurement, Option B uses imagery/personification, and Option C is a factual comparative statement."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Medium",
    "question": "Which of the following options shows the correct spelling when the prefix dis- is added to the root word similar?",
    "options": [
      "disimilar",
      "dissamelar",
      "dissimilar",
      "dyssimilar"
    ],
    "correctIndex": 2,
    "explanation": "When adding 'dis-' to a root word starting with 's' ('similar'), both 's' letters are kept, forming 'dissimilar'. Option A incorrectly drops an 's', Option B misspells the root vowels, and Option D uses the wrong prefix 'dys-'."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Medium",
    "question": "Select the correct spelling of the adjective meaning 'able to be trusted or reliable'.",
    "options": [
      "responsable",
      "responsible",
      "responceable",
      "responsiable"
    ],
    "correctIndex": 1,
    "explanation": "The correct spelling is 'responsible' (ending with the suffix -ible). Options A, C, and D are common misspellings that incorrectly use -able or add extra vowels."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Medium",
    "question": "Identify the word from the Year 5/6 statutory spelling list that contains a spelling error.",
    "options": [
      "government",
      "environment",
      "millenium",
      "accommodation"
    ],
    "correctIndex": 2,
    "explanation": "'Millennium' is misspelled here; it requires a double 'n' as well as a double 'l' ('millennium'). Options A ('government'), B ('environment'), and D ('accommodation' - double 'c', double 'm') are all spelled correctly."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Medium",
    "question": "According to standard spelling rules (e.g., 'i before e except after c'), which word is spelled correctly?",
    "options": [
      "receive",
      "recieve",
      "receve",
      "receieve"
    ],
    "correctIndex": 0,
    "explanation": "In 'receive', the 'e' comes before the 'i' because it follows the letter 'c' producing an /ee/ sound ('i before e except after c'). Recieve (Option B) is a classic misspelling."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Medium",
    "question": "Which sentence is completely free of spelling errors?",
    "options": [
      "It is necessary to guarantee that the equipment is maintained properly.",
      "It is neccessary to gaurantee that the equipment is maintained properly.",
      "It is necessary to guarantee that the equipement is maintained properly.",
      "It is neccessary to guarantee that the equipment is maitained properly."
    ],
    "correctIndex": 0,
    "explanation": "Option A is entirely correct: 'necessary' (one 'c', double 's'), 'guarantee' (starts with 'gua-'), and 'equipment' (no extra 'e' after 'p'). Options B, C, and D contain common misconceptions for these Year 6 statutory words."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Medium",
    "question": "Read the sentence below:\n'Neither the headteacher nor the class teachers _____ available to discuss the trip until tomorrow morning.'\nWhich verb form correctly completes the sentence according to standard English rules?",
    "options": [
      "is",
      "were",
      "are",
      "be"
    ],
    "correctIndex": 2,
    "explanation": "When using the correlative conjunction 'neither... nor', the verb must agree with the subject closest to it. Here, 'class teachers' is plural, so the correct present tense verb is 'are'. 'Is' is a common distractor because students often think 'Neither' always demands a singular verb, or align it with 'headteacher'."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Medium",
    "question": "Which of the options correctly identifies the main clause in the sentence below?\n'Although the rain beat heavily against the windowpanes, the exhausted travellers, who had walked for hours, managed to build a warm fire.'",
    "options": [
      "Although the rain beat heavily against the windowpanes",
      "who had walked for hours",
      "the exhausted travellers managed to build a warm fire",
      "managed to build a warm fire"
    ],
    "correctIndex": 2,
    "explanation": "A main clause contains a subject and a predicate and can stand alone as a complete sentence. Removing the subordinate clause ('Although the rain...') and the relative clause ('who had walked for hours') leaves 'the exhausted travellers managed to build a warm fire'. Option 0 is a subordinate clause; Option 1 is a relative clause; Option 3 is missing the noun phrase subject."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Medium",
    "question": "Which sentence is written entirely in the passive voice?",
    "options": [
      "The ancient map had been buried beneath the floorboards by the pirate captain.",
      "The pirate captain buried the ancient map beneath the floorboards.",
      "Having buried the ancient map, the pirate captain walked away.",
      "The ancient map was lying quietly beneath the floorboards."
    ],
    "correctIndex": 0,
    "explanation": "In Option 0, the target/object ('ancient map') is placed as the subject, and the action is performed upon it ('had been buried by...'), which is the defining structure of the passive voice. Options 1 and 2 use the active voice, where the subject ('pirate captain') performs the action. Option 3 uses an active intransitive verb ('was lying')."
  },
  {
    "subject": "english",
    "topic": "Grammar",
    "difficulty": "Medium",
    "question": "Which modal verb best expresses a strong degree of certainty about a present situation?",
    "options": [
      "You might find the missing library book under your desk.",
      "The missing library book must be under your desk.",
      "The missing library book could be under your desk.",
      "You should check if the missing library book is under your desk."
    ],
    "correctIndex": 1,
    "explanation": "'Must' is a modal verb used to express strong logical certainty or deduction based on evidence. 'Might' and 'could' express possibility, while 'should' expresses advice or expectation rather than certainty."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Medium",
    "question": "Which sentence demonstrates the correct use of possessive apostrophes for both singular and plural nouns?",
    "options": [
      "The childrens' coats were hung next to the teachers' room.",
      "The children's coats were hung next to the teacher's room.",
      "The childrens coat's were hung next to the teachers room.",
      "The children's coats' were hung next to the teachers's room."
    ],
    "correctIndex": 1,
    "explanation": "'Children' is an irregular plural noun, so its possessive form requires an apostrophe followed by 's' ('children's'). 'Teacher's' correctly shows singular possession for one teacher. Option 0 incorrectly places the apostrophe after the 's' in 'childrens''. Option 2 incorrectly adds an apostrophe to a plural noun ('coat's') and omits possessive apostrophes elsewhere."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Medium",
    "question": "Where should a colon be inserted in the sentence below?\n'The expedition team required three essential items sturdy boots, a reliable compass, and a waterproof tent.'",
    "options": [
      "After 'team'",
      "After 'items'",
      "After 'boots'",
      "After 'compass'"
    ],
    "correctIndex": 1,
    "explanation": "A colon is used to introduce a list after a complete independent clause. 'The expedition team required three essential items' is an independent clause, so the colon correctly belongs right after 'items'. Placing it elsewhere disrupts the grammatical structure."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Medium",
    "question": "Which sentence uses hyphens correctly to avoid ambiguity?",
    "options": [
      "The museum exhibited a thirty-year-old document.",
      "The museum exhibited a thirty year old document.",
      "The museum exhibited a thirty year-old document.",
      "The museum exhibited a thirty-year old-document."
    ],
    "correctIndex": 0,
    "explanation": "When a compound adjective precedes a noun to describe age, hyphens join all words in the modifier ('thirty-year-old document'). Without hyphens (or with incorrect hyphenation as in Options 1, 2, and 3), the meaning becomes unclear or grammatically inconsistent."
  },
  {
    "subject": "english",
    "topic": "Punctuation",
    "difficulty": "Medium",
    "question": "Which sentence is correctly punctuated for direct speech?",
    "options": [
      "\"We must leave immediately\" Whispered the guide, \"Before the fog descends.\"",
      "\"We must leave immediately,\" whispered the guide, \"before the fog descends.\"",
      "\"We must leave immediately\", whispered the guide \"before the fog descends.\"",
      "\"We must leave immediately.\" whispered the guide, \"Before the fog descends.\""
    ],
    "correctIndex": 1,
    "explanation": "In direct speech, a comma must precede the closing speech mark before a reporting verb ('immediately,'), the reporting clause starts with a lower-case letter unless it is a proper noun ('whispered'), and the second part of the spoken sentence continues with a lower-case letter ('before') if it forms a single sentence."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Medium",
    "question": "Read the excerpt below:\n' despite the loud commotions in the courtyard, the old librarian remained surprisingly *unperturbed*, quietly turning the brittle pages of his tome.'\nWhat does the word *unperturbed* mean in this context?",
    "options": [
      "Deeply annoyed",
      "Completely calm and untroubled",
      "Extremely distracted",
      "Noticeably confused"
    ],
    "correctIndex": 1,
    "explanation": "The context clues 'despite the loud commotions' and 'quietly turning the brittle pages' indicate a contrast between the surrounding chaos and the librarian's relaxed state. 'Unperturbed' means undisturbed or calm. Distractors like 'annoyed' or 'distracted' misinterpret the context contrast."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Medium",
    "question": "Read the sentence:\n'The scientist conducted a *meticulous* examination of the rare fossil, ensuring no detail was overlooked.'\nWhich word is the closest synonym for *meticulous* as used in this sentence?",
    "options": [
      "Thorough",
      "Rapid",
      "Hesitant",
      "Curious"
    ],
    "correctIndex": 0,
    "explanation": "'Meticulous' means showing great attention to detail or being extremely careful and precise. The clue 'ensuring no detail was overlooked' directly points to 'thorough'. 'Rapid' and 'hesitant' do not convey the focused precision required."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Medium",
    "question": "Which word would best complete the sentence to convey a tone of **reluctance**?\n'Although the hour was late, Maya took a _____ step towards the dark, creaking staircase.'",
    "options": [
      "decisive",
      "tentative",
      "confident",
      "hasty"
    ],
    "correctIndex": 1,
    "explanation": "'Tentative' means hesitant, unconfirmed, or cautious, which accurately conveys reluctance in stepping toward a dark, creaking staircase. 'Decisive', 'confident', and 'hasty' imply eagerness or certainty rather than hesitation."
  },
  {
    "subject": "english",
    "topic": "Vocabulary in Context",
    "difficulty": "Medium",
    "question": "Read the sentence below:\n'The young prince was known for his *generosity*, often giving away his own treasures to those in need.'\nWhich of the following is an **antonym** for *generosity*?",
    "options": [
      "Benevolence",
      "Altruism",
      "Miserliness",
      "Sympathy"
    ],
    "correctIndex": 2,
    "explanation": "'Generosity' refers to willingness to give clear resources freely. 'Miserliness' is the quality of being stingy or hoarding money/resources, making it the exact antonym. 'Benevolence' and 'Altruism' are synonyms, while 'Sympathy' is a related positive emotional quality."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Medium",
    "question": "Read the text extract:\n'Join our campaign today! By giving just ten minutes of your weekend, you can help clear plastic pollution from our local beach and safeguard marine wildlife for future generations.'\nWhat is the main purpose of this text?",
    "options": [
      "To inform readers about marine life habitats",
      "To persuade readers to participate in a beach clean-up",
      "To entertain readers with a story about plastic pollution",
      "To instruct readers on how to recycle household waste"
    ],
    "correctIndex": 1,
    "explanation": "Phrases such as 'Join our campaign today!' and persuasive reasons ('safeguard marine wildlife') clearly show the main purpose is to persuade readers to take action and join the clean-up event."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Medium",
    "question": "Which set of features would be most suitable for a non-chronological report about extreme weather intended for primary school students?",
    "options": [
      "First-person narrative, emotional language, dialogue, informal slang",
      "Subheadings, clear factual descriptions, diagrams with labels, formal tone",
      "Rhyming couplets, rhythm, sensory imagery, figurative speech",
      "Step-by-step numbered instructions, imperative verbs, chronologically ordered list"
    ],
    "correctIndex": 1,
    "explanation": "A non-chronological report is an informational text. Subheadings, factual descriptions, diagrams, and formal tone are key structural and linguistic features of non-chronological reports. Option 0 describes narrative text; Option 2 describes poetry; Option 3 describes instructional writing."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Medium",
    "question": "Which sentence is written in the most appropriate formal register for an official letter to a local council mayor?",
    "options": [
      "I reckon it's high time you fixed up the skate park because it's totally wrecked.",
      "I am writing to formally request an urgent inspection of the local park facilities.",
      "You really should pop down to the park and see how terrible it looks!",
      "The park is dead boring and we need something cool done to it ASAP."
    ],
    "correctIndex": 1,
    "explanation": "Option 1 uses formal vocabulary ('formally request', 'urgent inspection', 'facilities') and standard syntax appropriate for official correspondence. Options 0, 2, and 3 contain colloquialisms, slang, and informal language ('reckon', 'pop down', 'ASAP', 'dead boring')."
  },
  {
    "subject": "english",
    "topic": "Purpose and Audience",
    "difficulty": "Medium",
    "question": "Read the notice below:\n'ALL VISITORS MUST REPORT TO RECEPTION BEFORE ENTERING SCHOOL GROUNDS. SIGN-IN REQUIRED.'\nWho is the primary intended audience for this notice?",
    "options": [
      "Students attending their morning lessons",
      "Teachers working in their classrooms",
      "External guests arriving at the school",
      "Cleaners working after school hours"
    ],
    "correctIndex": 2,
    "explanation": "The term 'VISITORS' specifically targets external guests who do not routinely attend or work at the school and need to follow sign-in procedures for security purposes."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Medium",
    "question": "Read the sentence below:\n'The old oak tree stood like a silent guardian, watching over the sleeping village.'\nWhich literary device is present in the phrase *'stood like a silent guardian'*?",
    "options": [
      "Metaphor",
      "Simile",
      "Alliteration",
      "Onomatopoeia"
    ],
    "correctIndex": 1,
    "explanation": "A simile explicitly compares two different things using 'like' or 'as'. 'Stood like a silent guardian' uses 'like' to compare the oak tree to a guardian. A metaphor would state the tree *was* a guardian without using 'like' or 'as'."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Medium",
    "question": "Which line from a poem contains an example of **personification**?",
    "options": [
      "The wind howled through the hollow trees.",
      "The wind whispered secrets to the swaying leaves.",
      "The wind was as cold as ice.",
      "The wind blew with terrible force across the field."
    ],
    "correctIndex": 1,
    "explanation": "Personification attributes human characteristics or actions to non-human things. Whispering 'secrets' is a human action given to the wind. Option 0 uses onomatopoeia/metaphorical sound ('howled'); Option 2 uses a simile ('as cold as ice'); Option 3 is a literal statement."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Medium",
    "question": "Read the sentence below:\n'I have told you a million times to hang up your wet coat!'\nWhich literary device is used here for dramatic emphasis?",
    "options": [
      "Hyperbole",
      "Personification",
      "Idiom",
      "Oxymoron"
    ],
    "correctIndex": 0,
    "explanation": "Hyperbole is an intentional and extreme exaggeration used to emphasize a point or add emphasis ('told you a million times'). It is not meant to be taken literally."
  },
  {
    "subject": "english",
    "topic": "Literary Devices",
    "difficulty": "Medium",
    "question": "Read the sentence below:\n'The crunchy, golden toast crackled as the buttery goodness melted on my tongue.'\nWhich human sense is primarily targeted by the sensory imagery in this sentence?",
    "options": [
      "Sight and touch",
      "Hearing and taste",
      "Smell and sight",
      "Taste and touch"
    ],
    "correctIndex": 1,
    "explanation": "'Crackled' and 'crunchy' evoke sound/hearing, while 'buttery goodness melted on my tongue' specifically targets taste. While texture/touch is secondary, 'crackled' (sound) and 'taste' are the primary sensory associations in this imagery combination."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Medium",
    "question": "Which option contains the correct standard UK spelling of the word?",
    "options": [
      "Accommodate",
      "Acommodate",
      "Accomodate",
      "Acomodate"
    ],
    "correctIndex": 0,
    "explanation": "'Accommodate' is correctly spelled with a double 'c' and a double 'm'. Missing either set of double consonants is a very common spelling error."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Medium",
    "question": "Which sentence contains NO spelling errors?",
    "options": [
      "It was a complete coincidence that we met at the library.",
      "It was a complete co-incidence that we met at the library.",
      "It was a complete coencidence that we met at the library.",
      "It was a complete coincidense that we met at the library."
    ],
    "correctIndex": 0,
    "explanation": "'Coincidence' is correctly spelled with 'i-n-c-i-d-e-n-c-e'. Common errors include replacing 'c' with 's' at the end or misspelling the vowel combinations ('coencidence')."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Medium",
    "question": "Which suffix correctly turns the root word **'rely'** into an adjective?",
    "options": [
      "relyable",
      "reliable",
      "rellyable",
      "relible"
    ],
    "correctIndex": 1,
    "explanation": "When adding the suffix '-able' to a word ending in a consonant + 'y', change the 'y' to an 'i' before adding '-able', giving 'reliable'."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Medium",
    "question": "Choose the correctly spelled homophone to complete the sentence:\n'The principal reason for our school assembly today is to discuss environmental _____.'",
    "options": [
      "principals",
      "principles",
      "principle's",
      "principles"
    ],
    "correctIndex": 1,
    "explanation": "'Principles' (noun plural) refers to moral rules, beliefs, or fundamental truths. 'Principal' (used earlier as an adjective meaning main) is a homophone often confused with 'principle'."
  },
  {
    "subject": "english",
    "topic": "Spelling",
    "difficulty": "Medium",
    "question": "Which word is spelled correctly?",
    "options": [
      "Neccessary",
      "Necessary",
      "Necesary",
      "Neccesary"
    ],
    "correctIndex": 1,
    "explanation": "'Necessary' is spelled with one 'c' and double 's'. A helpful memory aid for Year 6 students is that a shirt has **1** **C**ollar and **2** **S**leeves."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Easy",
    "question": "What is the value of the digit 7 in the number 457 209?",
    "options": [
      "700",
      "7000",
      "70 000",
      "70"
    ],
    "correctIndex": 1,
    "explanation": "In 457 209, the digit 7 is in the thousands place, so its value is 7000. Option 700 confuses it with the hundreds place, 70 000 with ten thousands, and 70 with tens."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Easy",
    "question": "Calculate 345 + 1000.",
    "options": [
      "1345",
      "1340",
      "3450",
      "1355"
    ],
    "correctIndex": 0,
    "explanation": "Adding 1000 increases the thousands digit by 1, making 1345. Option 3450 comes from mistakenly multiplying by 10, while 1340 and 1355 are calculation errors in the tens column."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Easy",
    "question": "What is 48 multiplied by 10?",
    "options": [
      "4.8",
      "4800",
      "480",
      "481"
    ],
    "correctIndex": 2,
    "explanation": "Multiplying an integer by 10 shifts all digits one place to the left, giving 480. Option 4.8 comes from dividing by 10, 4800 from multiplying by 100, and 481 from adding 10 instead of multiplying."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Easy",
    "question": "Which of these numbers is a multiple of 8?",
    "options": [
      "28",
      "36",
      "48",
      "52"
    ],
    "correctIndex": 2,
    "explanation": "48 is a multiple of 8 because 8 x 6 = 48. Options 28, 36, and 52 are not in the 8 times table."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Easy",
    "question": "What is the missing number in this linear sequence? 15, 11, 7, __, -1",
    "options": [
      "3",
      "4",
      "5",
      "2"
    ],
    "correctIndex": 0,
    "explanation": "The term-to-term rule is subtract 4 each time. 7 - 4 = 3. Option 4 is the rule itself rather than the term, 5 comes from subtracting 2, and 2 comes from subtracting 5."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Easy",
    "question": "What is 1/2 written as a decimal?",
    "options": [
      "0.2",
      "0.5",
      "0.12",
      "0.05"
    ],
    "correctIndex": 1,
    "explanation": "1 divided by 2 is 0.5. Option 0.2 confuses 1/2 with 1/5 or uses the digit 2 from the denominator, while 0.12 literally combines digits 1 and 2."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Easy",
    "question": "Which fraction is equivalent to 3/4?",
    "options": [
      "6/8",
      "5/6",
      "4/3",
      "3/8"
    ],
    "correctIndex": 0,
    "explanation": "Multiplying both the numerator and denominator of 3/4 by 2 yields 6/8. Option 4/3 is the reciprocal, and 3/8 changes only the denominator."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Easy",
    "question": "Calculate 25% of £80.",
    "options": [
      "£40",
      "£25",
      "£10",
      "£20"
    ],
    "correctIndex": 3,
    "explanation": "25% is equivalent to dividing by 4. £80 divided by 4 equals £20. Option £40 is 50%, £25 mistakes the percentage value for currency, and £10 is 12.5%."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Easy",
    "question": "Work out 0.4 + 0.35.",
    "options": [
      "0.39",
      "0.75",
      "0.395",
      "0.7"
    ],
    "correctIndex": 1,
    "explanation": "Aligning decimal places gives 0.40 + 0.35 = 0.75. Option 0.39 comes from mistakenly adding 4 to 35 without aligning place values (0.04 + 0.35)."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Easy",
    "question": "Which sign makes the statement true? 0.6 ___ 0.58",
    "options": [
      "<",
      ">",
      "=",
      "+"
    ],
    "correctIndex": 1,
    "explanation": "0.6 is equal to 0.60, which is greater than 0.58. Option '<' is chosen if a student mistakenly thinks 58 is larger than 6 without comparing place values."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Easy",
    "question": "How many degrees are there in a right angle?",
    "options": [
      "45°",
      "180°",
      "90°",
      "360°"
    ],
    "correctIndex": 2,
    "explanation": "A right angle measures exactly 90°. 180° is a straight line, 360° is a full turn, and 45° is half a right angle."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Easy",
    "question": "Which of these shapes is a 3D shape?",
    "options": [
      "Square",
      "Cube",
      "Triangle",
      "Rectangle"
    ],
    "correctIndex": 1,
    "explanation": "A cube is a three-dimensional (3D) solid shape. Square, triangle, and rectangle are all two-dimensional (2D) flat shapes."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Easy",
    "question": "What is the name of a polygon with 6 sides?",
    "options": [
      "Pentagon",
      "Hexagon",
      "Octagon",
      "Heptagon"
    ],
    "correctIndex": 1,
    "explanation": "A 6-sided polygon is a hexagon. Pentagon has 5 sides, Heptagon has 7 sides, and Octagon has 8 sides."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Easy",
    "question": "How many lines of symmetry does a square have?",
    "options": [
      "2",
      "4",
      "8",
      "1"
    ],
    "correctIndex": 1,
    "explanation": "A square has 4 lines of symmetry: 2 vertical/horizontal and 2 diagonal. Option 2 considers only horizontal/vertical lines, and option 8 counts line segments instead of full lines."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Easy",
    "question": "An angle measures 45°. What type of angle is it?",
    "options": [
      "Acute angle",
      "Obtuse angle",
      "Right angle",
      "Reflex angle"
    ],
    "correctIndex": 0,
    "explanation": "Angles less than 90° are acute. Obtuse angles are between 90° and 180°, right angles are exactly 90°, and reflex angles are greater than 180°."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Easy",
    "question": "How many grams are in 1 kilogram?",
    "options": [
      "10",
      "100",
      "1000",
      "10 000"
    ],
    "correctIndex": 2,
    "explanation": "The prefix 'kilo-' means one thousand, so 1 kilogram = 1000 grams. Options 10, 100, and 10 000 reflect conversion factor errors."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Easy",
    "question": "Convert 3 metres into centimetres.",
    "options": [
      "30 cm",
      "300 cm",
      "3000 cm",
      "0.3 cm"
    ],
    "correctIndex": 1,
    "explanation": "There are 100 centimetres in 1 metre. Therefore, 3 metres = 3 x 100 = 300 cm. Option 30 confuses cm with mm conversion factor (10)."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Easy",
    "question": "A television program starts at 14:15 and finishes at 15:00. How long does the program last?",
    "options": [
      "45 minutes",
      "30 minutes",
      "1 hour 15 minutes",
      "85 minutes"
    ],
    "correctIndex": 0,
    "explanation": "From 14:15 to 15:00 is 45 minutes. Option 1 hour 15 minutes confuses the 15 minute past time with a duration, and 85 minutes treats time subtraction as decimals (1500 - 1415 = 85)."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Easy",
    "question": "What is the perimeter of a rectangle with length 6 cm and width 4 cm?",
    "options": [
      "24 cm",
      "10 cm",
      "20 cm",
      "12 cm"
    ],
    "correctIndex": 2,
    "explanation": "Perimeter is the total distance around the shape: 6 + 4 + 6 + 4 = 20 cm. Option 24 cm calculates area (6 x 4), and 10 cm adds only one length and one width."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Easy",
    "question": "Which unit of measurement is best to measure the capacity of water in a bucket?",
    "options": [
      "Metres",
      "Litres",
      "Grams",
      "Centimetres"
    ],
    "correctIndex": 1,
    "explanation": "Litres measure liquid capacity or volume. Metres and centimetres measure length, and grams measure mass."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Easy",
    "question": "Find the mode of this set of numbers: 3, 5, 5, 7, 8, 9, 5, 2",
    "options": [
      "5",
      "5.5",
      "7",
      "9"
    ],
    "correctIndex": 0,
    "explanation": "The mode is the most frequently occurring value. The number 5 appears 3 times, which is more than any other number. Option 5.5 confuses mode with mean or median."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Easy",
    "question": "Find the range of these numbers: 4, 9, 2, 12, 7",
    "options": [
      "10",
      "12",
      "2",
      "6.8"
    ],
    "correctIndex": 0,
    "explanation": "Range is maximum value minus minimum value: 12 - 2 = 10. Option 12 is the maximum value, 2 is the minimum value, and 6.8 is the mean."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Easy",
    "question": "A bar chart shows favourite fruits of a class: Apple = 8, Banana = 12, Orange = 6. How many pupils were surveyed in total?",
    "options": [
      "26",
      "20",
      "18",
      "30"
    ],
    "correctIndex": 0,
    "explanation": "Total pupils = 8 + 12 + 6 = 26. Option 20 adds only Apple and Banana, and option 18 adds Banana and Orange."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Easy",
    "question": "You roll a standard fair 6-sided dice. What is the probability of rolling a 7?",
    "options": [
      "Certain",
      "Likely",
      "Even chance",
      "Impossible"
    ],
    "correctIndex": 3,
    "explanation": "A standard 6-sided dice has faces numbered 1 to 6. Rolling a 7 is impossible."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Easy",
    "question": "What is the mean of 2, 4, and 9?",
    "options": [
      "15",
      "5",
      "4",
      "6"
    ],
    "correctIndex": 1,
    "explanation": "To find the mean, sum the numbers (2 + 4 + 9 = 15) and divide by the count of numbers (15 / 3 = 5). Option 15 is just the sum, and option 4 is the median."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Easy",
    "question": "What is 45 849 rounded to the nearest thousand?",
    "options": [
      "45 800",
      "45 000",
      "46 000",
      "50 000"
    ],
    "correctIndex": 2,
    "explanation": "To round 45 849 to the nearest thousand, look at the hundreds digit (8). Since 8 is 5 or greater, round up the thousands digit from 5 to 6, giving 46 000. '45 800' is rounded to the nearest hundred, '45 000' is rounded down incorrectly, and '50 000' is rounded to the nearest ten thousand."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Easy",
    "question": "Calculate the value of 18 - 6 ÷ 2 + 4.",
    "options": [
      "10",
      "17",
      "2",
      "19"
    ],
    "correctIndex": 3,
    "explanation": "Following the order of operations (BIDMAS/BODMAS), division is performed first: 6 ÷ 2 = 3. Next, perform addition and subtraction from left to right: 18 - 3 = 15, then 15 + 4 = 19. Option '10' comes from evaluating (18 - 6) ÷ 2 + 4. Option '17' comes from doing 18 - (6 ÷ (2 + 4)). Option '2' comes from (18 - 6) ÷ (2 + 4)."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Easy",
    "question": "Which of these numbers is a prime number?",
    "options": [
      "21",
      "29",
      "27",
      "33"
    ],
    "correctIndex": 1,
    "explanation": "A prime number has exactly two distinct factors: 1 and itself. 29 has only 1 and 29 as factors. 21 (3 × 7), 27 (3 × 9), and 33 (3 × 11) are all composite numbers."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Easy",
    "question": "At midnight, the temperature was -4 °C. By midday, the temperature had risen by 9 °C. What was the temperature at midday?",
    "options": [
      "-13 °C",
      "13 °C",
      "-5 °C",
      "5 °C"
    ],
    "correctIndex": 3,
    "explanation": "Starting at -4 °C and adding 9 °C: -4 + 9 = 5 °C. Option '-13 °C' comes from subtracting 9 from -4. Option '13 °C' comes from adding 4 and 9 without considering the negative sign. Option '-5 °C' comes from subtracting 4 from 9 and giving it a negative sign."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Easy",
    "question": "What is 3.05 multiplied by 100?",
    "options": [
      "305",
      "30.5",
      "3050",
      "0.0305"
    ],
    "correctIndex": 0,
    "explanation": "Multiplying a decimal by 100 moves all digits two place values to the left, changing 3.05 into 305. '30.5' is multiplied by 10, '3050' is multiplied by 1000, and '0.0305' is divided by 100."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Easy",
    "question": "Which fraction is equivalent to 12/18 in its simplest form?",
    "options": [
      "4/6",
      "2/3",
      "3/4",
      "6/9"
    ],
    "correctIndex": 1,
    "explanation": "To simplify 12/18, divide both the numerator and the denominator by their highest common factor, which is 6. 12 ÷ 6 = 2 and 18 ÷ 6 = 3, giving 2/3. Fractions '4/6' and '6/9' are equivalent to 12/18, but they are not in simplest form."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Easy",
    "question": "What is 3/5 expressed as a percentage?",
    "options": [
      "35%",
      "30%",
      "65%",
      "60%"
    ],
    "correctIndex": 3,
    "explanation": "To convert 3/5 to a percentage, multiply by 100: (3 ÷ 5) × 100 = 60%. Alternatively, 3/5 = 60/100 = 60%. '35%' is a misconception from placing 3 and 5 together, and '30%' confuses 3/5 with 3/10."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Easy",
    "question": "Calculate 3/8 + 1/4.",
    "options": [
      "4/12",
      "4/8",
      "5/8",
      "1/2"
    ],
    "correctIndex": 2,
    "explanation": "First, convert 1/4 to an equivalent fraction with a denominator of 8: 1/4 = 2/8. Then add the numerators: 3/8 + 2/8 = 5/8. Option '4/12' is the common mistake of adding numerators and denominators directly (3+1)/(8+4)."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Easy",
    "question": "Calculate 15% of $200.",
    "options": [
      "$30",
      "$15",
      "$25",
      "$35"
    ],
    "correctIndex": 0,
    "explanation": "10% of $200 = $20. 5% of $200 = $10. Therefore, 15% = $20 + $10 = $30. Option '$15' mistakes the percentage for the dollar amount directly."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Easy",
    "question": "Which list of decimal numbers is arranged in order from smallest to largest?",
    "options": [
      "0.4, 0.07, 0.42, 0.5",
      "0.07, 0.42, 0.4, 0.5",
      "0.07, 0.4, 0.42, 0.5",
      "0.5, 0.42, 0.4, 0.07"
    ],
    "correctIndex": 2,
    "explanation": "Comparing place values: 0.07 (7 hundredths) < 0.4 (40 hundredths) < 0.42 (42 hundredths) < 0.5 (50 hundredths). In option '0.07, 0.42, 0.4, 0.5', 0.42 is incorrectly placed before 0.4 due to comparing 42 and 4 directly without place value consideration."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Easy",
    "question": "A triangle has two interior angles measuring 55° and 65°. What is the size of the third angle?",
    "options": [
      "50°",
      "60°",
      "70°",
      "120°"
    ],
    "correctIndex": 1,
    "explanation": "The sum of interior angles in a triangle is 180°. Working out: 55° + 65° = 120°. 180° - 120° = 60°. Option '120°' is the sum of the two given angles rather than subtracting from 180°."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Easy",
    "question": "How many vertices does a square-based pyramid have?",
    "options": [
      "4",
      "6",
      "8",
      "5"
    ],
    "correctIndex": 3,
    "explanation": "A square-based pyramid has 4 vertices at the corners of the square base plus 1 apex vertex at the top, making 5 vertices in total. '8' is the number of edges, and '4' is the number of triangular faces."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Easy",
    "question": "Point A has the coordinates (3, 5). Point A is translated 2 units right and 1 unit down. What are the new coordinates of Point A?",
    "options": [
      "(5, 4)",
      "(1, 6)",
      "(5, 6)",
      "(1, 4)"
    ],
    "correctIndex": 0,
    "explanation": "Moving right increases the x-coordinate by 2: 3 + 2 = 5. Moving down decreases the y-coordinate by 1: 5 - 1 = 4. The new coordinates are (5, 4). Option '(1, 6)' moves left and up instead."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Easy",
    "question": "How many lines of symmetry does a regular hexagon have?",
    "options": [
      "3",
      "5",
      "6",
      "12"
    ],
    "correctIndex": 2,
    "explanation": "A regular polygon with n sides has n lines of symmetry. A regular hexagon has 6 sides, so it has 6 lines of symmetry (3 passing through opposite vertices and 3 through midpoints of opposite sides)."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Easy",
    "question": "Two angles lie on a straight line. One angle measures 115°. What is the size of the other angle?",
    "options": [
      "65°",
      "75°",
      "85°",
      "245°"
    ],
    "correctIndex": 0,
    "explanation": "Angles on a straight line add up to 180°. Working out: 180° - 115° = 65°. Option '245°' comes from subtracting 115° from 360° instead of 180°."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Easy",
    "question": "A rectangle has a length of 8 cm and a width of 5 cm. What is the perimeter of the rectangle?",
    "options": [
      "13 cm",
      "20 cm",
      "40 cm",
      "26 cm"
    ],
    "correctIndex": 3,
    "explanation": "Perimeter is the total distance around the outside: 2 × (length + width) = 2 × (8 cm + 5 cm) = 2 × 13 cm = 26 cm. Option '40 cm' is the area (8 × 5), and '13 cm' is only half of the perimeter (8 + 5)."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Easy",
    "question": "Convert 2.5 litres into millilitres.",
    "options": [
      "250 ml",
      "2500 ml",
      "25 000 ml",
      "0.25 ml"
    ],
    "correctIndex": 1,
    "explanation": "There are 1000 millilitres in 1 litre. Working out: 2.5 × 1000 = 2500 ml. Option '250 ml' comes from multiplying by 100 instead of 1000."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Easy",
    "question": "A square has a perimeter of 24 cm. What is the area of this square?",
    "options": [
      "24 cm²",
      "144 cm²",
      "36 cm²",
      "12 cm²"
    ],
    "correctIndex": 2,
    "explanation": "A square has 4 equal sides, so each side length is 24 cm ÷ 4 = 6 cm. The area of the square is side × side = 6 cm × 6 cm = 36 cm². Option '144 cm²' mistakenly squares 12 or calculates area using perimeter."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Easy",
    "question": "A film starts at 14:35 and lasts for 1 hour and 45 minutes. What time does the film finish?",
    "options": [
      "15:80",
      "16:20",
      "16:10",
      "15:20"
    ],
    "correctIndex": 1,
    "explanation": "Adding 1 hour to 14:35 gives 15:35. Adding 25 minutes to reach 16:00 leaves 20 more minutes to add, giving 16:20. Option '15:80' forgets that there are 60 minutes in an hour."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Easy",
    "question": "A kitchen scale measures mass from 0 kg to 1 kg with 10 equal divisions. The pointer points to the 7th mark. What is this mass in grams?",
    "options": [
      "7 g",
      "70 g",
      "7000 g",
      "700 g"
    ],
    "correctIndex": 3,
    "explanation": "1 kg = 1000 g. Each division represents 1000 g ÷ 10 = 100 g. The 7th mark represents 7 × 100 g = 700 g (or 0.7 kg). Option '70 g' comes from dividing 100 g incorrectly."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Easy",
    "question": "What is the mean of the numbers 4, 7, 8 and 11?",
    "options": [
      "7.5",
      "7",
      "8",
      "30"
    ],
    "correctIndex": 0,
    "explanation": "To find the mean, sum the numbers and divide by how many numbers there are: (4 + 7 + 8 + 11) ÷ 4 = 30 ÷ 4 = 7.5. Option '30' is the total sum before dividing."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Easy",
    "question": "The scores in a mental mathematics test are 12, 18, 15, 9 and 21. What is the range of these scores?",
    "options": [
      "9",
      "12",
      "15",
      "75"
    ],
    "correctIndex": 1,
    "explanation": "Range = highest value - lowest value. The highest score is 21 and the lowest is 9. Range = 21 - 9 = 12. Option '15' is the median score, and '75' is the sum of the scores."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Easy",
    "question": "In a class survey about favourite pets, 8 students chose dogs, 5 chose cats, 3 chose rabbits and 4 chose fish. How many students took part in the survey in total?",
    "options": [
      "18",
      "22",
      "20",
      "24"
    ],
    "correctIndex": 2,
    "explanation": "Add the counts for all categories together: 8 + 5 + 3 + 4 = 20 students. Arithmetic error options like '18' or '22' stem from miscounting one of the categories."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Easy",
    "question": "A shoe store recorded the shoe sizes of seven customers: 3, 4, 3, 5, 4, 3, 6. What is the mode of these shoe sizes?",
    "options": [
      "4",
      "3",
      "5",
      "6"
    ],
    "correctIndex": 1,
    "explanation": "The mode is the value that appears most frequently. Size 3 appears 3 times, size 4 appears 2 times, size 5 appears once, and size 6 appears once. Thus, the mode is 3."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Easy",
    "question": "A fair six-sided dice with faces numbered 1 to 6 is rolled once. What is the probability of rolling an even number?",
    "options": [
      "1/2",
      "1/6",
      "1/3",
      "2/3"
    ],
    "correctIndex": 0,
    "explanation": "The even numbers on a 6-sided dice are 2, 4, and 6 (3 outcomes out of 6 possible outcomes). The probability is 3/6, which simplifies to 1/2. Option '1/6' is the probability of rolling a specific single number."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Hard",
    "question": "A 3-digit whole number N is a multiple of 7, a square number, and the digit in its tens place is double the digit in its units place. What is the value of N?",
    "options": [
      "784",
      "324",
      "196",
      "484"
    ],
    "correctIndex": 0,
    "explanation": "To solve this working out step-by-step: 1) Square 3-digit numbers with tens digit double units digit: 784 (tens=8, units=4, 28^2 = 784). 2) Test divisibility by 7: 784 ÷ 7 = 112 with no remainder. Thus 784 is correct. Distractors: 324 is a square (18^2) but units is double tens; 196 is a square (14^2) and multiple of 7, but tens (9) is not double units (6); 484 has tens double units, but 484 is not divisible by 7."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Hard",
    "question": "Sequence A starts at -15 and adds 6 each time (-15, -9, -3, ...). Sequence B starts at 45 and subtracts 4 each time (45, 41, 37, ...). What is the value of the term that appears at the EXACT same term position in both sequences?",
    "options": [
      "7",
      "15",
      "21",
      "25"
    ],
    "correctIndex": 2,
    "explanation": "The nth term of Sequence A is 6n - 21. The nth term of Sequence B is 49 - 4n. Setting them equal: 6n - 21 = 49 - 4n -> 10n = 70 -> n = 7 (the 7th position). Substituting n = 7 back into either sequence gives 6(7) - 21 = 21. Distractors: 7 is the term position rather than the term value; 15 and 25 are common errors from misapplying negative arithmetic or term indexing."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Hard",
    "question": "Mia has four digit cards: 3, 4, 6, and 8. She uses each card once to form two 2-digit numbers. She subtracts the smaller 2-digit number from the larger 2-digit number. What is the SMALLEST possible positive difference she can make?",
    "options": [
      "1",
      "5",
      "12",
      "15"
    ],
    "correctIndex": 1,
    "explanation": "To minimize the difference, the tens digits must be as close as possible. Choosing 4 and 3 as tens digits gives numbers in the 40s and 30s. To make 4_ as small as possible and 3_ as large as possible, arrange the remaining units digits (6 and 8): 43 - 38 = 5. Distractors: 12 comes from 48 - 36; 15 comes from 63 - 48; 1 is an impossible target assuming digits can yield adjacent numbers without checking available cards."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Hard",
    "question": "Given that 384 × 45 = 17 280, what is the exact value of 17.28 ÷ 0.384?",
    "options": [
      "4.5",
      "0.45",
      "450",
      "45"
    ],
    "correctIndex": 3,
    "explanation": "From the given multiplication, 17 280 ÷ 384 = 45. In 17.28 ÷ 0.384, both numbers are divided by 1000 compared to 17 280 ÷ 384 (17.28 = 17 280 ÷ 1000 and 0.384 = 384 ÷ 1000). Since both numerator and denominator are scaled down by the same factor, the quotient remains unchanged: 45. Distractors: 4.5 and 0.45 happen if students mistakenly adjust the quotient believing only one number changed decimal places; 450 comes from shifting the decimal in the wrong direction."
  },
  {
    "subject": "math",
    "topic": "Number and Calculation",
    "difficulty": "Hard",
    "question": "Whole number N rounds to 400 when rounded to the nearest 100. Whole number M rounds to 250 when rounded to the nearest 10. What is the MAXIMUM possible difference between N and M?",
    "options": [
      "204",
      "200",
      "195",
      "199"
    ],
    "correctIndex": 0,
    "explanation": "To find the maximum difference (N - M), we need the maximum possible value of N and the minimum possible value of M. For N rounding to 400 (nearest 100), max N = 449. For M rounding to 250 (nearest 10), min M = 245. Max difference = 449 - 245 = 204. Distractors: 200 is 400 - 200 using rounded values; 195 is max N (449) minus max M (254); 199 comes from using 444 as max N."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Hard",
    "question": "Class 6 has 36 students. 4/9 of the class are boys. 3/5 of the girls wear glasses. How many girls in Class 6 do NOT wear glasses?",
    "options": [
      "12",
      "16",
      "8",
      "20"
    ],
    "correctIndex": 2,
    "explanation": "Fraction of girls = 1 - 4/9 = 5/9. Number of girls = 5/9 of 36 = 20 girls. If 3/5 of girls wear glasses, then 2/5 of girls do not wear glasses. 2/5 of 20 = 8 girls. Distractors: 12 is the number of girls with glasses; 16 is the number of boys; 20 is the total number of girls."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Hard",
    "question": "Which of the following lists of numbers is correctly ordered from SMALLEST to LARGEST?",
    "options": [
      "62%, 0.605, 3/5, 5/8",
      "3/5, 0.605, 62%, 5/8",
      "3/5, 62%, 0.605, 5/8",
      "5/8, 62%, 0.605, 3/5"
    ],
    "correctIndex": 1,
    "explanation": "Convert all values to decimals: 3/5 = 0.600; 0.605 = 0.605; 62% = 0.620; 5/8 = 0.625. Ordering from smallest to largest gives 0.600 (3/5), 0.605, 0.620 (62%), 0.625 (5/8). Distractors confuse 62% as smaller than 0.605 or confuse decimal place values."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Hard",
    "question": "A coat normally costs £80. In a sale, its price is reduced by 20%. During a clearance event, the sale price is reduced by a further 10%. What is the final price of the coat?",
    "options": [
      "£56.00",
      "£57.60",
      "£54.00",
      "£62.40"
    ],
    "correctIndex": 1,
    "explanation": "Step 1: 20% of £80 = £16. Sale price = £80 - £16 = £64. Step 2: 10% of £64 = £6.40. Final price = £64 - £6.40 = £57.60. Distractors: £56.00 is a common misconception where students incorrectly add percentages together (20% + 10% = 30% off £80); £62.40 subtracts 10% of original price instead of sale price."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Hard",
    "question": "Calculate 3 1/4 - 1 5/6. Express your answer as a mixed number in its simplest form.",
    "options": [
      "1 5/12",
      "2 1/2",
      "2 1/3",
      "1 7/12"
    ],
    "correctIndex": 0,
    "explanation": "Find a common denominator (12): 3 3/12 - 1 10/12. Since 3/12 < 10/12, convert 3 3/12 to 2 15/12. Now subtract: (2 - 1) + (15/12 - 10/12) = 1 5/12. Distractors: 2 1/2 comes from subtracting smaller numerator from larger and smaller denominator from larger (|1-5| / |4-6|); 2 1/3 comes from ignoring regrouping; 1 7/12 comes from regrouping incorrectly as 13/12 instead of 15/12."
  },
  {
    "subject": "math",
    "topic": "Fractions, Decimals and Percentages",
    "difficulty": "Hard",
    "question": "In a box of chocolates, 3/8 are dark chocolates. There are 15 dark chocolates. Of the remaining chocolates, 1/5 are white chocolates and the rest are milk chocolates. How many milk chocolates are in the box?",
    "options": [
      "25",
      "20",
      "8",
      "15"
    ],
    "correctIndex": 1,
    "explanation": "If 3/8 of total = 15, then 1/8 = 5, making total chocolates = 40. Remaining chocolates = 40 - 15 = 25. White chocolates = 1/5 of 25 = 5. Milk chocolates = 25 - 5 = 20. Distractors: 25 is total remaining chocolates before removing white ones; 8 is 1/5 of total 40; 15 is dark chocolate count."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Hard",
    "question": "An isosceles triangle ABC has side lengths AB = AC and angle BAC = 40°. A straight line extends from point B through point C to point D. What is the size of exterior angle ACD?",
    "options": [
      "70°",
      "140°",
      "110°",
      "100°"
    ],
    "correctIndex": 2,
    "explanation": "In isosceles triangle ABC with AB = AC, interior angles ABC and ACB are equal. Angle ACB = (180° - 40°) ÷ 2 = 70°. Angle ACD forms a straight line with angle ACB, so exterior angle ACD = 180° - 70° = 110°. Distractors: 70° is interior angle ACB; 140° is 180° - 40°; 100° comes from miscalculating base angles as (180 - 40) / 2 = 80°."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Hard",
    "question": "Point P has co-ordinates (2, 7). Point P is reflected in the horizontal mirror line y = 4 to give point Q. Point Q is then translated by 3 units left and 2 units up to give point R. What are the co-ordinates of point R?",
    "options": [
      "(1, 3)",
      "(-1, 5)",
      "(5, 3)",
      "(-1, 3)"
    ],
    "correctIndex": 3,
    "explanation": "Reflecting P(2, 7) across line y = 4: distance from y=7 to y=4 is 3 units down, so Q has y-coordinate 4 - 3 = 1 (x stays 2), so Q = (2, 1). Translating Q(2, 1) by 3 left and 2 up: x = 2 - 3 = -1, y = 1 + 2 = 3. Point R = (-1, 3). Distractors: (1, 3) reflects across x=4; (-1, 5) translates original P; (5, 3) translates 3 units right instead of left."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Hard",
    "question": "Which 3D shape has exactly 5 faces, 6 vertices, and 9 edges?",
    "options": [
      "Triangular prism",
      "Square-based pyramid",
      "Triangular-based pyramid",
      "Pentagonal prism"
    ],
    "correctIndex": 0,
    "explanation": "A triangular prism has 2 triangular bases and 3 rectangular sides (5 faces), 6 vertices, and 9 edges (3 on each base + 3 connecting). Distractors: Square-based pyramid has 5 faces, 5 vertices, 8 edges; Triangular pyramid has 4 faces, 4 vertices, 6 edges; Pentagonal prism has 7 faces, 10 vertices, 15 edges."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Hard",
    "question": "A shape is formed by joining two identical equilateral triangles edge-to-edge along one full side to create a rhombus (not a square). How many lines of symmetry and what order of rotational symmetry does this rhombus have?",
    "options": [
      "4 lines of symmetry and order 4 rotational symmetry",
      "2 lines of symmetry and order 2 rotational symmetry",
      "3 lines of symmetry and order 3 rotational symmetry",
      "1 line of symmetry and order 1 rotational symmetry"
    ],
    "correctIndex": 1,
    "explanation": "A non-square rhombus has 2 lines of symmetry (along its diagonals) and rotational symmetry of order 2 (turns 180° to match itself). Distractors: Option with 4/4 confuses a rhombus with a square; Option with 3/3 confuses rhombus properties with original equilateral triangles."
  },
  {
    "subject": "math",
    "topic": "Geometry",
    "difficulty": "Hard",
    "question": "A square is drawn inside a circle so that all 4 vertices touch the circle. The radius of the circle is 5 cm. What is the area of the square?",
    "options": [
      "100 cm²",
      "25 cm²",
      "50 cm²",
      "31.4 cm²"
    ],
    "correctIndex": 2,
    "explanation": "The diagonal of the square equals the diameter of the circle, which is 2 × 5 cm = 10 cm. The square can be split into 4 right-angled triangles from the center, each with base 5 cm and height 5 cm. Area of one triangle = 1/2 × 5 × 5 = 12.5 cm². Total area = 4 × 12.5 = 50 cm². Distractors: 100 cm² assumes side length is 10 cm; 25 cm² assumes side length is 5 cm; 31.4 cm² uses circle perimeter approximation."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Hard",
    "question": "A rectangle has a perimeter of 48 cm. Its length is 3 times its width. A square with a perimeter of 16 cm is cut away from one corner. What is the area of the remaining shape?",
    "options": [
      "108 cm²",
      "92 cm²",
      "80 cm²",
      "128 cm²"
    ],
    "correctIndex": 1,
    "explanation": "Step 1: Rectangle perimeter = 2(l + w) = 48 -> l + w = 24. Since l = 3w, 4w = 24 -> w = 6 cm, l = 18 cm. Area of rectangle = 18 × 6 = 108 cm². Step 2: Square perimeter = 16 cm -> side = 4 cm. Area of square = 4 × 4 = 16 cm². Step 3: Remaining area = 108 - 16 = 92 cm². Distractors: 108 cm² forgets to subtract cut square; 80 cm² subtracts perimeter instead of area; 128 cm² adds square area."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Hard",
    "question": "A water tank in the shape of a cuboid measures 1.5 m long, 80 cm wide, and 60 cm high. It is filled to 3/4 of its total capacity. How many litres of water are inside the tank? (1 litre = 1000 cm³)",
    "options": [
      "720 litres",
      "54 litres",
      "540 litres",
      "180 litres"
    ],
    "correctIndex": 2,
    "explanation": "Convert dimensions to cm: 150 cm × 80 cm × 60 cm. Total Volume = 150 × 80 × 60 = 720 000 cm³ = 720 litres. 3/4 of capacity = 3/4 × 720 = 540 litres. Distractors: 720 litres is total capacity; 54 litres is unit conversion error (dividing by 10 000); 180 litres is the remaining empty volume (1/4)."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Hard",
    "question": "A train leaves Station A at 14:45 and arrives at Station B at 17:15. It travels a total distance of 180 km. What was the average speed of the train in km/h?",
    "options": [
      "72 km/h",
      "90 km/h",
      "75 km/h",
      "45 km/h"
    ],
    "correctIndex": 0,
    "explanation": "Time taken = 14:45 to 17:15 = 2 hours 30 minutes = 2.5 hours. Average speed = Distance ÷ Time = 180 ÷ 2.5 = 72 km/h. Distractors: 90 km/h divides by 2 hours; 75 km/h treats 2h 30m as 2.4 hours (180 ÷ 2.4 = 75); 45 km/h miscalculates time as 4 hours."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Hard",
    "question": "A recipe for 8 identical cakes requires 0.6 kg of flour. Chef Leo wants to make 12 cakes. He has a 1 kg bag of flour. How many grams of flour will he have left in the bag after making the 12 cakes?",
    "options": [
      "900 g",
      "400 g",
      "100 g",
      "10 g"
    ],
    "correctIndex": 2,
    "explanation": "0.6 kg = 600 g. Flour for 1 cake = 600 ÷ 8 = 75 g. Flour for 12 cakes = 12 × 75 = 900 g. Remaining flour in 1 kg (1000 g) bag = 1000 g - 900 g = 100 g. Distractors: 900 g is flour used, not flour remaining; 400 g is 1000 g - 600 g (ignoring 12 cakes scaling); 10 g is place value error."
  },
  {
    "subject": "math",
    "topic": "Measure",
    "difficulty": "Hard",
    "question": "A rectangular lawn measures 14 m by 8 m. A border path of uniform width 1 m is built inside the lawn around all four edges. What is the area of the path?",
    "options": [
      "40 m²",
      "21 m²",
      "44 m²",
      "72 m²"
    ],
    "correctIndex": 0,
    "explanation": "Outer lawn area = 14 × 8 = 112 m². Inner lawn dimensions reduced by 1 m on each side: length = 14 - 2 = 12 m, width = 8 - 2 = 6 m. Inner area = 12 × 6 = 72 m². Area of path = 112 - 72 = 40 m². Distractors: 21 m² subtracts 1 m once instead of twice from each dimension [(14-1)(8-1) = 91 -> 112-91 = 21]; 72 m² is inner lawn area; 44 m² uses perimeter calculation."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Hard",
    "question": "The test scores of 5 pupils are 6, 8, 9, 10, and x. The mean score of the 5 pupils is equal to the median score. Given that x > 10, what is the value of x?",
    "options": [
      "11",
      "12",
      "14",
      "9"
    ],
    "correctIndex": 1,
    "explanation": "Since x > 10, the ordered list is 6, 8, 9, 10, x. The median is the middle value, 9. The mean is (6 + 8 + 9 + 10 + x) ÷ 5 = (33 + x) ÷ 5. Since Mean = Median: (33 + x) ÷ 5 = 9 -> 33 + x = 45 -> x = 12. Distractors: 11 is a guess for the next number; 14 comes from arithmetic error (33 + x = 47); 9 confuses x with the median."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Hard",
    "question": "A survey asked 50 children about their favourite pet. 2/5 chose Dogs, 30% chose Cats, 3 children chose Hamsters, and the rest chose either Fish or Rabbits. Twice as many children chose Fish as chose Rabbits. How many children chose Fish?",
    "options": [
      "4",
      "12",
      "8",
      "6"
    ],
    "correctIndex": 2,
    "explanation": "Dogs = 2/5 of 50 = 20. Cats = 30% of 50 = 15. Hamsters = 3. Total accounted for = 20 + 15 + 3 = 38. Remaining for Fish + Rabbits = 50 - 38 = 12. Ratio Fish : Rabbits = 2 : 1 (3 parts total). 1 part = 12 ÷ 3 = 4. Fish = 2 × 4 = 8 children. Distractors: 4 is number of children choosing Rabbits; 12 is combined total for Fish and Rabbits; 6 divides 12 equally."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Hard",
    "question": "In a Year 6 cohort of 60 children: 35 play football, 28 play tennis, and 12 play neither football nor tennis. How many children play BOTH football and tennis?",
    "options": [
      "15",
      "23",
      "12",
      "20"
    ],
    "correctIndex": 0,
    "explanation": "Children playing at least one sport = Total - Neither = 60 - 12 = 48. Total sport counts = 35 + 28 = 63. Overlap (playing both) = 63 - 48 = 15. Distractors: 23 comes from ignoring those playing neither (35 + 28 - 60 = 3); 12 is students playing neither; 20 is calculation error."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Hard",
    "question": "A conversion graph shows 5 miles ≈ 8 kilometres. A cyclist travels 24 miles in the morning and 40 kilometres in the afternoon. What is the TOTAL distance travelled in kilometres?",
    "options": [
      "64 km",
      "78.4 km",
      "49 km",
      "70.4 km"
    ],
    "correctIndex": 1,
    "explanation": "Convert morning distance to km: 24 miles = 24 × (8/5) = 38.4 km. Total distance in km = 38.4 km + 40 km = 78.4 km. Distractors: 64 km simply adds 24 + 40 without converting; 49 km converts 40 km to 25 miles and adds to 24 (giving total in miles, not km); 70.4 km uses wrong factor (24 × 1.4)."
  },
  {
    "subject": "math",
    "topic": "Handling Data",
    "difficulty": "Hard",
    "question": "A bag contains red, blue, and yellow counters. The probability of picking a red counter is 3/10. The probability of picking a blue counter is 2/5. If there are 18 yellow counters, how many counters are in the bag in total?",
    "options": [
      "45",
      "180",
      "30",
      "60"
    ],
    "correctIndex": 3,
    "explanation": "Convert blue probability to tenths: 2/5 = 4/10. Probability of yellow = 1 - (3/10 + 4/10) = 3/10. Since 3/10 of total = 18, then 1/10 = 6, and total counters = 6 × 10 = 60. Distractors: 45 confuses 3/10 with 1/3; 180 multiplies 18 by 10; 30 miscalculates 3/10 of total."
  }
];

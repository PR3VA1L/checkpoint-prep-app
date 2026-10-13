import { family } from "./english.js";
import type { Difficulty } from "./types";

type Item = [extract: string, answer: string, wrong1: string, wrong2: string, wrong3: string, reason: string];
function question(items: Item[], prompts: [string, string, string]) {
  return (v: number, d: Difficulty): [string, string, string[], string] => {
    const [extract, answer, a, b, c, reason] = items[v];
    const prompt = prompts[d === "Easy" ? 0 : d === "Medium" ? 1 : 2];
    return [`${extract} ${prompt}`, answer, [a, b, c], reason];
  };
}

// Original short extracts: the answer must be justified by the quoted wording,
// not a supposed event outside the extract.
const evidence: Item[] = [
  ["The path was dry under the trees, but fresh drops shone on the open gate.", "Rain had fallen recently near the gate.", "The gate had been painted.", "The trees were newly planted.", "It was raining heavily at that moment.", "Fresh drops on the exposed gate, but not beneath the trees, support recent rain."],
  ["Ben put the wrapped parcel behind his back when Dad entered the room.", "Ben wanted to keep the parcel unseen for now.", "Dad had lost the parcel.", "The parcel was too heavy to lift.", "Ben had opened the parcel already.", "Moving the wrapped parcel behind his back shows he is hiding it for now."],
  ["The sign said CLOSED, yet a warm light glowed behind the bakery window.", "Someone may still be inside the bakery.", "The bakery is open to customers.", "The light proves there is a fire.", "The sign has been stolen.", "A light inside supports the possibility of someone there; the sign still says it is closed."],
  ["Priya checked the map again before choosing the longer, marked trail.", "Priya values a clear route over the shortest one.", "Priya cannot read maps.", "The marked trail is certainly unsafe.", "Priya has already finished the walk.", "She checks the map and chooses the longer marked trail."],
  ["When the results were announced, Imani smiled for her friend before looking at her own card.", "Imani first paid attention to her friend's result.", "Imani won every prize.", "The cards were blank.", "Her friend had not entered.", "The order of her actions shows concern for her friend first."],
  ["The field was empty except for one ball still rolling towards the goal.", "The players have probably just left the field.", "The match will certainly start tomorrow.", "The goal has moved.", "Nobody has ever played there.", "A still-rolling ball suggests very recent activity, not a definite future event."],
  ["Although the instructions were brief, Omar read them twice before beginning.", "Omar wanted to avoid a mistake.", "Omar wrote the instructions.", "The task was impossible.", "Omar had completed the task already.", "Reading brief instructions twice before starting suggests care."],
  ["The librarian lowered her voice, and the children did the same.", "The children followed her quiet example.", "The library was closing.", "The children could not hear her.", "The librarian was angry.", "Their voices changed after hers; the extract does not state anger or closing."],
  ["Noah returned the borrowed torch with fresh batteries in it.", "Noah took care to return the torch ready to use.", "Noah bought a new torch.", "The old batteries were missing when he borrowed it.", "The torch was broken.", "Fresh batteries in the returned torch show consideration, without proving its earlier condition."],
  ["The first bus was crowded, so Laila waited beneath the shelter for the next one.", "Laila chose not to board the crowded bus.", "Laila missed the last bus of the day.", "The shelter was locked.", "The next bus was empty.", "She waited for another bus because the first was crowded."],
  ["The vegetable leaves drooped; after watering, they stood upright again.", "The plants had needed water.", "The leaves were made of paper.", "The plants had grown taller in one minute.", "Watering caused the leaves to fall.", "The change after watering supports a need for water."],
  ["Ella crossed out her first heading and wrote a clearer one above the report.", "Ella revised the heading to help readers.", "Ella threw the report away.", "The first heading was misspelled.", "The report had no title.", "The new heading is described as clearer, but no spelling error is mentioned."],
];

const cohesion: Item[] = [
  ["The lantern flickered in the wind. It finally went out.", "the lantern", "the wind", "the path", "the person holding it", "A lantern can flicker and go out; the wind is the cause, not what went out."],
  ["Mariam gave Sofia the folded map. She tucked it into her bag.", "the folded map", "the bag", "the path", "the school", "The object tucked away is the map that has just been mentioned."],
  ["The children reached the bridge. Beyond it, the track became narrow.", "the bridge", "the children", "the track", "the river", "‘Beyond it’ locates the narrow track on the far side of the bridge."],
  ["A cloud covered the sun. This made the playground cooler.", "the cloud covering the sun", "the playground", "the children", "the sun becoming hotter", "‘This’ refers to the whole previous event, not just one noun."],
  ["The gardener planted beans beside the fence. They soon climbed it.", "the beans", "the gardener", "the fence", "the tools", "Beans are the things that climbed; ‘it’ refers to the fence."],
  ["We found the missing key under the mat. That discovery saved us a long search.", "finding the key under the mat", "the mat alone", "a new door", "the long search", "‘That discovery’ sums up finding the key."],
  ["The grey boat passed the red boat. The latter then turned towards shore.", "the red boat", "the grey boat", "both boats", "the shore", "‘The latter’ means the second of two things named: the red boat."],
  ["First, Tumi measured the soil. Afterwards, she watered the seedlings.", "after measuring the soil", "before measuring the soil", "while buying seedlings", "after the seedlings had died", "‘Afterwards’ puts watering after the measurement."],
  ["The box held a compass and a whistle. The former was scratched.", "the compass", "the whistle", "the box", "both objects", "‘The former’ means the first named object, the compass."],
  ["The hall was full, so the choir practised outside instead.", "because the hall was full", "because the choir had finished", "because it was raining", "because the hall was empty", "‘So’ links the full hall to the choice to practise outside."],
  ["Kavi wanted to leave early. However, he stayed to finish the display.", "a contrast with wanting to leave", "an example of leaving early", "a reason the display was lost", "the time the display began", "‘However’ signals that staying contrasts with his earlier wish."],
  ["The ropes were checked before the climb. This precaution took five minutes.", "checking the ropes", "climbing the hill", "packing the bags", "waiting for a friend", "‘This precaution’ refers to the rope check, a safety measure."],
];

const vocabulary: Item[] = [
  ["The council postponed the opening until the bridge was safe.", "delayed", "cancelled forever", "celebrated", "repeated immediately", "‘Until’ shows the opening was moved to a later time."],
  ["A narrow channel carried rainwater away from the garden.", "a small water passage", "a television station", "a steep hill", "a locked gate", "The context says it carried water away."],
  ["The teacher asked for a concise summary, so Amir removed repeated details.", "brief but clear", "very long", "written in verse", "difficult to read", "Removing repeated details makes a summary shorter without losing its meaning."],
  ["The path was uneven, with stones jutting above the earth.", "not level", "newly painted", "completely straight", "covered by water", "Stones jutting out make the path not level."],
  ["The final clue was hidden in a transparent box; everyone could see the paper inside.", "see-through", "very heavy", "secret", "made of metal", "Seeing through the box to the paper explains ‘transparent’."],
  ["The team made a provisional plan while they waited for the weather report.", "temporary and open to change", "secret and final", "too late to use", "written by one person", "Waiting for more information means the plan may change."],
  ["The stream was shallow enough for the children to see every stone on its bed.", "not deep", "very cold", "fast-flowing", "wide and muddy", "Seeing the bed supports a meaning of limited depth."],
  ["Lena's account was accurate: its times matched the station clock.", "correct in its details", "entertaining", "written quickly", "difficult to believe", "Matching the clock provides evidence that the times were correct."],
  ["The farmer selected sturdy poles that would not bend in the wind.", "strong and firm", "brightly coloured", "very thin", "already damaged", "The poles must resist bending in wind."],
  ["The answer was obvious once the missing number was written in the table.", "easy to see or understand", "still impossible", "unrelated to the table", "hidden from everyone", "Writing the missing number made the answer clear."],
  ["The new rule was optional; teams could choose whether to use it.", "not required", "forbidden", "required every day", "already cancelled", "Being able to choose means it was not compulsory."],
  ["The volunteers restored the old bench by repairing its legs and repainting it.", "returned it to good condition", "moved it to another town", "broke it into parts", "sold it", "The repairs and repainting show restoration."],
];

const language: Item[] = [
  ["‘The last leaf clung stubbornly to the branch.’", "It makes the leaf seem determined to stay.", "It states the leaf is human.", "It measures the branch.", "It proves the weather is warm.", "‘Clung stubbornly’ gives the leaf a human-like determination."],
  ["‘The queue crept towards the door.’", "It suggests the queue moved very slowly.", "It says people crawled on the floor.", "It shows the door moved away.", "It proves the queue became shorter.", "‘Crept’ conveys slow movement without stating that anyone crawled."],
  ["‘The bell split the quiet morning.’", "It makes the sudden sound seem sharp and startling.", "It says the bell broke in two.", "It shows the morning was noisy already.", "It gives the bell a gentle sound.", "‘Split’ suggests an abrupt sound interrupting silence."],
  ["‘A ribbon of water wound through the valley.’", "It helps us picture a long, winding stream.", "It says someone dropped a ribbon.", "It makes the valley dry.", "It tells us the stream is straight.", "The ribbon image suggests a narrow curving line of water."],
  ["‘The cold air nipped at her fingers.’", "It makes the cold feel biting and uncomfortable.", "It means an animal bit her.", "It says her fingers were warm.", "It describes a loud noise.", "‘Nipped’ suggests a small but sharp feeling caused by cold."],
  ["‘The market buzzed from the first hour.’", "It suggests lively noise and activity.", "It proves there were bees in every stall.", "It says the market was empty.", "It tells us the market had closed.", "‘Buzzed’ gives an impression of many sounds and movement."],
  ["‘His promise was a bridge across their argument.’", "It suggests the promise helped them reconnect.", "It says they built a bridge.", "It means the argument was about a river.", "It proves they never disagreed.", "The bridge image represents a way over the division between them."],
  ["‘The door groaned as it opened.’", "It helps the reader hear a long, strained sound.", "It says the door could speak.", "It proves a person was hurt.", "It shows the door opened silently.", "‘Groaned’ evokes a creaking sound from the door."],
  ["‘The little boat danced on the waves.’", "It suggests quick, lively movement up and down.", "It says the boat has feet.", "It proves the water was still.", "It describes the colour of the boat.", "‘Danced’ conveys lively movement, not a literal dance."],
  ["‘A wall of rain hid the far hill.’", "It suggests heavy rain blocked the view.", "It says someone built a wall.", "It proves the hill was removed.", "It means the rain was light.", "‘Wall’ makes the rain seem dense enough to hide the hill."],
  ["‘The tiny flame held back the darkness.’", "It emphasises the small but useful light.", "It says the flame touched the darkness.", "It proves the room had no shadows.", "It tells us the flame was huge.", "The contrast of ‘tiny’ with ‘held back’ stresses the flame's effect."],
  ["‘The road stretched ahead without end.’", "It conveys how long the journey seemed.", "It means the road grew longer.", "It gives an exact distance.", "It says the road had disappeared.", "‘Without end’ expresses the traveller's impression, not a measured fact."],
];

const grammar: Item[] = [
  ["Although the team was tired, it finished the final lap.", "Although the team was tired", "it finished the final lap", "the final lap", "team was tired, it", "‘Although’ introduces the dependent clause; the other full clause can stand alone."],
  ["Mina stayed indoors because the storm grew stronger.", "because the storm grew stronger", "Mina stayed indoors", "the storm", "stayed indoors because", "The reason beginning ‘because’ depends on the main clause."],
  ["When the music stopped, everyone waited.", "When the music stopped", "everyone waited", "the music", "stopped, everyone", "The ‘when’ clause gives a time and cannot stand alone here."],
  ["If the soil dries out, water the seedlings.", "If the soil dries out", "water the seedlings", "the seedlings", "soil dries out, water", "The ‘if’ clause gives a condition for the instruction."],
  ["The lantern glowed while the children read.", "while the children read", "The lantern glowed", "the lantern", "glowed while", "The ‘while’ clause adds the time of the main action."],
  ["After the match ended, the players thanked the referee.", "After the match ended", "the players thanked the referee", "the match", "players thanked", "The ‘after’ clause tells us when the thanks happened."],
  ["The path remained closed until the bridge was repaired.", "until the bridge was repaired", "The path remained closed", "the bridge", "remained closed until", "The ‘until’ clause gives an ending condition or time."],
  ["Although the box was small, it held every photograph.", "Although the box was small", "it held every photograph", "every photograph", "the box was", "The first clause begins ‘although’ and depends on the main clause."],
  ["Ravi lowered his voice so that the baby could sleep.", "so that the baby could sleep", "Ravi lowered his voice", "the baby", "lowered his voice so", "‘So that’ introduces the purpose of lowering his voice."],
  ["Before the bell rang, Ana finished her drawing.", "Before the bell rang", "Ana finished her drawing", "her drawing", "bell rang, Ana", "The ‘before’ clause gives the time of the main event."],
  ["The garden stayed green even though the summer was dry.", "even though the summer was dry", "The garden stayed green", "the summer", "stayed green even", "‘Even though’ introduces a dependent contrast."],
  ["Whenever the gate opened, the dog looked up.", "Whenever the gate opened", "the dog looked up", "the gate", "opened, the dog", "The ‘whenever’ clause sets the repeated time or condition."],
];

const punctuation: Item[] = [
  ["‘I packed pencils, paper and a ruler,’ said Tia.", "A comma separates the reporting clause from the spoken words.", "A comma shows possession.", "A comma marks a question.", "A comma replaces every full stop.", "The comma after ‘ruler’ comes before the reporting clause ‘said Tia’."],
  ["The red bag, which had a broken zip, lay on the bench.", "The commas surround extra information about the bag.", "The commas mark a list of three bags.", "The commas show someone is speaking.", "The commas divide two questions.", "The sentence still makes sense without ‘which had a broken zip’."],
  ["First, wash the fruit; then, cut it carefully.", "The semicolon joins two closely linked instructions.", "It ends a question.", "It marks ownership.", "It introduces a quotation.", "Each side can work as a short instruction and the ideas are closely related."],
  ["The sign gave one warning: Keep away from the wet paint.", "The colon introduces the warning that follows.", "It shows the sign belongs to someone.", "It ends the whole text.", "It separates a speaker's words.", "The words after the colon state the warning mentioned before it."],
  ["‘Where is the missing page?’ asked Kemi.", "The question mark belongs inside the spoken question.", "It should replace ‘asked’.", "It shows a sentence is shouted.", "It marks a list.", "The spoken words ask a question, so the question mark closes those words."],
  ["The children's coats hung beside the door.", "The apostrophe shows the coats belong to several children.", "It shows one child owns all coats.", "It makes ‘children’ plural.", "It separates two sentences.", "‘Children’ is already plural; apostrophe-s marks their ownership."],
  ["We had one problem—the bridge was shut.", "The dash adds an explanation of the problem.", "It marks a missing letter.", "It shows a question begins.", "It means the bridge was open.", "The words after the dash explain what the problem was."],
  ["The rain stopped; however, the field remained wet.", "The semicolon separates linked main clauses.", "It shows a person is speaking.", "It marks a possessive noun.", "It replaces the final full stop.", "The statements on either side can stand alone and are linked in meaning."],
  ["Arun's notebook was left in the library.", "The apostrophe shows the notebook belongs to Arun.", "It means there are many Aruns.", "It marks a quotation.", "It joins two main clauses.", "The apostrophe-s marks one person's possession."],
  ["The box contained three things: string, chalk and tape.", "The colon introduces the list of three things.", "It ends the list.", "It shows the box belongs to someone.", "It replaces the commas in the list.", "The first clause announces three things; the list follows the colon."],
  ["‘Look out!’ shouted the cyclist.", "The exclamation mark shows a forceful warning.", "It means the cyclist asked a question.", "It marks possession.", "It shows the warning was whispered.", "‘Look out!’ is a sudden warning, and the reporting verb is ‘shouted’."],
  ["My brother—usually very quiet—cheered loudly.", "The dashes surround extra information about the brother.", "The dashes show a list of brothers.", "The dashes replace the verb.", "The dashes make a question.", "The central phrase can be removed and the sentence remains complete."],
];

export const ENGLISH_EXTRA_FAMILIES = [
  family("evidence-extra", "inference", "6Ri.14", evidence.length, question(evidence, ["What is best supported?", "Which inference follows from the detail?", "Which conclusion uses the evidence without adding an unsupported event?"])),
  family("cohesion-extra", "language", "6Ri.08", cohesion.length, question(cohesion, ["What do the linking words refer to?", "Which earlier idea is picked up by the linking words?", "Which reference keeps the meaning of the two sentences connected?"])),
  family("vocabulary-extra", "vocabulary", "6Rv.01", vocabulary.length, question(vocabulary, ["What does the key word mean here?", "Which meaning fits the surrounding detail?", "Which meaning is supported by the context rather than by a different use of the word?"])),
  family("effect-extra", "language", "6Rv.06", language.length, question(language, ["What does this wording suggest?", "What effect does the image have?", "Which explanation connects a particular word to its effect on the reader?"])),
  family("subordinate-extra", "grammar", "6Rg.02", grammar.length, question(grammar, ["Which group of words is a dependent clause?", "Which clause cannot stand alone in this sentence?", "Which clause adds time, reason, condition or contrast to the main clause?"])),
  family("punctuation-extra", "punctuation", "6Rg.01", punctuation.length, (v, d) => {
    const [extract, answer, a, b, c, reason] = punctuation[v];
    const target = /colon/i.test(answer) ? "colon (:)" : /semicolon/i.test(answer) ? "semicolon (;)" : /apostrophe/i.test(answer) ? "apostrophe (')" : /question mark/i.test(answer) ? "question mark (?)" : /exclamation mark/i.test(answer) ? "exclamation mark (!)" : /dashes|dash/i.test(answer) ? "dash (—)" : "comma (,)";
    const prompt = d === "Easy" ? `What does the ${target} do in this sentence?` : d === "Medium" ? `Which explanation best describes the use of the ${target} in this sentence?` : `Which explanation describes the exact job of the ${target} in this sentence?`;
    return [`${extract} ${prompt}`, answer, [a, b, c], reason];
  }),
];

import type { DaySchedule, KidChores } from "./schedule-parser";
import { DateTime } from "luxon";

// Word Sneak categories
const ARCHAIC_WORDS = [
  { word: "Forsooth", def: "Indeed, in truth" },
  { word: "Whence", def: "From what place or source" },
  { word: "Hitherto", def: "Until now" },
  { word: "Perchance", def: "Perhaps, maybe" },
  { word: "Betwixt", def: "Between" },
  { word: "Fortnight", def: "Two weeks" },
  { word: "Erstwhile", def: "Former, previous" },
  { word: "Henceforth", def: "From this time on" },
  { word: "Methinks", def: "I think" },
  { word: "Verily", def: "Truly, certainly" },
  { word: "Anon", def: "Soon, shortly" },
  { word: "Prithee", def: "Please (I pray thee)" },
  { word: "Mayhaps", def: "Perhaps" },
  { word: "Hearken", def: "Listen" },
  { word: "Thrice", def: "Three times" },
  { word: "Afore", def: "Before" },
  { word: "Beseech", def: "Beg earnestly" },
  { word: "Tarry", def: "Delay, linger" },
  { word: "Forthwith", def: "Immediately" },
  { word: "Nigh", def: "Near" },
  { word: "Wherefore", def: "Why, for what reason" },
  { word: "Hark", def: "Listen!" },
  { word: "Oft", def: "Often" },
  { word: "Thither", def: "To that place" },
  { word: "Ere", def: "Before" },
  { word: "Twain", def: "Two" },
  { word: "Bequeath", def: "Pass down to others" },
  { word: "Doth", def: "Does" },
  { word: "Fain", def: "Gladly, willingly" },
  { word: "Morrow", def: "Tomorrow" },
];

const RANDOM_NOUNS = [
  { word: "Kazoo", def: "A buzzing musical toy" },
  { word: "Spatula", def: "A flat cooking utensil" },
  { word: "Armadillo", def: "An armored mammal" },
  { word: "Kumquat", def: "A tiny orange fruit" },
  { word: "Toboggan", def: "A long sled" },
  { word: "Gazebo", def: "An outdoor pavilion" },
  { word: "Dirigible", def: "A steerable airship" },
  { word: "Pinecone", def: "A tree seed holder" },
  { word: "Hammock", def: "A hanging bed" },
  { word: "Umbrella", def: "A rain shield" },
  { word: "Avocado", def: "A green creamy fruit" },
  { word: "Tambourine", def: "A jingling instrument" },
  { word: "Escalator", def: "Moving stairs" },
  { word: "Platypus", def: "A duck-billed mammal" },
  { word: "Chandelier", def: "A hanging light fixture" },
  { word: "Jellyfish", def: "A squishy sea creature" },
  { word: "Xylophone", def: "A mallet instrument" },
  { word: "Hedgehog", def: "A spiny little mammal" },
  { word: "Trampoline", def: "A bouncy surface" },
  { word: "Telescope", def: "A star-viewing device" },
  { word: "Candelabra", def: "A branched candleholder" },
  { word: "Centipede", def: "A many-legged bug" },
  { word: "Periscope", def: "A submarine viewer" },
  { word: "Accordion", def: "A squeezebox instrument" },
  { word: "Dandelion", def: "A yellow weed flower" },
  { word: "Kaleidoscope", def: "A pattern viewer toy" },
  { word: "Artichoke", def: "A thistle vegetable" },
  { word: "Caterpillar", def: "A fuzzy bug larva" },
  { word: "Stalagmite", def: "A cave floor spike" },
  { word: "Flamingo", def: "A pink standing bird" },
];

const SILLY_WORDS = [
  { word: "Flibbertigibbet", def: "A chatty, silly person" },
  { word: "Brouhaha", def: "A noisy commotion" },
  { word: "Kerfuffle", def: "A fuss or commotion" },
  { word: "Gobbledygook", def: "Nonsense language" },
  { word: "Skedaddle", def: "Run away quickly" },
  { word: "Lollygag", def: "Waste time aimlessly" },
  { word: "Hullabaloo", def: "A loud uproar" },
  { word: "Bumfuzzle", def: "To confuse someone" },
  { word: "Cattywampus", def: "Crooked, askew" },
  { word: "Snollygoster", def: "A dishonest politician" },
  { word: "Nincompoop", def: "A foolish person" },
  { word: "Discombobulate", def: "To confuse utterly" },
  { word: "Widdershins", def: "Counter-clockwise" },
  { word: "Malarkey", def: "Nonsense, baloney" },
  { word: "Snickersnee", def: "A large knife" },
  { word: "Collywobbles", def: "Butterflies in stomach" },
  { word: "Bumbershoot", def: "An umbrella" },
  { word: "Codswallop", def: "Utter nonsense" },
  { word: "Fuddy-duddy", def: "An old-fashioned person" },
  { word: "Rigmarole", def: "A complicated procedure" },
  { word: "Slapdash", def: "Done carelessly" },
  { word: "Wishy-washy", def: "Weak, indecisive" },
  { word: "Whippersnapper", def: "A young upstart" },
  { word: "Bamboozle", def: "To trick someone" },
  { word: "Flummox", def: "To bewilder completely" },
  { word: "Canoodle", def: "To cuddle and kiss" },
  { word: "Dingleberry", def: "A silly person" },
  { word: "Flapdoodle", def: "Foolish talk" },
  { word: "Hornswoggle", def: "To cheat or hoax" },
  { word: "Spiffy", def: "Looking smart and neat" },
];

const VOCAB_WORDS = [
  { word: "Ephemeral", def: "Lasting briefly" },
  { word: "Ubiquitous", def: "Found everywhere" },
  { word: "Pragmatic", def: "Practical, realistic" },
  { word: "Eloquent", def: "Beautifully spoken" },
  { word: "Tenacious", def: "Persistent, determined" },
  { word: "Meticulous", def: "Very careful, precise" },
  { word: "Ambiguous", def: "Unclear, vague" },
  { word: "Diligent", def: "Hardworking" },
  { word: "Resilient", def: "Bounces back quickly" },
  { word: "Candid", def: "Honest and direct" },
  { word: "Frugal", def: "Thrifty with money" },
  { word: "Gregarious", def: "Very sociable" },
  { word: "Impeccable", def: "Flawless, perfect" },
  { word: "Lethargic", def: "Sluggish, tired" },
  { word: "Mundane", def: "Ordinary, boring" },
  { word: "Obscure", def: "Unknown, hidden" },
  { word: "Succinct", def: "Brief and clear" },
  { word: "Verbose", def: "Using too many words" },
  { word: "Astute", def: "Clever, perceptive" },
  { word: "Cogent", def: "Logical, convincing" },
  { word: "Fastidious", def: "Very picky" },
  { word: "Garrulous", def: "Overly talkative" },
  { word: "Inquisitive", def: "Curious, questioning" },
  { word: "Prudent", def: "Wise and careful" },
  { word: "Arduous", def: "Difficult, tiring" },
  { word: "Benevolent", def: "Kind, generous" },
  { word: "Capricious", def: "Unpredictable" },
  { word: "Dubious", def: "Doubtful, uncertain" },
  { word: "Zealous", def: "Passionately eager" },
  { word: "Whimsical", def: "Playfully odd" },
];

const POSITIVE_WORDS = [
  { word: "Magnificent", def: "Extremely beautiful" },
  { word: "Phenomenal", def: "Remarkably great" },
  { word: "Spectacular", def: "Strikingly impressive" },
  { word: "Brilliant", def: "Exceptionally clever" },
  { word: "Delightful", def: "Highly pleasing" },
  { word: "Marvelous", def: "Wonderfully good" },
  { word: "Extraordinary", def: "Beyond ordinary" },
  { word: "Fantastic", def: "Incredibly great" },
  { word: "Wonderful", def: "Inspiring wonder" },
  { word: "Splendid", def: "Magnificent, grand" },
  { word: "Glorious", def: "Magnificently beautiful" },
  { word: "Radiant", def: "Shining brightly" },
  { word: "Exquisite", def: "Extremely beautiful" },
  { word: "Superb", def: "Excellently good" },
  { word: "Remarkable", def: "Worthy of attention" },
  { word: "Outstanding", def: "Exceptionally good" },
  { word: "Incredible", def: "Hard to believe good" },
  { word: "Fabulous", def: "Amazingly great" },
  { word: "Stunning", def: "Extremely impressive" },
  { word: "Enchanting", def: "Delightfully charming" },
  { word: "Gracious", def: "Kind and pleasant" },
  { word: "Charming", def: "Very pleasant" },
  { word: "Inspiring", def: "Filling with hope" },
  { word: "Heartwarming", def: "Emotionally uplifting" },
  { word: "Uplifting", def: "Making happier" },
  { word: "Dazzling", def: "Blindingly impressive" },
  { word: "Blissful", def: "Extremely happy" },
  { word: "Jubilant", def: "Full of joy" },
  { word: "Resplendent", def: "Dazzlingly beautiful" },
  { word: "Triumphant", def: "Victoriously happy" },
];

const ACTION_VERBS = [
  { word: "Gallivant", def: "Roam for pleasure" },
  { word: "Meander", def: "Wander aimlessly" },
  { word: "Scamper", def: "Run with quick steps" },
  { word: "Saunter", def: "Walk leisurely" },
  { word: "Frolic", def: "Play cheerfully" },
  { word: "Cavort", def: "Jump around excitedly" },
  { word: "Swagger", def: "Walk confidently" },
  { word: "Traipse", def: "Walk wearily" },
  { word: "Prance", def: "Move with high steps" },
  { word: "Waddle", def: "Walk with short steps" },
  { word: "Scuttle", def: "Move hurriedly" },
  { word: "Shimmy", def: "Shake the body" },
  { word: "Pirouette", def: "Spin on one foot" },
  { word: "Catapult", def: "Fling forcefully" },
  { word: "Plummet", def: "Fall straight down" },
  { word: "Ricochet", def: "Bounce off surfaces" },
  { word: "Oscillate", def: "Swing back and forth" },
  { word: "Somersault", def: "Roll head over heels" },
  { word: "Levitate", def: "Float in the air" },
  { word: "Teleport", def: "Move instantly" },
  { word: "Hibernate", def: "Sleep through winter" },
  { word: "Procrastinate", def: "Delay doing things" },
  { word: "Collaborate", def: "Work together" },
  { word: "Investigate", def: "Look into carefully" },
  { word: "Improvise", def: "Make it up as you go" },
  { word: "Persevere", def: "Keep trying" },
  { word: "Strategize", def: "Plan carefully" },
  { word: "Hypothesize", def: "Make an educated guess" },
  { word: "Contemplate", def: "Think deeply" },
  { word: "Exaggerate", def: "Overstate wildly" },
];

const EMOTIONS = [
  { word: "Euphoric", def: "Intensely happy" },
  { word: "Melancholy", def: "Deeply sad" },
  { word: "Anxious", def: "Worried, nervous" },
  { word: "Serene", def: "Calm and peaceful" },
  { word: "Nostalgic", def: "Missing the past" },
  { word: "Exhilarated", def: "Thrilled, excited" },
  { word: "Bewildered", def: "Completely puzzled" },
  { word: "Indignant", def: "Righteously angry" },
  { word: "Apprehensive", def: "Fearful of future" },
  { word: "Ecstatic", def: "Overwhelmingly joyful" },
  { word: "Flabbergasted", def: "Utterly shocked" },
  { word: "Mortified", def: "Extremely embarrassed" },
  { word: "Elated", def: "Extremely happy" },
  { word: "Despondent", def: "In low spirits" },
  { word: "Infuriated", def: "Extremely angry" },
  { word: "Tranquil", def: "Free from disturbance" },
  { word: "Skeptical", def: "Doubtful, questioning" },
  { word: "Ambivalent", def: "Mixed feelings" },
  { word: "Remorseful", def: "Full of regret" },
  { word: "Wistful", def: "Sadly longing" },
  { word: "Perplexed", def: "Totally confused" },
  { word: "Envious", def: "Wanting what others have" },
  { word: "Triumphant", def: "Feeling victorious" },
  { word: "Humbled", def: "Made modest" },
  { word: "Overwhelmed", def: "Buried in feelings" },
  { word: "Intrigued", def: "Very curious" },
  { word: "Irritated", def: "Slightly annoyed" },
  { word: "Content", def: "Peacefully satisfied" },
  { word: "Mystified", def: "Completely baffled" },
  { word: "Astonished", def: "Greatly surprised" },
];

const FOODS = [
  { word: "Rutabaga", def: "A root vegetable" },
  { word: "Quinoa", def: "An ancient grain" },
  { word: "Kiwi", def: "A fuzzy fruit" },
  { word: "Focaccia", def: "Italian flatbread" },
  { word: "Gnocchi", def: "Potato dumplings" },
  { word: "Prosciutto", def: "Italian dry ham" },
  { word: "Wasabi", def: "Spicy green paste" },
  { word: "Falafel", def: "Fried chickpea balls" },
  { word: "Tiramisu", def: "Coffee-flavored dessert" },
  { word: "Bruschetta", def: "Toasted bread topping" },
  { word: "Biscotti", def: "Crunchy Italian cookies" },
  { word: "Edamame", def: "Steamed soybeans" },
  { word: "Guacamole", def: "Mashed avocado dip" },
  { word: "Croissant", def: "Flaky crescent pastry" },
  { word: "Sourdough", def: "Tangy fermented bread" },
  { word: "Kimchi", def: "Fermented cabbage" },
  { word: "Cannoli", def: "Cream-filled pastry" },
  { word: "Empanada", def: "Stuffed pastry pocket" },
  { word: "Ravioli", def: "Stuffed pasta squares" },
  { word: "Dumpling", def: "Filled dough ball" },
  { word: "Churro", def: "Fried dough stick" },
  { word: "Gazpacho", def: "Cold tomato soup" },
  { word: "Pancetta", def: "Italian bacon" },
  { word: "Tempura", def: "Light Japanese batter" },
  { word: "Brioche", def: "Rich French bread" },
  { word: "Arugula", def: "Peppery salad green" },
  { word: "Tzatziki", def: "Greek yogurt sauce" },
  { word: "Mozzarella", def: "Stretchy Italian cheese" },
  { word: "Soufflé", def: "Puffy baked dish" },
  { word: "Jalapeño", def: "Spicy green pepper" },
];

const SOUNDS = [
  { word: "Kerplunk", def: "Splash into water" },
  { word: "Whoosh", def: "Rushing air sound" },
  { word: "Splatter", def: "Messy liquid sound" },
  { word: "Thwack", def: "Sharp hitting sound" },
  { word: "Crunch", def: "Breaking under teeth" },
  { word: "Sizzle", def: "Hot frying sound" },
  { word: "Gurgle", def: "Bubbling water sound" },
  { word: "Clatter", def: "Rattling noise" },
  { word: "Squelch", def: "Wet squishing sound" },
  { word: "Clang", def: "Metal striking metal" },
  { word: "Rumble", def: "Low rolling sound" },
  { word: "Tinkle", def: "Light ringing sound" },
  { word: "Crackle", def: "Snapping fire sound" },
  { word: "Whimper", def: "Soft crying sound" },
  { word: "Murmur", def: "Quiet talking sound" },
  { word: "Screech", def: "High piercing sound" },
  { word: "Rustle", def: "Leaves moving sound" },
  { word: "Squeak", def: "High-pitched noise" },
  { word: "Thud", def: "Heavy falling sound" },
  { word: "Hiss", def: "Snake-like sound" },
  { word: "Rattle", def: "Shaking loose parts" },
  { word: "Plop", def: "Soft dropping sound" },
  { word: "Fizz", def: "Bubbles escaping" },
  { word: "Swoosh", def: "Fast movement sound" },
  { word: "Clunk", def: "Dull heavy sound" },
  { word: "Splosh", def: "Water movement" },
  { word: "Whir", def: "Mechanical spinning" },
  { word: "Pitter-patter", def: "Light tapping rain" },
  { word: "Zing", def: "High speed passing" },
  { word: "Bonk", def: "Hitting head sound" },
];

const NATURE = [
  { word: "Constellation", def: "Star pattern" },
  { word: "Aurora", def: "Northern lights" },
  { word: "Tsunami", def: "Giant ocean wave" },
  { word: "Archipelago", def: "Chain of islands" },
  { word: "Glacier", def: "Slow-moving ice" },
  { word: "Tundra", def: "Frozen treeless land" },
  { word: "Savanna", def: "Grassy plain" },
  { word: "Fjord", def: "Narrow sea inlet" },
  { word: "Geyser", def: "Hot water spout" },
  { word: "Stalactite", def: "Cave ceiling spike" },
  { word: "Meadow", def: "Grassy field" },
  { word: "Lagoon", def: "Shallow water body" },
  { word: "Monsoon", def: "Seasonal rainstorm" },
  { word: "Avalanche", def: "Snow slide" },
  { word: "Driftwood", def: "Water-carried wood" },
  { word: "Estuary", def: "River meets sea" },
  { word: "Canopy", def: "Forest top layer" },
  { word: "Reef", def: "Underwater rock ridge" },
  { word: "Tributary", def: "River branch" },
  { word: "Crater", def: "Volcano opening" },
  { word: "Oasis", def: "Desert water spot" },
  { word: "Blizzard", def: "Severe snowstorm" },
  { word: "Eclipse", def: "Sun or moon blocked" },
  { word: "Waterfall", def: "Falling water" },
  { word: "Volcano", def: "Erupting mountain" },
  { word: "Bamboo", def: "Fast-growing grass" },
  { word: "Bioluminescence", def: "Living light" },
  { word: "Quicksand", def: "Sinking sand" },
  { word: "Tidepool", def: "Shore water pocket" },
  { word: "Whirlpool", def: "Spinning water" },
];

interface WordEntry { word: string; def: string }

function getDailyWords(date: DateTime): { word: string; def: string; cat: string }[] {
  const day = date.ordinal;
  return [
    { ...ARCHAIC_WORDS[day % ARCHAIC_WORDS.length], cat: "Archaic" },
    { ...RANDOM_NOUNS[day % RANDOM_NOUNS.length], cat: "Noun" },
    { ...SILLY_WORDS[day % SILLY_WORDS.length], cat: "Silly" },
    { ...VOCAB_WORDS[day % VOCAB_WORDS.length], cat: "Vocab" },
    { ...POSITIVE_WORDS[day % POSITIVE_WORDS.length], cat: "Positive" },
    { ...ACTION_VERBS[day % ACTION_VERBS.length], cat: "Action" },
    { ...EMOTIONS[day % EMOTIONS.length], cat: "Emotion" },
    { ...FOODS[day % FOODS.length], cat: "Food" },
    { ...SOUNDS[day % SOUNDS.length], cat: "Sound" },
    { ...NATURE[day % NATURE.length], cat: "Nature" },
  ];
}

interface MarkupResult {
  markup: string;
  markup_half_horizontal: string;
  markup_half_vertical: string;
  markup_quadrant: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(date: DateTime): string {
  return date.toFormat("cccc, LLL d");
}

export function renderMarkup(
  schedule: DaySchedule,
  date: DateTime,
  instanceUuid: string,
  benQuote?: string | null
): MarkupResult {
  const dateStr = formatDate(date);
  const id = `c-${instanceUuid.slice(0, 8)}`;

  // Brutalist styles - large readable fonts for e-ink
  const baseStyles = `
    <style>
      #${id} { font-family: Arial, Helvetica, sans-serif; background: #fff; padding: 0; height: 100%; box-sizing: border-box; position: relative; }
      #${id} .header { background: #000; color: #fff; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
      #${id} .title { font-size: 36px; font-weight: 700; text-transform: uppercase; letter-spacing: 4px; color: #fff; }
      #${id} .date { font-size: 18px; border: 3px solid #fff; padding: 6px 12px; color: #fff; }
      #${id} .grid { display: grid; grid-template-columns: repeat(4, 1fr); }
      #${id} .kid { border-right: 4px solid #000; border-bottom: 4px solid #000; padding: 16px; }
      #${id} .kid:last-child { border-right: none; }
      #${id} .kid-name { font-size: 24px; font-weight: 700; text-transform: uppercase; border-bottom: 3px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
      #${id} .chore { font-size: 18px; padding: 6px 0; border-bottom: 1px solid #000; }
      #${id} .chore:last-child { border-bottom: none; }
      #${id} .more { font-style: italic; font-size: 16px; }
      #${id} .sneak { padding: 8px 16px; border-top: 4px solid #000; }
      #${id} .sneak-label { font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }
      #${id} .sneak-words { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
      #${id} .sneak-item { }
      #${id} .sneak-cat { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #666; }
      #${id} .sneak-word { font-size: 13px; font-weight: 700; }
      #${id} .sneak-def { font-size: 9px; color: #333; }
      #${id} .quote { position: absolute; bottom: 0; left: 0; right: 0; background: #000; color: #fff; padding: 12px 24px; font-size: 16px; display: flex; gap: 10px; }
      #${id} .quote-label { font-weight: 700; }
    </style>
  `;

  // Helper to render a kid section
  const renderKid = (kid: KidChores, maxChores: number) => {
    const chores = kid.chores.length > 0 ? kid.chores : ["No chores today!"];
    const display = chores.slice(0, maxChores);
    const hasMore = chores.length > display.length;
    const choreHtml = display.map((c) => `<div class="chore">${escapeHtml(c)}</div>`).join("");
    const moreHtml = hasMore ? `<div class="chore more">+${chores.length - display.length} more</div>` : "";
    return `<div class="kid"><div class="kid-name">${escapeHtml(kid.name)}</div>${choreHtml}${moreHtml}</div>`;
  };

  const displayQuote = benQuote || "Don't quote me on this";
  const quoteHtml = `<div class="quote"><span class="quote-label">BEN:</span><span>"${escapeHtml(displayQuote)}"</span></div>`;

  const sneakWords = getDailyWords(date);
  const sneakHtml = `<div class="sneak"><div class="sneak-label">Word Sneak - Sneak these into conversation!</div><div class="sneak-words">${sneakWords.map((w) => `<div class="sneak-item"><div class="sneak-cat">${escapeHtml(w.cat)}</div><div class="sneak-word">${escapeHtml(w.word)}</div><div class="sneak-def">${escapeHtml(w.def)}</div></div>`).join("")}</div></div>`;

  // Full screen (800x480)
  const fullMarkup = `
    <div id="${id}">
      ${baseStyles}
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="grid">${schedule.kids.map((k) => renderKid(k, 5)).join("")}</div>
      ${sneakHtml}
      ${quoteHtml}
    </div>
  `;

  // Half horizontal (800x240) - 2 rows of 2
  const halfHorizontalMarkup = `
    <div id="${id}">
      ${baseStyles}
      <style>
        #${id} .header { padding: 10px 16px; }
        #${id} .title { font-size: 24px; letter-spacing: 3px; }
        #${id} .date { font-size: 14px; padding: 4px 8px; }
        #${id} .grid { grid-template-columns: repeat(4, 1fr); }
        #${id} .kid { padding: 10px; }
        #${id} .kid-name { font-size: 18px; padding-bottom: 4px; margin-bottom: 6px; }
        #${id} .chore { font-size: 14px; padding: 3px 0; }
        #${id} .quote { padding: 8px 16px; font-size: 14px; }
      </style>
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="grid">${schedule.kids.map((k) => renderKid(k, 3)).join("")}</div>
      ${quoteHtml}
    </div>
  `;

  // Half vertical (400x480) - single column
  const halfVerticalMarkup = `
    <div id="${id}">
      ${baseStyles}
      <style>
        #${id} .header { padding: 12px 16px; }
        #${id} .title { font-size: 22px; letter-spacing: 2px; }
        #${id} .date { font-size: 14px; padding: 4px 8px; }
        #${id} .grid { grid-template-columns: 1fr 1fr; }
        #${id} .kid { padding: 12px; border-right: 3px solid #000; border-bottom: 3px solid #000; }
        #${id} .kid:nth-child(2n) { border-right: none; }
        #${id} .kid-name { font-size: 18px; padding-bottom: 6px; margin-bottom: 8px; border-bottom: 2px solid #000; }
        #${id} .chore { font-size: 14px; padding: 4px 0; }
        #${id} .quote { padding: 8px 16px; font-size: 14px; }
      </style>
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="grid">${schedule.kids.map((k) => renderKid(k, 3)).join("")}</div>
      ${quoteHtml}
    </div>
  `;

  // Quadrant (400x240) - compact list
  const quadrantMarkup = `
    <div id="${id}">
      ${baseStyles}
      <style>
        #${id} .header { padding: 8px 12px; }
        #${id} .title { font-size: 18px; letter-spacing: 2px; }
        #${id} .date { font-size: 12px; padding: 3px 6px; border-width: 2px; }
        #${id} .grid { grid-template-columns: 1fr 1fr; }
        #${id} .kid { padding: 8px 10px; border-width: 2px; }
        #${id} .kid:nth-child(2n) { border-right: none; }
        #${id} .kid-name { font-size: 14px; padding-bottom: 4px; margin-bottom: 6px; border-bottom: 2px solid #000; }
        #${id} .chore { font-size: 12px; padding: 3px 0; }
        #${id} .quote { display: none; }
      </style>
      <div class="header">
        <span class="title">Chores</span>
        <span class="date">${date.toFormat("ccc d")}</span>
      </div>
      <div class="grid">${schedule.kids.map((k) => renderKid(k, 2)).join("")}</div>
    </div>
  `;

  return {
    markup: fullMarkup,
    markup_half_horizontal: halfHorizontalMarkup,
    markup_half_vertical: halfVerticalMarkup,
    markup_quadrant: quadrantMarkup,
  };
}

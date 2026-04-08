/**
 * Character Name Generator for Kynnys TTRPG
 *
 * Generates culturally-fused names by combining source names from different
 * cultural traditions. Names in Kynnys are strongly rooted in real-world
 * cultural fusions — Finnish-Latin, Germanic-Indian, Italo-Korean,
 * Anglo-Slavic, and French-African blends.
 *
 * The algorithm picks two source names and fuses them at syllable boundaries,
 * applying phonetic smoothing to produce natural-sounding results.
 */

// ─── Types ───────────────────────────────────────────────────────────────


interface NamePair {
  a: string;
  b: string;
}

interface FusionCategory {
  id: string;
  label: string;
  male: NamePair[];
  female: NamePair[];
  neutral: NamePair[];
}

// ─── Source Name Corpus ──────────────────────────────────────────────────
// Each pair { a, b } represents two cultural source names that can be fused.
// The algorithm will pick halves from each to generate NEW names — it does
// NOT return these pairs directly.

const FINNISH_LATIN: FusionCategory = {
  id: "finnish-latin",
  label: "Suomalais-Latinalaiset fuusiot",
  male: [
    { a: "Pekka", b: "Pablo" },
    { a: "Ville", b: "Rodrigo" },
    { a: "Seppo", b: "Hipólito" },
    { a: "Antti", b: "Manuelito" },
    { a: "Juho", b: "Javier" },
    { a: "Heikki", b: "Federico" },
    { a: "Mikko", b: "Marcello" },
    { a: "Eerik", b: "Rodriguez" },
    { a: "Väinö", b: "Alejandro" },
    { a: "Toivo", b: "Ernesto" },
    { a: "Ilmari", b: "Santiago" },
    { a: "Kalevi", b: "Gonzalo" },
    { a: "Olavi", b: "Renaldo" },
    { a: "Tapio", b: "Bernardo" },
    { a: "Eino", b: "Celestino" },
    { a: "Lauri", b: "Augusto" },
    { a: "Onni", b: "Patricio" },
    { a: "Arvo", b: "Leandro" },
  ],
  female: [
    { a: "Marisol", b: "Mirja" },
    { a: "Kaisa", b: "Isabella" },
    { a: "Niina", b: "Lolita" },
    { a: "Maija", b: "Inez" },
    { a: "Sanna", b: "Mariluz" },
    { a: "Tiina", b: "Rita" },
    { a: "Raija", b: "Anita" },
    { a: "Anne", b: "Alicia" },
    { a: "Aino", b: "Catalina" },
    { a: "Helmi", b: "Esperanza" },
    { a: "Siiri", b: "Valentina" },
    { a: "Tyyne", b: "Rosalinda" },
    { a: "Lempi", b: "Consuelo" },
    { a: "Vieno", b: "Maribel" },
    { a: "Elina", b: "Graciela" },
    { a: "Päivi", b: "Luciana" },
    { a: "Tuula", b: "Florencia" },
  ],
  neutral: [
    { a: "Aarni", b: "Ariel" },
    { a: "Tuuli", b: "Diego" },
    { a: "Halti", b: "Santiago" },
    { a: "Mari", b: "Mario" },
    { a: "Soli", b: "Sari" },
    { a: "Inari", b: "Mariano" },
    { a: "Talvi", b: "Rodrigo" },
    { a: "Lumi", b: "Cielo" },
    { a: "Ilma", b: "Rio" },
    { a: "Pyry", b: "Sol" },
    { a: "Meri", b: "Cruz" },
    { a: "Touko", b: "Abril" },
    { a: "Syksy", b: "Paz" },
    { a: "Valo", b: "Lucero" },
    { a: "Kuura", b: "Relámpago" },
  ],
};

const GERMANIC_INDIAN: FusionCategory = {
  id: "germanic-indian",
  label: "Germaanis-Intialaiset rakenteet",
  male: [
    { a: "Kurt", b: "Ashish" },
    { a: "Wolfgang", b: "Vikram" },
    { a: "Hans", b: "Arjun" },
    { a: "Karl", b: "Ashish" },
    { a: "Otto", b: "Akshay" },
    { a: "Dieter", b: "Pal" },
    { a: "Rolf", b: "Rajesh" },
    { a: "Günther", b: "Sanjay" },
    { a: "Werner", b: "Pradeep" },
    { a: "Fritz", b: "Mahesh" },
    { a: "Ludwig", b: "Rajan" },
    { a: "Heinrich", b: "Suresh" },
    { a: "Helmut", b: "Dinesh" },
    { a: "Siegfried", b: "Ganesh" },
    { a: "Albrecht", b: "Naveen" },
    { a: "Konrad", b: "Ramesh" },
  ],
  female: [
    { a: "Anika", b: "Ishani" },
    { a: "Greta", b: "Priya" },
    { a: "Brigitte", b: "Ganesha" },
    { a: "Helga", b: "Abhiram" },
    { a: "Anna", b: "Lakshmi" },
    { a: "Mina", b: "Devi" },
    { a: "Hilde", b: "Sunita" },
    { a: "Ingrid", b: "Kavita" },
    { a: "Liesel", b: "Meera" },
    { a: "Gertrude", b: "Ananya" },
    { a: "Frieda", b: "Nalini" },
    { a: "Ursula", b: "Padmini" },
    { a: "Hannelore", b: "Savitri" },
    { a: "Else", b: "Jyoti" },
    { a: "Elke", b: "Nandini" },
  ],
  neutral: [
    { a: "Krishan", b: "Hans" },
    { a: "Arjun", b: "Ulf" },
    { a: "Surya", b: "Anton" },
    { a: "Indu", b: "Ludvic" },
    { a: "Kiran", b: "Ulf" },
    { a: "Raja", b: "Rolf" },
    { a: "Janavi", b: "Ulrich" },
    { a: "Deepak", b: "Karl" },
    { a: "Nil", b: "Hans" },
    { a: "Hima", b: "Helga" },
    { a: "Vikram", b: "Karl" },
    { a: "Prem", b: "Friedrich" },
    { a: "Noor", b: "Gisela" },
    { a: "Chandra", b: "Ernst" },
    { a: "Bodhi", b: "Steffen" },
  ],
};

const ITALO_KOREAN: FusionCategory = {
  id: "italo-korean",
  label: "Italo-Korealaiset ja Itä-Aasian melodiat",
  male: [
    { a: "Giovanni", b: "Min-ho" },
    { a: "Matteo", b: "Sang-hoon" },
    { a: "Marco", b: "Ji-seon" },
    { a: "Paolo", b: "Hideki" },
    { a: "Riccardo", b: "Doo" },
    { a: "Hiroshi", b: "David" },
    { a: "Kenji", b: "Arthur" },
    { a: "Alessandro", b: "Sung-jin" },
    { a: "Lorenzo", b: "Tae-hyun" },
    { a: "Salvatore", b: "Yong-soo" },
    { a: "Vincenzo", b: "Haru" },
    { a: "Roberto", b: "Daiki" },
    { a: "Emilio", b: "Ji-hoon" },
    { a: "Claudio", b: "Ren" },
    { a: "Fabrizio", b: "Shin" },
    { a: "Massimo", b: "Kazuki" },
  ],
  female: [
    { a: "Luca", b: "Hana" },
    { a: "Elena", b: "Ji-won" },
    { a: "Sofia", b: "Da-hye" },
    { a: "Beatrice", b: "Min-ho" },
    { a: "Lucia", b: "Moon" },
    { a: "Francesca", b: "Chae" },
    { a: "Sakura", b: "Emily" },
    { a: "Chiara", b: "Yuna" },
    { a: "Valentina", b: "Soo-jin" },
    { a: "Giuliana", b: "Mei" },
    { a: "Isabella", b: "Haruki" },
    { a: "Rosaria", b: "Ayumi" },
    { a: "Antonella", b: "Nari" },
    { a: "Bianca", b: "Mitsuki" },
    { a: "Serena", b: "Eun-bi" },
  ],
  neutral: [
    { a: "Alessia", b: "Min" },
    { a: "Mika", b: "Kaos" },
    { a: "Jun", b: "Paolo" },
    { a: "Hikari", b: "Gary" },
    { a: "Sora", b: "Lorenzo" },
    { a: "Yuki", b: "Nico" },
    { a: "Rio", b: "Min" },
    { a: "Kim", b: "Mario" },
    { a: "Nami", b: "Manon" },
    { a: "Yuki", b: "Shin" },
    { a: "Akira", b: "Elia" },
    { a: "Hiro", b: "Luca" },
    { a: "Ren", b: "Andrea" },
    { a: "Tomo", b: "Fiore" },
    { a: "Kai", b: "Mattia" },
  ],
};

const ANGLO_SLAVIC: FusionCategory = {
  id: "anglo-slavic",
  label: "Anglo-Slaavilaiset ja urbaanit synteesit",
  male: [
    { a: "Jack", b: "Vladimir" },
    { a: "Boris", b: "Jaroslav" },
    { a: "Henry", b: "Ivan" },
    { a: "Arthur", b: "Miroslav" },
    { a: "Viktor", b: "Ian" },
    { a: "Oleg", b: "Gary" },
    { a: "Yuri", b: "Jack" },
    { a: "Mikhail", b: "Chris" },
    { a: "Edward", b: "Stanislav" },
    { a: "George", b: "Bogdan" },
    { a: "Charles", b: "Dmitri" },
    { a: "William", b: "Radoslav" },
    { a: "Thomas", b: "Yaroslav" },
    { a: "Richard", b: "Aleksei" },
    { a: "James", b: "Miroslav" },
    { a: "Andrew", b: "Borislav" },
  ],
  female: [
    { a: "William", b: "Anna" },
    { a: "Katja", b: "Catherine" },
    { a: "Olivia", b: "Boris" },
    { a: "Elizabeth", b: "Bohdan" },
    { a: "Sarah", b: "Antonina" },
    { a: "Natasha", b: "Emily" },
    { a: "Annika", b: "Antonov" },
    { a: "Larissa", b: "Jason" },
    { a: "Svetlana", b: "Grace" },
    { a: "Irina", b: "Charlotte" },
    { a: "Tatiana", b: "Rose" },
    { a: "Valentina", b: "Sophie" },
    { a: "Yelena", b: "Margaret" },
    { a: "Anastasia", b: "Jane" },
    { a: "Xenia", b: "Alice" },
  ],
  neutral: [
    { a: "Stanislav", b: "Lynn" },
    { a: "Sasha", b: "Samuel" },
    { a: "Mila", b: "Laura" },
    { a: "Yuri", b: "Jane" },
    { a: "Nikolai", b: "Alice" },
    { a: "Mischa", b: "Michael" },
    { a: "Danya", b: "Silas" },
    { a: "Valeri", b: "Gary" },
    { a: "Alexei", b: "Morgan" },
    { a: "Sasha", b: "Quinn" },
    { a: "Robin", b: "Slava" },
    { a: "Dana", b: "Riley" },
    { a: "Jordan", b: "Misha" },
    { a: "Morgan", b: "Zhenya" },
  ],
};

const FRENCH_AFRICAN: FusionCategory = {
  id: "french-african",
  label: "Ranskalais-Afrikkalaiset ja muut fuusiot",
  male: [
    { a: "Amadou", b: "Dieudonné" },
    { a: "Théodore", b: "Babatunde" },
    { a: "Bakari", b: "Blaise" },
    { a: "Kofi", b: "Pierre" },
    { a: "Pascal", b: "Abdou" },
    { a: "Moussa", b: "Laurent" },
    { a: "Ousmane", b: "Philippe" },
    { a: "Sekou", b: "François" },
    { a: "Ibrahima", b: "Gérard" },
    { a: "Kwame", b: "Thierry" },
    { a: "Boubacar", b: "Matthieu" },
    { a: "Cheick", b: "Christophe" },
    { a: "Abdoulaye", b: "Julien" },
    { a: "Mamadou", b: "Benoît" },
    { a: "Tidiane", b: "René" },
  ],
  female: [
    { a: "Jean", b: "Adara" },
    { a: "Malik", b: "Lucette" },
    { a: "Lucien", b: "Amina" },
    { a: "Mariam", b: "Yvonne" },
    { a: "Elodie", b: "Akina" },
    { a: "Fatou", b: "Colette" },
    { a: "Aissatou", b: "Amelie" },
    { a: "Ndeye", b: "Simone" },
    { a: "Aminata", b: "Brigitte" },
    { a: "Djeneba", b: "Marguerite" },
    { a: "Kadiatou", b: "Josette" },
    { a: "Mariama", b: "Hélène" },
    { a: "Fatoumata", b: "Cécile" },
    { a: "Bintou", b: "Solange" },
  ],
  neutral: [
    { a: "Claire", b: "Simba" },
    { a: "Akina", b: "Renault" },
    { a: "Zane", b: "Sandrine" },
    { a: "Indira", b: "Eustace" },
    { a: "Yara", b: "Marc" },
    { a: "Nael", b: "Djibril" },
    { a: "Samba", b: "Claude" },
    { a: "Amari", b: "Dominique" },
    { a: "Kenza", b: "Moussa" },
    { a: "Fadel", b: "Camille" },
    { a: "Noa", b: "Bakary" },
    { a: "Aziz", b: "Marin" },
    { a: "Issa", b: "Florian" },
  ],
};

const ALL_CATEGORIES: FusionCategory[] = [
  FINNISH_LATIN,
  GERMANIC_INDIAN,
  ITALO_KOREAN,
  ANGLO_SLAVIC,
  FRENCH_AFRICAN,
];

// ─── Known Names (never suggest these) ───────────────────────────────────
// All example names from the design spec + source names themselves.

const KNOWN_NAMES = new Set([
  // Finnish-Latin examples
  "Pekablo", "Marisorja", "Aarniel", "Villergo", "Kaisabell",
  "Tuuligo", "Sepolito", "Niolita", "Ranicco", "Manuenti",
  "Maijinez", "Haltiago", "Ju'ovier", "Sannluz", "Marimar",
  "Heico", "Tiirita", "Solisari", "Mikelllo", "Raijita",
  "Inariano", "Eerikuez", "Annelicia", "Talvigo",
  // Germanic-Indian examples
  "Kurtish", "Anishani", "Krishans", "Wolfvick", "Gretapriya",
  "Arjulf", "Hansarjun", "Brijitgan", "Suryatton", "Karlashish",
  "Helgaviram", "Induvic", "Ottoshay", "Annalakshi", "Kiranulf",
  "Rajulf", "Minadevi", "Janavich", "Deepakarl", "Ulvishni",
  "Nilsson", "Dieterpal", "Himalga", "Vickar",
  // Italo-Korean examples
  "Giovanho", "Lucahana", "Alessin", "Mattesun", "Eleniwon",
  "Mikaos", "Marcoseon", "Sofidahye", "Junio", "Beatrim-ho",
  "Luciamoon", "Hikary", "Paolohide", "Franceskae", "Soranzo",
  "Kenjarth", "Yukinico", "Riomin", "Hirodavid", "Sakuremy",
  "Kimio", "Riccardoo", "Naminon", "Yushin",
  // Anglo-Slavic examples
  "Jackimir", "Willianna", "Stanlynn", "Borissav", "Katyerin",
  "Sashamuel", "Henrivan", "Oliviaris", "Milaura", "Arthuroslav",
  "Elizabohdan", "Yurijane", "Viktorian", "Sarahnina", "Nikolace",
  "Olegary", "Natashaly", "Valery", "Yurijack", "Annikaov",
  "Mischael", "Mikhailis", "Larison", "Danyas",
  // French-African examples
  "Amadieu", "Jeandara", "Clarimba", "Thébault", "Malicette",
  "Akinault", "Bakarise", "Lucina", "Zandrine", "Kofier",
  "Marivonne", "Indirace", "Pascalou", "Elokina", "Yaramar",
]);

// ─── Phonetic Utilities ──────────────────────────────────────────────────

const VOWELS = new Set("aeiouyäöåáéíóúàèùâêîôûëïü".split(""));

function isVowel(ch: string): boolean {
  return VOWELS.has(ch.toLowerCase());
}

function isConsonant(ch: string): boolean {
  return /[a-zäöåßñçðþ]/i.test(ch) && !isVowel(ch);
}

/**
 * Find syllable boundary indices in a name.
 * Uses a simple heuristic: a boundary occurs between a vowel and
 * a following consonant, or between consonant clusters.
 */
function findSyllableBoundaries(name: string): number[] {
  const boundaries: number[] = [];
  for (let i = 1; i < name.length - 1; i++) {
    const prev = name[i - 1];
    const curr = name[i];
    // Boundary before a consonant that follows a vowel (CV boundary)
    if (isVowel(prev) && isConsonant(curr)) {
      boundaries.push(i);
    }
    // Boundary between two consonants where the next char is a vowel (CCV)
    else if (isConsonant(prev) && isConsonant(curr) && i + 1 < name.length && isVowel(name[i + 1])) {
      boundaries.push(i);
    }
  }
  return boundaries;
}

/**
 * Pick a split point in a name, favoring syllable boundaries.
 * Returns an index that splits the name into [0..idx) and [idx..end].
 */
function pickSplitPoint(name: string): number {
  const boundaries = findSyllableBoundaries(name);
  const minSplit = Math.max(1, Math.floor(name.length * 0.25));
  const maxSplit = Math.min(name.length - 1, Math.ceil(name.length * 0.75));

  // Filter boundaries to reasonable range
  const validBoundaries = boundaries.filter((b) => b >= minSplit && b <= maxSplit);

  if (validBoundaries.length > 0) {
    return validBoundaries[Math.floor(Math.random() * validBoundaries.length)];
  }

  // Fallback: pick a random point in the valid range
  return minSplit + Math.floor(Math.random() * (maxSplit - minSplit + 1));
}

/**
 * Apply phonetic smoothing at the join point between two name halves.
 * Prevents awkward consonant clusters and ensures readable transitions.
 */
function smoothJoin(first: string, second: string): string {
  if (first.length === 0 || second.length === 0) return first + second;

  const lastChar = first[first.length - 1].toLowerCase();
  const firstChar = second[0].toLowerCase();

  let result = first + second;

  // Rule 1: Triple+ consecutive consonants → insert a bridging vowel
  const joinRegion = (first.slice(-2) + second.slice(0, 2)).toLowerCase();
  let consonantRun = 0;
  let maxRun = 0;
  for (const ch of joinRegion) {
    if (isConsonant(ch)) {
      consonantRun++;
      maxRun = Math.max(maxRun, consonantRun);
    } else {
      consonantRun = 0;
    }
  }
  if (maxRun >= 3) {
    // Insert a bridging vowel between the halves
    const bridgeVowels = ["a", "i", "e", "o"];
    // Try to pick a vowel that harmonizes with the surrounding vowels
    const nearbyVowel = [...first].reverse().find((c) => isVowel(c))?.toLowerCase();
    const bridge = nearbyVowel && bridgeVowels.includes(nearbyVowel) ? nearbyVowel : "a";
    result = first + bridge + second;
  }

  // Rule 2: Same letter doubled at junction → remove one
  if (lastChar === firstChar) {
    result = first + second.slice(1);
  }

  // Rule 3: Strip trailing hyphens or special chars from the result
  result = result.replace(/-+$/, "").replace(/^-+/, "");

  // Rule 4: Handle internal hyphens (from names like "Min-ho") — keep at most one
  // but collapse doubled hyphens
  result = result.replace(/--+/g, "-");

  return result;
}

/**
 * Capitalize the first letter, lowercase the rest, preserving internal
 * hyphens and capitalizing after them.
 */
function formatName(raw: string): string {
  if (raw.length === 0) return raw;
  return raw
    .split("-")
    .map((part) => {
      if (part.length === 0) return part;
      return part[0].toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("-");
}

// ─── Core Fusion ─────────────────────────────────────────────────────────

/**
 * Fuse two source names into a new blended name.
 * Takes the first portion of nameA and the second portion of nameB.
 */
function fuseNames(nameA: string, nameB: string): string {
  // Clean hyphens for splitting purposes but track them
  const cleanA = nameA.replace(/-/g, "");
  const cleanB = nameB.replace(/-/g, "");

  const splitA = pickSplitPoint(cleanA);
  const splitB = pickSplitPoint(cleanB);

  const firstHalf = cleanA.slice(0, splitA);
  const secondHalf = cleanB.slice(splitB);

  const joined = smoothJoin(firstHalf, secondHalf);
  const formatted = formatName(joined);

  // Sanity: name must be at least 3 chars
  if (formatted.length < 3) {
    return formatName(cleanA.slice(0, 3) + cleanB.slice(-3));
  }

  // Sanity: name shouldn't be too long
  if (formatted.length > 14) {
    return formatName(joined.slice(0, 12));
  }

  return formatted;
}

// ─── Public API ──────────────────────────────────────────────────────────

function getGenderPool(category: FusionCategory, sex: string): NamePair[] {
  switch (sex) {
    case "male":
      return category.male;
    case "female":
      return category.female;
    default:
      return category.neutral;
  }
}

/**
 * Pick a random element from an array.
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}


/**
 * Generate a single fused name from a random category and pair.
 * Can optionally cross-fuse: take nameA from one pair and nameB from another.
 */
function generateOne(sex: string): string {
  const category = pickRandom(ALL_CATEGORIES);
  const pool = getGenderPool(category, sex);

  if (pool.length < 2) {
    // Edge case: if pool is somehow tiny, just fuse the only pair
    const pair = pool[0];
    return fuseNames(pair.a, pair.b);
  }

  // 60% chance: fuse within a single pair (a→b)
  // 25% chance: cross-fuse (pairX.a + pairY.b from same category)
  // 15% chance: reverse fuse (b→a for different sound profile)
  const roll = Math.random();

  if (roll < 0.60) {
    const pair = pickRandom(pool);
    return fuseNames(pair.a, pair.b);
  } else if (roll < 0.85) {
    const pairX = pickRandom(pool);
    const pairY = pickRandom(pool.filter((p) => p !== pairX));
    return fuseNames(pairX.a, pairY.b);
  } else {
    const pair = pickRandom(pool);
    return fuseNames(pair.b, pair.a);
  }
}

/**
 * Suggest character names appropriate for the given sex.
 *
 * @param sex - "male", "female", "non-binary", or "none"
 * @param count - Number of names to suggest (default 5)
 * @param exclude - Names to exclude (existing character names, etc.)
 * @returns Array of unique suggested names
 */
export function suggestNames(
  sex: string,
  count = 5,
  exclude: string[] = [],
): string[] {
  // Map non-binary and none to the neutral pool
  const mappedSex = sex === "non-binary" || sex === "none" ? "neutral" : sex;

  const excludeSet = new Set([
    ...Array.from(KNOWN_NAMES),
    ...exclude.map((n) => n.toLowerCase()),
  ]);

  const results: string[] = [];
  let attempts = 0;
  const maxAttempts = count * 20; // Safety valve

  while (results.length < count && attempts < maxAttempts) {
    attempts++;
    const name = generateOne(mappedSex);
    const lowerName = name.toLowerCase();

    // Check uniqueness and exclusion
    if (
      !excludeSet.has(lowerName) &&
      !results.some((r) => r.toLowerCase() === lowerName)
    ) {
      results.push(name);
      excludeSet.add(lowerName); // Prevent duplicates within this batch
    }
  }

  return results;
}

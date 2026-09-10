/**
 * Character Name Generator for Kynnys TTRPG
 *
 * Generates culturally-fused names by combining source names from different
 * cultural traditions. Names in Kynnys are strongly rooted in real-world
 * cultural fusions — Finnish-Latin, Germanic-Indian, Italo-Korean,
 * Anglo-Slavic, and French-African blends.
 *
 * The algorithm picks source names from distinct cultural traditions and
 * fuses them at syllable boundaries, applying phonetic smoothing and
 * diversity heuristics to produce fresh, natural-sounding results.
 */

// ─── Types ───────────────────────────────────────────────────────────────

export interface CulturePool {
  cultureA: string[];
  cultureB: string[];
}

export interface FusionCategory {
  id: string;
  label: string;
  male: CulturePool;
  female: CulturePool;
  neutral: CulturePool;
}

// ─── Source Name Corpus ──────────────────────────────────────────────────
// Each category holds extensive pools for Culture A and Culture B.
// Any name from Culture A can fuse with any name from Culture B (and vice versa),
// creating thousands of distinct combinatorial pairings per category.

export const FINNISH_LATIN: FusionCategory = {
  id: "finnish-latin",
  label: "Suomalais-Latinalaiset fuusiot",
  male: {
    cultureA: [
      "Pekka",
      "Ville",
      "Seppo",
      "Antti",
      "Juho",
      "Heikki",
      "Mikko",
      "Eerik",
      "Väinö",
      "Toivo",
      "Ilmari",
      "Kalevi",
      "Olavi",
      "Tapio",
      "Eino",
      "Lauri",
      "Onni",
      "Arvo",
      "Sampo",
      "Jari",
      "Kari",
      "Matti",
      "Jukka",
      "Kalle",
      "Oskari",
      "Matias",
      "Valtteri",
      "Akseli",
      "Viljami",
      "Rasmus",
      "Kaarlo",
      "Armas",
      "Urho",
      "Voitto",
      "Tauno",
      "Jorma",
      "Pentti",
      "Reino",
      "Vilho",
      "Martti",
      "Otso",
      "Ukko",
      "Pyry",
      "Aapo",
      "Sulo",
      "Aimo",
      "Jouko",
      "Asko",
      "Keijo",
      "Ensio",
      "Paavo",
      "Terho",
      "Tarmo",
      "Veli",
      "Ilpo",
      "Yrjö",
      "Ahti",
      "Tapani",
      "Mauri",
      "Samuli",
      "Nuutti",
      "Teemu",
      "Santeri",
      "Elias",
      "Alvar",
      "Nestori",
      "Severi",
    ],
    cultureB: [
      "Pablo",
      "Rodrigo",
      "Hipólito",
      "Manuelito",
      "Javier",
      "Federico",
      "Marcello",
      "Alejandro",
      "Ernesto",
      "Santiago",
      "Gonzalo",
      "Renaldo",
      "Bernardo",
      "Celestino",
      "Augusto",
      "Patricio",
      "Leandro",
      "Mateo",
      "Diego",
      "Carlos",
      "Miguel",
      "Rafael",
      "Fernando",
      "Ignacio",
      "Joaquín",
      "Álvaro",
      "Emilio",
      "Darío",
      "Lorenzo",
      "Salvador",
      "Gabriel",
      "Andrés",
      "Esteban",
      "Marco",
      "Dante",
      "Silvio",
      "Antonio",
      "Orlando",
      "Gustavo",
      "Felipe",
      "Arturo",
      "Bruno",
      "César",
      "Hugo",
      "Lucas",
      "Mario",
      "Néstor",
      "Sergio",
      "Tomás",
      "Vicente",
      "Ramón",
      "Alberto",
      "Enrique",
      "Vasco",
      "Tiago",
      "Raúl",
      "Félix",
      "Damián",
      "Héctor",
      "Alonzo",
      "Valerio",
    ],
  },
  female: {
    cultureA: [
      "Mirja",
      "Kaisa",
      "Niina",
      "Maija",
      "Sanna",
      "Tiina",
      "Raija",
      "Anne",
      "Aino",
      "Helmi",
      "Siiri",
      "Tyyne",
      "Lempi",
      "Vieno",
      "Elina",
      "Päivi",
      "Tuula",
      "Anja",
      "Ritva",
      "Marja",
      "Sirpa",
      "Leena",
      "Pirjo",
      "Seija",
      "Tarja",
      "Eeva",
      "Sari",
      "Minna",
      "Johanna",
      "Laura",
      "Saara",
      "Emmi",
      "Venla",
      "Sofia",
      "Iida",
      "Ella",
      "Veera",
      "Minea",
      "Ronja",
      "Linnea",
      "Hilma",
      "Rauha",
      "Suvi",
      "Kerttu",
      "Lahja",
      "Tytti",
      "Kielo",
      "Aura",
      "Pinja",
      "Mielikki",
      "Tellervo",
      "Tuomi",
      "Kanerva",
      "Pihla",
      "Hilla",
      "Sointu",
      "Valma",
      "Ilona",
      "Terttu",
      "Sinikka",
    ],
    cultureB: [
      "Marisol",
      "Isabella",
      "Lolita",
      "Inez",
      "Mariluz",
      "Rita",
      "Anita",
      "Alicia",
      "Catalina",
      "Esperanza",
      "Valentina",
      "Rosalinda",
      "Consuelo",
      "Maribel",
      "Graciela",
      "Luciana",
      "Florencia",
      "Camila",
      "Elena",
      "Beatriz",
      "Mariana",
      "Paloma",
      "Carmen",
      "Lucia",
      "Teresa",
      "Dolores",
      "Mercedes",
      "Raquel",
      "Estela",
      "Aurora",
      "Celia",
      "Natalia",
      "Clara",
      "Claudia",
      "Renata",
      "Ximena",
      "Jimena",
      "Adriana",
      "Daniela",
      "Valeria",
      "Veronica",
      "Liliana",
      "Yolanda",
      "Isabel",
      "Gabriela",
      "Silvia",
      "Patricia",
      "Blanca",
      "Estrella",
      "Rocío",
      "Soledad",
      "Mireia",
      "Nuria",
      "Leonor",
      "Carlota",
    ],
  },
  neutral: {
    cultureA: [
      "Aarni",
      "Tuuli",
      "Halti",
      "Mari",
      "Soli",
      "Inari",
      "Talvi",
      "Lumi",
      "Ilma",
      "Pyry",
      "Meri",
      "Touko",
      "Syksy",
      "Valo",
      "Kuura",
      "Havu",
      "Tuisku",
      "Otava",
      "Kaste",
      "Usva",
      "Ruska",
      "Paju",
      "Kaisla",
      "Puro",
      "Elo",
      "Sade",
      "Tyrsky",
      "Kaarna",
      "Nietos",
      "Louhi",
      "Pälvi",
      "Sula",
      "Ahti",
      "Halla",
      "Huurre",
      "Routa",
      "Tiera",
      "Vanamo",
    ],
    cultureB: [
      "Ariel",
      "Cielo",
      "Rio",
      "Sol",
      "Cruz",
      "Abril",
      "Paz",
      "Lucero",
      "Relámpago",
      "Alba",
      "Mar",
      "Angel",
      "Reyes",
      "Rosario",
      "Guadalupe",
      "Indigo",
      "Santos",
      "Palma",
      "Brisa",
      "Viento",
      "Fuego",
      "Oasis",
      "Sierra",
      "Lirio",
      "Coral",
      "Prado",
      "Camino",
      "Luna",
      "Niebla",
      "Monte",
      "Valle",
      "Azul",
      "Selva",
      "Roca",
    ],
  },
};

export const GERMANIC_INDIAN: FusionCategory = {
  id: "germanic-indian",
  label: "Germaanis-Intialaiset rakenteet",
  male: {
    cultureA: [
      "Kurt",
      "Wolfgang",
      "Hans",
      "Karl",
      "Otto",
      "Dieter",
      "Rolf",
      "Günther",
      "Werner",
      "Fritz",
      "Ludwig",
      "Heinrich",
      "Helmut",
      "Siegfried",
      "Albrecht",
      "Konrad",
      "Friedrich",
      "Ernst",
      "Steffen",
      "Ulf",
      "Ulrich",
      "Bruno",
      "Claus",
      "Dirk",
      "Erich",
      "Felix",
      "Gerald",
      "Horst",
      "Ingmar",
      "Jürgen",
      "Klaus",
      "Manfred",
      "Norbert",
      "Rainer",
      "Torsten",
      "Volker",
      "Waldemar",
      "Axel",
      "Björn",
      "Einar",
      "Gunnar",
      "Halvar",
      "Lars",
      "Magnus",
      "Nils",
      "Olaf",
      "Ragnar",
      "Sigurd",
      "Sven",
      "Torbjörn",
      "Vidar",
      "Leif",
      "Stig",
      "Soren",
      "Roar",
      "Hermann",
      "Gottfried",
    ],
    cultureB: [
      "Ashish",
      "Vikram",
      "Arjun",
      "Akshay",
      "Pal",
      "Rajesh",
      "Sanjay",
      "Pradeep",
      "Mahesh",
      "Rajan",
      "Suresh",
      "Dinesh",
      "Ganesh",
      "Naveen",
      "Ramesh",
      "Ajay",
      "Amit",
      "Anand",
      "Deepak",
      "Dev",
      "Harish",
      "Jitendra",
      "Kapil",
      "Manoj",
      "Mohan",
      "Nikhil",
      "Pankaj",
      "Rahul",
      "Ravi",
      "Sachin",
      "Sunil",
      "Vijay",
      "Vivek",
      "Aditya",
      "Rohan",
      "Siddharth",
      "Tarun",
      "Varun",
      "Alok",
      "Bharat",
      "Chetan",
      "Gaurav",
      "Hemant",
      "Jagdish",
      "Kavi",
      "Madhav",
      "Pranav",
      "Roshan",
      "Sandeep",
      "Tushar",
      "Yash",
      "Kiran",
      "Samir",
      "Brijesh",
    ],
  },
  female: {
    cultureA: [
      "Anika",
      "Greta",
      "Brigitte",
      "Helga",
      "Anna",
      "Mina",
      "Hilde",
      "Ingrid",
      "Liesel",
      "Gertrude",
      "Frieda",
      "Ursula",
      "Hannelore",
      "Else",
      "Elke",
      "Gisela",
      "Astrid",
      "Brunhild",
      "Dagmar",
      "Freja",
      "Gerda",
      "Heidrun",
      "Ilse",
      "Karin",
      "Klara",
      "Lotte",
      "Mathilda",
      "Sigrid",
      "Sonja",
      "Therese",
      "Waltraud",
      "Erika",
      "Britta",
      "Solveig",
      "Gunhild",
      "Kristin",
      "Marta",
      "Signe",
      "Thyra",
      "Ulrike",
      "Renate",
      "Adelheid",
      "Marlene",
      "Katrin",
      "Heike",
      "Dorothea",
      "Svenja",
      "Birgit",
      "Gudrun",
      "Irmgard",
    ],
    cultureB: [
      "Ishani",
      "Priya",
      "Lakshmi",
      "Devi",
      "Sunita",
      "Kavita",
      "Meera",
      "Ananya",
      "Nalini",
      "Padmini",
      "Savitri",
      "Jyoti",
      "Nandini",
      "Asha",
      "Deepa",
      "Geeta",
      "Indira",
      "Jaya",
      "Kalyani",
      "Maya",
      "Neha",
      "Pooja",
      "Radhika",
      "Shanti",
      "Tanvi",
      "Uma",
      "Vandana",
      "Vidya",
      "Aditi",
      "Chetna",
      "Divya",
      "Gayatri",
      "Ila",
      "Juhi",
      "Kamla",
      "Leela",
      "Malati",
      "Parvati",
      "Rupa",
      "Saroj",
      "Tara",
      "Usha",
      "Vasudha",
      "Yamuna",
      "Ritu",
      "Shilpa",
      "Rekha",
      "Sangeeta",
      "Pallavi",
    ],
  },
  neutral: {
    cultureA: [
      "Anton",
      "Ludvic",
      "Rune",
      "Birk",
      "Storm",
      "Frost",
      "Bente",
      "Jan",
      "Kai",
      "Robin",
      "Kim",
      "Sascha",
      "Toni",
      "Chris",
      "Mika",
      "Malte",
      "Finn",
      "Jona",
      "Eike",
      "Gerd",
      "Wendel",
      "Friso",
      "Dale",
      "Lind",
      "Berit",
      "Eckart",
      "Lenz",
      "Valtin",
    ],
    cultureB: [
      "Krishan",
      "Surya",
      "Indu",
      "Kiran",
      "Raja",
      "Janavi",
      "Hima",
      "Prem",
      "Noor",
      "Chandra",
      "Bodhi",
      "Anand",
      "Milan",
      "Roshan",
      "Deep",
      "Neel",
      "Aman",
      "Shashi",
      "Anmol",
      "Sonu",
      "Suman",
      "Kamal",
      "Daya",
      "Amar",
      "Tejas",
      "Badal",
      "Vasant",
      "Pawan",
      "Mani",
      "Samar",
    ],
  },
};

export const ITALO_KOREAN: FusionCategory = {
  id: "italo-korean",
  label: "Italo-Korealaiset ja Itä-Aasian melodiat",
  male: {
    cultureA: [
      "Giovanni",
      "Matteo",
      "Marco",
      "Paolo",
      "Riccardo",
      "Alessandro",
      "Lorenzo",
      "Salvatore",
      "Vincenzo",
      "Roberto",
      "Emilio",
      "Claudio",
      "Fabrizio",
      "Massimo",
      "Luca",
      "Andrea",
      "Carlo",
      "Davide",
      "Federico",
      "Filippo",
      "Giorgio",
      "Leonardo",
      "Pietro",
      "Stefano",
      "Alberto",
      "Angelo",
      "Bruno",
      "Cesare",
      "Daniele",
      "Edoardo",
      "Franco",
      "Gianni",
      "Mario",
      "Nicola",
      "Raffaele",
      "Tommaso",
      "Vito",
      "Valerio",
      "Flavio",
      "Silvano",
      "Cristiano",
      "Ennio",
      "Rocco",
      "Marcello",
      "Guido",
      "Aldo",
    ],
    cultureB: [
      "Min-ho",
      "Sang-hoon",
      "Ji-seon",
      "Hideki",
      "Doo",
      "Sung-jin",
      "Tae-hyun",
      "Yong-soo",
      "Haru",
      "Daiki",
      "Ji-hoon",
      "Shin",
      "Kazuki",
      "Kenji",
      "Hiroshi",
      "Byung-hun",
      "Dong-hyun",
      "Hyun-woo",
      "Jae-won",
      "Jung-hoon",
      "Kwang-sun",
      "Min-jun",
      "Seung-gi",
      "Woo-jin",
      "Ye-jun",
      "Kenzo",
      "Ryu",
      "Taro",
      "Kaito",
      "Sota",
      "Takumi",
      "Yuto",
      "Kenta",
      "Ren",
      "Daichi",
      "Shota",
      "Naoki",
      "Riku",
      "Hayato",
      "Yamato",
      "Kazuma",
      "Masashi",
      "Taeyang",
      "Jun-seo",
      "Min-kyu",
    ],
  },
  female: {
    cultureA: [
      "Elena",
      "Sofia",
      "Beatrice",
      "Lucia",
      "Francesca",
      "Chiara",
      "Valentina",
      "Giuliana",
      "Isabella",
      "Rosaria",
      "Antonella",
      "Bianca",
      "Serena",
      "Alessandra",
      "Camilla",
      "Donatella",
      "Flavia",
      "Ginevra",
      "Laura",
      "Martina",
      "Paola",
      "Silvia",
      "Vittoria",
      "Caterina",
      "Daniela",
      "Elisabetta",
      "Giorgia",
      "Marta",
      "Patrizia",
      "Simona",
      "Teresa",
      "Viviana",
      "Carina",
      "Loredana",
      "Mirella",
      "Ornella",
      "Gemma",
      "Fiorella",
      "Agata",
      "Costanza",
      "Ilaria",
      "Romina",
    ],
    cultureB: [
      "Hana",
      "Ji-won",
      "Da-hye",
      "Moon",
      "Chae",
      "Yuna",
      "Soo-jin",
      "Mei",
      "Haruki",
      "Ayumi",
      "Nari",
      "Mitsuki",
      "Eun-bi",
      "Sakura",
      "Bo-young",
      "Eun-ji",
      "Hye-jin",
      "Ji-eun",
      "Min-seo",
      "Seo-yeon",
      "Su-bin",
      "Ye-eun",
      "Aoi",
      "Hina",
      "Koharu",
      "Nanami",
      "Riko",
      "Yui",
      "Akari",
      "Mio",
      "Honoka",
      "Misaki",
      "Rin",
      "Kaede",
      "Asuka",
      "Sayuri",
      "Chiyo",
      "Emi",
      "Midori",
      "Ye-jin",
      "So-hee",
      "Ha-eun",
    ],
  },
  neutral: {
    cultureA: [
      "Alessia",
      "Andrea",
      "Fiore",
      "Mattia",
      "Elia",
      "Nico",
      "Celeste",
      "Rosario",
      "Leone",
      "Sole",
      "Mirto",
      "Vanni",
      "Michele",
      "Carmine",
      "Erme",
      "Cosma",
      "Amabile",
      "Felice",
    ],
    cultureB: [
      "Min",
      "Kaos",
      "Shin",
      "Jun",
      "Ren",
      "Tomo",
      "Kai",
      "Sora",
      "Yuki",
      "Rio",
      "Jin",
      "Ha-neul",
      "Ji-woo",
      "Seo-jin",
      "Yu-jin",
      "Yeon",
      "Si-woo",
      "Hyun",
      "Chiaki",
      "Hikaru",
      "Makoto",
      "Nao",
      "Ryo",
      "Shinobu",
      "Yu",
      "Rei",
      "Sen",
      "Haru",
      "Kyo",
      "Aoi",
    ],
  },
};

export const ANGLO_SLAVIC: FusionCategory = {
  id: "anglo-slavic",
  label: "Anglo-Slaavilaiset ja urbaanit synteesit",
  male: {
    cultureA: [
      "Jack",
      "Henry",
      "Arthur",
      "Edward",
      "George",
      "Charles",
      "William",
      "Thomas",
      "Richard",
      "James",
      "Andrew",
      "Oliver",
      "Harry",
      "Samuel",
      "Benjamin",
      "Lucas",
      "Liam",
      "Mason",
      "Ethan",
      "Alexander",
      "Daniel",
      "Joseph",
      "Matthew",
      "David",
      "John",
      "Robert",
      "Colin",
      "Callum",
      "Alistair",
      "Duncan",
      "Kenneth",
      "Ewan",
      "Graham",
      "Rory",
      "Douglas",
      "Angus",
      "Ian",
      "Donald",
      "Craig",
      "Fraser",
      "Keith",
      "Malcolm",
      "Stuart",
      "Neil",
      "Gordon",
      "Ronald",
      "Trevor",
      "Nigel",
      "Gareth",
    ],
    cultureB: [
      "Vladimir",
      "Jaroslav",
      "Ivan",
      "Miroslav",
      "Viktor",
      "Oleg",
      "Yuri",
      "Mikhail",
      "Stanislav",
      "Bogdan",
      "Dmitri",
      "Radoslav",
      "Yaroslav",
      "Aleksei",
      "Borislav",
      "Anton",
      "Boris",
      "Danil",
      "Fedor",
      "Grigory",
      "Ilya",
      "Kirill",
      "Leonid",
      "Maksim",
      "Nikolai",
      "Pavel",
      "Roman",
      "Sergei",
      "Timofei",
      "Vasily",
      "Vladislav",
      "Zakhar",
      "Branislav",
      "Cedomir",
      "Dragan",
      "Goran",
      "Milan",
      "Radomir",
      "Vuk",
      "Zoran",
      "Casimir",
      "Lech",
      "Tomasz",
      "Waclaw",
      "Andrzej",
      "Taras",
    ],
  },
  female: {
    cultureA: [
      "Catherine",
      "Olivia",
      "Elizabeth",
      "Sarah",
      "Emily",
      "Grace",
      "Charlotte",
      "Rose",
      "Sophie",
      "Margaret",
      "Jane",
      "Alice",
      "Emma",
      "Amelia",
      "Isla",
      "Ava",
      "Mia",
      "Jessica",
      "Lily",
      "Eleanor",
      "Evelyn",
      "Hannah",
      "Chloe",
      "Lucy",
      "Victoria",
      "Clara",
      "Beatrice",
      "Flora",
      "Fiona",
      "Morag",
      "Eilidh",
      "Moira",
      "Kirsty",
      "Lorna",
      "Heather",
      "Bridget",
      "Abigail",
      "Penelope",
      "Audrey",
      "Lydia",
      "Hazel",
      "Mabel",
      "Gwendolyn",
      "Rosalind",
    ],
    cultureB: [
      "Anna",
      "Katja",
      "Antonina",
      "Natasha",
      "Annika",
      "Larissa",
      "Svetlana",
      "Irina",
      "Tatiana",
      "Valentina",
      "Yelena",
      "Anastasia",
      "Xenia",
      "Daria",
      "Galina",
      "Ksenia",
      "Ludmila",
      "Marina",
      "Nadezhda",
      "Olga",
      "Polina",
      "Raisa",
      "Snezhana",
      "Vera",
      "Yulia",
      "Zoya",
      "Bojana",
      "Danica",
      "Dragana",
      "Jelena",
      "Milica",
      "Radmila",
      "Vesna",
      "Danuta",
      "Halina",
      "Jadwiga",
      "Stanislawa",
      "Wanda",
      "Zofia",
      "Milena",
      "Lenka",
      "Bozena",
      "Darina",
      "Oksana",
    ],
  },
  neutral: {
    cultureA: [
      "Lynn",
      "Morgan",
      "Quinn",
      "Robin",
      "Riley",
      "Jordan",
      "Alex",
      "Ashley",
      "Blair",
      "Cameron",
      "Dale",
      "Glen",
      "Jamie",
      "Kelly",
      "Kerry",
      "Lee",
      "Leslie",
      "Lindsay",
      "Rowan",
      "Shannon",
      "Sidney",
      "Taylor",
      "Terry",
      "Tracy",
      "Casey",
      "Darcy",
      "Devon",
      "Peyton",
      "Reese",
      "River",
      "Skyler",
      "Winter",
      "Rowley",
      "Harley",
    ],
    cultureB: [
      "Stanislav",
      "Sasha",
      "Mila",
      "Nikolai",
      "Mischa",
      "Danya",
      "Valeri",
      "Alexei",
      "Slava",
      "Dana",
      "Misha",
      "Zhenya",
      "Vanja",
      "Sonja",
      "Tanja",
      "Kolya",
      "Kostya",
      "Pasha",
      "Senya",
      "Tolya",
      "Vova",
      "Fedya",
      "Grisha",
      "Ilya",
      "Leka",
      "Lyova",
      "Roma",
      "Sanya",
      "Seryozha",
      "Yura",
      "Bora",
      "Miran",
      "Vanya",
      "Luka",
    ],
  },
};

export const FRENCH_AFRICAN: FusionCategory = {
  id: "french-african",
  label: "Ranskalais-Afrikkalaiset ja muut fuusiot",
  male: {
    cultureA: [
      "Dieudonné",
      "Blaise",
      "Pierre",
      "Pascal",
      "Laurent",
      "Philippe",
      "François",
      "Gérard",
      "Thierry",
      "Matthieu",
      "Christophe",
      "Julien",
      "Benoît",
      "René",
      "Théodore",
      "Antoine",
      "Baptiste",
      "Clément",
      "Damien",
      "Etienne",
      "Fabien",
      "Gabriel",
      "Henri",
      "Jean",
      "Louis",
      "Maxime",
      "Nicolas",
      "Olivier",
      "Quentin",
      "Romain",
      "Sébastien",
      "Tristan",
      "Vincent",
      "Yves",
      "Adrien",
      "Bastien",
      "Florian",
      "Gaël",
      "Hugo",
      "Léopold",
      "Marius",
      "Noé",
      "Rémi",
      "Sylvain",
      "Xavier",
      "Armand",
      "Gaston",
      "Lucien",
    ],
    cultureB: [
      "Amadou",
      "Babatunde",
      "Bakari",
      "Kofi",
      "Abdou",
      "Moussa",
      "Ousmane",
      "Sekou",
      "Ibrahima",
      "Kwame",
      "Boubacar",
      "Cheick",
      "Abdoulaye",
      "Mamadou",
      "Tidiane",
      "Adebayo",
      "Chidi",
      "Dapo",
      "Emeka",
      "Faraji",
      "Femi",
      "Jengo",
      "Kojo",
      "Malik",
      "Obinna",
      "Olumide",
      "Sefu",
      "Tunde",
      "Zuberi",
      "Diallo",
      "Fousseyni",
      "Harouna",
      "Lamine",
      "Modibo",
      "Souleymane",
      "Yacouba",
      "Tendai",
      "Tafari",
      "Simba",
      "Juma",
      "Kenan",
      "Baraka",
      "Zikomo",
      "Badu",
      "Kwesi",
      "Nuru",
    ],
  },
  female: {
    cultureA: [
      "Lucette",
      "Yvonne",
      "Colette",
      "Amélie",
      "Simone",
      "Brigitte",
      "Marguerite",
      "Josette",
      "Hélène",
      "Cécile",
      "Solange",
      "Elodie",
      "Lucine",
      "Sandrine",
      "Camille",
      "Delphine",
      "Estelle",
      "Françoise",
      "Geneviève",
      "Isabelle",
      "Juliette",
      "Laurence",
      "Madeleine",
      "Nathalie",
      "Odette",
      "Pauline",
      "Renée",
      "Sylvie",
      "Thérèse",
      "Valérie",
      "Adrienne",
      "Blanche",
      "Chantal",
      "Denise",
      "Félicité",
      "Gisèle",
      "Hortense",
      "Inès",
      "Julienne",
      "Léonie",
      "Manon",
      "Solène",
      "Mireille",
    ],
    cultureB: [
      "Adara",
      "Amina",
      "Akina",
      "Fatou",
      "Aissatou",
      "Ndeye",
      "Aminata",
      "Djeneba",
      "Kadiatou",
      "Mariama",
      "Fatoumata",
      "Bintou",
      "Abena",
      "Chioma",
      "Folami",
      "Habiba",
      "Ife",
      "Jamila",
      "Nia",
      "Olufunke",
      "Sade",
      "Zola",
      "Zouhir",
      "Awa",
      "Coumba",
      "Fanta",
      "Hawa",
      "Mariam",
      "Oumou",
      "Rokiatou",
      "Seynabou",
      "Safiatou",
      "Tendai",
      "Zuri",
      "Asha",
      "Subira",
      "Malaika",
      "Pendo",
      "Neema",
      "Bolanle",
      "Esi",
      "Makena",
    ],
  },
  neutral: {
    cultureA: [
      "Claire",
      "Renault",
      "Sandrine",
      "Eustace",
      "Marc",
      "Claude",
      "Dominique",
      "Camille",
      "Marin",
      "Florian",
      "Alexis",
      "Ange",
      "Lou",
      "Maxime",
      "Noa",
      "Sasha",
      "Stephane",
      "Alix",
      "Celeste",
      "Charlie",
      "Eden",
      "Loïc",
      "Morgan",
      "Patrice",
      "Valéry",
      "Yannick",
      "Gabin",
      "Sido",
    ],
    cultureB: [
      "Simba",
      "Akina",
      "Zane",
      "Indira",
      "Yara",
      "Nael",
      "Djibril",
      "Samba",
      "Amari",
      "Kenza",
      "Fadel",
      "Aziz",
      "Issa",
      "Ayo",
      "Chike",
      "Dali",
      "Imani",
      "Jojo",
      "Kani",
      "Leke",
      "Maki",
      "Nalo",
      "Olani",
      "Sadi",
      "Tayo",
      "Zaki",
      "Zuri",
      "Enam",
      "Dumi",
      "Kazi",
      "Remi",
      "Sanyu",
      "Shani",
    ],
  },
};

export const ALL_CATEGORIES: FusionCategory[] = [
  FINNISH_LATIN,
  GERMANIC_INDIAN,
  ITALO_KOREAN,
  ANGLO_SLAVIC,
  FRENCH_AFRICAN,
];

// ─── Known & Source Names (never suggest these directly) ──────────────────

const KNOWN_NAMES = new Set([
  // Finnish-Latin examples
  "Pekablo",
  "Marisorja",
  "Aarniel",
  "Villergo",
  "Kaisabell",
  "Tuuligo",
  "Sepolito",
  "Niolita",
  "Ranicco",
  "Manuenti",
  "Maijinez",
  "Haltiago",
  "Ju'ovier",
  "Sannluz",
  "Marimar",
  "Heico",
  "Tiirita",
  "Solisari",
  "Mikelllo",
  "Raijita",
  "Inariano",
  "Eerikuez",
  "Annelicia",
  "Talvigo",
  // Germanic-Indian examples
  "Kurtish",
  "Anishani",
  "Krishans",
  "Wolfvick",
  "Gretapriya",
  "Arjulf",
  "Hansarjun",
  "Brijitgan",
  "Suryatton",
  "Karlashish",
  "Helgaviram",
  "Induvic",
  "Ottoshay",
  "Annalakshi",
  "Kiranulf",
  "Rajulf",
  "Minadevi",
  "Janavich",
  "Deepakarl",
  "Ulvishni",
  "Nilsson",
  "Dieterpal",
  "Himalga",
  "Vickar",
  // Italo-Korean examples
  "Giovanho",
  "Lucahana",
  "Alessin",
  "Mattesun",
  "Eleniwon",
  "Mikaos",
  "Marcoseon",
  "Sofidahye",
  "Junio",
  "Beatrim-ho",
  "Luciamoon",
  "Hikary",
  "Paolohide",
  "Franceskae",
  "Soranzo",
  "Kenjarth",
  "Yukinico",
  "Riomin",
  "Hirodavid",
  "Sakuremy",
  "Kimio",
  "Riccardoo",
  "Naminon",
  "Yushin",
  // Anglo-Slavic examples
  "Jackimir",
  "Willianna",
  "Stanlynn",
  "Borissav",
  "Katyerin",
  "Sashamuel",
  "Henrivan",
  "Oliviaris",
  "Milaura",
  "Arthuroslav",
  "Elizabohdan",
  "Yurijane",
  "Viktorian",
  "Sarahnina",
  "Nikolace",
  "Olegary",
  "Natashaly",
  "Valery",
  "Yurijack",
  "Annikaov",
  "Mischael",
  "Mikhailis",
  "Larison",
  "Danyas",
  // French-African examples
  "Amadieu",
  "Jeandara",
  "Clarimba",
  "Thébault",
  "Malicette",
  "Akinault",
  "Bakarise",
  "Lucina",
  "Zandrine",
  "Kofier",
  "Marivonne",
  "Indirace",
  "Pascalou",
  "Elokina",
  "Yaramar",
]);

const SOURCE_NAMES_SET = new Set<string>();
for (const cat of ALL_CATEGORIES) {
  for (const pool of [cat.male, cat.female, cat.neutral]) {
    for (const name of [...pool.cultureA, ...pool.cultureB]) {
      SOURCE_NAMES_SET.add(name.toLowerCase());
    }
  }
}

// ─── Phonetic Utilities ──────────────────────────────────────────────────

const VOWELS = new Set("aeiouyäöåáéíóúàèùâêîôûëïü".split(""));

function isVowel(ch: string): boolean {
  return VOWELS.has(ch.toLowerCase());
}

function isConsonant(ch: string): boolean {
  return /[a-zäöåßñçðþ]/i.test(ch) && !isVowel(ch);
}

function stripAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Find syllable boundary indices in a name.
 * Uses a heuristic identifying CV transitions, CCV consonant clusters,
 * and vowel hiatus transitions.
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
    else if (
      isConsonant(prev) &&
      isConsonant(curr) &&
      i + 1 < name.length &&
      isVowel(name[i + 1])
    ) {
      boundaries.push(i);
    }
    // Boundary between distinct vowels (hiatus, e.g. "io", "ea", "eo")
    else if (isVowel(prev) && isVowel(curr) && prev.toLowerCase() !== curr.toLowerCase()) {
      boundaries.push(i);
    }
  }
  return boundaries;
}

/**
 * Pick a split point in a name, favoring syllable boundaries with random
 * variance to avoid repetitive cut points.
 * Returns an index that splits the name into [0..idx) and [idx..end].
 */
function pickSplitPoint(name: string, isPrefix: boolean): number {
  const boundaries = findSyllableBoundaries(name);
  const minSplit = isPrefix
    ? Math.max(2, Math.floor(name.length * 0.25))
    : Math.max(2, Math.floor(name.length * 0.3));
  const maxSplit = isPrefix
    ? Math.min(name.length - 2, Math.ceil(name.length * 0.75))
    : Math.min(name.length - 2, Math.ceil(name.length * 0.8));

  // Filter boundaries to reasonable range
  const validBoundaries = boundaries.filter((b) => b >= minSplit && b <= maxSplit);

  // 75% chance: pick an identified syllable boundary if available
  // 25% chance: pick a dynamic point within the valid range for phoneme variety
  if (validBoundaries.length > 0 && Math.random() < 0.75) {
    return validBoundaries[Math.floor(Math.random() * validBoundaries.length)];
  }

  // Fallback: pick a random point in the valid range
  if (maxSplit >= minSplit) {
    return minSplit + Math.floor(Math.random() * (maxSplit - minSplit + 1));
  }
  return Math.floor(name.length / 2);
}

/**
 * Apply phonetic smoothing at the join point between two name halves.
 * Prevents awkward consonant clusters, collapses identical letters/accents,
 * and handles vowel hiatus collisions.
 */
function smoothJoin(first: string, second: string): string {
  if (first.length === 0 || second.length === 0) return first + second;

  const lastChar = first[first.length - 1].toLowerCase();
  const firstChar = second[0].toLowerCase();
  const baseLast = stripAccents(lastChar);
  const baseFirst = stripAccents(firstChar);

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
    const bridgeVowels = ["a", "i", "e", "o"];
    const nearbyVowel = [...first]
      .reverse()
      .find((c) => isVowel(c))
      ?.toLowerCase();
    const bridge = nearbyVowel && bridgeVowels.includes(nearbyVowel) ? nearbyVowel : "a";
    result = first + bridge + second;
  }

  // Rule 2: Same base letter or accent variants doubled at junction → remove one
  else if (baseLast === baseFirst) {
    result = first + second.slice(1);
  }

  // Rule 3: Awkward vowel collision (e.g. first ends in two vowels before joining another)
  else if (isVowel(lastChar) && isVowel(firstChar)) {
    if (first.length >= 3 && isVowel(first[first.length - 2])) {
      result = first.slice(0, -1) + second;
    }
  }

  // Rule 4: Strip trailing or leading hyphens
  result = result.replace(/-+$/, "").replace(/^-+/, "");

  // Rule 5: Handle internal hyphens — collapse doubled hyphens
  result = result.replace(/--+/g, "-");

  // Rule 6: Normalize cedillas at fusion seam
  result = result.replace(/ç/g, "s").replace(/Ç/g, "S");

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

function isValidName(name: string): boolean {
  if (name.length < 4 || name.length > 14) return false;
  // Must contain at least one vowel
  if (!/[aeiouyäöåáéíóúàèùâêîôûëïü]/i.test(name)) return false;
  // No triple identical characters
  if (/(.)\1\1/i.test(name)) return false;
  // No awkward 3-consonant onset unless common blend (str, spr, chr, sch)
  if (/^[bcdfghjklmnpqrstvwxz]{3,}/i.test(name) && !/^(str|spr|chr|sch|thr)/i.test(name)) {
    return false;
  }
  // No awkward initial consonant pairs like Jn, Qn, Wn, Vb
  if (/^[jqwx][bcdfghjklmnpqrstvwxz]/i.test(name)) return false;
  return true;
}

// ─── Core Fusion ─────────────────────────────────────────────────────────

/**
 * Fuse two source names into a new blended name.
 * Takes the first portion of nameA and the second portion of nameB.
 */
function fuseNames(nameA: string, nameB: string): string {
  const cleanA = nameA.replace(/-/g, "");
  const cleanB = nameB.replace(/-/g, "");

  const splitA = pickSplitPoint(cleanA, true);
  const splitB = pickSplitPoint(cleanB, false);

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

function getGenderPool(category: FusionCategory, sex: string): CulturePool {
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
 * Generate a single fused name from cultural seed pools.
 * Decoupled: dynamically chooses seeds from Culture A and Culture B,
 * supporting forward, reverse, and occasional cross-category cosmopolitan fusions.
 */
function generateOne(sex: string): string {
  const roll = Math.random();

  // 15% chance: Cross-category cosmopolitan fusion
  if (roll < 0.15 && ALL_CATEGORIES.length > 1) {
    const cat1 = pickRandom(ALL_CATEGORIES);
    const cat2 = pickRandom(ALL_CATEGORIES.filter((c) => c !== cat1));
    const pool1 = getGenderPool(cat1, sex);
    const pool2 = getGenderPool(cat2, sex);

    const nameA = Math.random() < 0.5 ? pickRandom(pool1.cultureA) : pickRandom(pool1.cultureB);
    const nameB = Math.random() < 0.5 ? pickRandom(pool2.cultureA) : pickRandom(pool2.cultureB);

    return Math.random() < 0.5 ? fuseNames(nameA, nameB) : fuseNames(nameB, nameA);
  }

  // 85% chance: Within-category fusion (55% forward A->B, 45% reverse B->A)
  const category = pickRandom(ALL_CATEGORIES);
  const pool = getGenderPool(category, sex);

  const nameA = pickRandom(pool.cultureA);
  const nameB = pickRandom(pool.cultureB);

  // 55% forward (A -> B), 45% reverse (B -> A)
  if (Math.random() < 0.55) {
    return fuseNames(nameA, nameB);
  }
  return fuseNames(nameB, nameA);
}

/**
 * Suggest character names appropriate for the given sex.
 *
 * @param sex - "male", "female", "non-binary", or "none"
 * @param count - Number of names to suggest (default 5)
 * @param exclude - Names to exclude (existing character names, etc.)
 * @returns Array of unique suggested names with intra-batch phonetic diversity
 */
export function suggestNames(sex: string, count = 5, exclude: string[] = []): string[] {
  // Map non-binary and none to the neutral pool
  const mappedSex = sex === "non-binary" || sex === "none" ? "neutral" : sex;

  const excludeSet = new Set([
    ...Array.from(KNOWN_NAMES, (n) => n.toLowerCase()),
    ...Array.from(SOURCE_NAMES_SET),
    ...exclude.map((n) => n.toLowerCase()),
  ]);

  const results: string[] = [];
  const usedPrefixes = new Set<string>();
  const usedSuffixes = new Set<string>();
  let attempts = 0;
  const maxAttempts = count * 40; // Safety valve

  while (results.length < count && attempts < maxAttempts) {
    attempts++;
    const name = generateOne(mappedSex);
    const lowerName = name.toLowerCase();

    // Validate phonetic sanity
    if (!isValidName(name)) {
      continue;
    }

    // Check uniqueness and exclusion
    if (excludeSet.has(lowerName) || results.some((r) => r.toLowerCase() === lowerName)) {
      continue;
    }

    // Intra-batch diversity heuristic:
    // Avoid multiple names sharing the same 3-character prefix or suffix
    // in the same suggestion batch so results feel varied rather than samey.
    if (lowerName.length >= 4 && attempts < maxAttempts * 0.75) {
      const prefix = lowerName.slice(0, 3);
      const suffix = lowerName.slice(-3);
      if (usedPrefixes.has(prefix) || usedSuffixes.has(suffix)) {
        continue;
      }
      usedPrefixes.add(prefix);
      usedSuffixes.add(suffix);
    }

    results.push(name);
    excludeSet.add(lowerName); // Prevent duplicates within this batch
  }

  return results;
}

/**
 * Returns corpus metrics for testing and verification.
 */
export function getSeedCorpusStats(): {
  totalSeeds: number;
  categoryCount: number;
  uniqueSeedsCount: number;
} {
  const allSeeds: string[] = [];
  for (const cat of ALL_CATEGORIES) {
    for (const pool of [cat.male, cat.female, cat.neutral]) {
      allSeeds.push(...pool.cultureA, ...pool.cultureB);
    }
  }
  const unique = new Set(allSeeds.map((s) => s.toLowerCase()));
  return {
    totalSeeds: allSeeds.length,
    categoryCount: ALL_CATEGORIES.length,
    uniqueSeedsCount: unique.size,
  };
}

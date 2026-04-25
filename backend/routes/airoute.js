import express from "express";
import Product from "../models/productModel.js";

const router = express.Router();
const sessions = new Map();

const SYNONYMS = {
  // Multi-word first (longest match wins)
  "air conditioner": "ac",
  "washing machine": "washing machine",
  "make-up kit": "makeup",
  "makeup kit": "makeup",
  "beauty kit": "makeup",
  "make up": "makeup",
  "face cream": "face cream",
  "face wash": "face wash",
  "smart tv": "tv",
  "led tv": "tv",
  // Single-word
  smartphone: "mobile",
  refrigerator: "fridge",
  television: "tv",
  cosmetics: "makeup",
  lipstick: "makeup",
  eyeliner: "makeup",
  iphone: "mobile",
  washer: "washing machine",
  trouser: "pant",
  sneakers: "shoes",
  phone: "mobile",
  jeans: "pant",
  moisturizer: "moisturizer",
  skincare: "skincare",
  sunscreen: "sunscreen",
  foundation: "makeup",
  mascara: "makeup",
  blush: "makeup",
  primer: "makeup",
};

const AMBIGUOUS_KEYWORDS = {
  apple: {
    question:
      "మీరు **Apple iPhone** కోసం వెతుకుతున్నారా లేక **Apple MacBook** కోసమా?",
    options: ["iPhone", "MacBook"],
    resolutions: { iphone: "mobile", macbook: "laptop" },
  },
  samsung: {
    question:
      "మీరు **Samsung Mobile** కోసం వెతుకుతున్నారా లేక **Samsung TV** కోసమా?",
    options: ["Mobile", "TV"],
    resolutions: { mobile: "mobile", tv: "tv" },
  },
};

const CATEGORY_MAP = {
  tv: {
    name: "TV",

    titlePatterns: [
      /\btv\b/i,
      /\btelevision\b/i,
      /\bled\s*tv\b/i,
      /\bsmart\s*tv\b/i,
      /\bqled\b/i,
      /\boled\b/i,
    ],
    keys: [/\btv\b/i, /\btelevision\b/i, /\bled tv\b/i, /\bsmart tv\b/i],
    aliases: ["tv", "television", "led tv", "smart tv"],
  },

  washing_machine: {
    name: "Washing Machine",
    titlePatterns: [/\bwashing\b/i, /\bwasher\b/i],
    keys: [/\bwashing machine\b/i, /\bwasher\b/i, /\bwashing\b/i],
    aliases: ["washing machine", "washer", "washing"],
  },

  fridge: {
    name: "Refrigerator",
    titlePatterns: [/\bfridge\b/i, /\brefrigerator\b/i],
    keys: [/\bfridge\b/i, /\brefrigerator\b/i],
    aliases: ["fridge", "refrigerator"],
  },

  ac: {
    name: "AC",
    titlePatterns: [/\bac\b/i, /\bair\s*conditioner\b/i],
    keys: [/\bac\b/i, /\bair conditioner\b/i],
    aliases: ["ac", "air conditioner"],
  },

  mobile: {
    name: "Mobile",

    titlePatterns: [
      /\bmobile\b/i,
      /\bphone\b/i,
      /\bsmartphone\b/i,
      /\biphone\b/i,
    ],
    keys: [/\bmobile\b/i, /\bphone\b/i, /\bsmartphone\b/i],
    aliases: ["mobile", "phone", "smartphone"],
  },

  fan: {
    name: "Fan",
    titlePatterns: [/\bfan\b/i],
    keys: [/\bfan\b/i, /\bceiling fan\b/i, /\btable fan\b/i],
    aliases: ["fan", "ceiling fan", "table fan"],
  },

  laptop: {
    name: "Laptop",
    titlePatterns: [/\blaptop\b/i, /\bmacbook\b/i, /\bnotebook\b/i],
    keys: [/\blaptop\b/i, /\bmacbook\b/i, /\bnotebook\b/i],
    aliases: ["laptop", "macbook", "notebook"],
  },

  headphones: {
    name: "Headphones",
    titlePatterns: [
      /\bheadphones?\b/i,
      /\bearbuds?\b/i,
      /\bearphones?\b/i,
      /\bairpods?\b/i,
    ],
    keys: [
      /\bheadphones?\b/i,
      /\bearbuds?\b/i,
      /\bearphones?\b/i,
      /\bairpods?\b/i,
    ],
    aliases: ["headphones", "earbuds", "earphones", "airpods"],
  },

  watch: {
    name: "Watch",
    titlePatterns: [/\bwatch\b/i, /\bsmartwatch\b/i],
    keys: [/\bwatch\b/i, /\bsmartwatch\b/i, /\bwrist watch\b/i],
    aliases: ["watch", "smartwatch"],
  },

  makeup: {
    name: "Makeup",

    titlePatterns: [
      /\bmakeup\b/i,
      /\bbeauty\b/i,
      /\bcosmetics?\b/i,
      /\blipstick\b/i,
      /\beyeliner\b/i,
      /\bfoundation\b/i,
      /\bmamaearth\b/i, // brand name — all Mamaearth products are beauty
      /\bmoisturizer\b/i,
      /\bface\s*cream\b/i,
      /\bface\s*wash\b/i,
      /\bserum\b/i,
      /\btoner\b/i,
      /\bsunscreen\b/i,
      /\bskincare\b/i,
      /\bvitamin\s*c\b/i, // "Vitamin C Face Cream"
      /\brhiss\b/i, // "Rhiss Beauty Faves Kit"
      /\bprime[r]?\b/i,
      /\bmascara\b/i,
      /\bblush\b/i,
    ],
    keys: [
      /\bmakeup\b/i,
      /\bmake up\b/i,
      /\bcosmetics?\b/i,
      /\blipstick\b/i,
      /\beyeliner\b/i,
      /\bbeauty\b/i,
      /\bmoisturizer\b/i,
      /\bface\s*cream\b/i,
      /\bface\s*wash\b/i,
      /\bskincare\b/i,
      /\bserum\b/i,
      /\bsunscreen\b/i,
      /\bmamaearth\b/i,
      /\bfoundation\b/i,
      /\bprimer\b/i,
      /\bmascara\b/i,
    ],
    aliases: [
      "makeup",
      "make up",
      "cosmetics",
      "beauty kit",
      "makeup kit",
      "lipstick",
      "eyeliner",
      "moisturizer",
      "skincare",
      "face cream",
      "face wash",
      "mascara",
      "primer",
      "foundation",
      "blush",
      "serum",
      "sunscreen",
      "mamaearth",
    ],
  },

  shirt: {
    name: "shirt",

    titlePatterns: [
      /\bshirts?\b/i,
      /\bt[-\s]?shirts?\b/i,
      /\btees?\b/i,
      /\blinen\b/i, // UCB Pure Linen Summer Shirt
      /\boxford\b/i, // Flying Machine Striped Oxford Shirt
      /\bformal shirt\b/i,
      /\bcasual shirt\b/i,
      /\bcheck(?:ered)? shirt\b/i,
      /\bdenim shirt\b/i,
      /\bsportswear\b/i, // Adidas Sportswear T-Shirt
      /\bgraphic tee\b/i, // Levi's Classic Graphic Tee
      /\bessentials\b/i, // Puma Essentials Logo Tee (tee context)
    ],
    keys: [/\bshirts?\b/i, /\bt-?shirts?\b/i, /\btees?\b/i],
    aliases: ["shirt", "shirts", "tshirt", "t-shirt", "tee"],
  },

  pant: {
    name: "pant",
    titlePatterns: [
      /\bpants?\b/i,
      /\bjeans\b/i,
      /\btrousers?\b/i,
      /\bdenim\b/i,
      /\bchinos\b/i,
      /\bbootcut\b/i,
      /\bskinny\b/i,
      /\bcargo\b/i,
      /\bslim\s*fit\b/i, // "Wrangler Slim Fit Khaki Pants"
      /\bstraight\s*(fit|leg)\b/i,
      /\bbaggy\b/i,
    ],
    keys: [/\bpants?\b/i, /\bjeans\b/i, /\btrousers?\b/i, /\bdenim\b/i],
    aliases: ["pant", "pants", "jeans", "trousers", "denim", "chinos"],
  },

  dress: {
    name: "Dress",
    titlePatterns: [
      /\bdresses?\b/i,
      /\bgown\b/i,
      /\bmaxi\b/i,
      /\bsundress\b/i,
      /\bethnic\b/i,
      /\bwrap dress\b/i,
      /\bparty dress\b/i,
      /\bevening gown\b/i,
    ],
    keys: [/\bdresses?\b/i, /\bgown\b/i, /\bmaxi\b/i],
    aliases: ["dress", "dresses", "gown", "maxi", "sundress"],
  },

  bag: {
    name: "Bag",

    titlePatterns: [
      /\bbags?\b/i,
      /\bbackpack\b/i,
      /\bluggage\b/i,
      /\bhandbag\b/i,
      /\bmessenger\b/i,
      /\bstrolly\b/i,
      /\bskybags?\b/i,
      /\bwildcraft\b/i,
      /\bsafari\b/i,
      /\bamerican tourister\b/i,
      /\bherm[eè]s?\b/i,
    ],
    keys: [
      /\bbags?\b/i,
      /\btravel bag\b/i,
      /\bbackpack\b/i,
      /\bhandbag\b/i,
      /\bluggage\b/i,
    ],
    aliases: [
      "bag",
      "bags",
      "backpack",
      "travel bag",
      "handbag",
      "luggage",
      "sling bag",
    ],
  },

  shoes: {
    name: "shoes",
    titlePatterns: [
      /\bshoes?\b/i,
      /\bsneakers?\b/i,
      /\bsandals?\b/i,
      /\bloafers?\b/i,
      /\bslip[-\s]?on\b/i,
      /\bderby\b/i,
      /\bkolhapuri\b/i,
      /\bchappal\b/i,
      /\blace[-\s]?up\b/i,
    ],
    keys: [/\bshoes?\b/i, /\bsneakers?\b/i, /\bfootwear\b/i, /\bsandals?\b/i],
    aliases: ["shoes", "sneakers", "footwear", "sandals", "loafers"],
  },

  fitness: {
    name: "Fitness",
    titlePatterns: [
      /\bfitness\b/i,
      /\bgym\b/i,
      /\bworkout\b/i,
      /\bdumbbells?\b/i,
      /\byoga\b/i,
      /\bpower rack\b/i,
      /\bweight bench\b/i,
      /\bab roller\b/i,
    ],
    keys: [/\bfitness\b/i, /\bgym\b/i, /\bworkout\b/i, /\bdumbbells?\b/i],
    aliases: ["fitness", "gym", "workout", "dumbbells", "yoga", "exercise"],
  },

  toys: {
    name: "Toys",
    titlePatterns: [
      /\btoys?\b/i,
      /\bblocks?\b/i,
      /\bmontessori\b/i,
      /\bhappy meal\b/i,
      /\baction hero\b/i,
      /\blearning board\b/i,
      /\bbricology\b/i,
      /\brainbow stacker\b/i,
      /\bscience.*kit\b/i,
    ],
    keys: [/\btoys?\b/i, /\bblocks?\b/i, /\blearning kit\b/i],
    aliases: ["toy", "toys", "blocks", "learning kit"],
  },

  kidswear: {
    name: "Kidswear",
    titlePatterns: [/\bkidswear\b/i, /\bkids\b/i, /\btoddler\b/i],
    keys: [/\bkidswear\b/i, /\bkids clothes\b/i],
    aliases: ["kidswear", "kids clothes"],
  },
};

// Flat alias → category item map
const ALIAS_TO_CATEGORY = {};
for (const item of Object.values(CATEGORY_MAP)) {
  for (const alias of item.aliases) {
    ALIAS_TO_CATEGORY[alias] = item;
  }
}

const GENDER_AGE_KEYWORDS = {
  men: ["men", "male", "gents", "gentleman", "mens"],
  women: ["women", "female", "ladies", "lady", "girls", "girl", "womens"],
  kids: [
    "kids",
    "children",
    "child",
    "boy",
    "boys",
    "baby",
    "infant",
    "toddler",
  ],
};

const COLORS = [
  "red",
  "blue",
  "green",
  "white",
  "black",
  "yellow",
  "pink",
  "grey",
  "gray",
  "maroon",
  "orange",
  "purple",
  "brown",
  "silver",
  "gold",
  "beige",
  "navy",
  "teal",
  "cream",
  "indigo",
  "burgundy",
];

const GHOST_WORDS = new Set([
  "ok",
  "okay",
  "hmm",
  "hm",
  "ha",
  "hi",
  "hey",
  "hello",
  "bye",
  "thanks",
  "thank",
  "ty",
  "yes",
  "no",
  "yeah",
  "nope",
  "sure",
  "alright",
  "fine",
  "good",
  "great",
  "nice",
  "kavali",
  "kaval",
  "ivvu",
  "emi",
  "cheyyi",
  "chupinchu",
  "undi",
  "ledu",
  "anni",
  "oka",
  "okka",
  "chala",
  "chupinchandi",
  "cheppandi",
  "please",
  "show",
  "me",
  "want",
  "need",
  "give",
  "find",
  "get",
  "buy",
  "the",
  "a",
  "an",
  "some",
]);

const SUFFIX_WORDS = new Set([
  "kit",
  "set",
  "combo",
  "pack",
  "bundle",
  "collection",
]);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeSynonyms(text) {
  let result = text;
  const sorted = Object.keys(SYNONYMS).sort((a, b) => b.length - a.length);
  for (const syn of sorted) {
    const rx = new RegExp(`\\b${escapeRegex(syn)}\\b`, "gi");
    if (rx.test(result)) result = result.replace(rx, SYNONYMS[syn]);
  }
  return result;
}

function isGarbage(word) {
  if (!word || word.length < 2) return true;
  if (/^([a-z])\1{2,}$/.test(word)) return true;
  if (/^[^aeiou\s]{5,}$/.test(word)) return true;
  return false;
}

function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function fuzzyThreshold(len) {
  if (len <= 3) return 0;
  if (len <= 5) return 1;
  return 2;
}

function correctWord(word) {
  if (word.length < 3 || GHOST_WORDS.has(word) || SUFFIX_WORDS.has(word))
    return word;
  const thr = fuzzyThreshold(word.length);
  let best = { corrected: word, dist: Infinity };
  for (const alias of Object.keys(ALIAS_TO_CATEGORY)) {
    if (alias.includes(" ")) continue;
    if (Math.abs(word.length - alias.length) > thr + 1) continue;
    const d = levenshtein(word, alias);
    if (d <= thr && d < best.dist) best = { corrected: alias, dist: d };
  }
  return best.corrected;
}

function correctPhrase(text) {
  return text.split(/\s+/).map(correctWord).join(" ");
}

function detectCategory(cleanText, correctedText) {
  // Pass 1: exact key match on cleaned text
  for (const item of Object.values(CATEGORY_MAP))
    if (item.keys.some((rx) => rx.test(cleanText))) return item;

  // Pass 2: exact key match on spell-corrected text
  if (correctedText !== cleanText)
    for (const item of Object.values(CATEGORY_MAP))
      if (item.keys.some((rx) => rx.test(correctedText))) return item;

  // Pass 3: fuzzy alias scan (longest alias first)
  const sorted = Object.keys(ALIAS_TO_CATEGORY).sort(
    (a, b) => b.length - a.length,
  );
  for (const alias of sorted)
    if (new RegExp(`\\b${escapeRegex(alias)}\\b`, "i").test(correctedText))
      return ALIAS_TO_CATEGORY[alias];

  return null;
}

function extractGenderAge(text) {
  for (const [key, kws] of Object.entries(GENDER_AGE_KEYWORDS))
    if (kws.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(text))) return key;
  return null;
}

function extractPriceRange(text) {
  const range = text.match(/(\d+)\s*(?:to|-|నుండి|నుంచి|and|–)\s*(\d+)/i);
  if (range)
    return {
      min: Math.min(+range[1], +range[2]),
      max: Math.max(+range[1], +range[2]),
    };

  const maxM = text.match(
    /(?:under|below|max|upto|up to|లోపు|కంటే తక్కువ)\s*₹?\s*(\d+)|₹?\s*(\d+)\s*(?:లోపు|కంటే తక్కువ|max|below|under)/i,
  );
  if (maxM) return { min: 0, max: parseInt(maxM[1] || maxM[2]) };

  // 3+ digit bare number only (avoid matching "2g", "4k" etc)
  const bare = text.match(/₹\s*(\d+)|(\d{4,})/);
  if (bare) return { min: 0, max: parseInt(bare[1] || bare[2]) };

  return null;
}

function deduplicateProducts(products) {
  const seen = new Set();
  return products.filter((p) => {
    const id = p._id.toString();
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function buildTitleQuery(catItem) {
  const titlePattern = catItem.titlePatterns.map((r) => r.source).join("|");
  // Title-only query — reliable, no false positives from shared categories
  return { title: { $regex: titlePattern, $options: "i" } };
}

function extractBagSubType(rawText) {
  const t = rawText.toLowerCase();
  if (/\bhandbag\b/i.test(t) || /\bpurse\b/i.test(t) || /\bclutch\b/i.test(t))
    return "handbag";
  if (
    /\bluggage\b/i.test(t) ||
    /\btrolley\b/i.test(t) ||
    /\bstrolly\b/i.test(t) ||
    /\bsuitcase\b/i.test(t)
  )
    return "luggage";
  if (/\btravel\b/i.test(t)) return "travel";
  if (/\bmessenger\b/i.test(t) || /\bsling\b/i.test(t)) return "sling";
  if (
    /\bbackpack\b/i.test(t) ||
    /\bschool bag\b/i.test(t) ||
    /\blaptop bag\b/i.test(t)
  )
    return "backpack";
  return null; // generic "bag" → show all types
}

const BAG_SUBTYPE_PATTERNS = {
  handbag: [/\bhandbag\b/i, /\bherm[eè]s?\b/i, /\bpurse\b/i, /\bluxury\b/i],
  luggage: [
    /\bluggage\b/i,
    /\bstrolly\b/i,
    /\btrolley\b/i,
    /\bsuitcase\b/i,
    /\bcabin\b/i,
  ],
  travel: [
    /\btravel\b/i,
    /\bwildcraft\b/i,
    /\badventure\b/i,
    /\bsafari\b/i,
    /\bbackpack\b/i,
  ],
  sling: [/\bmessenger\b/i, /\bsling\b/i, /\burban\b/i],
  backpack: [/\bbackpack\b/i, /\bschool\b/i, /\bskybags?\b/i, /\blaptop\b/i],
};
function applyIsolationFilter(products, catItem, userText = "") {
  if (!catItem) return products;

  return products.filter((p) => {
    const title = p.title.toLowerCase();

    // Must match at least one titlePattern
    const matchesCategory = catItem.titlePatterns.some((rx) => rx.test(title));
    if (!matchesCategory) return false;

    // Category-specific exclusions to prevent bleeding
    switch (catItem.name.toLowerCase()) {
      case "fan":
        // Exclude: "mobile", "laptop" (no fan product should have these)
        return !/\b(?:mobile|phone|laptop|airpods)\b/i.test(title);

      case "ac":
        // Exclude: "accessories" matches "ac" — block it
        return !/\baccessories\b/i.test(title);

      case "mobile":
        // Exclude: "airpods", "accessories", "laptop" from mobile results
        return !/\b(?:airpods?|accessories|laptop|headphones?)\b/i.test(title);

      case "shirt":
        // Exclude: jeans, pants, dresses, makeup from fashion category
        return !/\b(?:jeans|pants?|trousers?|dresses?|gown|maxi|makeup|moisturizer|cream)\b/i.test(
          title,
        );

      case "pant":
        // Exclude: shirts, dresses, makeup
        return !/\b(?:shirts?|t-?shirts?|tees?|dresses?|gown|makeup|cream)\b/i.test(
          title,
        );

      case "makeup":
        // Exclude: shirts, jeans, dresses, shoes from fashion category
        return !/\b(?:shirts?|t-?shirts?|tees?|jeans|pants?|trousers?|dresses?|gown|shoes?|sneakers?)\b/i.test(
          title,
        );

      case "dress":
        // Exclude: shirts, jeans, makeup
        return !/\b(?:shirts?|t-?shirts?|tees?|jeans|pants?|makeup|cream|moisturizer)\b/i.test(
          title,
        );

      case "bag": {
        const subType = extractBagSubType(userText);
        if (!subType) return true; // bare "bag" → show all bag products
        const patterns = BAG_SUBTYPE_PATTERNS[subType] || [];
        return patterns.some((rx) => rx.test(title));
      }

      default:
        return true;
    }
  });
}

router.post("/recommend", async (req, res) => {
  const { message, userId, userName } = req.body;
  if (!message || !userId)
    return res.status(400).json({ reply: "Message మరియు userId అవసరం." });

  const text = message.toLowerCase().trim();
  const userLabel = userName || "అనిల్";

  try {
    let session = sessions.get(userId) || {
      activeItem: null,
      lastColor: null,
      lastGender: null,
      pendingClarification: null,
      spellingNote: null,
    };

    if (
      ["reset", "clear", "start over", "మళ్ళీ", "క్లియర్"].some((k) =>
        text.includes(k),
      )
    ) {
      sessions.set(userId, {
        activeItem: null,
        lastColor: null,
        lastGender: null,
        pendingClarification: null,
        spellingNote: null,
      });
      return res.json({
        reply: `సరే ${userLabel}, అన్నీ క్లియర్ చేశాను. కొత్తగా అడుగు. 🔄`,
      });
    }

    // ── 2. RESOLVE PENDING CLARIFICATION
    if (session.pendingClarification) {
      const { resolutions } = session.pendingClarification;
      const resolvedKey = Object.keys(resolutions).find((k) =>
        text.includes(k),
      );
      if (resolvedKey) {
        const resolvedName = resolutions[resolvedKey];
        session.activeItem =
          Object.values(CATEGORY_MAP).find(
            (item) => item.name.toLowerCase() === resolvedName,
          ) || null;
        session.pendingClarification = null;
        // Fall through to search with session.activeItem set
      } else {
        session.pendingClarification = null;
      }
    }

    // ── 3. TEXT PIPELINE
    const cleanText = normalizeSynonyms(text);
    const correctedText = correctPhrase(cleanText);
    const wasCorreected = correctedText !== text && correctedText !== cleanText;

    // ── 4. SIGNAL EXTRACTION
    const foundColor = COLORS.find((c) =>
      new RegExp(`\\b${c}\\b`, "i").test(text),
    );
    const priceRange = extractPriceRange(cleanText);
    const foundGender = extractGenderAge(text);

    // ── 5. AMBIGUITY CHECK
    for (const [word, cfg] of Object.entries(AMBIGUOUS_KEYWORDS)) {
      if (new RegExp(`\\b${word}\\b`, "i").test(text)) {
        const resolved = cfg.options.some((opt) =>
          new RegExp(`\\b${opt}\\b`, "i").test(text),
        );
        if (!resolved) {
          session.pendingClarification = { ...cfg, keyword: word };
          sessions.set(userId, session);
          return res.json({ reply: cfg.question });
        }
      }
    }

    // ── 6. CATEGORY DETECTION
    let detected = detectCategory(cleanText, correctedText);

    // ── 7. GHOST WORD GUARD
    const meaningfulTokens = text
      .split(/\s+/)
      .filter(
        (w) => !GHOST_WORDS.has(w) && !SUFFIX_WORDS.has(w) && w.length > 1,
      );
    const isAllGhost =
      meaningfulTokens.length === 0 && !priceRange && !foundColor && !detected;

    if (isAllGhost) {
      sessions.set(userId, session);
      const hint = session.activeItem
        ? `మీరు **${session.activeItem.name}** చూస్తున్నారు — బడ్జెట్ లేదా రంగు చెప్పు! 💡`
        : `TV, Fan, Mobile, Shirt వంటి ఏదైనా చెప్పు. 🛍️`;
      return res.json({ reply: `${userLabel}, ${hint}` });
    }

    // ── 8. DB AUTO-DETECT (no CATEGORY_MAP match)
    if (
      !detected &&
      !priceRange &&
      !foundColor &&
      meaningfulTokens.length > 0
    ) {
      const correctedTokens = meaningfulTokens
        .map(correctWord)
        .filter((w) => !GHOST_WORDS.has(w) && !SUFFIX_WORDS.has(w));

      if (!correctedTokens.length || correctedTokens.every(isGarbage)) {
        return res.json({
          reply: `క్షమించండి ${userLabel}, అది అర్థం కాలేదు. 🧐\nTV, Mobile, Shirt, Makeup వంటివి అడుగు.`,
        });
      }

      const searchPattern = correctedTokens.map(escapeRegex).join("|");
      let dbCheck = null;
      try {
        dbCheck = await Product.findOne({
          title: { $regex: searchPattern, $options: "i" },
        });
      } catch (e) {
        console.error("DB auto-detect:", e);
      }

      if (dbCheck) {
        const detectedLabel = correctedTokens
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        detected = {
          name: detectedLabel,
          titlePatterns: [new RegExp(searchPattern, "i")],
          keys: [new RegExp(searchPattern, "i")],
          aliases: [],
          isDynamic: true,
          searchPattern,
        };
        if (wasCorreected) {
          session.spellingNote = `_(మీరు "${text}" అని టైప్ చేశారు — "${correctedText}" గా సర్చ్ చేశాను)_`;
        }
      } else {
        let trending = [];
        try {
          trending = await Product.find({})
            .sort({ rating: -1, price: -1 })
            .limit(3);
        } catch (_) {}
        const list = trending.length
          ? trending.map((p) => `\n• ${p.title} — ₹${p.price}`).join("")
          : "\n(ట్రెండింగ్ ఐటమ్స్ అందుబాటులో లేవు)";
        return res.json({
          reply: `క్షమించండి, **${correctedText}** అందుబాటులో లేదు. ❌\n\nట్రెండింగ్‌లో ఉన్నవి:${list}`,
        });
      }
    }

    // ── 9. SESSION CONTEXT UPDATE
    if (detected) {
      if (session.activeItem && session.activeItem.name !== detected.name) {
        session.lastColor = null;
        session.lastGender = null;
      }
      session.activeItem = detected;
    }
    if (foundColor) session.lastColor = foundColor;
    if (foundGender) session.lastGender = foundGender;

    if (!session.activeItem) {
      return res.json({
        reply: `హలో ${userLabel}! ఏం కావాలో చెప్పు (TV, Fan, Mobile, Shirt etc). 🛍️`,
      });
    }

    const current = session.activeItem;
    const targetColor = session.lastColor;
    const targetGender = session.lastGender;

    // ── 10. BUILD DATABASE QUERY

    let query;
    if (!current.isDynamic) {
      query = buildTitleQuery(current);
    } else {
      // Dynamic: user typed something not in CATEGORY_MAP, found via DB auto-detect
      query = { title: { $regex: current.searchPattern, $options: "i" } };
    }

    let products = [];
    try {
      products = await Product.find(query);
    } catch (dbErr) {
      console.error("Product query error:", dbErr);
      return res.json({
        reply: "డేటాబేస్ లో సమస్య ఉంది. తర్వాత ప్రయత్నించండి. ⚠️",
      });
    }

    products = deduplicateProducts(products);

    // ── 11. ISOLATION FILTER (in-memory, post-DB)
    const standardCat = !current.isDynamic
      ? Object.values(CATEGORY_MAP).find(
          (c) => c.name.toLowerCase() === current.name.toLowerCase(),
        )
      : null;

    let filtered = applyIsolationFilter(products, standardCat || current, text);

    // Safety: if isolation wiped everything, use raw products (better than empty)
    if (filtered.length === 0 && products.length > 0) {
      filtered = products;
    }

    // ── 12. GENDER / AGE FILTER
    if (targetGender && filtered.length > 0) {
      const kws = GENDER_AGE_KEYWORDS[targetGender] || [];
      const gf = filtered.filter((p) =>
        kws.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(p.title)),
      );
      if (gf.length > 0) {
        filtered = gf;
      } else {
        session.lastGender = null;
        sessions.set(userId, session);
        return res.json({
          reply: `క్షమించండి, **${targetGender}** కోసం **${current.name}** అందుబాటులో లేదు. ❌\nGender filter లేకుండా చూపిస్తానా?`,
        });
      }
    }

    // ── 13. EMPTY RESULT FALLBACK
    if (filtered.length === 0) {
      session.activeItem = null;
      sessions.set(userId, session);
      return res.json({
        reply: `క్షమించండి, ప్రస్తుతం **${current.name}** స్టాక్ లో లేదు. ❌ వేరే అడుగు!`,
      });
    }

    // ── 14. COLOR FILTER
    if (targetColor) {
      const cf = filtered.filter((p) =>
        new RegExp(`\\b${targetColor}\\b`, "i").test(p.title),
      );
      if (cf.length > 0) {
        filtered = cf;
      } else {
        session.lastColor = null;
        sessions.set(userId, session);
        return res.json({
          reply: `క్షమించండి, **${targetColor}** రంగులో **${current.name}** లేదు. ❌\nరంగు లేకుండా చూపిస్తానా?`,
        });
      }
    }

    // ── 15. PRICE RANGE FILTER
    let finalProduct = null;
    let replyHeader = `మీరు అడిగిన **${current.name}** లో టాప్ ఆప్షన్ ఇదే! 🎯`;

    if (priceRange) {
      const { min, max } = priceRange;
      if (min > 0 && max > min) {
        const inRange = filtered.filter(
          (p) => p.price >= min && p.price <= max,
        );
        if (inRange.length > 0) {
          finalProduct = inRange.sort(
            (a, b) => (b.rating || 0) - (a.rating || 0),
          )[0];
          replyHeader = `₹${min} – ₹${max} లో **${current.name}** బెస్ట్ ఆప్షన్:`;
        } else {
          const midpoint = (min + max) / 2;
          finalProduct = filtered.sort(
            (a, b) =>
              Math.abs(a.price - midpoint) - Math.abs(b.price - midpoint),
          )[0];
          replyHeader = `₹${min}–₹${max} లో ఏమీ లేదు, దగ్గరగా ఉన్నది (₹${finalProduct?.price}):`;
        }
      } else {
        const under = filtered.filter((p) => p.price <= max);
        if (under.length > 0) {
          finalProduct = under.sort((a, b) => b.price - a.price)[0];
          replyHeader = `₹${max} లోపు **${current.name}** బెస్ట్ ఆప్షన్:`;
        } else {
          finalProduct = filtered.sort((a, b) => a.price - b.price)[0];
          replyHeader = `₹${max} లోపు **${current.name}** లేదు, తక్కువ ధరలో ఇది (₹${finalProduct?.price}):`;
        }
      }
    } else {
      // Sort by rating desc, then price desc as tiebreaker
      finalProduct = [...filtered].sort(
        (a, b) => (b.rating || 0) - (a.rating || 0) || b.price - a.price,
      )[0];
    }

    if (!finalProduct)
      return res.json({
        reply: `క్షమించండి ${userLabel}, **${current.name}** దొరకలేదు. ❌`,
      });

    // ── 16. BUILD REPLY
    const spellingNote = session.spellingNote
      ? `\n${session.spellingNote}`
      : "";
    session.spellingNote = null;
    sessions.set(userId, session);

    const genderTag = targetGender ? ` (${targetGender})` : "";
    const colorTag = targetColor ? ` [${targetColor}]` : "";

    return res.json({
      reply: `${replyHeader}${spellingNote}\n\n🛒 **"${finalProduct.title}"**${genderTag}${colorTag}\n💰 ₹${finalProduct.price}`,
      recommendedProductId: finalProduct._id,
    });
  } catch (error) {
    console.error("Recommend route error:", error);
    return res.status(500).json({
      reply: `సర్వర్ లో చిన్న సమస్య ${userLabel} గారు! తర్వాత ప్రయత్నించండి. ⚠️`,
    });
  }
});

export default router;

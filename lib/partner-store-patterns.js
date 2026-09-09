// Category doodle backdrops for partner storefronts (WhatsApp-wallpaper style).
//
// Each entry in PATTERN_ICONS is a set of single-stroke line drawings, each drawn
// inside a 24x24 box, `fill:none`. StorePattern.js scatters them into a repeating
// tile and strokes them in the store's accent colour at low opacity.

export const STORE_PATTERNS = [
  { id: "none", label: "None", blurb: "Plain background." },
  { id: "fashion", label: "Fashion", blurb: "Dresses, bags, heels, shades." },
  { id: "electronics", label: "Electronics", blurb: "Phones, audio, gadgets." },
  { id: "beauty", label: "Beauty & Health", blurb: "Makeup, scent, skincare." },
  { id: "food", label: "Food & Groceries", blurb: "Fresh produce, drinks, treats." },
  { id: "home", label: "Home & Living", blurb: "Furniture, plants, decor." },
  { id: "fitness", label: "Sports & Fitness", blurb: "Weights, kicks, gear." },
  { id: "auto", label: "Automobiles", blurb: "Cars, wheels, tools." },
  { id: "books", label: "Books & Learning", blurb: "Books, stationery, ideas." },
];

export function patternLabel(id) {
  return STORE_PATTERNS.find((p) => p.id === id)?.label ?? "None";
}

// Shared little marks scattered alongside every category's icons.
const SPARK = "M12 4c.7 4.6 2.7 6.6 7.3 7.3-4.6.7-6.6 2.7-7.3 7.3-.7-4.6-2.7-6.6-7.3-7.3C9.3 10.6 11.3 8.6 12 4Z";
const HEART = "M12 20C6.5 15.5 4 12 4 8.8 4 6.4 5.9 4.5 8.2 4.5c1.6 0 3 .8 3.8 2 .8-1.2 2.2-2 3.8-2C21.1 4.5 23 6.4 23 8.8 23 12 20.5 15.5 15 20l-3 2.5Z";
const DOT = "M12 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z";
const CURVE = "M4 15c3-6 13-6 16 0";

export const PATTERN_ICONS = {
  fashion: [
    // dress
    "M9 4q3 2.6 6 0M9 4 7.7 9.3 10 10.3 7.5 21h9L14 10.3l2.3-1L15 4",
    // t-shirt
    "M8.2 4 4 7l2 3 2.1-1v11h7.8V9l2.1 1 2-3-4.2-3q-3.8 2.8-7.6 0Z",
    // handbag
    "M6 9h12l-1.2 11H7.2ZM9.2 9V7.2a2.8 2.8 0 0 1 5.6 0V9",
    // high heel
    "M6 5c0 8 1.4 11.4 11.6 12.6L18 21H6ZM17.6 17.6 19 21",
    // sunglasses
    "M3 9.5 6 8.5h3.5L11 10.5M13 10.5 14.5 8.5H18l3 1M4 10a3 3 0 0 0 6 0 3 3 0 0 0-6 0ZM14 10a3 3 0 0 0 6 0 3 3 0 0 0-6 0ZM10 11h4",
    // hat / cap
    "M4 16.5q0-8.5 8.5-8.5T20.5 14L12 15q-6 0-6 1.5ZM4 16.5h16",
    // hanger
    "M12 4a2 2 0 0 1 1 3.7L20.5 14H3.5L11 7.7A2 2 0 0 1 12 4Z",
    // scarf
    "M7.5 4h9l-1.8 6q2.6 3.6 0 7.5t-5.4 0-.2-7.5Z",
    // earring
    "M12 4v3.5M10 9.5a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM12 11.5v3q0 4 3 5.5",
    SPARK, HEART, DOT,
  ],
  electronics: [
    // phone
    "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM10 18h4",
    // laptop
    "M6 6h12v9H6ZM3 18.5h18l-1.3-3.5H4.3Z",
    // headphones
    "M5 13v-1a7 7 0 0 1 14 0v1M5 13h3v6.5H6a1 1 0 0 1-1-1ZM19 13h-3v6.5h2a1 1 0 0 0 1-1Z",
    // camera
    "M4 8h3.5l1-2h7l1 2H20v11H4ZM12 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    // game controller
    "M8.5 9h7a5 5 0 0 1 5 5 2.7 2.7 0 0 1-5 1l-1-1.2h-3l-1 1.2a2.7 2.7 0 0 1-5-1 5 5 0 0 1 5-5ZM7 12.2h3M8.5 10.7v3M15.5 12.2h.01M17.2 13.5h.01",
    // plug
    "M9 3v5M15 3v5M6 8h12v2.5a6 6 0 0 1-12 0ZM12 16.5V21",
    // lightbulb
    "M12 3a6 6 0 0 0-3.8 10.6c1 .9 1.3 1.7 1.3 2.9h5c0-1.2.3-2 1.3-2.9A6 6 0 0 0 12 3ZM10 19.5h4",
    // battery
    "M4 8.5h13.5v7H4ZM17.5 11h2.3v2.5h-2.3ZM7 10.5v3",
    // wifi
    "M4 9.5a12 12 0 0 1 16 0M7 12.5a8 8 0 0 1 10 0M10 15.5a4 4 0 0 1 4 0M12 18.5h.01",
    SPARK, HEART, DOT,
  ],
  beauty: [
    // lipstick
    "M9.5 8 11 4h2l1.5 4v3h-5ZM9.5 11h5v10h-5Z",
    // nail polish
    "M10 3.5h4v2.5l1.2 2v13H8.8v-13L10 6Z",
    // perfume bottle
    "M10 3.5h4v3h-4ZM8 8h8v13H8ZM10 6.5h4",
    // hand mirror
    "M12 3.5a5.5 6.5 0 1 0 0 13 5.5 6.5 0 0 0 0-13ZM12 16.5v4.5M9 21h6",
    // cream jar
    "M6 9.5h12v11.5H6ZM8 9.5V7.5h8v2M8 5.5h8",
    // comb
    "M4 9.5h16v3H4ZM6.5 12.5v6.5M9.5 12.5v6.5M12.5 12.5v6.5M15.5 12.5v6.5M18 12.5v6.5",
    // flower
    "M12 8.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 8.5V4M12 14.5V21M9 11.5H4M15 11.5h5M9.6 9.1 6 5.5M14.4 9.1 18 5.5",
    // droplet
    "M12 3.5s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z",
    CURVE, SPARK, HEART, DOT,
  ],
  food: [
    // apple
    "M12 8c-2-2-7-1.2-7 4.2S8 20 12 20s7-2.4 7-7.8S14 6 12 8ZM12 8V5.2M12 5.2c.4-1.8 2.2-2 3.4-2.8",
    // carrot
    "M6.5 18.5 15 10l3.2 3.2-8.5 8.5ZM15 10l1-3.4 3.4 1-1 3.4M9.5 12.5l1 1M12.5 15.5l1 1",
    // bread loaf
    "M4 11a4 3 0 0 1 8 0 4 3 0 0 1 8 0v8H4ZM4 12.5h16",
    // milk carton
    "M8 7h8v13.5H8ZM8 7l4-4 4 4M10 11h4",
    // coffee cup
    "M6 8.5h11v6a4 4 0 0 1-8 0ZM17 9.5h2a2 2 0 0 1 0 4h-2M8.5 4.5v2M11.5 4.5v2",
    // cupcake
    "M6.5 12h11l-2 8.5h-7ZM7.5 12a4.5 3.5 0 0 1 9 0M9.5 8.5a2.8 2.8 0 0 1 5 0",
    // bottle
    "M10 3h4v3l2 3v12H8V9l2-3Z",
    // fish
    "M4 12.5s3.2-5 9-5 8.4 5 8.4 5-2.6 5-8.4 5-9-5-9-5ZM17 10l3.4-2v9l-3.4-2M9 11.5h.01",
    // leaf
    "M6 18.5C6 10.5 12.4 5 20 5c0 8-5.4 14.5-14 14.5ZM6 18.5q6.4-2 9.6-8.5",
    SPARK, HEART, DOT,
  ],
  home: [
    // chair
    "M7 4v9M17 4v9M6.6 9h10.8M6 13.5h12l-1 7.5M6 21l1-7.5M17 21l1-7.5",
    // lamp
    "M9 3.5h6l3 6.5H6ZM12 10v8M8 21h8M10 18h4",
    // potted plant
    "M9 21h6l-1-8.5h-4ZM12 12.5c0-3.2 2.2-5.4 5.4-5.4-1 3.2-2.2 5.4-5.4 5.4ZM12 12.5c0-3.2-2.2-5.4-5.4-5.4 1 3.2 2.2 5.4 5.4 5.4Z",
    // mug
    "M6 8.5h9.5v10H6ZM15.5 9.5h2.5a2 2 0 0 1 0 4h-2.5",
    // framed picture
    "M4 5h16v14H4ZM7.5 15.5 11 11l2.2 2.2L16.5 9v7Z",
    // wall clock
    "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM12 8v4.2l3 1.8",
    // candle
    "M9 9.5h6v10H9ZM12 9.5V6.5M12 6.5c0-1.2 1.2-2 0-3.4-1.2 1.4 0 2.2 0 3.4M8 19.5h8",
    // key
    "M15 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12.5 12.2 4 20.7M8 16.7l2 2M6 18.7l2 2",
    // house
    "M4 11.5 12 4.5l8 7M6 10v9.5h12V10M10 19.5v-5.5h4v5.5",
    SPARK, HEART, DOT,
  ],
  fitness: [
    // dumbbell
    "M4 8v8M6 6v12M18 6v12M20 8v8M6 12h12",
    // sneaker
    "M3 15.5c0-2 2-3.2 4.2-3.2l3.3-4.3 2 2 6.3 1.2c2 .5 3.2 2 3.2 4.3v2H3ZM3 17.5h18",
    // water bottle
    "M9 3h6v2.2l1 2v13.3H8V7.2l1-2Z M9 11.5h6",
    // basketball
    "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM4 12h16M12 4v16M6.4 6.4c3.2 3 3.2 9 0 12M17.6 6.4c-3.2 3-3.2 9 0 12",
    // bicycle
    "M6.5 19a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM17.5 19a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM6.5 15.8l4.2-6.3h5.3l3 6.3M10.7 9.5 9.5 5.8h3.2M15.8 9.5l2 3.1",
    // medal
    "M9 3.5l3 6 3-6M12 9.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 12.5v3.2M10.4 14.1h3.2",
    // stopwatch
    "M12 6.5a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM12 6.5V3.5M10 3.5h4M12 13.5l3-3M18 8.5l2.2-2.2",
    // jump rope
    "M7 5a3 3 0 0 0-3 3v9a2 2 0 0 0 4 0v-2M17 5a3 3 0 0 1 3 3v9a2 2 0 0 1-4 0v-2M8 15q4-9 8 0",
    CURVE, SPARK, HEART, DOT,
  ],
  auto: [
    // car
    "M4 13.5 6.2 8.3h11.6L20 13.5M3.2 13.5h17.6v4.5H3.2ZM7.2 18a2 2 0 1 0 0 3 2 2 0 0 0 0-3ZM16.8 18a2 2 0 1 0 0 3 2 2 0 0 0 0-3Z",
    // wheel / tyre
    "M12 3.8a8.2 8.2 0 1 0 0 16.4 8.2 8.2 0 0 0 0-16.4ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 3.8V8M12 16v4.2M3.8 12H8M16 12h4.2",
    // fuel pump
    "M5 4h9v17H5ZM5 12h9M16 8.5l3 3v7a2 2 0 0 1-4 0V13h-2M14 9.5h3M8 7h3",
    // key fob
    "M8 4h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2.6l-1.4 3-1.4-3H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM10 9.5h4M12 9.5v4",
    // wrench
    "M18 4a5 5 0 0 0-6.3 6.3L3 19l2 2 8.7-8.7A5 5 0 0 0 20 6l-2.6 2.6-2.5-.5-.5-2.5Z",
    // traffic cone
    "M10 4h4l3.2 16.5H6.8ZM8.5 12h7M9.5 8h5M4.5 20.5h15",
    // road
    "M6 3.5 4 20.5M18 3.5l2 17M12 5v3M12 11.5v3M12 18v3",
    // oil can
    "M4 12.5h8V9.5h2l2.2 2.2 4-1v3l-4 1v5.3H4ZM6 12.5v6.3M4 12.5l-2.2-2.2h4.2",
    SPARK, HEART, DOT,
  ],
  books: [
    // open book
    "M12 6C9.5 4.6 6.8 4 4 4v13c2.8 0 5.5.6 8 2 2.5-1.4 5.2-2 8-2V4c-2.8 0-5.5.6-8 2ZM12 6v13",
    // book stack
    "M4 7.5h13.5v3.2H4ZM5 10.7h13.5v3.2H5ZM4 13.9h14.5v3.2H4ZM8 7.5v3.2M11 10.7v3.2M15 13.9v3.2",
    // pencil
    "M5 19.5 6.2 15l9.3-9.3 3.3 3.3-9.3 9.3ZM14.2 6.5l3.3 3.3M5 19.5l2.4-.7",
    // graduation cap
    "M12 5 21.5 9 12 13 2.5 9 12 5ZM6.2 11v5.2c0 1.4 2.6 2.6 5.8 2.6s5.8-1.2 5.8-2.6V11M20.5 10v5.5",
    // ruler
    "M4 8.2 16 4l4.2 12L8.2 20.2 4 8.2ZM7.6 8.6l1 3M11.3 7.4l1 3M15 6.2l1 3",
    // backpack
    "M7 8.5a5 5 0 0 1 10 0v11.5H7ZM9 8.5a3 3 0 0 1 6 0M9 12.5h6v4.5H9ZM11.5 20v-3",
    // globe
    "M12 3.8a8.2 8.2 0 1 0 0 16.4 8.2 8.2 0 0 0 0-16.4ZM3.8 12h16.4M12 3.8c3.2 3.2 3.2 13 0 16.4M12 3.8c-3.2 3.2-3.2 13 0 16.4",
    // lightbulb (idea)
    "M12 3.5a5.5 5.5 0 0 0-3.5 9.7c.9.8 1.2 1.5 1.2 2.6h4.6c0-1.1.3-1.8 1.2-2.6A5.5 5.5 0 0 0 12 3.5ZM10.2 18.5h3.6",
    SPARK, HEART, DOT,
  ],
};

// Lucky 7 Lawrence menu, transcribed from the 08.13.2026 print menu.
// Variants of the same thing (bucket sizes, sub lengths, pizza sizes) are ONE
// item with `sizes`, so the menu shows one card and the customer picks a size.

export type Size = { label: string; price: number };

export type Choice = { label: string; options: string[] };

export type MenuItem = {
  id: string;
  name: string;
  desc?: string;
  price?: number;
  sizes?: Size[];
  /** Overrides the category's choice for this item. */
  choice?: Choice;
  popular?: boolean;
};

export type MenuCategory = {
  id: string;
  title: string;
  note?: string;
  /** A choice the customer makes for every item in the category, e.g. sub cheese. */
  choice?: Choice;
  items: MenuItem[];
};

export const store = {
  name: "Lucky 7",
  tagline: "Deli, Market & Fried Chicken",
  slogan: "Biggest Sandwich in NJ",
  meals: "Breakfast, Lunch & Dinner",
  address: "1938 Princeton Ave.",
  city: "Lawrence, NJ 08648",
  landmark: "Harney's Corner at 206 & Princeton Pike",
  phone: "609-394-1500",
  hours: "Open daily, 5am until 11pm",
  quality: "We use Boar's Head meat & Land O'Lakes cheese",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=1938+Princeton+Ave+Lawrence+NJ+08648",
};

// NJ sales tax on prepared food.
export const TAX_RATE = 0.06625;

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

type Row = [name: string, price: number | (number | null)[], desc?: string];

function build(prefix: string, rows: Row[], sizeLabels?: string[]): MenuItem[] {
  return rows.map(([name, price, desc]) => {
    const id = `${prefix}-${slug(name)}`;
    if (typeof price === "number") return { id, name, desc, price };
    const sizes = price
      .map((p, i) => (p == null ? null : { label: sizeLabels![i], price: p }))
      .filter((s): s is Size => s !== null);
    return { id, name, desc, sizes };
  });
}

/** One item sold by piece count, e.g. a bucket in 4 to 100 pieces. */
function byCount(
  id: string,
  name: string,
  rows: [count: number, price: number][],
  extra: Partial<MenuItem> = {},
): MenuItem {
  return {
    id,
    name,
    sizes: rows.map(([n, price]) => ({ label: `${n} Pcs.`, price })),
    ...extra,
  };
}

const SUB = ["Roll", '10"', '15"'];
const HALF_WHOLE = ['10"', '15"'];
const SIDE = ["Small", "Large"];
const PIZZA = ['12"', '16"'];

export const menu: MenuCategory[] = [
  {
    id: "fried-chicken",
    title: "Fried Chicken",
    items: [
      byCount(
        "fried-chicken-bucket",
        "Fried Chicken Bucket",
        [
          [4, 8.99],
          [8, 14.99],
          [12, 21.99],
          [16, 29.99],
          [24, 39.99],
          [30, 49.99],
          [40, 59.99],
          [50, 89.99],
          [75, 129.99],
          [100, 179.99],
        ],
        { desc: "Mix of legs, thighs, breast & wings", popular: true },
      ),
      byCount(
        "dark-meat-bucket",
        "Dark Meat Bucket",
        [
          [4, 7.99],
          [8, 14.99],
          [12, 19.99],
          [16, 23.99],
          [24, 39.99],
          [50, 79.99],
        ],
        { desc: "Legs & thighs only" },
      ),
      ...build("fc", [
        ["Chicken Breast", 3.49, "One piece, fried to order"],
        ["Chicken Thigh", 2.25, "One piece, fried to order"],
        ["Chicken Leg", 1.89, "One piece, fried to order"],
        ["Chicken Wing", 1.69, "One piece, fried to order"],
        ["Breast Chicken Strip", 2.49, "One strip"],
        ["Chicken Finger", 1.69, "One finger"],
      ]),
    ],
  },
  {
    id: "wings",
    title: "Wings",
    items: [
      byCount(
        "buffalo-wings",
        "Buffalo Wings",
        [
          [6, 6.99],
          [12, 11.99],
          [20, 18.99],
          [24, 22.99],
          [30, 28.99],
          [50, 46.99],
          [75, 69.99],
          [100, 89.99],
        ],
        {
          desc: "Comes with blue cheese & ranch",
          choice: { label: "Sauce", options: ["Buffalo", "Mild", "BBQ"] },
          popular: true,
        },
      ),
      byCount(
        "whole-fried-wings",
        "Whole Fried Wings",
        [
          [5, 8.99],
          [10, 14.99],
          [15, 22.99],
          [20, 29.99],
          [25, 35.99],
          [35, 48.99],
          [50, 69.99],
          [100, 139.99],
        ],
        { desc: "Whole wings, crispy fried" },
      ),
    ],
  },
  {
    id: "platters",
    title: "Platters & Baskets",
    note: "All platters come with fries.",
    items: [
      byCount(
        "chicken-fingers-fries",
        "Chicken Fingers & Fries",
        [
          [4, 6.99],
          [5, 8.99],
          [6, 9.99],
          [10, 15.99],
        ],
        { popular: true },
      ),
      byCount("chicken-strips-fries", "Chicken Strips & Fries", [
        [3, 8.99],
        [5, 12.99],
        [8, 17.99],
      ]),
      byCount("fish-flounder-fries", "Fish Flounder & Fries", [
        [2, 12.99],
        [3, 16.99],
      ]),
      ...build("pl", [
        ["Cheesesteak Platter", 13.99, '10" cheesesteak with french fries'],
        ["Cheeseburger Platter", 12.99, "Cheeseburger with fries"],
        ["Shrimp Basket & Fries", 11.99],
        ["10 Pcs. Chicken Nuggets & Fries", 8.99],
      ]),
    ],
  },
  {
    id: "breakfast-sandwiches",
    title: "Breakfast Sandwiches",
    note: "The biggest breakfast in NJ, all day long. On bagel, Kaiser roll, white, wheat or rye toast, or a white or wheat wrap.",
    choice: {
      label: "Served on",
      options: ["Kaiser Roll", "Bagel", "White Toast", "Wheat Toast", "Rye Toast", "White Wrap", "Wheat Wrap"],
    },
    items: build("bs", [
      ["Egg & Cheese", 4.49],
      ["Pork Roll & Cheese", 7.99],
      ["Pork Roll, Egg & Cheese", 7.99],
      ["Bacon, Egg & Cheese", 7.99],
      ["Beef, Bacon, Egg & Cheese", 9.99],
      ["Sausage, Egg & Cheese", 7.49],
      ["Steak, Egg & Cheese", 7.99],
      ["Turkey Bacon, Egg & Cheese", 7.49],
      ["Turkey Sausage, Egg & Cheese", 7.99],
      ["Scrapple, Egg & Cheese", 7.49],
      ["Lucky 7 Belly Buster", 12.99, '4 Eggs, Pork Roll, Bacon, Sausage, Hash Brown & Cheese on a 10" Sub Roll'],
      ["Lucky 7 Turkey Belly Buster", 12.99, '4 Eggs, Turkey Bacon, Turkey Sausage, Hash Brown & Cheese on a 10" Sub Roll'],
      ["B.L.T.", 7.99],
      ["Turkey Bacon, Lettuce & Tomatoes", 7.99],
      ["Grilled Cheese", 4.99, "Add Bacon or Ham Extra"],
      ["Beef Bacon BLT", 9.99],
      ["Bologna, Egg & Cheese", 8.49],
      ["Pastrami, Egg & Cheese", 10.99],
      ["Turkey Burger, Egg & Cheese", 12.99],
      ["Fish, Egg & Cheese", 12.99],
      ["Chicken Steak, Egg & Cheese", 7.49],
      ["Hash Brown Pattie", 1.75],
      ["Home Fries", 2.99, "Add Pepper $0.50 & Onion $0.50"],
    ]),
  },
  {
    id: "breakfast-platters",
    title: "Breakfast Platters",
    items: build("bp", [
      ["Breakfast Platter", 9.99, "3 Eggs, Meat, Hash Browns & Your Choice of Toast. Egg Whites Extra"],
      ["French Toast Platter", 7.99, "4 Slices, Hash Browns. Add Any Meat or Eggs Extra"],
      ["Pancake Platter", 7.99, "Add Choice of Meat or Eggs Extra"],
      ["Western Omelette", 9.99, "Peppers, Onions & Ham"],
      ["Cheese Omelette", 7.99, "Add Your Choice of Meat Extra"],
      ["Meat Lover Omelette", 10.99, "Pork Roll & Bacon Sausage"],
      ["Eastern Omelette", 8.99, "Pepper, Onions & Cheese"],
      ["Bacon Omelette", 9.99],
      ["Pork Roll Omelette", 9.99],
      ["Veggie Omelette", 9.99, "Pepper, Onions, Mushroom & Tomatoes"],
      ["Ham & Cheese Omelette", 9.99],
      ["Sausage & Cheese Omelette", 9.99],
      ["Steak & Cheese Omelette", 9.99],
      ["Egg White Omelette", 8.99, "Add Any Style of Meat Extra"],
    ]),
  },

  {
    id: "cold-subs",
    title: "Cold Subs",
    note: 'Kaiser roll, half (10") or whole (15"). Toppings: lettuce, tomatoes, onions, sweet peppers, banana hot peppers, jalapeños, cherry hot peppers, black olives & pickles.',
    choice: {
      label: "Cheese",
      options: ["White American", "Yellow American", "Provolone", "Swiss", "Pepper Jack", "Cheddar", "Cooper Sharp", "Mozzarella"],
    },
    items: build(
      "cs",
      [
        ["American", [8.99, 11.99, 15.99], "Ham, Salami & Bologna + American Cheese"],
        ["Lucky 7 Italian", [8.99, 11.99, 16.99], "Ham, Salami, Hot Ham, Pepperoni & Provolone"],
        ["Italian", [8.99, 11.99, 15.99], "Ham, Salami & Provolone"],
        ["Ham & Cheese", [8.99, 11.99, 15.99]],
        ["Turkey & Cheese", [9.49, 11.99, 16.99]],
        ["Pepper Turkey & Cheese", [9.49, 12.49, 16.99]],
        ["Turkey, Ham & Cheese", [10.99, 12.99, 17.99]],
        ["Turkey, Bacon & Cheese", [10.99, 14.99, 18.99]],
        ["Honey Maple Turkey & Cheese", [9.99, 12.49, 16.99]],
        ["Salami & Cheese", [8.99, 11.99, 15.99]],
        ["Honey Maple Ham & Cheese", [9.49, 12.49, 16.99]],
        ["Salsalito Turkey & Cheese", [9.99, 12.49, 16.99]],
        ["Bologna & Cheese", [8.99, 11.99, 15.99]],
        ["Roasted Chicken Breast & Cheese", [9.99, 12.49, 16.99]],
        ["Buffalo Chicken Breast & Cheese", [9.99, 12.49, 16.99]],
        ["Roast Beef & Cheese", [9.99, 13.99, 17.99]],
        ["Liverwurst", [8.99, 11.99, 15.99]],
        ["Chicken Salad", [8.99, 11.99, 15.99]],
        ["Seafood Salad", [8.99, 11.99, 15.99]],
        ["Egg Salad", [8.99, 11.99, 15.99]],
        ["Cheese Hoagie", [8.99, 11.99, 15.99], "American Cheese, Provolone & Swiss"],
        ["Tuna", [8.99, 11.99, 15.99]],
        ["Pastrami Special", [11.99, 14.99, 18.99], "Swiss Cheese, Coleslaw & Russian Dressing"],
        ["Corned Beef Special", [11.99, 14.99, 18.99]],
        ["Roast Beef Special", [11.99, 14.99, 18.99]],
        ["Turkey Special", [11.99, 14.99, 18.99]],
      ],
      SUB,
    ),
  },
  {
    id: "hot-subs",
    title: "Hot Subs",
    note: 'Kaiser roll, half (10") or whole (15").',
    items: [
      ...build(
        "hs",
        [
          ["Cheesesteak", [8.99, 11.99, 15.99]],
          ["Bacon Cheesesteak", [11.99, 14.99, 18.99]],
          ["Cheesesteak Hoagie", [8.99, 11.99, 15.99]],
          ["Pizza Steak", [8.99, 11.99, 15.99]],
          ["Chicken Cheesesteak", [8.99, 11.99, 15.99]],
          ["Bacon Chicken Cheesesteak", [11.99, 14.99, 18.99]],
          ["Buffalo Chicken Cheesesteak", [9.99, 11.99, 15.99]],
          ["BBQ Chicken Cheesesteak", [9.99, 11.99, 15.99]],
          ["Chicken Cheesesteak Hoagie", [9.99, 11.99, 15.99]],
          ["Buffalo Grilled Chicken", [9.99, 12.99, 16.99]],
          ["Grilled Chicken", [9.99, 12.99, 16.99]],
          ["BBQ Grilled Chicken", [9.99, 12.99, 16.99]],
          ["Lucky 7 Chicken Melt", [11.99, 14.99, 18.99], "Grilled Chicken, Bacon & Cheese"],
          ["Buffalo Chicken Cutlet", [8.99, 11.99, 15.99]],
          ["Chicken Cutlet", [8.99, 11.99, 15.99]],
          ["Chicken Cutlet Parmigiana", [8.99, 11.99, 15.99]],
          ["Chicken Tenders", [9.99, 11.99, 15.99]],
          ["Cheeseburger", [9.99, 14.99, 18.99]],
          ["Chopped Cheeseburger", [null, 11.99, 15.99]],
          ["Bacon Cheeseburger", [12.99, 16.99, 20.99]],
          ["Turkey Burger", [10.99, 14.99, 18.99]],
          ["Pastrami & Cheese", [9.99, 12.99, 16.99]],
          ["Corned Beef & Cheese", [9.99, 12.99, 16.99]],
          ["Corned Beef & Pastrami", [10.99, 13.99, 18.99]],
          ["Fish Flounder", [9.99, 12.99, 16.99]],
          ["Tuna Melt", [9.99, 11.99, 15.99]],
          ["Italian Sausage Peppers & Onions", [null, 11.99, 15.99]],
          ["Hot Pastrami", [9.99, 12.99, 16.99]],
          ["Pastrami Reuben", [11.99, 14.99, 18.99], "Swiss Cheese, Sauerkraut & Russian Dressing"],
          ["Turkey Reuben", [11.99, 14.99, 18.99], "Swiss Cheese, Sauerkraut & Russian Dressing"],
          ["Roast Beef Reuben", [11.99, 14.99, 18.99], "Swiss Cheese, Sauerkraut & Russian Dressing"],
          ["Corned Beef Reuben", [11.99, 14.99, 18.99], "Swiss Cheese, Sauerkraut & Russian Dressing"],
          ["BLT", [7.99, 11.99, 15.99]],
        ],
        SUB,
      ),
      ...build(
        "hs",
        [
          ["Italian Hot Dog", [11.99, 15.99], "Potatoes, Peppers & Onions"],
          ["Italian Sausage Parmigiana", [11.99, 15.99]],
          ["Meatballs Parmigiana", [11.99, 15.99]],
          ["Hot Roast Beef & Gravy", [13.99, 17.99]],
        ],
        HALF_WHOLE,
      ),
    ],
  },
  {
    id: "reubens",
    title: "Reubens",
    note: "Grilled Rye w/ Swiss Cheese, Sauerkraut & Russian Dressing",
    items: build("rb", [
      ["Pastrami Reuben", 11.99],
      ["Turkey Reuben", 11.99],
      ["Corned Beef Reuben", 11.99],
      ["Roast Beef Reuben", 12.99],
    ]),
  },
  {
    id: "specials",
    title: "Specials",
    note: "Rye Bread, Swiss Cheese, Coleslaw & Russian Dressing",
    items: build("sp", [
      ["Pastrami Special", 11.99],
      ["Turkey Special", 11.99],
      ["Corned Beef Special", 11.99],
      ["Roast Beef Special", 11.99],
    ]),
  },
  {
    id: "wraps",
    title: "Wraps",
    items: build("wr", [
      ["Turkey & Cheese", 9.99],
      ["Italian", 9.99],
      ["Ham & Cheese", 9.99],
      ["Turkey & Bacon", 12.99],
      ["Tuna Salad", 9.99],
      ["Chicken Salad", 9.99],
      ["Grilled Chicken", 10.99],
      ["Chicken Cutlet", 9.99],
      ["Cheesesteak", 9.99],
      ["Chicken Cheesesteak", 9.99],
      ["Cheeseburger", 10.99],
      ["Chicken Fingers", 9.99],
    ]),
  },
  {
    id: "hoagie-platters",
    title: "Hoagie Platters",
    items: build("hp", [["Hoagie Platter", [69.99, 79.99], "Mini sandwiches for a crowd"]], ["10-15 People (15 minis)", "15-20 People (20 minis)"]),
  },

  {
    id: "salads",
    title: "Salads",
    note: "Lettuce, tomatoes, cucumbers, onions, sweet & banana hot pepper, boiled egg & croutons included. 2 oz. dressing cup with each salad.",
    choice: {
      label: "Dressing",
      options: ["Blue Cheese", "French", "Caesar", "Russian", "Creamy Italian", "Oil & Vinegar", "Balsamic Vinaigrette"],
    },
    items: build("sa", [
      ["Garden Salad", 7.99],
      ["Chef Salad", 14.99, "Turkey, Ham & Provolone"],
      ["Antipasto Salad", 14.99, "Ham, Salami & Provolone"],
      ["Tuna on Salad", 14.99],
      ["Grilled Chicken on Salad", 14.99],
      ["Crispy Chicken on Salad", 14.99],
      ["Tuna Salad on Salad", 14.99],
      ["Shrimp on Salad", 14.99],
      ["Ham & Cheese Salad", 14.99],
      ["Chicken Salad on Salad", 14.99],
      ["Seafood on Salad", 14.99],
      ["Turkey & Cheese Salad", 14.99],
      ["2 Pcs. Fish on Salad", 16.99],
      ["Honey Turkey & Cheese Salad", 14.99],
      ["Mixed Cheeses on Salad", 14.99],
      ["Add Bacon", 4.0],
    ]),
  },
  {
    id: "sides",
    title: "Sides",
    items: [
      ...build(
        "sd",
        [
          ["Mac & Cheese", [3.99, 7.99]],
          ["French Fries", [3.49, 7.99]],
          ["Wiz Cheese Fries", [4.99, 8.99]],
          ["Mozzarella Fries", [4.99, 8.99]],
          ["Bacon Cheese Fries", [6.99, 11.99]],
          ["Pizza Fries", [4.99, 8.99]],
          ["Curly Fries", [4.49, 8.99]],
          ["Potato Wedges", [5.49, 9.99]],
          ["Onion Rings", [4.99, 9.99]],
          ["Potato Salad", [3.99, 7.99]],
          ["Macaroni Salad", [3.99, 7.99]],
          ["Coleslaw", [3.99, 7.99]],
          ["Egg Salad", [4.99, 9.99]],
          ["Seafood Salad", [5.99, 10.99]],
          ["Chicken Salad", [5.99, 10.99]],
          ["Tuna Salad", [5.99, 10.99]],
        ],
        SIDE,
      ),
      ...build("sd", [["Mozzarella Sticks", [7.99, 12.99]]], ["6 Pcs.", "12 Pcs."]),
      ...build("sd", [
        ["Broccoli Bites", 5.99],
        ["Corn Nuggets", 5.99],
        ["Jalapeño Peppers", 6.99],
        ["Fried Mushrooms", 5.99],
      ]),
    ],
  },

  {
    id: "pizza",
    title: "Pizza",
    note: "Toppings: tomatoes, onions, black olives, mushrooms, green peppers, hot peppers, ham, pepperoni, sausage, red onions, pineapple, cherry peppers, sweet peppers, bacon. Add veggie topping $1.99, meat topping $3.99.",
    items: build(
      "pz",
      [
        ["Plain Pizza Special", [12.99, 14.99]],
        ["1 Topping Pizza", [14.99, 17.99]],
        ["2 Pizzas w/ 2 Toppings", [29.99, 35.99]],
        ["Veggie Pizza", [13.99, 16.99], "Tomatoes, Onions, Black Olives & Green Peppers"],
        ["The Works", [13.99, 17.99], "Sausage, Pepperoni, Ham, Mushrooms & Onions"],
        ["Meat Lovers Pizza", [14.99, 18.99], "Meatballs, Ham, Pepperoni, Sausage & Bacon"],
        ["Grilled Chicken Pizza", [14.99, 18.99], "Grilled Chicken & Extra Cheese"],
        ["Steak Pizza", [14.99, 18.99], "Fresh Beef Steak or Chicken Steak"],
        ["Buffalo Chicken Pizza", [14.99, 18.99], "Crispy Chicken, Buffalo Sauce & Ranch"],
      ],
      PIZZA,
    ),
  },
];

const POPULAR = ["hs-cheesesteak", "cs-lucky-7-italian", "bs-lucky-7-belly-buster", "pz-the-works"];
for (const c of menu) for (const i of c.items) if (POPULAR.includes(i.id)) i.popular = true;

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function findItem(id: string) {
  for (const cat of menu) {
    const item = cat.items.find((i) => i.id === id);
    if (item) return { category: cat, item };
  }
  return undefined;
}

export function priceOf(item: MenuItem, size?: string) {
  if (item.sizes) {
    return (item.sizes.find((s) => s.label === size) ?? item.sizes[0]).price;
  }
  return item.price ?? 0;
}

export const fromPrice = (item: MenuItem) =>
  item.sizes ? Math.min(...item.sizes.map((s) => s.price)) : (item.price ?? 0);

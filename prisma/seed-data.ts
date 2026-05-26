export type SeedCategory = {
  id: number;
  slug: string;
  name: string;
  imagePath: string;
  sortOrder: number;
};

export type SeedProduct = {
  id: number;
  slug: string;
  title: string;
  description: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  categoryName: string;
  brand?: string;
  material?: string;
  colors?: string[];
  setOptions?: { id: string; title: string }[];
  specs?: Record<string, string>;
  imgs: { thumbnails: string[]; previews: string[] };
};

export const seedCategories: SeedCategory[] = [
  {
    id: 1,
    slug: 'knives-cutting',
    name: 'Knives & Cutting',
    imagePath: '/images/categories/categories-01.png',
    sortOrder: 1,
  },
  {
    id: 2,
    slug: 'cookware',
    name: 'Cookware',
    imagePath: '/images/categories/categories-02.png',
    sortOrder: 2,
  },
  {
    id: 3,
    slug: 'utensils-gadgets',
    name: 'Utensils & Gadgets',
    imagePath: '/images/categories/categories-03.png',
    sortOrder: 3,
  },
  {
    id: 4,
    slug: 'storage',
    name: 'Storage',
    imagePath: '/images/categories/categories-04.png',
    sortOrder: 4,
  },
  {
    id: 5,
    slug: 'small-appliances',
    name: 'Small Appliances',
    imagePath: '/images/categories/categories-05.png',
    sortOrder: 5,
  },
  {
    id: 6,
    slug: 'bakeware',
    name: 'Bakeware',
    imagePath: '/images/categories/categories-06.png',
    sortOrder: 6,
  },
];

const img = (n: number) => ({
  thumbnails: [
    `/images/products/product-${n}-sm-1.png`,
    `/images/products/product-${n}-sm-2.png`,
  ],
  previews: [
    `/images/products/product-${n}-bg-1.png`,
    `/images/products/product-${n}-bg-2.png`,
  ],
});

export const seedProducts: SeedProduct[] = [
  {
    id: 1,
    title: 'Professional 8-Piece Chef Knife Set',
    slug: 'professional-8-piece-chef-knife-set',
    description:
      'High-carbon stainless steel blades with ergonomic handles. Includes chef, santoku, utility, paring, and steak knives plus sharpening steel and block.',
    reviews: 124,
    price: 10780,
    discountedPrice: 8500,
    categoryName: 'Knives & Cutting',
    brand: 'EdgeCraft',
    material: 'Stainless steel',
    colors: ['black', 'silver'],
    setOptions: [
      { id: '6-piece', title: '6-Piece' },
      { id: '8-piece', title: '8-Piece' },
      { id: '10-piece', title: '10-Piece' },
    ],
    specs: {
      Material: 'High-carbon stainless steel',
      'Block material': 'Acacia wood',
      Warranty: 'Lifetime sharpening',
    },
    imgs: img(1),
  },
  {
    id: 2,
    title: 'Japanese Santoku Knife 7-Inch',
    slug: 'japanese-santoku-knife-7-inch',
    description:
      'Hollow-ground blade reduces friction for clean slices. Ideal for vegetables, onions, and injera prep.',
    reviews: 89,
    price: 4520,
    discountedPrice: 3360,
    categoryName: 'Knives & Cutting',
    brand: 'EdgeCraft',
    material: 'Damascus steel',
    colors: ['silver'],
    specs: {
      'Blade length': '7 inches',
      Handle: 'Pakka wood',
      Weight: '175 g',
    },
    imgs: img(2),
  },
  {
    id: 3,
    title: 'Bamboo Cutting Board Set (3-Pack)',
    slug: 'bamboo-cutting-board-set',
    description:
      'Eco-friendly bamboo boards in small, medium, and large. Juice grooves on the large board for carving.',
    reviews: 56,
    price: 2800,
    discountedPrice: 1940,
    categoryName: 'Knives & Cutting',
    brand: 'GreenPrep',
    material: 'Bamboo',
    colors: ['natural'],
    setOptions: [
      { id: '2-pack', title: '2-Pack' },
      { id: '3-pack', title: '3-Pack' },
    ],
    specs: {
      Material: 'Organic bamboo',
      Finish: 'Food-safe mineral oil',
      Care: 'Hand wash only',
    },
    imgs: img(3),
  },
  {
    id: 4,
    title: 'Cast Iron Dutch Oven 6-Qt',
    slug: 'cast-iron-dutch-oven-6qt',
    description:
      'Heavy-duty pot for shiro, doro wot, and slow cooking. Oven-safe with tight-fitting lid — a kitchen staple in Ethiopian homes.',
    reviews: 203,
    price: 7360,
    discountedPrice: 5650,
    categoryName: 'Cookware',
    brand: 'ForgeKitchen',
    material: 'Cast iron',
    colors: ['red', 'blue', 'cream'],
    specs: {
      Capacity: '6 litres',
      'Interior coating': 'Enameled',
      'Heat safe': '260°C',
    },
    imgs: img(4),
  },
  {
    id: 5,
    title: 'Non-Stick Skillet 12-Inch',
    slug: 'non-stick-skillet-12-inch',
    description:
      'PFOA-free ceramic non-stick coating. Ideal for tibs, eggs, and quick sautéing on both gas and electric stoves.',
    reviews: 67,
    price: 3370,
    discountedPrice: 2510,
    categoryName: 'Cookware',
    brand: 'ForgeKitchen',
    material: 'Aluminum',
    colors: ['black', 'gray'],
    specs: {
      Diameter: '30 cm',
      Coating: 'Ceramic non-stick',
      'Dishwasher safe': 'Yes',
    },
    imgs: img(5),
  },
  {
    id: 6,
    title: 'Stainless Steel Saucepan Set',
    slug: 'stainless-steel-saucepan-set',
    description:
      'Tri-ply construction for even heating. Set includes three saucepans with lids for sauces, shiro, and daily wot.',
    reviews: 41,
    price: 6780,
    discountedPrice: 5070,
    categoryName: 'Cookware',
    brand: 'ForgeKitchen',
    material: 'Stainless steel',
    setOptions: [
      { id: '2-piece', title: '2-Piece' },
      { id: '3-piece', title: '3-Piece' },
    ],
    specs: {
      Construction: 'Tri-ply',
      'Heat safe': '230°C',
      Lids: 'Tempered glass',
    },
    imgs: img(6),
  },
  {
    id: 7,
    title: 'Silicone Spatula & Turner Set',
    slug: 'silicone-spatula-turner-set',
    description:
      'Heat-resistant utensils for flipping injera and stirring wot without scratching your cookware.',
    reviews: 38,
    price: 1650,
    discountedPrice: 1090,
    categoryName: 'Utensils & Gadgets',
    brand: 'PrepPro',
    material: 'Silicone',
    colors: ['red', 'blue', 'gray'],
    setOptions: [
      { id: '4-piece', title: '4-Piece' },
      { id: '6-piece', title: '6-Piece' },
    ],
    specs: {
      'Heat resistant': '315°C',
      'BPA free': 'Yes',
      'Dishwasher safe': 'Yes',
    },
    imgs: img(7),
  },
  {
    id: 8,
    title: 'Stainless Steel Garlic Press',
    slug: 'stainless-steel-garlic-press',
    description:
      'Heavy-duty press for garlic and ginger — essential for Ethiopian spice bases and daily cooking.',
    reviews: 22,
    price: 1370,
    discountedPrice: 910,
    categoryName: 'Utensils & Gadgets',
    brand: 'PrepPro',
    material: 'Stainless steel',
    colors: ['silver'],
    specs: {
      Material: '18/8 stainless steel',
      'Dishwasher safe': 'Yes',
    },
    imgs: img(8),
  },
  {
    id: 9,
    title: 'Measuring Cups & Spoons Set',
    slug: 'measuring-cups-spoons-set',
    description:
      'Nested cups and spoons with engraved measurements. Magnetic storage strip included.',
    reviews: 51,
    price: 1250,
    discountedPrice: 860,
    categoryName: 'Utensils & Gadgets',
    brand: 'PrepPro',
    material: 'Stainless steel',
    colors: ['silver'],
    specs: {
      Pieces: '12',
      Storage: 'Magnetic strip',
      'Dishwasher safe': 'Yes',
    },
    imgs: img(1),
  },
  {
    id: 10,
    title: 'Berbere & Spice Storage Set (20 Jars)',
    slug: 'berbere-spice-storage-set',
    description:
      'Organize berbere, mitmita, and everyday spices. Wall-mount rack with labeled glass jars for Ethiopian pantries.',
    reviews: 73,
    price: 3080,
    discountedPrice: 2400,
    categoryName: 'Storage',
    brand: 'PantryPlus',
    material: 'Glass',
    colors: ['clear'],
    specs: {
      Jars: '20 glass jars',
      Mounting: 'Wall or counter',
      Labels: 'Chalkboard included',
    },
    imgs: img(2),
  },
  {
    id: 11,
    title: 'Airtight Food Container Set',
    slug: 'airtight-food-container-set',
    description:
      'BPA-free containers with snap-lock lids. Stackable design for fridge and pantry in compact Addis kitchens.',
    reviews: 94,
    price: 2220,
    discountedPrice: 1660,
    categoryName: 'Storage',
    brand: 'PantryPlus',
    material: 'Plastic',
    colors: ['clear'],
    setOptions: [
      { id: '10-piece', title: '10-Piece' },
      { id: '18-piece', title: '18-Piece' },
      { id: '24-piece', title: '24-Piece' },
    ],
    specs: {
      'BPA free': 'Yes',
      'Microwave safe': 'Lids off',
      Stackable: 'Yes',
    },
    imgs: img(3),
  },
  {
    id: 12,
    title: 'Ethiopian Coffee Ceremony Set',
    slug: 'ethiopian-coffee-ceremony-set',
    description:
      'Everything for bunna at home: rapid-boil kettle, handle, and tray-friendly design. Auto shut-off for safe daily use.',
    reviews: 112,
    price: 2800,
    discountedPrice: 2230,
    categoryName: 'Small Appliances',
    brand: 'BrewBase',
    material: 'Stainless steel',
    colors: ['silver', 'black'],
    specs: {
      Capacity: '1.7 litres',
      Power: '1500W',
      'Auto shut-off': 'Yes',
    },
    imgs: img(4),
  },
  {
    id: 13,
    title: 'Immersion Hand Blender',
    slug: 'immersion-hand-blender',
    description:
      'Variable speed stick blender with whisk and chopper attachments. Ideal for shiro, sauces, and smoothies.',
    reviews: 48,
    price: 2570,
    discountedPrice: 2000,
    categoryName: 'Small Appliances',
    brand: 'BrewBase',
    material: 'Plastic',
    colors: ['black', 'white'],
    specs: {
      Speeds: '8 variable',
      Attachments: 'Whisk, chopper',
      Warranty: '2 years',
    },
    imgs: img(5),
  },
  {
    id: 14,
    title: 'Injera Mitad / Baking Pan (2-Pack)',
    slug: 'injera-mitad-baking-pan-2-pack',
    description:
      'Wide aluminum pans suited for injera and large flatbreads. Even heat distribution for consistent results.',
    reviews: 35,
    price: 1600,
    discountedPrice: 1260,
    categoryName: 'Bakeware',
    brand: 'BakeWell',
    material: 'Aluminum',
    colors: ['silver'],
    setOptions: [
      { id: '1-pack', title: '1-Pack' },
      { id: '2-pack', title: '2-Pack' },
    ],
    specs: {
      Size: '46 x 33 cm',
      Material: 'Heavy-gauge aluminum',
      'Dishwasher safe': 'Yes',
    },
    imgs: img(6),
  },
  {
    id: 15,
    title: 'Stainless Mixing Bowl Set',
    slug: 'stainless-mixing-bowl-set',
    description:
      'Nested bowls with non-slip bases for batter, marinating tibs, and prep before holiday feasts.',
    reviews: 29,
    price: 2390,
    discountedPrice: 1830,
    categoryName: 'Bakeware',
    brand: 'BakeWell',
    material: 'Stainless steel',
    colors: ['silver'],
    setOptions: [
      { id: '3-piece', title: '3-Piece' },
      { id: '5-piece', title: '5-Piece' },
    ],
    specs: {
      Material: '18/8 stainless steel',
      'Non-slip base': 'Yes',
      Nesting: 'Yes',
    },
    imgs: img(7),
  },
];

const dataPlant = [
  {
    id: 1,
    img: {
      src: "https://myplantin.com/_next/image?url=https%3A%2F%2Fstrapi.myplantin.com%2Fsmall_leaf_ge67528b35_1920_0e56f75901.webp&w=1920&q=100",
      alt: "Aloe"
    },
    title: "Aloe Vera",
    text: "Aloe Barbadensis Miller",
    category: "Succulents",
    description: "A versatile succulent known for its thick, fleshy leaves filled with soothing gel. Widely used in skincare and for treating minor burns. One of the most popular houseplants in the world.",
    watering: "Every 2–3 weeks",
    light: "Bright indirect to full sun",
    soil: "Sandy, well-draining cactus mix",
    difficulty: "Easy",
    toxicity: "Mildly toxic to pets",
    height: "1–2 feet"
  },
  {
    id: 2,
    img: {
      src: "https://myplantin.com/_next/image?url=https%3A%2F%2Fstrapi.myplantin.com%2Fsmall_menu_b86e8b64-ddb5-4f56-aab0-78c95fa96de2.webp&w=1920&q=100",
      alt: "Blue periwinkle"
    },
    title: "Blue Periwinkle",
    text: "Vinca major",
    category: "Shrubs",
    description: "An evergreen trailing vine with striking blue-purple flowers. Popular as ground cover in shaded garden areas. Fast-growing and very low maintenance once established.",
    watering: "Every 5–7 days",
    light: "Full sun to partial shade",
    soil: "Moist, well-draining",
    difficulty: "Easy",
    toxicity: "Toxic if ingested",
    height: "6–12 inches"
  },
  {
    id: 3,
    img: {
      src: "https://myplantin.com/_next/image?url=https%3A%2F%2Fstrapi.myplantin.com%2Fsmall_Angel_s_trumpet_close_up_image_9532557bad.jpg&w=1920&q=100",
      alt: "Devil's Trumpet"
    },
    title: "Devil's Trumpet",
    text: "Datura metel",
    category: "Shrubs",
    description: "A striking plant with large, fragrant, trumpet-shaped flowers that open in the evening. Gorgeous in gardens but all parts of the plant are highly poisonous. Handle with care.",
    watering: "Every 5–7 days",
    light: "Full sun",
    soil: "Rich, well-draining",
    difficulty: "Moderate",
    toxicity: "Highly toxic — all parts",
    height: "3–5 feet"
  },
  {
    id: 4,
    img: {
      src: "https://myplantin.com/_next/image?url=https%3A%2F%2Fstrapi.myplantin.com%2Fsmall_Depositphotos_464136050_XL_fc970145c6.webp&w=1920&q=100",
      alt: "Dumb Cane"
    },
    title: "Dumb Cane",
    text: "Dieffenbachia seguine",
    category: "Foliage",
    description: "A tropical houseplant with large, beautifully patterned leaves in shades of green and cream. The sap causes temporary speechlessness if ingested, which is how it got its name.",
    watering: "Every 7–10 days",
    light: "Bright indirect light",
    soil: "Well-draining potting mix",
    difficulty: "Easy",
    toxicity: "Toxic to humans & pets",
    height: "3–6 feet"
  },
  {
    id: 5,
    img: {
      src: "https://myplantin.com/_next/image?url=https%3A%2F%2Fstrapi.myplantin.com%2Fsmall_main_7056a30f-bf24-4024-a596-6202cb6aa73a.webp&w=1920&q=100",
      alt: "Rat Tail Cactus"
    },
    title: "Rat Tail Cactus",
    text: "Aporocactus flagelliformis",
    category: "Cactuses",
    description: "A trailing cactus with long, ribbed, thin stems covered in small golden spines. Produces vibrant magenta-red flowers in spring. Perfect for hanging baskets in sunny spots.",
    watering: "Every 10–14 days",
    light: "Full sun",
    soil: "Well-draining cactus mix",
    difficulty: "Easy",
    toxicity: "Non-toxic",
    height: "Trailing 2–6 feet"
  },
  {
    id: 6,
    img: {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ZEbZRpF4opTmFNKReE9Ee1cuYJaML9-Agg&s",
      alt: "Snake Plant"
    },
    title: "Snake Plant",
    text: "Dracaena trifasciata",
    category: "Houseplants",
    description: "One of the most resilient houseplants ever — known for its tall, architectural sword-shaped leaves with yellow edges. An excellent air purifier that can survive almost any condition.",
    watering: "Every 2–6 weeks",
    light: "Low to bright indirect light",
    soil: "Well-draining, dry soil",
    difficulty: "Easy",
    toxicity: "Mildly toxic to pets",
    height: "2–4 feet"
  },
  {
    id: 7,
    img: {
      src: "https://m.media-amazon.com/images/I/61iYu9acZ9L._AC_UF1000,1000_QL80_.jpg",
      alt: "Peace Lily"
    },
    title: "Peace Lily",
    text: "Spathiphyllum wallisii",
    category: "Houseplants",
    description: "A beautiful tropical plant that thrives in low light and produces elegant white sail-like flowers. One of the most effective houseplants for removing indoor air pollutants like formaldehyde.",
    watering: "Every 7–10 days",
    light: "Low to medium indirect light",
    soil: "Rich, well-draining potting mix",
    difficulty: "Easy",
    toxicity: "Toxic to pets & children",
    height: "1–4 feet"
  },
  {
    id: 8,
    img: {
      src: "https://www.thesill.com/cdn/shop/articles/73cc14cd4cbc12d7985c8e83a7d57ed1e69cec5f-1200x856.webp?v=1727201537",
      alt: "Spider Plant"
    },
    title: "Spider Plant",
    text: "Chlorophytum comosum",
    category: "Houseplants",
    description: "A cheerful, easy-to-grow plant that produces long arching green-and-white striped leaves and tiny 'spiderettes' on long runners. Non-toxic and perfect for beginners.",
    watering: "Every 7–10 days",
    light: "Bright indirect light",
    soil: "Well-draining potting mix",
    difficulty: "Easy",
    toxicity: "Non-toxic (pet safe)",
    height: "1–2 feet"
  },
  {
    id: 9,
    img: {
      src: "https://m.media-amazon.com/images/I/51n0fa4c-iL._AC_UF1000,1000_QL80_.jpg",
      alt: "Jade Plant"
    },
    title: "Jade Plant",
    text: "Crassula ovata",
    category: "Succulents",
    description: "A long-lived succulent with thick, shiny oval leaves on woody stems. In many cultures, it's considered a symbol of good luck and prosperity. Can live for decades with minimal care.",
    watering: "Every 2–3 weeks",
    light: "Bright indirect to full sun",
    soil: "Well-draining succulent mix",
    difficulty: "Easy",
    toxicity: "Mildly toxic to pets",
    height: "3–6 feet (slow growing)"
  },
  {
    id: 10,
    img: {
      src: "https://i.etsystatic.com/10267921/r/il/d9fb66/5381152342/il_fullxfull.5381152342_jgl4.jpg",
      alt: "Echeveria"
    },
    title: "Echeveria",
    text: "Echeveria elegans",
    category: "Succulents",
    description: "A gorgeous rosette-forming succulent with fleshy leaves in shades of green, pink, and purple. Produces beautiful bell-shaped flowers in summer. Perfect for small pots and arrangements.",
    watering: "Every 10–14 days",
    light: "Bright direct sunlight",
    soil: "Gritty, well-draining cactus mix",
    difficulty: "Easy",
    toxicity: "Non-toxic",
    height: "2–12 inches"
  },
  {
    id: 11,
    img: {
      src: "https://plantsguru.com/cdn/shop/files/Rose_Baby_Pink.jpg?v=1758804477",
      alt: "Rose"
    },
    title: "Rose",
    text: "Rosa indica",
    category: "Flowers",
    description: "The quintessential garden flower, available in thousands of varieties and nearly every color. Roses are celebrated worldwide for their stunning blooms and intoxicating fragrance.",
    watering: "2–3 times per week",
    light: "Full sun (min 6 hours)",
    soil: "Rich, well-draining, slightly acidic",
    difficulty: "Moderate",
    toxicity: "Non-toxic (thorns cause injury)",
    height: "2–7 feet"
  },
  {
    id: 12,
    img: {
      src: "https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg",
      alt: "Sunflower"
    },
    title: "Sunflower",
    text: "Helianthus annuus",
    category: "Flowers",
    description: "A tall, cheerful annual that tracks the sun across the sky. Sunflowers are grown for their ornamental value, edible seeds, and oil production. A symbol of happiness and warmth.",
    watering: "Weekly (drought tolerant)",
    light: "Full sun",
    soil: "Well-draining, slightly acidic to neutral",
    difficulty: "Easy",
    toxicity: "Non-toxic",
    height: "3–12 feet"
  },
  {
    id: 13,
    img: {
      src: "https://m.media-amazon.com/images/I/51M1pKcDpQL.jpg",
      alt: "Tulip"
    },
    title: "Tulip",
    text: "Tulipa gesneriana",
    category: "Flowers",
    description: "A beloved spring-blooming bulb plant with classic cup-shaped flowers in almost every color imaginable. Tulips are a timeless symbol of spring and renewal across the world.",
    watering: "Every 7–10 days when growing",
    light: "Full sun to partial shade",
    soil: "Well-draining, slightly sandy",
    difficulty: "Easy",
    toxicity: "Toxic to cats & dogs",
    height: "6–24 inches"
  },
  {
    id: 14,
    img: {
      src: "https://upload.wikimedia.org/wikipedia/commons/9/90/Basil-Basilico-Ocimum_basilicum-albahaca.jpg",
      alt: "Basil"
    },
    title: "Basil",
    text: "Ocimum basilicum",
    category: "Herbs",
    description: "A fragrant culinary herb at the heart of Mediterranean cooking — from Italian pesto to Thai curry. Basil thrives in warm, sunny conditions and is ideal for any kitchen garden.",
    watering: "Every 2–3 days",
    light: "Full sun (6–8 hours)",
    soil: "Rich, moist, well-draining",
    difficulty: "Moderate",
    toxicity: "Non-toxic (edible)",
    height: "1–2 feet"
  },
  {
    id: 15,
    img: {
      src: "https://cdn.shopify.com/s/files/1/0573/3993/6868/t/6/assets/mint-closeup-pot.jpeg-1696612175222.jpg?v=1696612176",
      alt: "Mint"
    },
    title: "Mint",
    text: "Mentha spicata",
    category: "Herbs",
    description: "A fast-growing, incredibly aromatic herb used in teas, cocktails, desserts, and savory dishes. Mint is known for its refreshing scent and tendency to spread — best grown in containers.",
    watering: "Every 2–3 days",
    light: "Full sun to partial shade",
    soil: "Moist, well-draining, rich",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible)",
    height: "1–2 feet"
  },
  {
    id: 16,
    img: {
      src: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Rosemary_in_bloom.JPG",
      alt: "Rosemary"
    },
    title: "Rosemary",
    text: "Salvia rosmarinus",
    category: "Herbs",
    description: "A fragrant Mediterranean shrubby herb with needle-like leaves and small blue flowers. Widely used in cooking for meats and breads, and historically associated with memory and remembrance.",
    watering: "Every 7–10 days",
    light: "Full sun",
    soil: "Well-draining, slightly sandy",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible)",
    height: "2–4 feet"
  },
  {
    id: 17,
    img: {
      src: "https://media.istockphoto.com/id/1477444644/photo/beautiful-lush-houseplant-ficus-benjamina-commonly-known-as-weeping-fig-benjamin-fig-or-ficus.jpg?s=612x612&w=0&k=20&c=O3xJqs-a5ZnpYT2ptlXTlH8mF5jCFTznz7pyQ4qlpVc=",
      alt: "Ficus Tree"
    },
    title: "Ficus",
    text: "Ficus benjamina",
    category: "Trees",
    description: "A graceful indoor tree with delicate, weeping branches and small glossy leaves. Ficus trees can be sensitive to changes in their environment, often dropping leaves when moved to a new spot.",
    watering: "Every 7–10 days",
    light: "Bright indirect light",
    soil: "Well-draining potting mix",
    difficulty: "Moderate",
    toxicity: "Mildly toxic (irritating sap)",
    height: "3–10 feet indoors"
  },
  {
    id: 18,
    img: {
      src: "https://cdn1.img.sputniknews.in/img/07e7/06/04/2329676_0:0:3642:2048_1920x0_80_0_0_827527879f299db353a6fcbacef3e4b7.jpg",
      alt: "Banyan Tree"
    },
    title: "Banyan Tree",
    text: "Ficus benghalensis",
    category: "Trees",
    description: "One of the world's most iconic and majestic trees, the Banyan can cover vast areas with its aerial prop roots, effectively becoming a forest of its own. Sacred across South Asian cultures.",
    watering: "Weekly when young, drought tolerant when mature",
    light: "Full sun",
    soil: "Rich, moist, well-draining",
    difficulty: "Hard",
    toxicity: "Non-toxic",
    height: "Up to 100 feet"
  },
  {
    id: 19,
    img: {
      src: "https://theturfgrassgroup.com/wp-content/uploads/2023/05/theturfgrassgroup-1.png",
      alt: "Lawn Grass"
    },
    title: "Bermuda Grass",
    text: "Cynodon dactylon",
    category: "Grasses",
    description: "A hardy, warm-season grass used extensively for lawns, golf courses, and sports fields around the world. It's highly drought tolerant and grows aggressively to form a dense, resilient turf.",
    watering: "2–3 times per week",
    light: "Full sun",
    soil: "Any well-draining soil",
    difficulty: "Easy",
    toxicity: "Non-toxic",
    height: "1–2 inches mowed"
  },
  {
    id: 20,
    img: {
      src: "https://txmg.org/hendersonmg/files/2022/03/Lemongrass.jpg",
      alt: "Lemongrass"
    },
    title: "Lemongrass",
    text: "Cymbopogon citratus",
    category: "Grasses",
    description: "A tropical clumping grass with a strong, refreshing citrus scent widely used in Southeast Asian cooking and aromatherapy. Also acts as a natural mosquito repellent in the garden.",
    watering: "Every 5–7 days",
    light: "Full sun",
    soil: "Rich, moist, well-draining",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible)",
    height: "3–6 feet"
  },
  {
    id: 21,
    img: {
      src: "https://www.thespruce.com/thmb/H3hYYBq9QP98uNkB3OjuZI-Q_dg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/how-to-grow-organic-fiddlehead-ferns-2539638-hero-23c689cdd2b74f0c9e817cc6e710f0b8-82f8bca0439d493c8a5d09a4683434dc.jpg",
      alt: "Fern"
    },
    title: "Boston Fern",
    text: "Nephrolepis exaltata",
    category: "Ferns",
    description: "A classic and elegant fern with long, arching, feathery fronds. Popular as a hanging basket plant and considered one of the best air-purifying houseplants available. Loves humidity.",
    watering: "Every 2–3 days (loves humidity)",
    light: "Bright indirect light",
    soil: "Peat-based, well-draining",
    difficulty: "Moderate",
    toxicity: "Non-toxic (pet safe)",
    height: "1–3 feet"
  },
  {
    id: 22,
    img: {
      src: "https://nurtureplant.in/wp-content/uploads/2019/09/pl2000030502.jpg",
      alt: "Maidenhair Fern"
    },
    title: "Maidenhair Fern",
    text: "Adiantum raddianum",
    category: "Ferns",
    description: "A delicate and beautiful fern with airy, fan-shaped leaflets on slender, dark wiry stems. Notoriously demanding — it requires consistently high humidity and moisture to thrive.",
    watering: "Every 2–3 days",
    light: "Medium indirect light",
    soil: "Rich, moist, well-draining",
    difficulty: "Hard",
    toxicity: "Non-toxic",
    height: "1–2 feet"
  },
  {
    id: 23,
    img: {
      src: "https://upload.wikimedia.org/wikipedia/commons/6/65/Sparrige_Sch%C3%BCppling_%28Pholiota_squarrosa%29.jpg",
      alt: "Mushroom"
    },
    title: "Button Mushroom",
    text: "Agaricus bisporus",
    category: "Mushrooms",
    description: "The world's most widely cultivated edible mushroom. White to light brown with a mild, earthy flavor, used in countless recipes worldwide. Easy to grow at home with the right kit.",
    watering: "Keep substrate moist (spray daily)",
    light: "Indirect or shade",
    soil: "Composted manure substrate",
    difficulty: "Moderate",
    toxicity: "Non-toxic (edible)",
    height: "2–4 inches"
  },
  {
    id: 24,
    img: {
      src: "https://m.media-amazon.com/images/I/71jENZFg6IL.jpg",
      alt: "Shiitake"
    },
    title: "Shiitake",
    text: "Lentinula edodes",
    category: "Mushrooms",
    description: "A prized culinary mushroom native to East Asia with rich, savory, umami flavor. Widely used in Asian cuisine and known for its immune-boosting and medicinal properties.",
    watering: "Keep substrate moist",
    light: "Shade or indirect light",
    soil: "Hardwood logs or sawdust",
    difficulty: "Moderate",
    toxicity: "Non-toxic (edible)",
    height: "2–5 inches"
  },
  {
    id: 25,
    img: {
      src: "https://media.istockphoto.com/id/484572810/photo/prickly-pear-cactus-close-up-with-fruit-in-red-color.jpg?s=612x612&w=0&k=20&c=oLqiAIzvSJWum-ncS20rdsDigFgZQbwBrLXH2TQ9RKY=",
      alt: "Opuntia"
    },
    title: "Prickly Pear",
    text: "Opuntia ficus-indica",
    category: "Cactuses",
    description: "A flat-padded cactus native to the Americas that produces beautiful yellow flowers and edible fruits called 'tunas'. Used in food, medicine, and even as a natural dye.",
    watering: "Monthly (extremely drought tolerant)",
    light: "Full sun",
    soil: "Sandy, well-draining cactus mix",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible fruit)",
    height: "3–7 feet"
  },
  {
    id: 26,
    img: {
      src: "https://cdn.pixabay.com/photo/2016/08/15/14/35/lavender-1595581_1280.jpg",
      alt: "Lavender"
    },
    title: "Lavender",
    text: "Lavandula angustifolia",
    category: "Shrubs",
    description: "A fragrant Mediterranean shrub celebrated for its beautiful purple flower spikes and calming, soothing scent. Used extensively in aromatherapy, cosmetics, cooking, and as a natural insect repellent.",
    watering: "Every 7–14 days (drought tolerant)",
    light: "Full sun (min 6 hours)",
    soil: "Well-draining, slightly alkaline",
    difficulty: "Easy",
    toxicity: "Mildly toxic to pets",
    height: "1–3 feet"
  },
  {
    id: 27,
    img: {
      src: "https://yourhomify.com/wp-content/uploads/2024/06/What-is-a-Money-Plant.webp",
      alt: "Money Plant"
    },
    title: "Money Plant",
    text: "Epipremnum aureum",
    category: "Houseplants",
    description: "Also known as Golden Pothos, this trailing vine is nearly indestructible — it thrives on neglect. Widely believed in many Asian cultures to bring good luck, fortune, and prosperity to the home.",
    watering: "Every 7–10 days",
    light: "Low to bright indirect light",
    soil: "Well-draining potting mix",
    difficulty: "Easy",
    toxicity: "Toxic to pets & children",
    height: "Trailing up to 10 feet"
  },
  {
    id: 28,
    img: {
      src: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Zamioculcas_zamiifolia_1.jpg",
      alt: "ZZ Plant"
    },
    title: "ZZ Plant",
    text: "Zamioculcas zamiifolia",
    category: "Houseplants",
    description: "An extremely tough and beautiful houseplant with glossy, deep green leaves. The ZZ plant tolerates neglect, low light, and drought better than almost any other houseplant — perfect for busy people.",
    watering: "Every 2–4 weeks",
    light: "Low to bright indirect light",
    soil: "Well-draining potting mix",
    difficulty: "Easy",
    toxicity: "Toxic to pets & children",
    height: "2–4 feet"
  },
  {
    id: 29,
    img: {
      src: "https://plantura.garden/uk/wp-content/uploads/sites/2/2022/11/thyme-inflorescence-pink.jpg",
      alt: "Thyme"
    },
    title: "Thyme",
    text: "Thymus vulgaris",
    category: "Herbs",
    description: "A compact, drought-tolerant culinary and medicinal herb with tiny aromatic leaves and delicate pink flowers. A staple of Mediterranean cuisine and known for its antiseptic properties.",
    watering: "Every 7–10 days",
    light: "Full sun",
    soil: "Well-draining, slightly sandy",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible)",
    height: "6–12 inches"
  },
  {
    id: 30,
    img: {
      src: "https://www.flowerchimp.com/cdn/shop/articles/dandilieo_30faf95c-d4ca-4b12-9147-59cfc482cb1b_600x.png?v=1757310836",
      alt: "Weed"
    },
    title: "Dandelion",
    text: "Taraxacum officinale",
    category: "Weeds",
    description: "A resilient perennial weed that is actually entirely edible — leaves, flowers, and roots. Rich in vitamins A, C, and K. Dandelion is used in salads, teas, and traditional medicine worldwide.",
    watering: "Rain-fed; drought tolerant",
    light: "Full sun to partial shade",
    soil: "Adapts to almost any soil",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible)",
    height: "6–18 inches"
  },
  {
    id: 31,
    img: {
      src: "https://myplantin.com/_next/image?url=https%3A%2F%2Fstrapi.myplantin.com%2Fsmall_main_c34276f1-6980-4f1b-ad24-eb6bba597a2f.webp&w=1920&q=100",
      alt: "Red And Blue Water-lily"
    },
    title: "Red And Blue Water-lily",
    text: "Nymphaea Nouchali",
    category: "Aquatics",
    description: "Sri Lanka's national flower, this stunning aquatic plant produces striking violet-blue to red flowers that float serenely on the surface of calm water. Sacred in Buddhist culture.",
    watering: "Aquatic (lives in water)",
    light: "Full sun",
    soil: "Aquatic clay substrate",
    difficulty: "Moderate",
    toxicity: "Non-toxic",
    height: "Floating (up to 6 inches above water)"
  },
  {
    id: 32,
    img: {
      src: "https://myplantin.com/_next/image?url=https%3A%2F%2Fstrapi.myplantin.com%2Fsmall_main_5c2f4176-c621-4437-ba8c-8293ebdb0657.webp&w=1920&q=100",
      alt: "Mission Olive Tree"
    },
    title: "Mission Olive Tree",
    text: "Olea Europaea 'Mission Olive'",
    category: "Veggies & Fruit",
    description: "A classic Mediterranean olive tree that produces abundant, small black olives excellent for both table use and oil pressing. An ornamental tree as well as a productive fruiting plant.",
    watering: "Every 2–4 weeks when established",
    light: "Full sun",
    soil: "Well-draining, slightly alkaline",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible fruit)",
    height: "15–30 feet"
  }
];

export default dataPlant;
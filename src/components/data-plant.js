const dataPlant = [
  {
    id: 1,
    img: {
      src: "https://myplantin.com/_next/image?url=https%3A%2F%2Fstrapi.myplantin.com%2Fsmall_leaf_ge67528b35_1920_0e56f75901.webp&w=1920&q=100",
      alt: "Aloe Vera"
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
      alt: "Blue Periwinkle"
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
  },
  {
    id: 33,
    img: {
      src: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&q=80",
      alt: "Monstera Deliciosa"
    },
    title: "Monstera Deliciosa",
    text: "Monstera deliciosa",
    category: "Houseplants",
    description: "Famous for its natural leaf holes (fenestrations), the Swiss Cheese Plant is an iconic tropical favorite that adds vibrant jungle aesthetics to any modern living space.",
    watering: "Every 1–2 weeks",
    light: "Bright indirect light",
    soil: "Peat-based potting mix with perlite",
    difficulty: "Easy",
    toxicity: "Toxic to cats & dogs",
    height: "3–8 feet"
  },
  {
    id: 34,
    img: {
      src: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&q=80",
      alt: "Golden Pothos"
    },
    title: "Golden Pothos",
    text: "Epipremnum aureum",
    category: "Houseplants",
    description: "Heart-shaped variegated green and yellow leaves make this trailing vine one of the most popular, air-purifying, and beginner-friendly houseplants in the world.",
    watering: "Every 1–2 weeks",
    light: "Low to bright indirect light",
    soil: "Standard well-draining potting soil",
    difficulty: "Easy",
    toxicity: "Toxic to pets",
    height: "Trailing 6–20 feet"
  },
  {
    id: 35,
    img: {
      src: "https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=600&q=80",
      alt: "Rubber Tree"
    },
    title: "Rubber Tree",
    text: "Ficus elastica",
    category: "Houseplants",
    description: "Features thick, glossy burgundy-green leaves that bring a bold statement to indoor decor. Thrives in bright indirect light and requires minimal maintenance.",
    watering: "Every 1–2 weeks",
    light: "Bright indirect sunlight",
    soil: "Well-draining aerated potting mix",
    difficulty: "Easy",
    toxicity: "Mildly toxic to pets",
    height: "4–10 feet indoors"
  },
  {
    id: 36,
    img: {
      src: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80",
      alt: "Fiddle Leaf Fig"
    },
    title: "Fiddle Leaf Fig",
    text: "Ficus lyrata",
    category: "Houseplants",
    description: "Celebrated in interior design for its dramatic violin-shaped leaves. Requires consistent lighting and watering routine to keep its foliage lush and healthy.",
    watering: "Every 7–10 days",
    light: "Bright indirect light",
    soil: "Rich, well-draining potting soil",
    difficulty: "Moderate",
    toxicity: "Toxic to cats & dogs",
    height: "4–10 feet"
  },
  {
    id: 37,
    img: {
      src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&q=80",
      alt: "String of Pearls"
    },
    title: "String of Pearls",
    text: "Senecio rowleyanus",
    category: "Succulents",
    description: "A unique trailing succulent with tiny pea-shaped bead leaves that cascade elegantly over hanging baskets. Perfect for high shelves in sunny rooms.",
    watering: "Every 2–3 weeks",
    light: "Bright direct sunlight",
    soil: "Gritty cactus & succulent soil",
    difficulty: "Moderate",
    toxicity: "Toxic if ingested",
    height: "Trailing 1–3 feet"
  },
  {
    id: 38,
    img: {
      src: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600&q=80",
      alt: "Burro's Tail"
    },
    title: "Burro's Tail",
    text: "Sedum morganianum",
    category: "Succulents",
    description: "Features thick, overlapping blue-green fleshy leaves that resemble braided ropes. Extremely drought-resistant and stunning in decorative hanging planters.",
    watering: "Every 14–21 days",
    light: "Bright direct sunlight",
    soil: "Well-draining succulent substrate",
    difficulty: "Easy",
    toxicity: "Non-toxic",
    height: "Trailing up to 4 feet"
  },
  {
    id: 39,
    img: {
      src: "https://images.unsplash.com/photo-1551893478-d726eaf0442c?w=600&q=80",
      alt: "Golden Barrel Cactus"
    },
    title: "Golden Barrel Cactus",
    text: "Echinocactus grusonii",
    category: "Cactuses",
    description: "A globe-shaped desert cactus covered in bright yellow radial spines. Highly prized in xeriscaping and desert container gardens for its bold geometric look.",
    watering: "Every 3–4 weeks",
    light: "Full direct sun",
    soil: "Fast-draining sandy cactus mix",
    difficulty: "Easy",
    toxicity: "Non-toxic (sharp spines)",
    height: "1–3 feet diameter"
  },
  {
    id: 40,
    img: {
      src: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80",
      alt: "Bunny Ears Cactus"
    },
    title: "Bunny Ears Cactus",
    text: "Opuntia microdasys",
    category: "Cactuses",
    description: "Produces paired oval pads that look like rabbit ears. Covered with tiny golden glochids instead of long spines, giving it a soft fuzzy appearance.",
    watering: "Every 3–4 weeks",
    light: "Full sun",
    soil: "Gritty cactus mix",
    difficulty: "Easy",
    toxicity: "Irritating bristles",
    height: "1–2 feet"
  },
  {
    id: 41,
    img: {
      src: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&q=80",
      alt: "Moth Orchid"
    },
    title: "Moth Orchid",
    text: "Phalaenopsis orchid",
    category: "Flowers",
    description: "One of the most popular flowering houseplants worldwide, blooming for months at a time with vibrant, elegant blossoms in white, pink, and purple shades.",
    watering: "Every 7–10 days",
    light: "Medium indirect light",
    soil: "Coarse orchid bark mix",
    difficulty: "Moderate",
    toxicity: "Non-toxic (pet safe)",
    height: "1–2 feet"
  },
  {
    id: 42,
    img: {
      src: "https://images.unsplash.com/photo-1592722212952-b88d8b4c5fb4?w=600&q=80",
      alt: "Star Jasmine"
    },
    title: "Star Jasmine",
    text: "Jasminum officinale",
    category: "Flowers",
    description: "A fast-climbing evergreen woody vine with clusters of intoxicatingly fragrant, starry white blossoms that bloom throughout spring and summer.",
    watering: "Every 5–7 days",
    light: "Full sun to partial shade",
    soil: "Moist, organic-rich soil",
    difficulty: "Easy",
    toxicity: "Non-toxic",
    height: "10–20 feet climbing"
  },
  {
    id: 43,
    img: {
      src: "https://images.unsplash.com/photo-1565011523534-747a8601f10a?w=600&q=80",
      alt: "French Marigold"
    },
    title: "French Marigold",
    text: "Tagetes patula",
    category: "Flowers",
    description: "Bright golden-orange annual flowers widely planted in gardens to repel pests and naturally protect vegetable crops from harmful insects.",
    watering: "Weekly",
    light: "Full sun",
    soil: "Well-draining, moderately fertile",
    difficulty: "Easy",
    toxicity: "Non-toxic",
    height: "6–18 inches"
  },
  {
    id: 44,
    img: {
      src: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=80",
      alt: "Hydrangea"
    },
    title: "Bigleaf Hydrangea",
    text: "Hydrangea macrophylla",
    category: "Shrubs",
    description: "Famous for its large pom-pom flower heads that naturally change color between pink, blue, and purple depending on the acidity of the soil.",
    watering: "2–3 times per week",
    light: "Partial shade to morning sun",
    soil: "Moist, rich, well-draining soil",
    difficulty: "Moderate",
    toxicity: "Toxic if ingested",
    height: "3–6 feet"
  },
  {
    id: 45,
    img: {
      src: "https://images.unsplash.com/photo-1534531141161-e41d133a8ad2?w=600&q=80",
      alt: "Meyer Lemon Tree"
    },
    title: "Meyer Lemon Tree",
    text: "Citrus x meyeri",
    category: "Veggies & Fruit",
    description: "A compact dwarf citrus tree that produces sweet, juicy lemons and highly fragrant white blossoms. Can be grown in pots on sunny patios or indoors.",
    watering: "Every 7–10 days",
    light: "Full sun (8+ hours)",
    soil: "Acidic, well-draining citrus mix",
    difficulty: "Moderate",
    toxicity: "Mildly toxic to pets",
    height: "4–8 feet in containers"
  },
  {
    id: 46,
    img: {
      src: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80",
      alt: "Mango Tree"
    },
    title: "Mango Tree",
    text: "Mangifera indica",
    category: "Veggies & Fruit",
    description: "A tropical fruit tree native to South Asia known as the king of fruits. Produces delicious sweet mangos and lush evergreen canopy coverage.",
    watering: "Weekly when young, drought tolerant when adult",
    light: "Full sun",
    soil: "Deep, well-draining sandy loam",
    difficulty: "Moderate",
    toxicity: "Non-toxic (fruit)",
    height: "30–100 feet"
  },
  {
    id: 47,
    img: {
      src: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80",
      alt: "Cherry Tomato"
    },
    title: "Cherry Tomato",
    text: "Solanum lycopersicum var. cerasiforme",
    category: "Veggies & Fruit",
    description: "High-yielding garden staple that produces bunches of sweet, bite-sized red tomatoes all summer long. Great for garden beds or container pots.",
    watering: "Every 1–2 days",
    light: "Full sun (6–8 hours)",
    soil: "Rich, fertile, moist soil",
    difficulty: "Easy",
    toxicity: "Leaves toxic to pets",
    height: "3–6 feet with stakes"
  },
  {
    id: 48,
    img: {
      src: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&q=80",
      alt: "Garden Strawberry"
    },
    title: "Garden Strawberry",
    text: "Fragaria × ananassa",
    category: "Veggies & Fruit",
    description: "Popular fruit-bearing perennial plant that grows sweet red berries and sends out runners. Excellent for raised beds, hanging baskets, and home gardens.",
    watering: "Every 2–3 days",
    light: "Full sun",
    soil: "Loamy, rich, well-draining",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible)",
    height: "6–12 inches"
  },
  {
    id: 49,
    img: {
      src: "https://images.unsplash.com/photo-1567331711402-509c12c41959?w=600&q=80",
      alt: "Golden Bamboo"
    },
    title: "Golden Bamboo",
    text: "Phyllostachys aurea",
    category: "Grasses",
    description: "A graceful, fast-growing woody grass with golden canes and lush green foliage. Provides excellent privacy screening and serene garden atmosphere.",
    watering: "2 times per week",
    light: "Full sun to partial shade",
    soil: "Moist, fertile, well-draining",
    difficulty: "Easy",
    toxicity: "Non-toxic",
    height: "10–25 feet"
  },
  {
    id: 50,
    img: {
      src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&q=80",
      alt: "Pampas Grass"
    },
    title: "Pampas Grass",
    text: "Cortaderia selloana",
    category: "Grasses",
    description: "A dramatic ornamental grass featuring large, silky feather-like plumes. Frequently used in modern boho landscape architecture and dried floral decor.",
    watering: "Low (drought tolerant)",
    light: "Full sun",
    soil: "Well-draining soil",
    difficulty: "Easy",
    toxicity: "Sharp leaf margins",
    height: "6–10 feet"
  },
  {
    id: 51,
    img: {
      src: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80",
      alt: "Staghorn Fern"
    },
    title: "Staghorn Fern",
    text: "Platycerium bifurcatum",
    category: "Ferns",
    description: "An epiphytic fern with broad antler-like fronds. Often mounted on wood planks or hanging baskets to mimic its natural tree-canopy habitat.",
    watering: "Soak every 1–2 weeks",
    light: "Filtered indirect light",
    soil: "Sphagnum moss or bark mount",
    difficulty: "Moderate",
    toxicity: "Non-toxic",
    height: "2–3 feet"
  },
  {
    id: 52,
    img: {
      src: "https://images.unsplash.com/photo-1620127812932-e9601056c58e?w=600&q=80",
      alt: "Bird's Nest Fern"
    },
    title: "Bird's Nest Fern",
    text: "Asplenium nidus",
    category: "Ferns",
    description: "Known for its bright lime-green rippled fronds that grow out of a central rosette nest. Thrives in humid bathrooms and shaded indoor corners.",
    watering: "Every 1–2 weeks",
    light: "Medium indirect light",
    soil: "Peat-rich potting mix",
    difficulty: "Easy",
    toxicity: "Non-toxic (pet safe)",
    height: "1–3 feet"
  },
  {
    id: 53,
    img: {
      src: "https://images.unsplash.com/photo-1608797178974-15b35a640578?w=600&q=80",
      alt: "Cilantro"
    },
    title: "Cilantro / Coriander",
    text: "Coriandrum sativum",
    category: "Herbs",
    description: "Essential culinary annual herb producing fresh citrusy leaves (cilantro) and aromatic warm spice seeds (coriander). Fast growing in spring and autumn.",
    watering: "Every 2–3 days",
    light: "Full sun to partial shade",
    soil: "Moist, fertile, well-draining",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible)",
    height: "1–2 feet"
  },
  {
    id: 54,
    img: {
      src: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80",
      alt: "Greek Oregano"
    },
    title: "Greek Oregano",
    text: "Origanum vulgare hirtum",
    category: "Herbs",
    description: "Pungent Mediterranean perennial herb with intense savory flavor. Key ingredient in pizza, pasta sauces, grilled meats, and herbal remedies.",
    watering: "Every 7–10 days",
    light: "Full sun",
    soil: "Dry, sandy, well-draining",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible)",
    height: "1–2 feet"
  },
  {
    id: 55,
    img: {
      src: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&q=80",
      alt: "Garden Sage"
    },
    title: "Garden Sage",
    text: "Salvia officinalis",
    category: "Herbs",
    description: "Features soft velvety grey-green leaves with an earthy, pine-like fragrance. Celebrated for culinary seasoning and natural wellness properties.",
    watering: "Every 7–10 days",
    light: "Full sun",
    soil: "Well-draining, sandy soil",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible)",
    height: "1–2.5 feet"
  },
  {
    id: 56,
    img: {
      src: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&q=80",
      alt: "Calathea Orbifolia"
    },
    title: "Calathea Orbifolia",
    text: "Goeppertia orbifolia",
    category: "Foliage",
    description: "Prized for its gigantic round leaves patterned with silver and green stripes. Known as a prayer plant because its leaves fold upwards at night.",
    watering: "Every 5–7 days (keep moist)",
    light: "Medium indirect light",
    soil: "Peat-based moisture-retentive mix",
    difficulty: "Moderate",
    toxicity: "Non-toxic (pet safe)",
    height: "2–3 feet"
  },
  {
    id: 57,
    img: {
      src: "https://images.unsplash.com/photo-1620127812932-e9601056c58e?w=600&q=80",
      alt: "Chinese Evergreen"
    },
    title: "Chinese Evergreen",
    text: "Aglaonema commutatum",
    category: "Foliage",
    description: "Extremely adaptable foliage plant with variegated pink, silver, and dark green leaves. Tolerates low-light office environments effortlessly.",
    watering: "Every 7–10 days",
    light: "Low to medium indirect light",
    soil: "Well-draining potting soil",
    difficulty: "Easy",
    toxicity: "Toxic to pets",
    height: "1–3 feet"
  },
  {
    id: 58,
    img: {
      src: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&q=80",
      alt: "Philodendron Birkin"
    },
    title: "Philodendron Birkin",
    text: "Philodendron 'Birkin'",
    category: "Foliage",
    description: "A striking compact hybrid philodendron with creamy white pin-stripe pinstriping across glossy dark green leaves.",
    watering: "Every 7–10 days",
    light: "Bright indirect light",
    soil: "Chunk aerated potting soil",
    difficulty: "Easy",
    toxicity: "Toxic to pets",
    height: "1–2 feet"
  },
  {
    id: 59,
    img: {
      src: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=80",
      alt: "Sacred Lotus"
    },
    title: "Sacred Lotus",
    text: "Nelumbo nucifera",
    category: "Aquatics",
    description: "An iconic aquatic perennial plant with large round floating leaves and fragrant multi-layered pink flowers. Revered in Eastern spiritual traditions.",
    watering: "Aquatic (submerged roots)",
    light: "Full sun",
    soil: "Heavy clay water substrate",
    difficulty: "Moderate",
    toxicity: "Non-toxic",
    height: "3–6 feet above water"
  },
  {
    id: 60,
    img: {
      src: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80",
      alt: "Water Hyacinth"
    },
    title: "Water Hyacinth",
    text: "Eichhornia crassipes",
    category: "Aquatics",
    description: "A free-floating aquatic plant with swollen bulbous leaf stems and delicate pale violet-blue flower spikes. Ideal for garden ponds.",
    watering: "Aquatic (floating)",
    light: "Full sun",
    soil: "Water only",
    difficulty: "Easy",
    toxicity: "Non-toxic",
    height: "6–12 inches"
  },
  {
    id: 61,
    img: {
      src: "https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=600&q=80",
      alt: "Lion's Mane"
    },
    title: "Lion's Mane Mushroom",
    text: "Hericium erinaceus",
    category: "Mushrooms",
    description: "A culinary and medicinal mushroom with cascading white icicle-like spines. Known for supporting focus, brain health, and gourmet culinary dishes.",
    watering: "Daily misting",
    light: "Shade / indirect light",
    soil: "Hardwood sawdust substrate",
    difficulty: "Moderate",
    toxicity: "Non-toxic (edible)",
    height: "4–8 inches"
  },
  {
    id: 62,
    img: {
      src: "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=600&q=80",
      alt: "Pearl Oyster Mushroom"
    },
    title: "Pearl Oyster Mushroom",
    text: "Pleurotus ostreatus",
    category: "Mushrooms",
    description: "A fast-growing edible mushroom that grows in fan-shaped clusters. Highly popular in gourmet cooking for its savory texture and delicate flavor.",
    watering: "Daily misting",
    light: "Indirect light",
    soil: "Straw / wood shavings substrate",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible)",
    height: "2–6 inches"
  },
  {
    id: 63,
    img: {
      src: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&q=80",
      alt: "White Clover"
    },
    title: "White Clover",
    text: "Trifolium repens",
    category: "Weeds",
    description: "A common nitrogen-fixing lawn perennial with distinctive three-lobed leaves and sweet white flower heads that attract honeybees.",
    watering: "Rain-fed",
    light: "Full sun to partial shade",
    soil: "Any soil",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible)",
    height: "2–6 inches"
  },
  {
    id: 64,
    img: {
      src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&q=80",
      alt: "Common Chickweed"
    },
    title: "Common Chickweed",
    text: "Stellaria media",
    category: "Weeds",
    description: "A tender, vitamin-rich annual weed with small star-shaped white flowers. Frequently used in fresh wild salads and herbal remedies.",
    watering: "Rain-fed",
    light: "Partial shade",
    soil: "Moist soil",
    difficulty: "Easy",
    toxicity: "Non-toxic (edible)",
    height: "4–8 inches"
  },
  {
    id: 65,
    img: {
      src: "https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=600&q=80",
      alt: "Dragon Tree"
    },
    title: "Dragon Tree",
    text: "Dracaena marginata",
    category: "Houseplants",
    description: "Features slender stems topped with crowns of narrow green leaves edged in vibrant red-purple. Excellent low-maintenance architectural houseplant.",
    watering: "Every 2–3 weeks",
    light: "Bright indirect light",
    soil: "Well-draining potting soil",
    difficulty: "Easy",
    toxicity: "Toxic to cats & dogs",
    height: "4–8 feet"
  }
];

export default dataPlant;

export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  variantImages?: string[];
  badge?: string;
  badgeColor?: "violet" | "red" | "green";
  inStock: boolean;
  colors?: string[];
  description?: string;
  features?: string[];
  specifications?: { key: string; value: string }[];
  rating: number;
  reviews: number;
}

export const ALL_PRODUCTS: ShopProduct[] = [
  {
    id: "p1",
    slug: "iphone-16-pro-max-case",
    name: "iPhone 16 Pro Max Silicone Case",
    brand: "Apple",
    category: "Cases",
    price: 3999,
    originalPrice: 4999,
    image: "/shop/category/Cases.webp",
    variantImages: ["/shop/category/Cases.webp", "/shop/category/Screen_Protectors.webp", "/shop/category/Charging.webp"],
    badge: "New",
    badgeColor: "violet",
    inStock: true,
    colors: ["Black", "White", "Red", "Navy Blue"],
    description: "The Apple Silicone Case for iPhone 16 Pro Max is crafted from soft, silky silicone and features a microfiber lining inside that helps protect your iPhone. Available in a range of gorgeous colors that look great and feel even better. Includes MagSafe compatibility for easy charging.",
    specifications: [
      { key: "Compatible With", value: "iPhone 16 Pro Max" },
      { key: "Material", value: "Liquid Silicone + Microfiber" },
      { key: "MagSafe", value: "Yes" },
      { key: "Wireless Charging", value: "Compatible" },
      { key: "Weight", value: "42g" },
    ],
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "p2",
    slug: "galaxy-s25-screen-protector",
    name: "Galaxy S25 Ultra Tempered Glass",
    brand: "Samsung",
    category: "Screen Protection",
    price: 1499,
    image: "/shop/category/Screen_Protectors.webp",
    variantImages: ["/shop/category/Screen_Protectors.webp", "/shop/category/Cases.webp"],
    badge: "New",
    badgeColor: "violet",
    inStock: true,
    colors: ["Clear", "Matte Clear"],
    description: "Crystal-clear 9H tempered glass screen protector designed specifically for the Samsung Galaxy S25 Ultra. Offers maximum scratch and shatter resistance while maintaining full touch sensitivity and vivid display clarity.",
    specifications: [
      { key: "Compatible With", value: "Samsung Galaxy S25 Ultra" },
      { key: "Hardness", value: "9H" },
      { key: "Thickness", value: "0.33mm" },
      { key: "Coating", value: "Oleophobic Anti-Fingerprint" },
      { key: "Pack", value: "2 pieces included" },
    ],
    rating: 4.6,
    reviews: 89,
  },
  {
    id: "p3",
    slug: "65w-gan-charger",
    name: "65W USB-C GaN Fast Charger",
    brand: "Anker",
    category: "Power",
    price: 2999,
    originalPrice: 3799,
    image: "/shop/category/Charging.webp",
    variantImages: ["/shop/category/Charging.webp", "/shop/category/Cases.webp"],
    badge: "New",
    badgeColor: "violet",
    inStock: true,
    colors: ["Black", "White"],
    description: "The Anker 65W GaN charger uses advanced Gallium Nitride technology to deliver faster, cooler, and more efficient charging than traditional chargers. Charge your laptop, phone, and tablet simultaneously with a single compact unit.",
    specifications: [
      { key: "Output Power", value: "65W Max" },
      { key: "Ports", value: "2x USB-C + 1x USB-A" },
      { key: "Technology", value: "GaN II + PowerIQ 4.0" },
      { key: "Input", value: "100–240V (Universal)" },
      { key: "Weight", value: "115g" },
    ],
    rating: 4.9,
    reviews: 213,
  },
  {
    id: "p4",
    slug: "jbl-earbuds-pro",
    name: "True Wireless Noise Cancelling Earbuds Pro",
    brand: "JBL",
    category: "Audio",
    price: 8999,
    originalPrice: 11999,
    image: "/shop/category/Audio_Category_Tile.webp",
    variantImages: ["/shop/category/Audio_Category_Tile.webp", "/shop/category/Cases.webp"],
    badge: "New",
    badgeColor: "violet",
    inStock: true,
    colors: ["Black", "White"],
    description: "JBL Pro True Wireless earbuds deliver rich JBL Pro Sound with active noise cancelling and up to 32 hours of combined battery life. IPX5 rated for water resistance, with a comfortable, secure fit for all-day wear.",
    specifications: [
      { key: "Driver Size", value: "11mm Dynamic" },
      { key: "ANC", value: "Adaptive Noise Cancelling" },
      { key: "Battery Life", value: "8 hrs + 24 hrs (case)" },
      { key: "Connectivity", value: "Bluetooth 5.3" },
      { key: "Water Resistance", value: "IPX5" },
    ],
    rating: 4.7,
    reviews: 176,
  },
  {
    id: "p5",
    slug: "spigen-clear-case",
    name: "iPhone 16 Clear Case MagSafe Drop Protection",
    brand: "Spigen",
    category: "Cases",
    price: 2499,
    image: "/shop/category/Cases.webp",
    variantImages: ["/shop/category/Cases.webp", "/shop/category/Screen_Protectors.webp"],
    badge: "Hot",
    badgeColor: "red",
    inStock: true,
    colors: ["Clear", "Matte Clear"],
    description: "Spigen's Ultra Hybrid case features a clear back that shows off your iPhone 16's design, combined with a tough PC back and flexible TPU bumper for military-grade drop protection. MagSafe compatible for effortless charging.",
    specifications: [
      { key: "Compatible With", value: "iPhone 16" },
      { key: "Material", value: "PC + TPU Hybrid" },
      { key: "Drop Protection", value: "Military Grade (MIL-STD-810G)" },
      { key: "MagSafe", value: "Compatible" },
      { key: "Yellowing Resistance", value: "Yes" },
    ],
    rating: 4.7,
    reviews: 342,
  },
  {
    id: "p6",
    slug: "belkin-wireless-pad",
    name: "Universal Magnetic Wireless Charging Pad 15W",
    brand: "Belkin",
    category: "Power",
    price: 3499,
    originalPrice: 4799,
    image: "/shop/category/Charging.webp",
    variantImages: ["/shop/category/Charging.webp", "/shop/category/Audio_Category_Tile.webp"],
    badge: "Sale",
    badgeColor: "red",
    inStock: true,
    colors: ["Black", "White"],
    description: "Belkin's 15W wireless charging pad delivers fast, cable-free charging for all Qi-compatible devices. The slim, non-slip design keeps your phone in place while the LED indicator confirms charging has started.",
    specifications: [
      { key: "Output", value: "15W Max (iPhone), 10W (Android)" },
      { key: "Standard", value: "Qi Certified" },
      { key: "Cable Length", value: "1.2m USB-C" },
      { key: "Dimensions", value: "100 × 100 × 6.3 mm" },
      { key: "LED Indicator", value: "Yes" },
    ],
    rating: 4.5,
    reviews: 98,
  },
  {
    id: "p7",
    slug: "zagg-privacy-screen",
    name: "Privacy Screen Protector for iPhone 16 Pro",
    brand: "ZAGG",
    category: "Screen Protection",
    price: 1999,
    image: "/shop/category/Screen_Protectors.webp",
    variantImages: ["/shop/category/Screen_Protectors.webp"],
    badge: "Trending",
    badgeColor: "green",
    inStock: true,
    colors: ["Clear"],
    description: "ZAGG's InvisibleShield Privacy screen protector blocks side-angle viewing to keep your screen private in public. Tempered glass construction offers superior hardness while an anti-microbial surface inhibits 99% of bacteria.",
    specifications: [
      { key: "Compatible With", value: "iPhone 16 Pro" },
      { key: "Type", value: "Privacy Filter + Tempered Glass" },
      { key: "Viewing Angle", value: "60° (blocked from sides)" },
      { key: "Antimicrobial", value: "Yes (inhibits 99% bacteria)" },
      { key: "Includes", value: "Installation tray + wipes" },
    ],
    rating: 4.4,
    reviews: 67,
  },
  {
    id: "p8",
    slug: "jbl-speaker",
    name: "Portable Bluetooth Speaker 360° Waterproof",
    brand: "JBL",
    category: "Audio",
    price: 5999,
    originalPrice: 7999,
    image: "/shop/category/Audio_Category_Tile.webp",
    variantImages: ["/shop/category/Audio_Category_Tile.webp", "/shop/category/Charging.webp"],
    badge: "Hot",
    badgeColor: "red",
    inStock: true,
    colors: ["Black", "Red", "Green"],
    description: "JBL's portable 360° speaker delivers powerful omnidirectional sound in a compact, waterproof package. IP67-rated for full submersion, with up to 12 hours of playtime and a built-in power bank to charge your devices on the go.",
    specifications: [
      { key: "Output Power", value: "20W RMS" },
      { key: "Sound", value: "360° Omnidirectional" },
      { key: "Battery Life", value: "Up to 12 hours" },
      { key: "Water Resistance", value: "IP67" },
      { key: "Connectivity", value: "Bluetooth 5.3 + AUX" },
    ],
    rating: 4.8,
    reviews: 289,
  },
  {
    id: "p9",
    slug: "oneplus-case",
    name: "OnePlus Nord CE4 TPU Bumper Case",
    brand: "OnePlus",
    category: "Cases",
    price: 899,
    image: "/shop/category/Cases.webp",
    variantImages: ["/shop/category/Cases.webp"],
    inStock: true,
    colors: ["Black", "Clear"],
    description: "Slim TPU bumper case designed specifically for the OnePlus Nord CE4. Features precise cutouts for all buttons and ports, raised lip protection for the screen and camera, and a non-slip matte finish.",
    specifications: [
      { key: "Compatible With", value: "OnePlus Nord CE4" },
      { key: "Material", value: "Flexible TPU" },
      { key: "Finish", value: "Matte Anti-Slip" },
      { key: "Camera Protection", value: "Raised Lip" },
      { key: "Thickness", value: "1.5mm" },
    ],
    rating: 4.3,
    reviews: 44,
  },
  {
    id: "p10",
    slug: "galaxy-buds3-pro",
    name: "Samsung Galaxy Buds3 Pro In-Ear ANC",
    brand: "Samsung",
    category: "Audio",
    price: 12999,
    originalPrice: 15999,
    image: "/shop/category/Audio_Category_Tile.webp",
    variantImages: ["/shop/category/Audio_Category_Tile.webp", "/shop/category/Charging.webp"],
    badge: "Sale",
    badgeColor: "red",
    inStock: true,
    colors: ["Black", "Silver"],
    description: "Samsung Galaxy Buds3 Pro deliver studio-quality sound with intelligent ANC that adapts to your environment. Seamlessly connect across Galaxy devices with Auto Switch, and enjoy Hi-Fi audio certified by SSC Audio.",
    specifications: [
      { key: "Driver", value: "2-way Speaker (Woofer + Tweeter)" },
      { key: "ANC", value: "Intelligent ANC" },
      { key: "Battery Life", value: "6 hrs + 18 hrs (case)" },
      { key: "Connectivity", value: "Bluetooth 5.4" },
      { key: "Water Resistance", value: "IPX7" },
    ],
    rating: 4.9,
    reviews: 512,
  },
  {
    id: "p11",
    slug: "anker-powerbank",
    name: "20000mAh Slim Power Bank USB-C 65W",
    brand: "Anker",
    category: "Power",
    price: 4499,
    originalPrice: 5499,
    image: "/shop/category/Charging.webp",
    variantImages: ["/shop/category/Charging.webp"],
    inStock: true,
    colors: ["Black", "White"],
    description: "Anker's 20000mAh slim power bank packs a massive capacity into an ultra-slim design. With 65W USB-C output, it can charge your laptop, tablet, and phone simultaneously. Smart Power Distribution ensures each device gets the optimal wattage.",
    specifications: [
      { key: "Capacity", value: "20,000mAh / 74Wh" },
      { key: "USB-C Output", value: "65W Max" },
      { key: "USB-A Output", value: "22.5W" },
      { key: "Input", value: "30W USB-C" },
      { key: "Dimensions", value: "163 × 74 × 15 mm" },
    ],
    rating: 4.7,
    reviews: 167,
  },
  {
    id: "p12",
    slug: "spigen-blue-light",
    name: "Anti-Blue Light Screen Protector Galaxy S25",
    brand: "Spigen",
    category: "Screen Protection",
    price: 1299,
    image: "/shop/category/Screen_Protectors.webp",
    variantImages: ["/shop/category/Screen_Protectors.webp"],
    inStock: false,
    colors: ["Clear"],
    description: "Spigen's Anti-Blue Light screen protector filters out harmful blue light emissions to reduce eye strain during extended screen time. Tempered glass construction provides 9H hardness without compromising display clarity.",
    specifications: [
      { key: "Compatible With", value: "Samsung Galaxy S25" },
      { key: "Blue Light Filtration", value: "Blocks 30% blue light" },
      { key: "Hardness", value: "9H" },
      { key: "Thickness", value: "0.4mm" },
      { key: "Pack", value: "2 pieces" },
    ],
    rating: 4.2,
    reviews: 38,
  },
];

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: ShopProduct, limit = 4): ShopProduct[] {
  return ALL_PRODUCTS
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function generateFeatures(name: string, brand: string): string[] {
  const n = name.toLowerCase();
  const features: string[] = [];

  if (n.includes("tempered glass") || n.includes("screen protector")) {
    features.push("9H hardness protects against scratches and shattering");
    features.push("0.33mm ultra-thin glass maintains full touch sensitivity");
    features.push("Oleophobic coating repels fingerprints and smudges");
    features.push("Precise cutouts for camera, sensors, and speakers");
  } else if (n.includes("privacy")) {
    features.push("Side-angle privacy filter blocks unwanted viewing");
    features.push("Tempered glass provides 9H scratch protection");
    features.push("Anti-microbial surface inhibits bacteria growth");
    features.push("Easy bubble-free installation included");
  } else if (n.includes("silicone") || n.includes("case") || n.includes("cover") || n.includes("bumper")) {
    features.push("Precision fit for your exact device model");
    features.push("Raised lip protection for screen and camera");
    features.push("Easy access to all buttons, ports, and speakers");
    features.push("Slim profile adds minimal bulk");
    if (n.includes("magsafe") || brand === "Apple") features.push("MagSafe compatible for seamless wireless charging");
  } else if (n.includes("gan") || n.includes("charger") || n.includes("charging")) {
    features.push("GaN technology — runs cooler and charges faster");
    features.push("Universal 100–240V input works worldwide");
    features.push("Smart power distribution — adjusts to each device");
    features.push("Overcharge, overheat, and short-circuit protection");
  } else if (n.includes("power bank")) {
    features.push("High-capacity battery charges your phone multiple times");
    features.push("Multi-device simultaneous charging");
    features.push("LED battery indicator shows remaining charge");
    features.push("Pass-through charging — charge the bank and device together");
  } else if (n.includes("wireless") && n.includes("pad")) {
    features.push("Qi-certified for universal device compatibility");
    features.push("Charges through cases up to 5mm thick");
    features.push("Foreign object detection for safe charging");
    features.push("Non-slip surface keeps your device in place");
  } else if (n.includes("earbuds") || n.includes("buds")) {
    features.push("Active Noise Cancellation for immersive audio");
    features.push("True wireless freedom — no cables or wires");
    features.push("Water-resistant design for workouts and outdoor use");
    features.push("Touch controls for calls, music, and voice assistant");
  } else if (n.includes("speaker")) {
    features.push("360° omnidirectional sound fills any space");
    features.push("Waterproof design for outdoor and poolside use");
    features.push("Long battery life for all-day listening");
    features.push("Built-in microphone for hands-free calls");
  } else {
    features.push(`Engineered by ${brand} to the highest quality standards`);
    features.push("Precisely designed for a perfect fit and feel");
    features.push("Backed by manufacturer's quality guarantee");
  }

  return features.slice(0, 5);
}

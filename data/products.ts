// import clamImage from '../assets/clam-1.jpg';
// import shrimpImage from '../assets/shrimp-1.jpg';
// import slabImage from '../assets/slab-1.jpg';
// import tentImage from '../assets/tent-1.jpg';

// Rods (using existing assets as placeholders since generation failed)
// In a real scenario, we would have specific rod images.
const rodTravelImg = "/assets/rod-breakdown.png";
const rodInshoreImg = "/assets/rod-breakdown.png";
const rodSurfImg = "/assets/rod-breakdown.png";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    specs: string;
    categoryId?: 'bait' | 'tackle' | 'bundle' | 'ebook' | 'rod';
    subtitle?: string;
    tag?: string;
    detailedSpecs?: {
        length: string;
        pieces: string;
        lureWeight: string;
        lineRating: string;
        action: string;
    };
    items?: string[];
}

export const products: Product[] = [
    {
        id: 'bait-salted-clams',
        name: "Clammy Bits",
        description: "Tougher than fresh. These shucked clams stay on the hook during heavy surf casting and release a concentrated scent trail.",
        price: 20.99,
        image: "/assets/clam-1.jpg",
        specs: "Vacuum Sealed / 8oz",
        categoryId: 'bait'
    },
    {
        id: 'bait-salted-shrimp',
        name: "Shrimpy Bits",
        description: "The universal bait, cured to rubber-like toughness. Ideal for tipping jigs or fishing bottom rigs without flying off the hook.",
        price: 20.99,
        image: "/assets/shrimp-1.jpg",
        specs: "Hand Cured / 6oz",
        categoryId: 'bait'
    },
    {
        id: 'bait-salted-squid',
        name: "Squidy Bits Slab",
        description: "Pre-cut strips of high-grade squid. The salting process concentrates the proteins, creating an irresistible signal for predatory fish.",
        price: 20.99,
        image: "/assets/slab-1.jpg",
        specs: "Pre-Cut / 8oz",
        categoryId: 'bait'
    },
    {
        id: 'bait-squid-tentacles',
        name: "Squidy Bits Tentacles",
        description: "Whole preserved squid tentacles. The natural movement combined with the salted scent trail triggers aggressive strikes.",
        price: 20.99,
        image: "/assets/tent-1.jpg",
        specs: "Whole Tentacles / 8oz",
        categoryId: 'bait'
    },
    // Rods
    {
        id: 'rod-travel-92',
        name: "9'2\" Hybrid Travel",
        description: "Our signature 5-piece travel rod. Bridges the gap between surf and inshore. Fits in carry-on luggage.",
        price: 249.00,
        image: rodTravelImg,
        specs: "9'2\" / 5-Piece",
        categoryId: 'rod',
        subtitle: "The Do-It-All Traveler",
        tag: "BEST_SELLER",
        detailedSpecs: {
            length: "9'2\"",
            pieces: "5-Piece",
            lureWeight: "1 - 3 oz",
            lineRating: "15 - 30 lb",
            action: "Mod-Fast"
        }
    },
    {
        id: 'rod-inshore-76',
        name: "7'6\" Inshore Specialist",
        description: "Designed for accuracy and sensitivity. Perfect for working lures around docks, mangroves, and flats.",
        price: 230.00,
        image: rodInshoreImg,
        specs: "7'6\" / 1-Piece",
        categoryId: 'rod',
        subtitle: "Precision Instrument",
        tag: "SPECIALIST",
        detailedSpecs: {
            length: "7'6\"",
            pieces: "1-Piece",
            lureWeight: "1/4 - 1 oz",
            lineRating: "8 - 17 lb",
            action: "Fast"
        }
    },
    {
        id: 'rod-surf-11',
        name: "11' Surf Commander",
        description: "Maximum distance casting machine. Built to heave heavy payloads past the breakers into the strike zone.",
        price: 600.00,
        image: rodSurfImg,
        specs: "11'0\" / 2-Piece",
        categoryId: 'rod',
        subtitle: "Long Range Artillery",
        tag: "FLAGSHIP",
        detailedSpecs: {
            length: "11'0\"",
            pieces: "2-Piece",
            lureWeight: "2 - 6 oz",
            lineRating: "20 - 40 lb",
            action: "Moderate"
        }
    },
    // Bundles
    {
        id: 'bundle-all-in-one',
        name: "ALL IN ONE – Fishing Bait Box",
        description: "The ultimate starter pack containing a complete assortment of high-quality baits for any condition.",
        price: 99.50,
        image: "/assets/box-all-in-one.jpg",
        specs: "Complete Kit",
        categoryId: 'bundle',
        items: ["Assorted Baits", "Tackle Box", "Instructions"],
        tag: "BEST_VALUE"
    },
    {
        id: 'bundle-fishing-fanatic',
        name: "FISHING FANATIC – Beach Fishing Bait Box + Fishing Rigs",
        description: "Everything a beach angler needs. Includes our premium bait box and a selection of specialized beach rigs.",
        price: 160.00,
        image: "/assets/box-fanatic.jpg",
        specs: "Beach Specialist",
        categoryId: 'bundle',
        items: ["Beach Bait Box", "3x Surf Rigs", "Sinker Pack"],
        tag: "POPULAR"
    },
    {
        id: 'bundle-weekend-essentials',
        name: "WEEKEND ESSENTIALS – Bottom Fishing Rigs + Sinkers",
        description: "Don't get caught short on the water. A resupply kit focusing on the most commonly lost terminal tackle.",
        price: 70.00,
        image: "/assets/box-weekend.jpg",
        specs: "Terminal Tackle",
        categoryId: 'bundle',
        items: ["10x Bottom Rigs", "Assorted Sinkers", "Swivels"],
        tag: "ESSENTIAL"
    },
    {
        id: 'bundle-fishing-fever',
        name: "FISHING FEVER Kit – Bottom Fishing Rig Box + Sinkers + Accessories",
        description: "A comprehensive kit for bottom fishing enthusiasts. Organized and ready to deploy.",
        price: 110.00,
        image: "/assets/box-fever.jpg",
        specs: "Bottom Rig Kit",
        categoryId: 'bundle',
        items: ["Rig Box", "Sinker Assortment", "Pliers", "Beads"],
        tag: "COMPLETE_URL"
    },
    {
        id: 'bundle-popping-float',
        name: "Popping slip float rig Kit",
        description: "Trigger aggressive strikes with this complete popping cork setup. Perfect for speckled trout and redfish.",
        price: 30.00,
        image: "/assets/box-popping.jpg",
        specs: "Surface Action",
        categoryId: 'bundle',
        items: ["3x Popping Floats", "Example Lures", "Leader Material"],
        tag: "INSHORE"
    },
    {
        id: 'bundle-missile-float',
        name: "Fishing Missile Slip Float Kit",
        description: "Long-casting slip float system for reaching distant feeding zones with precision depth control.",
        price: 40.00,
        image: "/assets/box-missile.jpg",
        specs: "Long Range Float",
        categoryId: 'bundle',
        items: ["Missile Floats", "Stoppers", "Weights"],
        tag: "DISTANCE"
    },
    {
        id: 'bundle-bbl-lure',
        name: "BBL LURE BUNDLE",
        description: "Big Bass/Big Lure selection. A heavy-hitting assortment for targeting trophy sized fish.",
        price: 100.00,
        image: "/assets/box-bbl.jpg",
        specs: "Trophy Hunter",
        categoryId: 'bundle',
        items: ["Large Lures", "Heavy Hooks", "Stinger Rigs"],
        tag: "TROPHY"
    },
    {
        id: 'bundle-core-rig',
        name: "Core Rig Bundle – Variety Pack",
        description: "Never wonder what to tie on next. A diverse collection of our most trusted rig patterns.",
        price: 35.00,
        image: "/assets/box-core.jpg",
        specs: "Variety Pack",
        categoryId: 'bundle',
        items: ["Carolina Rigs", "Knocker Rigs", "Drop Shot Rigs"],
        tag: "VERSATILE"
    },
    // E-books
    {
        id: 'ebook-surf-mastery',
        name: "Surf Fishing Fundamentals",
        description: "The comprehensive operator's manual for beach fishing. Covers reading the beach, rig selection, bait presentation, and tide analysis.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2020/11/Surf-Fishing-Book-Cover-300x300.jpg",
        specs: "PDF / 142 Pages / Mobile Optimized",
        categoryId: 'ebook',
        tag: "BEST_SELLER"
    },
    {
        id: 'ebook-inshore-tactics',
        name: "Inshore Tactics Guide",
        description: "Navigate the backwaters with confidence. Strategies for Snook, Redfish, and Trout. Includes seasonal patterns and lure selection charts.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2020/11/Inshore-Fishing-Book-Cover-300x300.jpg",
        specs: "PDF / 120 Pages / Charts Included",
        categoryId: 'ebook',
        tag: "ESSENTIAL"
    },
    {
        id: 'ebook-catch-cook',
        name: "The Catch & Cook Manual",
        description: "From the cooler to the table. Proper field dressing techniques, preservation methods, and signature recipes for popular saltwater species.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2020/11/Cookbook-Cover-300x300.jpg",
        specs: "PDF / 45 Recipes / High-Res Photos",
        categoryId: 'ebook',
        tag: "LIFESTYLE"
    },
    {
        id: 'ebook-spot-map',
        name: "Florida Spot Map Access",
        description: "Digital access to our curated map of verified fishing locations. Includes GPS coordinates, parking info, and best tide phases for each spot.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2023/01/Map-Mockup-1-300x300.jpg",
        specs: "Digital Access / Interactive / Updated Monthly",
        categoryId: 'ebook',
        tag: "PRO_DATA"
    },
    // New E-books
    {
        id: 'ebook-catch-cook-intl',
        name: "Catch'n & Cook'n INTL Fish Cookbook",
        description: "International recipes for your fresh catch.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-pier-fishing-big',
        name: "Pier Fishing For BIG fish (Tackle Gear, Techniques and Strategy)",
        description: "Master the pier with specialized techniques for landing trophy fish.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-advanced-knots',
        name: "Advanced Fishing Knot Tutorial for Saltwater Anglers! (T-Knot Fishing Knot Guide, Bottom Rigs + More!)",
        description: "Tie the strongest knots for every saltwater situation.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-saltwater-bait-guide',
        name: "Saltwater Anglers Guide to Fishing with Bait (How to rig, use and catch fish)",
        description: "The ultimate guide to selecting and rigging natural baits.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-pier-fishing-rigs',
        name: "Pier Fishing Rigs and Tactics (4 Proven Methods to Catch MORE Fish!)",
        description: "Four essential rig setups every pier angler needs to know.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-surf-rigs-basic',
        name: "4 Basic Surf Rigs and How to Tie Them",
        description: "Foundation rigs for successful surf fishing.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-surf-gear-guide',
        name: "Surf Fishing Gear Guide (BEST Rods, Reels, Tackle and Accessories)",
        description: "Don't waste money on the wrong gear. Expert recommendations for every budget.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-surf-adventure',
        name: "SURF FISHING ADVENTURE GUIDE (Hey Skipper Surf Fishing Crash Course)",
        description: "A crash course in surf fishing for the adventurous angler.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-pier-101',
        name: "Pier Fishing 101 (Fishing Rigs, Baits, Tackle and More!)",
        description: "The complete beginner's guide to pier fishing.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-jetty-101',
        name: "Jetty Fishing 101 Tutorial (Fishing Rigs, Baits, Tackle and More!)",
        description: "Learn how to fish the rocks safely and effectively.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-knots-101',
        name: "Fishing Knots 101 (How to Tie Strong Knots / What Knots to Use and When?)",
        description: "Essential knots for every angler.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-no-snag-rig',
        name: "No Snag Fishing Rig- Slip Float Rig (Advanced Saltwater Fishing Rig Tutorial)",
        description: "Stop losing tackle and start catching more fish with the slip float rig.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-surf-201',
        name: "Surf Fishing 201 (How to catch your own dinner fish!)",
        description: "Take your surf fishing to the next level.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-clammy-bits-guide',
        name: "How To Use Clammy Bits",
        description: "Maximize your success with our signature Clammy Bits bait.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-shrimpy-bits-guide',
        name: "How To Use Shrimpy Bits",
        description: "Tips and tricks for fishing with Shrimpy Bits.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-squidy-bits-guide',
        name: "How To Use Squidy Bits",
        description: "Unlock the full potential of Squidy Bits.",
        price: 4.99,
        image: "/assets/ebook-placeholder.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
];

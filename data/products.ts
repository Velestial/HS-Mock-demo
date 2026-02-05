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
    isFinalChance?: boolean;
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
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/03/allinone-1.jpg",
        specs: "Complete Kit",
        categoryId: 'bundle',
        items: ["Assorted Baits", "Tackle Box", "Instructions"],
        tag: "BEST_VALUE",
        isFinalChance: false
    },
    {
        id: 'bundle-fishing-fanatic',
        name: "FISHING FANATIC – Beach Fishing Bait Box + Fishing Rigs",
        description: "Everything a beach angler needs. Includes our premium bait box and a selection of specialized beach rigs.",
        price: 160.00,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/03/finatic-1.jpg",
        specs: "Beach Specialist",
        categoryId: 'bundle',
        items: ["Beach Bait Box", "3x Surf Rigs", "Sinker Pack"],
        tag: "POPULAR",
        isFinalChance: false
    },
    {
        id: 'bundle-weekend-essentials',
        name: "WEEKEND ESSENTIALS – Bottom Fishing Rigs + Sinkers",
        description: "Don't get caught short on the water. A resupply kit focusing on the most commonly lost terminal tackle.",
        price: 70.00,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/05/1.Weekendessentialsbundle.jpg",
        specs: "Terminal Tackle",
        categoryId: 'bundle',
        items: ["10x Bottom Rigs", "Assorted Sinkers", "Swivels"],
        tag: "ESSENTIAL",
        isFinalChance: true
    },
    {
        id: 'bundle-fishing-fever',
        name: "FISHING FEVER Kit – Bottom Fishing Rig Box + Sinkers + Accessories",
        description: "A comprehensive kit for bottom fishing enthusiasts. Organized and ready to deploy.",
        price: 110.00,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/05/1.essentialsbox.jpg",
        specs: "Bottom Rig Kit",
        categoryId: 'bundle',
        items: ["Rig Box", "Sinker Assortment", "Pliers", "Beads"],
        tag: "COMPLETE_URL",
        isFinalChance: true
    },
    {
        id: 'bundle-popping-float',
        name: "Popping slip float rig Kit",
        description: "Trigger aggressive strikes with this complete popping cork setup. Perfect for speckled trout and redfish.",
        price: 30.00,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/12/poppingfloat.jpg",
        specs: "Surface Action",
        categoryId: 'bundle',
        items: ["3x Popping Floats", "Example Lures", "Leader Material"],
        tag: "INSHORE",
        isFinalChance: true
    },
    {
        id: 'bundle-missile-float',
        name: "Fishing Missile Slip Float Kit",
        description: "Long-casting slip float system for reaching distant feeding zones with precision depth control.",
        price: 40.00,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/12/X-ROC-KIT.jpg",
        specs: "Long Range Float",
        categoryId: 'bundle',
        items: ["Missile Floats", "Stoppers", "Weights"],
        tag: "DISTANCE",
        isFinalChance: true
    },
    {
        id: 'bundle-bbl-lure',
        name: "BBL LURE BUNDLE",
        description: "Big Bass/Big Lure selection. A heavy-hitting assortment for targeting trophy sized fish.",
        price: 100.00,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2025/03/BBLBUNDLE.jpg",
        specs: "Trophy Hunter",
        categoryId: 'bundle',
        items: ["Large Lures", "Heavy Hooks", "Stinger Rigs"],
        tag: "TROPHY",
        isFinalChance: true
    },
    {
        id: 'bundle-core-rig',
        name: "Core Rig Bundle – Variety Pack",
        description: "Never wonder what to tie on next. A diverse collection of our most trusted rig patterns.",
        price: 35.00,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2025/04/COREBUNDLE.jpg",
        specs: "Variety Pack",
        categoryId: 'bundle',
        items: ["Carolina Rigs", "Knocker Rigs", "Drop Shot Rigs"],
        tag: "VERSATILE"
    },
    // E-books

    // New E-books
    {
        id: 'ebook-catch-cook-intl',
        name: "Catch'n & Cook'n INTL Fish Cookbook",
        description: "International recipes for your fresh catch.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2023/01/cookbookfinalthumbnail.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-pier-fishing-big',
        name: "Pier Fishing For BIG fish (Tackle Gear, Techniques and Strategy)",
        description: "Master the pier with specialized techniques for landing trophy fish.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2021/09/PRODUCTIMAGE1small-1.png",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-advanced-knots',
        name: "Advanced Fishing Knot Tutorial for Saltwater Anglers! (T-Knot Fishing Knot Guide, Bottom Rigs + More!)",
        description: "Tie the strongest knots for every saltwater situation.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2020/11/notangle.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-saltwater-bait-guide',
        name: "Saltwater Anglers Guide to Fishing with Bait (How to rig, use and catch fish)",
        description: "The ultimate guide to selecting and rigging natural baits.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2020/07/fishingwithbait.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-pier-fishing-rigs',
        name: "Pier Fishing Rigs and Tactics (4 Proven Methods to Catch MORE Fish!)",
        description: "Four essential rig setups every pier angler needs to know.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2020/03/thumnailpierfishing-1000x1000.png",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-surf-rigs-basic',
        name: "4 Basic Surf Rigs and How to Tie Them",
        description: "Foundation rigs for successful surf fishing.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2019/11/newthumb-1-scaled.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-surf-gear-guide',
        name: "Surf Fishing Gear Guide (BEST Rods, Reels, Tackle and Accessories)",
        description: "Don't waste money on the wrong gear. Expert recommendations for every budget.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2019/08/SURFGEAR-1-scaled-1000x1000.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-surf-adventure',
        name: "SURF FISHING ADVENTURE GUIDE (Hey Skipper Surf Fishing Crash Course)",
        description: "A crash course in surf fishing for the adventurous angler.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2019/05/surf-scaled-1000x1000.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-pier-101',
        name: "Pier Fishing 101 (Fishing Rigs, Baits, Tackle and More!)",
        description: "The complete beginner's guide to pier fishing.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2019/05/pier-scaled-1000x1000.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-jetty-101',
        name: "Jetty Fishing 101 Tutorial (Fishing Rigs, Baits, Tackle and More!)",
        description: "Learn how to fish the rocks safely and effectively.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2019/05/jetty-scaled-1000x1000.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-knots-101',
        name: "Fishing Knots 101 (How to Tie Strong Knots / What Knots to Use and When?)",
        description: "Essential knots for every angler.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2019/05/WHATKNOTS-scaled-1000x1000.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-no-snag-rig',
        name: "No Snag Fishing Rig- Slip Float Rig (Advanced Saltwater Fishing Rig Tutorial)",
        description: "Stop losing tackle and start catching more fish with the slip float rig.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2019/05/FLOATRIGTN-scaled-1000x1000.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-surf-201',
        name: "Surf Fishing 201 (How to catch your own dinner fish!)",
        description: "Take your surf fishing to the next level.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2019/05/pompanopdfthumbnail.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-clammy-bits-guide',
        name: "How To Use Clammy Bits",
        description: "Maximize your success with our signature Clammy Bits bait.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2021/03/clammybit13123-thumb.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-shrimpy-bits-guide',
        name: "How To Use Shrimpy Bits",
        description: "Tips and tricks for fishing with Shrimpy Bits.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2021/03/shrimpybitsthumbnail.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    {
        id: 'ebook-squidy-bits-guide',
        name: "How To Use Squidy Bits",
        description: "Unlock the full potential of Squidy Bits.",
        price: 4.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2019/05/FREEPDFSQUID-scaled-1000x1000.jpg",
        specs: "PDF / Digital Download",
        categoryId: 'ebook'
    },
    // Final Chance Items
    {
        id: 'final-sure-catch',
        name: "Sure Catch Fishing Rig (Long Distance Cast)",
        description: "Short Leader Line. Designed for maximum casting distance and hook setting power.",
        price: 7.00,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2023/03/wblongdistance.jpg",
        specs: "Long Distance / Short Leader",
        categoryId: 'tackle',
        isFinalChance: true,
        tag: "LIMITED_STOCK"
    },
    {
        id: 'final-rig-spool',
        name: "Fishing Rig Spool",
        description: "Tangle Free Rig Storage By Hey Skipper. Keep your rigs organized and ready to deploy.",
        price: 9.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/08/spool1.o.jpg",
        specs: "Storage / Tangle-Free",
        categoryId: 'tackle',
        isFinalChance: true
    },
    {
        id: 'final-mini-bait-cage',
        name: "Mini Bait Cage",
        description: "Fishing Rig Attachment. Perfect for holding chum or scent pellets near your hook.",
        price: 5.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/03/1.jpg",
        specs: "Rig Attachment",
        categoryId: 'tackle',
        isFinalChance: true
    },
    {
        id: 'final-double-take',
        name: "Double Take: Metal Casting Lure",
        description: "Flashy metal jig for long casts and fast retrieves.",
        price: 12.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/12/1.-EGGYsinker1ozOUTBAG.jpg", // Using placeholder from snippet if actual image is different
        specs: "Metal Jig",
        categoryId: 'tackle',
        isFinalChance: true
    },
    {
        id: 'final-eggy-sinkers',
        name: "Eggy Sinkers",
        description: "Orange Egg Sinkers. High visibility and smooth sliding action.",
        price: 6.99,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2024/12/1.-EGGYsinker1ozOUTBAG.jpg",
        specs: "Egg Sinker / Orange",
        categoryId: 'tackle',
        isFinalChance: true
    },
    {
        id: 'final-mini-sure-catch',
        name: "Mini Sure Catch Fishing Rig",
        description: "Small Hooks — Live Baits / Freeline / Carolina / Float. Versatile rig for smaller species.",
        price: 6.50,
        image: "https://www.heyskipperfishing.com/wp-content/uploads/2023/03/wblongdistance.jpg", // Placeholder
        specs: "Small Hooks / Versatile",
        categoryId: 'tackle',
        isFinalChance: true
    }
];


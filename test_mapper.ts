

import { mapWooProductToAppProduct } from './utils/productMapper';

// Mock data
const mockWpProduct = {
    id: 123,
    name: "Test Product",
    description: "<p>Test Description</p>",
    price: "19.99",
    images: [{ src: "test.jpg" }],
    attributes: [],
    categories: [
        { id: 1, name: "Final Chance" },
        { id: 2, name: "Fishing" }
    ],
    short_description: "Short desc"
};

const mockWpProductBundle = {
    id: 999,
    name: "WEEKEND ESSENTIALS – Bottom Fishing Rigs + Sinkers", // Exact match attempt
    description: "<p>Old WP Description</p>",
    price: "70.00",
    images: [],
    attributes: [],
    categories: [{ id: 5, name: "Bundles" }]
};

const mockWpProductBundleFuzzy = {
    id: 888,
    name: "Core Rig Bundle - Variety Pack", // Hyphen instead of dash, testing fuzzy
    description: "<p>Should be replaced</p>",
    price: "35.00",
    images: [],
    attributes: [],
    categories: [{ id: 5, name: "Bundles" }]
};

console.log("Starting test...");
try {
    const mapped1 = mapWooProductToAppProduct(mockWpProduct);
    console.log(`Product 1 (Final Chance): isFinalChance = ${mapped1.isFinalChance}`);

    const mappedBundle = mapWooProductToAppProduct(mockWpProductBundle);
    console.log(`Bundle 1 Name: ${mappedBundle.name}`);
    console.log(`Bundle 1 Description: ${mappedBundle.description}`);
    console.log(`Bundle 1 Items: ${mappedBundle.items?.join(', ')}`);

    const mappedBundleFuzzy = mapWooProductToAppProduct(mockWpProductBundleFuzzy);
    console.log(`Bundle 2 Name: ${mappedBundleFuzzy.name}`);
    console.log(`Bundle 2 Description: ${mappedBundleFuzzy.description}`);
    console.log(`Bundle 2 Items: ${mappedBundleFuzzy.items?.join(', ')}`);

    if (mappedBundle.description.startsWith("Don't get caught") && mappedBundle.items && mappedBundle.items.length > 0) {
        console.log("SUCCESS: Bundle 1 merged correctly.");
    } else {
        console.error("FAILURE: Bundle 1 did not merge correctly.");
    }

    if (mappedBundleFuzzy.description.startsWith("Never wonder") && mappedBundleFuzzy.items && mappedBundleFuzzy.items.length > 0) {
        console.log("SUCCESS: Bundle 2 (Fuzzy) merged correctly.");
    } else {
        console.error("FAILURE: Bundle 2 (Fuzzy) did not merge correctly.");
    }

} catch (error) {
    console.error("Error during test:", error);
}



const { mapWooProductToAppProduct } = require('./utils/productMapper');

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

const mockWpProduct2 = {
    id: 124,
    name: "Regular Product",
    categories: [
        { id: 3, name: "Regular" }
    ]
};

const mockWpProduct3 = {
    id: 125,
    name: "Clearance Product",
    categories: [
        { id: 4, name: "Clearance Items" }
    ]
};

// Mock mapCategory since it's not exported or we can just mock the whole file if structure is complex, 
// but here we are importing the actual file. 
// Note: The original file uses ES modules (import/export). 
// Node.js might complain if we use 'require' on a module type file or vice versa depending on package.json.
// Let's try to read the file content and check if it uses "type": "module" in package.json.
// If it does, we can use an .mjs file.

console.log("Starting test...");
try {
    const mapped1 = mapWooProductToAppProduct(mockWpProduct);
    console.log(`Product 1 (Final Chance): isFinalChance = ${mapped1.isFinalChance}`);

    const mapped2 = mapWooProductToAppProduct(mockWpProduct2);
    console.log(`Product 2 (Regular): isFinalChance = ${mapped2.isFinalChance}`);

    const mapped3 = mapWooProductToAppProduct(mockWpProduct3);
    console.log(`Product 3 (Clearance): isFinalChance = ${mapped3.isFinalChance}`);

    if (mapped1.isFinalChance === true && mapped2.isFinalChance === false && mapped3.isFinalChance === true) {
        console.log("SUCCESS: Mapper logic is correct.");
    } else {
        console.log("FAILURE: Mapper logic is incorrect.");
    }
} catch (error) {
    console.error("Error during test:", error);
}

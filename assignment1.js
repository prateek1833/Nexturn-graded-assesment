const inventory = [
    {
        id: 101,
        name: "MacBook Pro 2023",
        category: "Computers",
        price: 1299,
        inStock: true
    },
    {
        id: 102,
        name: "Action Figure - Batman",
        category: "Toys",
        price: 25.5,
        inStock: true
    },
    {
        id: 103,
        name: "Google Pixel 8",
        category: "Mobile Phones",
        price: 799,
        inStock: false
    }
];

// Function to process inventory data
const processInventory = (items) => items;

// Process the inventory data
const processedInventory = processInventory(inventory);

// Function to add a product to the inventory
const addProduct = (inventoryList, newProduct) => {
    return [...inventoryList, newProduct];
};

// Adding a new product
const newProduct = {
    id: 104,
    name: "The Alchemist",
    category: "Books",
    price: 15.99,
    inStock: true
};
const updatedInventory = addProduct(processedInventory, newProduct);

// Function to update the price of a product by its ID
const updatePriceById = (inventoryList, productId, newPrice) => {
    return inventoryList.map(item =>
        item.id === productId ? { ...item, price: newPrice } : item
    );
};

// Updating the price of product ID 102
const inventoryWithUpdatedPrice = updatePriceById(updatedInventory, 102, 29.99);

// Function to get products that are in stock
const getInStockProducts = (inventoryList) => {
    return inventoryList.filter(item => item.inStock);
};

// Get the list of products currently in stock
const inStockProducts = getInStockProducts(inventoryWithUpdatedPrice);

// Function to filter products by category
const filterByCategory = (inventoryList, category) => {
    return inventoryList.filter(item => item.category === category);
};

// Get products under the category "Computers"
const computersInventory = filterByCategory(inventoryWithUpdatedPrice, "Computers");

// Logs to display the results
console.log("Processed Inventory:", processedInventory);
console.log("Updated Inventory with New Product:", updatedInventory);
console.log("Inventory with Updated Price for Product ID 102:", inventoryWithUpdatedPrice);
console.log("In-Stock Products:", inStockProducts);
console.log("Products in 'Computers' Category:", computersInventory);

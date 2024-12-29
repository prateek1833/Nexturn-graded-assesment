db.users.insertMany([
    { name: "Michael Scott", email: "mscott@dundermifflin.com", address: { street: "1725 Slough Ave", city: "Scranton", zipcode: "18505" }, phone: "570-555-1234", joined_on: new Date("2023-01-10T10:00:00Z") },
    { name: "Pam Beesly", email: "pbeesly@dundermifflin.com", address: { street: "402 Paper St", city: "Scranton", zipcode: "18504" }, phone: "570-555-5678", joined_on: new Date("2023-03-22T10:00:00Z") },
    { name: "Jim Halpert", email: "jhalpert@dundermifflin.com", address: { street: "22 Maple Rd", city: "Clarks Summit", zipcode: "18411" }, phone: "570-555-8765", joined_on: new Date("2023-04-18T10:00:00Z") },
    { name: "Dwight Schrute", email: "dschrute@schrutefarms.com", address: { street: "1 Beet Ln", city: "Honesdale", zipcode: "18431" }, phone: "570-555-4321", joined_on: new Date("2023-05-05T10:00:00Z") },
    { name: "Ryan Howard", email: "rhoward@dundermifflin.com", address: { street: "300 Corporate Blvd", city: "New York", zipcode: "10016" }, phone: "212-555-6789", joined_on: new Date("2023-06-15T10:00:00Z") }
]);

db.users.findOne({ name: "Michael Scott" })._id;
db.users.findOne({ name: "Pam Beesly" })._id;
db.users.findOne({ name: "Jim Halpert" })._id;
db.users.findOne({ name: "Dwight Schrute" })._id;
db.users.findOne({ name: "Ryan Howard" })._id;

db.purchases.insertMany([
    {
        _id: ObjectId(),
        purchase_code: "PRC001",
        customer_id: ObjectId('60b22c279ec744648a0d1234'),
        purchase_date: "2023-07-01",
        status: "completed",
        items: [
            { product: "Laptop", quantity: 1, unit_price: 1200 },
            { product: "Keyboard", quantity: 1, unit_price: 50 }
        ],
        total_price: 1250
    },
    {
        _id: ObjectId(),
        purchase_code: "PRC002",
        customer_id: ObjectId('60b22c279ec744648a0d5678'),
        purchase_date: "2023-07-15",
        status: "pending",
        items: [
            { product: "Tablet", quantity: 1, unit_price: 300 }
        ],
        total_price: 300
    },
    {
        _id: ObjectId(),
        purchase_code: "PRC003",
        customer_id: ObjectId('60b22c279ec744648a0d8765'),
        purchase_date: "2023-08-10",
        status: "delivered",
        items: [
            { product: "Monitor", quantity: 2, unit_price: 150 }
        ],
        total_price: 300
    },
    {
        _id: ObjectId(),
        purchase_code: "PRC004",
        customer_id: ObjectId('60b22c279ec744648a0d4321'),
        purchase_date: "2023-08-20",
        status: "shipped",
        items: [
            { product: "Smartphone", quantity: 1, unit_price: 800 }
        ],
        total_price: 800
    },
    {
        _id: ObjectId(),
        purchase_code: "PRC005",
        customer_id: ObjectId('60b22c279ec744648a0d6789'),
        status: "processing",
        items: [
            { product: "Headphones", quantity: 2, unit_price: 40 },
            { product: "Charger", quantity: 1, unit_price: 20 }
        ],
        total_price: 100
    }
]);

db.purchases.find({ customer_id: ObjectId('60b22c279ec744648a0d1234') });

db.users.findOne({ _id: ObjectId('60b22c279ec744648a0d1234') });

db.purchases.updateOne(
    { purchase_code: "PRC001" },
    { $set: { status: "delivered" } }
);

db.purchases.deleteOne({ purchase_code: "PRC001" });

db.purchases.aggregate([
    { $group: { _id: "$customer_id", total_spent: { $sum: "$total_price" } } },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "customer_details" } },
    { $unwind: "$customer_details" },
    { $project: { name: "$customer_details.name", total_spent: 1 } }
]);

db.purchases.aggregate([
    { $group: { _id: "$status", purchase_count: { $sum: 1 } } }
]);

db.purchases.aggregate([
    { $sort: { purchase_date: -1 } },
    { $group: { _id: "$customer_id", latest_purchase: { $first: "$$ROOT" } } },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "customer_details" } },
    { $unwind: "$customer_details" },
    { $project: { name: "$customer_details.name", email: "$customer_details.email", purchase_code: "$latest_purchase.purchase_code", total_price: "$latest_purchase.total_price" } }
]);

db.purchases.aggregate([
    { $sort: { total_price: -1 } },
    { $group: { _id: "$customer_id", top_purchase: { $first: "$$ROOT" } } },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "customer_details" } },
    { $unwind: "$customer_details" },
    { $project: { name: "$customer_details.name", purchase_code: "$top_purchase.purchase_code", total_price: "$top_purchase.total_price" } }
]);

db.purchases.aggregate([
    { $match: { purchase_date: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } } },
    { $group: { _id: "$customer_id", recent_purchase: { $first: "$$ROOT" } } },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "customer_details" } },
    { $unwind: "$customer_details" },
    { $project: { name: "$customer_details.name", email: "$customer_details.email", purchase_date: "$recent_purchase.purchase_date" } }
]);

db.purchases.aggregate([
    { $match: { customer_id: ObjectId('60b22c279ec744648a0d1234') } },
    { $unwind: "$items" },
    { $group: { _id: "$items.product", total_quantity: { $sum: "$items.quantity" } } }
]);

db.purchases.aggregate([
    { $group: { _id: "$customer_id", total_spent: { $sum: "$total_price" } } },
    { $sort: { total_spent: -1 } },
    { $limit: 3 },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "customer_details" } },
    { $unwind: "$customer_details" },
    { $project: { name: "$customer_details.name", total_spent: 1 } }
]);

db.purchases.insertOne({
    purchase_code: "PRC006",
    customer_id: ObjectId("60b22c279ec744648a0d5678"),
    purchase_date: new Date("2023-09-01T15:00:00Z"),
    status: "pending",
    items: [
        { product: "Smartwatch", quantity: 1, unit_price: 300 },
        { product: "Wireless Earbuds", quantity: 2, unit_price: 75 }
    ],
    total_price: 450
});

db.users.aggregate([
    { $lookup: { from: "purchases", localField: "_id", foreignField: "customer_id", as: "purchase_history" } },
    { $match: { "purchase_history": { $size: 0 } } },
    { $project: { name: 1, email: 1 } }
]);

db.purchases.aggregate([
    { $unwind: "$items" },
    { $group: { _id: null, avg_quantity: { $avg: "$items.quantity" } } },
    { $project: { avg_quantity: 1, _id: 0 } }
]);

db.purchases.aggregate([
    { $lookup: { from: "users", localField: "customer_id", foreignField: "_id", as: "customer_details" } },
    { $unwind: "$customer_details" },
    { $match: { "customer_details.city": "Scranton" } },
    { $group: { _id: null, avg_order_total: { $avg: "$total_price" } } }
]);

// Get canceled orders
db.orders.aggregate([
  {
    $match: {
      STATUS: "Canceled",
    },
  },
  {
    $lookup: {
      from: "order_items",
      localField: "ORDER_ID",
      foreignField: "ORDER_ID",
      as: "order_items",
    },
  },
]);

// Get customers and number of their orders
db.orders.aggregate([
  {
    $group: {
      _id: "$NAME",
      count: { $sum: 1 },
    },
  },
]);

// Get number of products
db.products.count();

// Get product categories
db.products.distinct("CATEGORY_NAME");

// Get the top 3 bigges order's customer name and the order size
db.orders.aggregate(
  [
    { $match: { order_items: { $exists: true, $not: { $size: 0 } } } },

    {
      $unwind: "$order_items",
    },

    {
      $group: {
        _id: "$_id",
        customer: { $first: "$NAME" },
        total: { $sum: { $toInt: "$order_items.UNIT_PRICE" } },
      },
    },

    {
      $sort: {
        total: -1,
      },
    },

    {
      $limit: 3,
    },
  ],
  { allowDiskUse: true }
);

// Get the top 3 warehouses that stores the most variety things
db.inventories.aggregate(
  [
    {
      $group: {
        _id: "$WAREHOUSE_NAME",
        warehouseName: { $first: "$WAREHOUSE_NAME" },
        count: { $sum: 1 },
      },
    },

    {
      $sort: {
        count: -1,
      },
    },

    {
      $limit: 3,
    },
  ],
  { allowDiskUse: true }
);

// Get order date, customer name and number of their items
db.orders.aggregate([
  {
    $project: {
      orderDate: "$ORDER_DATE",
      customer: "$NAME",
      items: { $size: "$order_items" },
    },
  },
]);

// Get the latest joined employee

db.employees.aggregate([
  {
    $project: {
      date: {
        $dateFromString: {
          dateString: "$HIRE_DATE",
        },
      },
      firstName: "$FIRST_NAME",
      lastName: "$LAST_NAME",
    },
  },
  { $sort: { date: -1 } },
  { $limit: 1 },
]);

// Get Cheese products
db.products.find({ CATEGORY_NAME: { $eq: "Cheese" } });

// Get customers and number of their orders
db.orders.aggregate([
  {
    $group: {
      _id: "$NAME",
      count: { $sum: 1 },
    },
  },
]);

// Get the name of that sales who had the most sales
db.orders.aggregate(
  [
    { $unwind: "$salesman" },
    {
      $group: {
        _id: "$salesman.EMPLOYEE_ID",
        data: { $first: "$salesman" },
        count: { $sum: 1 },
      },
    },

    {
      $project: {
        _id: 0,
        sales: { $concat: ["$data.FIRST_NAME", " ", "$data.LAST_NAME"] },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ],
  { allowDiskUse: true }
);

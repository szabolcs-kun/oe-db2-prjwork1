db.orders.aggregate([
  {
    $lookup: {
      from: "order_items",
      localField: "ORDER_ID",
      foreignField: "ORDER_ID",
      as: "order_items",
    },
  },
  {
    $merge: { into: "orders" },
  },
]);

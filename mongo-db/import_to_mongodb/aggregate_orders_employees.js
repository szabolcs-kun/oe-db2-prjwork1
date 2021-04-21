db.orders.aggregate([
  {
    $lookup: {
      from: "employees",
      localField: "SALESMAN_ID",
      foreignField: "EMPLOYEE_ID",
      as: "salesman",
    },
  },
  {
    $merge: { into: "orders" },
  },
]);

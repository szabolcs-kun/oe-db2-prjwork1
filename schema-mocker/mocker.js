#!/usr/bin/env node
import mocker from "mocker-data-generator";
import fs from "fs";
import converter from "json-2-csv";

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
  } catch (err) {
    console.error(err);
  }
};

const convertJsonToCsvFileAsync = async (jsonObject, fileName) => {
  const rootDirectory = "./output";

  const options = {
    delimiter: { field: ";" },
    useDateIso8601Format: true,
  };

  const csvResult = await converter.json2csvAsync(jsonObject, options);

  if (!fs.existsSync(rootDirectory)) {
    fs.mkdirSync(rootDirectory);
  }

  var path = rootDirectory + "/" + fileName + ".csv";

  fs.writeFileSync(path, csvResult);
};

// Generates random date-time from interval
const randomDate = (start, end, startHour, endHour) => {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
  date.setHours(hour);
  return date;
};

// Generates random integer from interval
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Schema model
var region = {
  id: {
    incrementalId: 0,
  },
  regionName: {
    faker: "address.state",
  },
};

var country = {
  id: {
    faker: "address.countryCode",
  },
  countryName: {
    faker: "address.country",
  },
  regionId: {
    hasOne: "regions",
    get: "id",
  },
};

var location = {
  id: {
    incrementalId: 0,
  },
  address: {
    function: function () {
      return (
        this.faker.address.streetName() +
        " " +
        this.faker.address.citySuffix() +
        " " +
        this.faker.datatype.number()
      );
    },
  },
  postalCode: {
    faker: "address.zipCode",
  },
  city: {
    faker: "address.city",
  },
  state: {
    faker: "address.state",
  },
  countryId: {
    hasOne: "countries",
    get: "id",
  },
};

var warehouse = {
  id: {
    incrementalId: 0,
  },
  warehouseName: {
    function: function () {
      return this.faker.company.companyName() + " Warehouse";
    },
  },
  locationId: {
    hasOne: "locations",
    get: "id",
  },
};

var productCategory = {
  id: {
    incrementalId: 0,
  },
  categoryName: {
    faker: "commerce.product",
  },
};

var product = {
  id: {
    incrementalId: 0,
  },
  productName: {
    faker: "commerce.productName",
  },
  description: {
    faker: "commerce.productDescription",
  },
  standardCost: {
    faker: "commerce.price",
  },
  listPrice: {
    faker: "commerce.price",
  },
  categoryId: {
    hasOne: "productCategories",
    get: "id",
  },
};

var inventory = {
  id: {
    incrementalId: 0,
  },
  productId: {
    hasOne: "products",
    get: "id",
  },
  warehouseId: {
    hasOne: "warehouses",
    get: "id",
  },
};

var orderItem = {
  id: {
    incrementalId: 0,
  },
  quantity: {
    function: function () {
      return randomIntFromInterval(1, 1000);
    },
  },
  unit_price: {
    incrementalId: 0,
  },
  orderId: {
    hasOne: "orders",
    get: "id",
  },
  productId: {
    hasOne: "products",
    get: "id",
  },
};

var order = {
  id: {
    incrementalId: 0,
  },
  customerId: {
    hasOne: "customers",
    get: "id",
  },
  status: {
    function: function () {
      return this.faker.random.arrayElement([
        "Pending",
        "Canceled",
        "On-hold",
        "Processed",
        "Ordered from vendor",
        "Completed",
        "Passed to the delivery service",
        "Payment pending",
      ]);
    },
  },
  salesmanId: {
    hasOne: "employees",
    get: "id",
  },
  orderDate: {
    function: function () {
      var today = new Date();
      var withinOneYearStatuses = [
        "Ordered from vendor",
        "Pending",
        "On-hold",
        "Processed",
        "Passed to the delivery service",
        "Payment pending",
      ];
      if (withinOneYearStatuses.includes(this.object.status)) {
        return randomDate(
          today.setDate(today.getDate() - 180),
          new Date(),
          0,
          24
        );
      } else {
        return randomDate(new Date(1996, 1, 1), new Date(), 0, 24);
      }
    },
  },
};

var employee = {
  id: {
    incrementalId: 0,
  },
  firstName: {
    faker: "name.firstName",
  },
  lastName: {
    faker: "name.lastName",
  },
  email: {
    function: function () {
      return (
        this.object.firstName +
        "." +
        this.object.lastName +
        "@contosofactory.com"
      );
    },
  },
  phone: {
    faker: "phone.phoneNumber",
  },
  hireDate: {
    function: function () {
      return randomDate(new Date(1995, 1, 1), new Date(), 0, 24);
    },
  },
  jobTitle: {
    faker: "name.jobTitle",
  },
};

var customer = {
  id: {
    incrementalId: 0,
  },
  address: {
    function: function () {
      return (
        this.faker.address.streetName() +
        " " +
        this.faker.address.citySuffix() +
        " " +
        this.faker.datatype.number() +
        ", " +
        this.faker.address.city() +
        " " +
        this.faker.address.country()
      );
    },
  },
  website: {
    faker: "internet.url",
  },
  creditLimit: {
    function: function () {
      return randomIntFromInterval(50000, 1000000);
    },
  },
};

var contact = {
  id: {
    incrementalId: 0,
  },
  firstName: {
    faker: "name.firstName",
  },
  lastName: {
    faker: "name.lastName",
  },
  email: {
    function: function () {
      return (
        this.object.firstName +
        "." +
        this.object.lastName +
        "@" +
        this.faker.internet.domainName()
      );
    },
  },
  phone: {
    faker: "phone.phoneNumber",
  },
  customerId: {
    hasOne: "customers",
    get: "id",
  },
};

// Generating the mocked data set
var result = mocker
  .mocker()
  .schema("regions", region, 5)
  .schema("countries", country, 10)
  .schema("locations", location, 10)
  .schema("warehouses", warehouse, 20)
  .schema("productCategories", productCategory, 20)
  .schema("products", product, 40)
  .schema("inventories", inventory, 50)
  .schema("employees", employee, 50)
  .schema("customers", customer, 50)
  .schema("orders", order, 50)
  .schema("orderItems", orderItem, 50)
  .schema("contacts", contact, 50)
  .buildSync();

// Setting the manager IDs with simulating orgchart tree in the employees
result.employees[0].managerId = result.employees[0].id;
for (var i = 1; i < result.employees.length; i++) {
  result.employees[i].managerId =
    result.employees[randomIntFromInterval(0, i - 1)].id;
}

// Setting the names in customers with inheriting it from the contacts
for (var i = 0; i < result.contacts.length; i++) {
  var relatedCustomerIndex = result.customers.findIndex(
    (x) => x.id == result.contacts[i].customerId
  );

  result.customers[relatedCustomerIndex].name =
    result.contacts[i].lastName + ", " + result.contacts[i].firstName;
}

// Generate CSV output files
var key;
for (key in result) {
  await convertJsonToCsvFileAsync(result[key], key);
}

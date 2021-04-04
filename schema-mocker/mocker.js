#!/usr/bin/env node
import mocker from "mocker-data-generator";
import fs from "fs";
import converter from "json-2-csv";
import nfetch from "node-fetch";
import _ from "lodash";

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

  fs.writeFileSync(path, csvResult, "utf-8");
};

const fixIdsAndReferences = (data, ids, iterator, generatorSize) => {
  data.forEach((d) => {
    ids.forEach((id) => {
      d[id] += iterator * generatorSize;
    });
  });
  return data;
};

const getModelIds = (modelName) => {
  switch (modelName) {
    case "countries":
      return [];
      break;
    case "locations":
      return ["id"];
      break;
    case "warehouses":
      return ["id", "locationId"];
      break;
    case "productCategories":
      return ["id"];
      break;
    case "products":
      return ["id", "categoryId"];
      break;
    case "inventories":
      return ["id", "productId", "warehouseId"];
      break;
    case "employees":
      return ["id"];
      break;
    case "customers":
      return ["id"];
      break;
    case "orders":
      return ["id", "customerId", "salesmanId"];
      break;
    case "orderItems":
      return ["id", "orderId", "productId"];
      break;
    case "contacts":
      return ["id", "customerId"];
      break;
  }
};

const getCountryDetailsAsync = async (countryCode) => {
  const response = await nfetch(
    "https://restcountries.eu/rest/v2/alpha/" + countryCode
  );
  const jsonResult = await response.json();

  return {
    countryCode: countryCode,
    countryName: jsonResult.name,
    region: jsonResult.region,
  };
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

// Get date time diff

const getTimeDiff = (start, end) => {
  return new Date(Math.abs(end - start)).toISOString().slice(11, -1);
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
    function: function () {
      return this.faker.random.arrayElement([
        "Sales Manager",
        "Field Sales",
        "Account Executive",
        "Back-office Manager",
        "Senior Sales Expert",
        "Marketing Manager",
        "Social Media Sales Expert",
        "Ordering Manager",
      ]);
    },
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

var startDate = new Date();

// Generating the mocked data set
console.log("Mock generation has started: " + startDate.toLocaleString());


var result = mocker
.mocker()
.schema("countries", country, 25)
.schema("locations", location, 40)
.schema("warehouses", warehouse, 40)
.schema("productCategories", productCategory, 550)
.schema("products", product, 1000000)
.schema("inventories", inventory, 50)
.schema("employees", employee, 150)
.schema("customers", customer, 1000000)
.schema("orders", order, 1000000)
.schema("orderItems", orderItem, 1000000)
.schema("contacts", contact, 1000000)
.buildSync(function (error, data) {
  if (error) {
    throw error;
  }
  console.log(util.inspect(data, { depth: 10 }));
});

console.log(">>> Elapsed time:" + getTimeDiff(startDate, new Date()));

/*
var result = [];
for (var i = 0; i < 5; i++) {
  console.log("> Generating the " + (i + 1) + ". set of mock data.");
  var tmp = mocker
    .mocker()
    .schema("countries", country, 25)
    .schema("locations", location, 40)
    .schema("warehouses", warehouse, 40)
    .schema("productCategories", productCategory, 550)
    .schema("products", product, 100000)
    .schema("inventories", inventory, 50)
    .schema("employees", employee, 150)
    .schema("customers", customer, 100000)
    .schema("orders", order, 100000)
    .schema("orderItems", orderItem, 100000)
    .schema("contacts", contact, 100000)
    .buildSync(function (error, data) {
      if (error) {
        throw error;
      }
      console.log(util.inspect(data, { depth: 10 }));
    });

  var key;
  for (key in tmp) {
    if (key in result) {
      result[key] = result[key].concat(
        fixIdsAndReferences(tmp[key], getModelIds(key), i, tmp[key].length)
      );
    } else {
      result[key] = tmp[key];
    }
  }
  console.log(">>> Elapsed time:" + getTimeDiff(startDate, new Date()));
}
*/

// Setting the manager IDs with simulating orgchart tree in the employees
console.log(
  "Setting the manager IDs with simulating orgchart tree in the employees"
);
result.employees[0].managerId = result.employees[0].id;
for (var i = 1; i < result.employees.length; i++) {
  result.employees[i].managerId =
    result.employees[randomIntFromInterval(0, i - 1)].id;
}

console.log(">>> Elapsed time:" + getTimeDiff(startDate, new Date()));

// Setting the names in customers with inheriting it from the contacts
console.log(
  "Setting the names in customers with inheriting it from the contacts"
);
var customerMap = new Map(result.customers.map((c) => [c.id, c]));
for (var i = 0; i < result.contacts.length; i++) {
  var relatedCustomer = customerMap.get(result.contacts[i].customerId);

  if (relatedCustomer != undefined) {
    result.customers[relatedCustomer.id].name =
      result.contacts[i].firstName + " " + result.contacts[i].lastName;
  }
}

console.log(">>> Elapsed time:" + getTimeDiff(startDate, new Date()));

// Update country names based on country code and create regions
console.log("Pulling real country-region data from a public API endpoint");
const countries = await Promise.all(
  result.countries.map(async (c) => await getCountryDetailsAsync(c.id))
);
const regions = _.uniq(countries.map((r) => r.region)).map((a, i) => ({
  id: i,
  regionName: a,
}));

_.uniq(result.countries, function (item) {
  return [item.id, item.countryName].join();
}).forEach((c) => {
  const country = countries.find((cs) => cs.countryCode == c.id);
  c.countryName = country.countryName;
  c.regionId = regions.find((r) => r.regionName == country.region).id;
});

result.regions = regions;

var emptyRegionNameIndex = result.regions.findIndex((obj) => obj.regionName == "");
if (emptyRegionNameIndex != -1) {
  result.regions[emptyRegionNameIndex].regionName = "n/a";
}

console.log(">>> Elapsed time:" + getTimeDiff(startDate, new Date()));

// Generate CSV output files
console.log("Writing the results to CSV files");
var key;
for (key in result) {
  await convertJsonToCsvFileAsync(result[key], key);
}
console.log("[Total elapsed time:" + getTimeDiff(startDate, new Date()) + "]");

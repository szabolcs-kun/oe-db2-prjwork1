#!/usr/bin/env node
import mocker from "mocker-data-generator";
import fs from "fs";
import converter from "json-2-csv";
import nfetch from "node-fetch";
import _ from "lodash";
import moment from "moment";

const convertJsonToCsvFileAsync = async (jsonObject, fileName) => {
  const rootDirectory = "./output";

  const options = {
    useDateIso8601Format: false,
  };

  const csvResult = await converter.json2csvAsync(jsonObject, options);

  if (!fs.existsSync(rootDirectory)) {
    fs.mkdirSync(rootDirectory);
  }

  var path = rootDirectory + "/" + fileName + ".csv";

  fs.writeFileSync(path, csvResult, "utf-8");
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
  productId: {
    hasOne: "products",
    get: "id",
  },
  warehouseId: {
    hasOne: "warehouses",
    get: "id",
  },
  quantity: {
    function: function () {
      return randomIntFromInterval(0, 5000);
    },
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
        return moment(
          randomDate(today.setDate(today.getDate() - 180), new Date(), 0, 24)
        ).format("YYYY-MM-DD");
      } else {
        return moment(
          randomDate(new Date(1996, 1, 1), new Date(), 0, 24)
        ).format("YYYY-MM-DD");
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
        "@contosowholesale.com"
      );
    },
  },
  phone: {
    faker: "phone.phoneNumber",
  },
  hireDate: {
    function: function () {
      return moment(randomDate(new Date(1995, 1, 1), new Date(), 0, 24)).format(
        "YYYY-MM-DD"
      );
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
  .schema("warehouses", warehouse, 63)
  .schema("productCategories", productCategory, 550)
  .schema("products", product, 300000)
  .schema("inventories", inventory, 800000)
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

// Setting the names in customers with inheriting it from the contacts and fixing IDs
console.log(
  "Setting the names in customers with inheriting it from the contacts and fixing IDs"
);

for (var i = 0; i < result.customers.length; i++) {

  result.customers[i].name = result.contacts[i].firstName + " " + result.contacts[i].lastName;

  result.contacts[i].customerId = result.customers[i].id;
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

result.countries = _.uniqBy(result.countries, c => c.id);
result.countries.forEach((c) => {
    const country = countries.find((cs) => cs.countryCode == c.id);
    c.countryName = country.countryName;
    c.regionId = regions.find((r) => r.regionName == country.region).id;
  });

result.regions = regions;

var emptyRegionNameIndex = result.regions.findIndex(
  (obj) => obj.regionName == ""
);
if (emptyRegionNameIndex != -1) {
  result.regions[emptyRegionNameIndex].regionName = "n/a";
}

console.log(">>> Elapsed time:" + getTimeDiff(startDate, new Date()));

// Setting the unit_price in order items table
console.log("Setting the unit_price in order items table");
var productMap = new Map(result.products.map((p) => [p.id, p]));


for (var i = 0; i < result.orderItems.length; i++) {
  var relatedProduct = productMap.get(result.orderItems[i].productId);

  if (relatedProduct != undefined) {
    result.orderItems[i].unitPrice =
      Math.random() > 0.8
        ? Math.round(relatedProduct.standardCost * (1 - randomIntFromInterval(0, 20) / 100))
        : relatedProduct.standardCost;
  }
}

console.log(">>> Elapsed time:" + getTimeDiff(startDate, new Date()));

// Generate CSV output files
console.log("Writing the results to CSV files");
var key;
for (key in result) {
  await convertJsonToCsvFileAsync(result[key], key);
}
console.log("[Total elapsed time:" + getTimeDiff(startDate, new Date()) + "]");

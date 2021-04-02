#!/usr/bin/env node 
import mocker from 'mocker-data-generator'
import fs from 'fs'

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 4))
  } catch (err) {
    console.error(err)
  }
}

var region = {
    id: {
        incrementalId: 0
    },
    regionName: {
        faker: 'address.state'
    }
};

var country = {
    id:{
        faker: 'address.countryCode',
    },
    countryName:{
        faker: 'address.country'
    },
    regionId:{
        hasOne: 'regions',
        get: 'id',
        eval: true
    }

};

var location = {
    id: {
        incrementalId: 0
    },
    address:{
        function: function() {
            return this.faker.address.streetName() + ' ' + this.faker.address.citySuffix() + ' ' + this.faker.random.number()
        }
    },
    postalCode: {
        faker: 'address.zipCode'
    },
    city:{
        faker: 'address.city'
    },
    state:{
        faker: 'address.state'
    },
    countryId:{
        hasOne: 'countries',
        get: 'id',
        eval: true
    }

};

var warehouse = {
    id: {
        incrementalId: 0
    },
    warehouseName: {
        function: function() {
            return this.faker.company.companyName() + ' Warehouse'
        }
    },
    locationId: {
        hasOne: 'locations',
        get: 'id',
        eval: true
    }
};

var productCategory = {
    id: {
        incrementalId: 0
    },
    categoryName: {
       faker: 'commerce.product'
    }
}

var product = {
    id: {
        incrementalId: 0
    },
    productName: {
        faker: 'commerce.productName'
    },
    description: {
        faker: 'commerce.productDescription'
    },
    standardCost: {
        faker: 'commerce.price'
    },
    listPrice: {
        faker: 'commerce.price'
    },
    categoryId: {
        hasMany: 'productCategories',
        get: 'id',
        min: 1,
        max: 4,
        eval: true
    }
};

var inventory = {
    id: {
        incrementalId: 0
    },
    productId: {
        hasMany: 'products',
        get: 'id',
        min: 1,
        max: 20,
        eval: true
    }
};

var result = mocker.mocker()
    .schema('regions', region, 5)
    .schema('countries', country, 10)
    .schema('locations', location, 10)
    .schema('warehouses', warehouse, 20)
    .schema('productCategories', productCategory, 20)
    .schema('products', product, 40)
    .schema('inventories', inventory, 50)

    .buildSync();

console.log(result);

// storeData(result,'output.json');
CREATE TABLE regions
  (
    region_id NUMBER GENERATED BY DEFAULT AS IDENTITY
    START WITH 5,
    region_name VARCHAR2( 50 ) NOT NULL,
    CONSTRAINT PK_REGIONS_REGION_ID PRIMARY KEY(region_id)
  );
-- countries table
CREATE TABLE countries
  (
    country_id   CHAR( 2 )  ,
    country_name VARCHAR2( 40 ) NOT NULL,
    region_id    NUMBER                 , -- fk
    CONSTRAINT fk_countries_regions FOREIGN KEY( region_id )
      REFERENCES regions( region_id ) 
      ON DELETE CASCADE,
    CONSTRAINT PK_COUNTRIES_COUNTRY_ID PRIMARY KEY(country_id)
  );

-- location
CREATE TABLE locations
  (
    location_id NUMBER GENERATED BY DEFAULT AS IDENTITY START WITH 24,
    address     VARCHAR2( 255 ) NOT NULL,
    postal_code VARCHAR2( 20 )          ,
    city        VARCHAR2( 50 )          ,
    state       VARCHAR2( 50 )          ,
    country_id  CHAR( 2 )               , -- fk
    CONSTRAINT fk_locations_countries 
      FOREIGN KEY( country_id )
      REFERENCES countries( country_id ) 
      ON DELETE CASCADE,
    CONSTRAINT PK_LOCATIONS_LOCATION_ID PRIMARY KEY(location_id)
  );
-- warehouses
CREATE TABLE warehouses
  (
    warehouse_id NUMBER 
                 GENERATED BY DEFAULT AS IDENTITY START WITH 10,
    warehouse_name VARCHAR( 255 ) ,
    location_id    NUMBER( 12, 0 ), -- fk
    CONSTRAINT fk_warehouses_locations 
      FOREIGN KEY( location_id )
      REFERENCES locations( location_id ) 
      ON DELETE CASCADE,
    CONSTRAINT PK_WAREHOUSES_WAREHOUSE_ID PRIMARY KEY(warehouse_id)
  );
-- employees
CREATE TABLE employees
  (
    employee_id NUMBER 
                GENERATED BY DEFAULT AS IDENTITY START WITH 108,
    first_name VARCHAR( 255 ) NOT NULL,
    last_name  VARCHAR( 255 ) NOT NULL,
    email      VARCHAR( 255 ) NOT NULL,
    phone      VARCHAR( 50 ) NOT NULL ,
    hire_date  DATE NOT NULL          ,
    manager_id NUMBER( 12, 0 )        , -- fk
    job_title  VARCHAR( 255 ) NOT NULL,
    CONSTRAINT fk_employees_manager 
        FOREIGN KEY( manager_id )
        REFERENCES employees( employee_id )
        ON DELETE CASCADE,
    CONSTRAINT PK_EMPLOYEES_EMPLOYEE_ID PRIMARY KEY(employee_id)
  );
-- product category
CREATE TABLE product_categories
  (
    category_id NUMBER 
                GENERATED BY DEFAULT AS IDENTITY START WITH 6,
    category_name VARCHAR2( 255 ) NOT NULL,
    CONSTRAINT PK_PRODUCT_CATEGORIES_CATEGORY_ID PRIMARY KEY(category_id)
  );

-- products table
CREATE TABLE products
  (
    product_id NUMBER 
               GENERATED BY DEFAULT AS IDENTITY START WITH 289,
    product_name  VARCHAR2( 255 ) NOT NULL,
    description   VARCHAR2( 2000 )        ,
    standard_cost NUMBER( 9, 2 )          ,
    list_price    NUMBER( 9, 2 )          ,
    category_id   NUMBER NOT NULL         ,
    CONSTRAINT fk_products_categories 
      FOREIGN KEY( category_id )
      REFERENCES product_categories( category_id ) 
      ON DELETE CASCADE,
    CONSTRAINT PK_PRODUCTS_PRODUCT_ID PRIMARY KEY(product_id)
  );
-- customers
CREATE TABLE customers
  (
    customer_id NUMBER 
                GENERATED BY DEFAULT AS IDENTITY START WITH 320,
    name         VARCHAR2( 255 ) NOT NULL,
    address      VARCHAR2( 255 )         ,
    website      VARCHAR2( 255 )         ,
    credit_limit NUMBER( 12, 2 ),
    CONSTRAINT PK_CUSTOMERS_CUSTOMER_ID PRIMARY KEY(customer_id)
  );
-- contacts
CREATE TABLE contacts
  (
    contact_id NUMBER 
               GENERATED BY DEFAULT AS IDENTITY START WITH 320,
    first_name  VARCHAR2( 255 ) NOT NULL,
    last_name   VARCHAR2( 255 ) NOT NULL,
    email       VARCHAR2( 255 ) NOT NULL,
    phone       VARCHAR2( 35 )          ,
    customer_id NUMBER                  ,
    CONSTRAINT fk_contacts_customers 
      FOREIGN KEY( customer_id )
      REFERENCES customers( customer_id ) 
      ON DELETE CASCADE,
    CONSTRAINT PK_CONTACTS_CONTACT_ID PRIMARY KEY(contact_id)
  );
-- orders table
CREATE TABLE orders
  (
    order_id NUMBER 
             GENERATED BY DEFAULT AS IDENTITY START WITH 106,
    customer_id NUMBER( 6, 0 ) NOT NULL, -- fk
    status      VARCHAR( 50 ) NOT NULL ,
    salesman_id NUMBER( 6, 0 )         , -- fk
    order_date  DATE NOT NULL          ,
    CONSTRAINT fk_orders_customers 
      FOREIGN KEY( customer_id )
      REFERENCES customers( customer_id )
      ON DELETE CASCADE,
    CONSTRAINT fk_orders_employees 
      FOREIGN KEY( salesman_id )
      REFERENCES employees( employee_id ) 
      ON DELETE SET NULL,
    CONSTRAINT PK_ORDERS_ORDER_ID PRIMARY KEY(order_id)
  );
-- order items
CREATE TABLE order_items
  (
    order_id   NUMBER( 12, 0 )                                , -- fk
    item_id    NUMBER( 12, 0 )                                ,
    product_id NUMBER( 12, 0 ) NOT NULL                       , -- fk
    quantity   NUMBER( 8, 2 ) NOT NULL                        ,
    unit_price NUMBER( 8, 2 ) NOT NULL                        ,
    CONSTRAINT PK_ORDER_ITEMS_ORDER_ID_ITEM_ID
      PRIMARY KEY( order_id, item_id ),
    CONSTRAINT fk_order_items_products 
      FOREIGN KEY( product_id )
      REFERENCES products( product_id ) 
      ON DELETE CASCADE,
    CONSTRAINT fk_order_items_orders 
      FOREIGN KEY( order_id )
      REFERENCES orders( order_id ) 
      ON DELETE CASCADE
  );
-- inventories
CREATE TABLE inventories
  (
    invnetory_id NUMBER 
               GENERATED BY DEFAULT AS IDENTITY START WITH 289,
    product_id   NUMBER( 12, 0 )        , -- fk
    warehouse_id NUMBER( 12, 0 )        , -- fk
    quantity     NUMBER( 8, 0 ) NOT NULL,
    CONSTRAINT PK_INVENTORIES_PRODUCT_ID_WAREHOUSE_ID
      PRIMARY KEY(invnetory_id, product_id, warehouse_id ),
    CONSTRAINT fk_inventories_products 
      FOREIGN KEY( product_id )
      REFERENCES products( product_id ) 
      ON DELETE CASCADE,
    CONSTRAINT fk_inventories_warehouses 
      FOREIGN KEY( warehouse_id )
      REFERENCES warehouses( warehouse_id ) 
      ON DELETE CASCADE,
    CONSTRAINT PK_INVENTORIES_INVETORY_ID PRIMARY KEY(invnetory_id)
  );
SELECT
    DISTINCT(pro.product_id),
    pro.product_name,
    FIRST_VALUE(inv.quantity) OVER (PARTITION BY inv.product_id ORDER BY inv.quantity DESC) AS "Quantity",
    FIRST_VALUE(war.warehouse_name) OVER (PARTITION BY inv.product_id ORDER BY inv.quantity DESC) AS "Warehouse"
FROM PRODUCTS PRO
INNER JOIN INVENTORIES INV ON inv.product_id = pro.product_id
INNER JOIN WAREHOUSES WAR ON war.warehouse_id = inv.warehouse_id;
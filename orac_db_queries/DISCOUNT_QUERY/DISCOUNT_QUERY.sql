SELECT CUS.name, ORD.status, ORD.order_date, PRO.product_name, PRO.standard_cost, ORI.unit_price FROM customers CUS
INNER JOIN orders ORD ON ORD.customer_id = CUS.customer_id
INNER JOIN order_items ORI ON ORI.order_id = ORD.order_id
INNER JOIN products PRO ON PRO.product_id = ORI.product_id
WHERE (1-(ORI.unit_price / PRO.standard_cost)) > 0.1;
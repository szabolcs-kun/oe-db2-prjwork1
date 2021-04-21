select ord.order_id, ord.status, ord.order_date, ord.salesman_id, cus.customer_id, cus.name, cus.credit_limit, cus.website, cus.address, cont.first_name, cont.last_name, cont.email, cont.phone from orders ord
inner join customers cus on cus.customer_id = ord.customer_id
inner join contacts cont on cont.customer_id = cus.customer_id;
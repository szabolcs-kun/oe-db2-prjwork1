select inv.inventory_id, inv.product_id, inv.quantity, war.warehouse_name, loc.address, loc.postal_code, loc.city, loc.state, coun.country_name, reg.region_name from inventories inv
inner join warehouses war on inv.warehouse_id = war.warehouse_id
inner join locations loc on war.location_id = loc.location_id
inner join countries coun on loc.country_id = coun.country_id
inner join regions reg on coun.region_id = reg.region_id;
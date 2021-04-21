cd "C:\Program Files\MongoDB\Server\4.4\bin"

./mongoimport --db contoso --port 5204 --collection employees --type csv --headerline --file ~Desktop/merged_dataset/employees.csv

./mongoimport --db contoso --port 5204 --collection inventories --type csv --headerline --file ~Desktop/merged_dataset/inventories.csv

./mongoimport --db contoso --port 5204 --collection order_items --type csv --headerline --file ~Desktop/merged_dataset/order_items.csv

./mongoimport --db contoso --port 5204 --collection orders --type csv --headerline --file ~Desktop/merged_dataset/orders.csv

./mongoimport --db contoso --port 5204 --collection products --type csv --headerline --file ~Desktop/merged_dataset/products.csv
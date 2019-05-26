USE bamazon;

SELECT 
	products.product_name, 
	products.product_price, 
	product_price*5 AS "total"
FROM products;

SELECT 
	department_id,
    department_name,
    department_overHeadCosts,
    SUM(product_price * quantity) AS "tot_prod_purchase"
FROM departments
LEFT JOIN

SELECT 
    
FROM purchases
LEFT JOIN products
ON purchases.product_id=products.product_id
GROUP BY product_name;

SELECT 
    SUM(product_price * quantity) AS "tot_prod_purchase"
FROM purchases
LEFT JOIN products
ON purchases.product_id=products.product_id
GROUP BY product_name;

ON department = department_id;

SELECT 
	product_id,
    SUM(quantity)
FROM purchases
GROUP BY product_id;
    
    
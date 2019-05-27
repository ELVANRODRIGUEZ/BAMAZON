USE bamazon;

SELECT 
	products.product_name, 
	products.product_price, 
	product_price*5 AS "total"
FROM products;

SELECT 
	departments.department_id,
    departments.department_name,
    departments.department_overHeadCosts,
    SUM(products.product_price * purchases.quantity) AS "department_total_sales",
    ((products.product_price * purchases.quantity) - departments.department_overHeadCosts) AS "department_total_profits"
FROM departments
LEFT JOIN products
ON departments.department_id = products.department_id
LEFT JOIN purchases
ON purchases.product_id = products.product_id
GROUP BY departments.department_id;

SELECT 
	departments.department_id,
    departments.department_name,
    departments.department_overHeadCosts,
    SUM(products.product_price * purchases.quantity) AS "tot_prod_purchase"
FROM departments
JOIN products
ON departments.department_id = products.department_id
JOIN purchases
ON purchases.product_id = products.product_id;


SELECT 
	product_id,
    SUM(quantity)
FROM purchases
GROUP BY product_id;
    
    
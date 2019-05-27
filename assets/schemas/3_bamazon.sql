USE bamazon;

DROP TABLE IF EXISTS purchases;

CREATE TABLE purchases (
    purchase_id INT NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    quantity DECIMAL(10,4),
    purchase_time DATETIME,
    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,
    PRIMARY KEY (purchase_id)
);

SELECT * FROM purchases;

SELECT 
	products.product_name,
    departments.department_name,
    SUM(purchases.quantity) AS "total_product_sold",
    products.product_price * SUM(purchases.quantity) AS "total_product_gross_income"
FROM products
LEFT JOIN departments
ON products.department_id = departments.department_id
RIGHT JOIN purchases
ON purchases.product_id = products.product_id
GROUP BY products.product_name;
    
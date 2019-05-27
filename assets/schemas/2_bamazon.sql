USE bamazon;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
    product_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(128) NOT NULL,
    department_id INT NOT NULL,
    product_price DECIMAL(20,4) NULL,
    stock_quantity INT NULL,
    FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE CASCADE,
    PRIMARY KEY (product_id)
);

UPDATE products 
SET stock_quantity = 20
WHERE product_id = 2;

INSERT INTO products 
SET
	product_name = "test",
	department_id = 6,
	product_price = 100,
	stock_quantity = 50;

SELECT * FROM products;

SELECT 
	products.product_id,
    products.product_name,
    departments.department_name,
    products.product_price,
    products.stock_quantity	
FROM products
JOIN departments
ON products.department_id = departments.department_id
WHERE products.stock_quantity < 5
ORDER BY products.product_name;





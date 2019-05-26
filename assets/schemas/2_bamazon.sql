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


SELECT * FROM products;






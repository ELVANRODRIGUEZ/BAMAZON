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
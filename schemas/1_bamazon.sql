-- DROP DATABASE IF EXISTS bamazon;

-- CREATE DATABASE bamazon;

USE bamazon;

DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(64) NOT NULL,
    department_overHeadCosts DECIMAL(28,4),
    PRIMARY KEY (department_id)
);

SELECT * FROM departments;




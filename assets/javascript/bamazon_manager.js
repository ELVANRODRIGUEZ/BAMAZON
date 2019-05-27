var fs = require("fs");
var mysql = require("mysql");
var inquirer = require("inquirer");
var path = require("path");
var Table = require("easy-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "#Elvanovich11119121",
    database: "bamazon"
});

start();

function start() {

    inquirer.prompt([{
        type: "input",
        message: "Please enter your name:",
        name: "name"
    }]).then(function (res) {

        inquirer.prompt([{
            type: "list",
            message: "Hi " + res.name + ". Please select what you want to do:",
            choices: ["View products for sale", "View Low inventory", "Add to Inventory", "Add New Product", "Reset store"],
            name: "actions"
        }]).then(function (res) {

            switch (res.actions) {

                case "View products for sale":

                    viewProducts();

                    break;

                case "View Low inventory":

                    inventoryPrompt();

                    function inventoryPrompt() {
                        inquirer.prompt([{
                            type: "input",
                            message: "Please enter the quantity threshold you want to check inventory below:",
                            name: "inventory"
                        }]).then(function (res) {

                            var input = parseInt(Math.floor(res.inventory));

                            if (!input || typeof (input) != "number") {

                                console.log("Incorrect input data!");

                                return inventoryPrompt();

                            }

                            veiwLowInventory(input);

                        })
                    }

                    break;

                case "Add to Inventory":

                    var productArr = [];

                    selectProduct();

                    function selectProduct() {

                        connection.query(
                            "SELECT product_id, product_name " +
                            "FROM products " +
                            "ORDER BY product_name",
                            function (err, res) {

                                if (err) throw err;
                                res.forEach(function (item) {

                                    productArr.push(item.product_name + " id:" + item.product_id);

                                })

                                inquirer.prompt([{
                                        type: "list",
                                        message: "Please select the product you want to add stock for:",
                                        choices: productArr,
                                        name: "product"
                                    },
                                    {
                                        type: "number",
                                        message: "Please input the stock amount you want to add:",
                                        name: "stock",
                                    }
                                ]).then(function (res) {

                                    var stock = parseInt(res.stock);

                                    if (!stock) {

                                        return selectProduct();

                                    } else {

                                        var product = res.product;
                                        var productName = res.product;

                                        product = parseInt(product.slice((product.indexOf(":") + 1), (product.length + 1)));

                                        productName = productName.slice(0, (productName.indexOf(":") - 3));

                                        addInventory(productName, product, stock);

                                    }

                                })

                            });

                    }

                    break;

                case "Add New Product":

                    var departmentArr = [];
                    var department;
                    var price;
                    var stock;

                    inputProduct();

                    function inputProduct() {

                        connection.query(
                            "SELECT department_id, department_name " +
                            "FROM departments " +
                            "ORDER BY department_name",
                            function (err, res) {

                                if (err) throw err;
                                res.forEach(function (item) {

                                    departmentArr.push(item.department_name + " id:" + item.department_id);

                                });

                                inquirer.prompt([{
                                    type: "input",
                                    message: "Please type the product name you want to add:",
                                    name: "product"
                                }, {
                                    type: "number",
                                    message: "Please type the product price you want to add:",
                                    name: "price"
                                }, {
                                    type: "number",
                                    message: "Please type the product stock you want to add:",
                                    name: "stock"
                                }, {
                                    type: "list",
                                    message: "Please select de department the new product will belong to:",
                                    choices: departmentArr,
                                    name: "department"
                                }]).then(function (res) {

                                    product = res.product;
                                    price = parseFloat(res.price);
                                    stock = parseInt(res.stock);
                                    department = res.department;

                                    if (!price || !stock) {

                                        return inputProduct();

                                    } else {


                                        var message = "\nAre you sure you want to add -" + res.product + "- product, \n";
                                        message += "with a price of -$" + price + "-, \n";
                                        message += "a stock of -" + stock + "-, \n";
                                        message += "and add it to the -" + department + "- department?";

                                        inquirer.prompt([{
                                            type: "confirm",
                                            message: message,
                                            name: "assure"
                                        }]).then(function (res) {


                                            if (res.assure) {

                                                department = parseInt(department.slice((department.indexOf(":") + 1), (department.length + 1)));

                                                addNewProduct(product, department, price, stock);

                                            } else {

                                                return inputProduct();

                                            }

                                        })

                                    }

                                });

                            });

                    }

                    break;

                case "Reset store":

                    inquirer.prompt([{
                        message: "Departments and available products will be reset from the .csv Bamazon database.\n" +
                            "Are you sure you want to proceed?",
                        type: "list",
                        choices: ["Yes", "No"],
                        name: "reset"
                    }]).then(function (res) {

                        if (res.reset == "Yes") {

                            deleteAll();

                        } else {

                            return start();

                        }

                    });

                    break;

            }

        })

    })

}

function deleteAll() {

    connection.query("DROP TABLE IF EXISTS purchases", function () {

        console.log(
            "\n========================================================================\n" +
            "All data in --purchases-- table has been successfully deleted." +
            "\n========================================================================\n");

        connection.query("DROP TABLE IF EXISTS products", function () {

            console.log(
                "\n========================================================================\n" +
                "--products-- table has been successfully deleted." +
                "\n========================================================================\n");

            connection.query("DROP TABLE IF EXISTS departments", function () {

                console.log(
                    "\n========================================================================\n" +
                    "--departments-- table has been successfully deleted." +
                    "\n========================================================================\n");

                resetAll();

            })

        })

    })

}

function resetAll() {

    createTables();

    function createTables() {

        connection.query(
            "CREATE TABLE departments (" +
            "department_id INT NOT NULL AUTO_INCREMENT," +
            "department_name VARCHAR(64) NOT NULL," +
            "department_overHeadCosts DECIMAL(28,4)," +
            "PRIMARY KEY (department_id)" +
            ")",
            function () {

                console.log(
                    "\n========================================================================\n" +
                    "--purchases-- table has been successfully recreated." +
                    "\n========================================================================\n");

                connection.query(
                    "CREATE TABLE products (" +
                    "product_id INT NOT NULL AUTO_INCREMENT," +
                    "product_name VARCHAR(128) NOT NULL," +
                    "department_id INT NOT NULL," +
                    "product_price DECIMAL(20,4) NULL," +
                    "stock_quantity INT NULL," +
                    "FOREIGN KEY (department_id)" +
                    "REFERENCES departments(department_id)" +
                    "ON DELETE CASCADE," +
                    "PRIMARY KEY (product_id)" +
                    ")",
                    function () {

                        console.log(
                            "\n========================================================================\n" +
                            "--products-- table has been successfully recreated." +
                            "\n========================================================================\n");

                        connection.query(
                            "CREATE TABLE purchases (" +
                            "purchase_id INT NOT NULL AUTO_INCREMENT," +
                            "product_id INT NOT NULL," +
                            "quantity DECIMAL(10, 4)," +
                            "purchase_time DATETIME," +
                            "FOREIGN KEY(product_id) REFERENCES products(product_id) ON DELETE CASCADE," +
                            "PRIMARY KEY(purchase_id)" +
                            ")",
                            function () {

                                console.log(
                                    "\n========================================================================\n" +
                                    "--purchases-- table has been successfully recreated." +
                                    "\n========================================================================\n");

                                fillTables();

                            })

                    })

            })

    }

    function fillTables() {


        fs.readFile("../raw_data/departments.csv", "UTF-8", function (err, data) {

            var dataArr = data.split(/\r?\n/);
            var itemArr;
            var query;

            dataArr.forEach(function (value) {

                itemArr = value.split(",");

                query = "INSERT INTO departments ";
                query += "SET ?";

                connection.query(query, {
                        department_name: itemArr[0],
                        department_overHeadCosts: itemArr[1]
                    },
                    function (err) {
                        if (err) throw err;

                    })

            });

            console.log(
                "\n========================================================================\n" +
                dataArr.length + " records successfully  added to --departments-- table." +
                "\n========================================================================\n"
            );

            fs.readFile("../raw_data/products.csv", "UTF-8", function (err, data) {

                var dataArr = data.split(/\r?\n/);
                var itemArr = [];
                var query;

                dataArr.forEach(function (value) {

                    itemArr = value.split(",");

                    query = "INSERT INTO products ";
                    query += "(product_name,";
                    query += "department_id,";
                    query += "product_price,";
                    query += "stock_quantity) ";
                    query += "VALUES (?,?,?,?)";

                    connection.query(query, [
                            itemArr[0],
                            parseInt(itemArr[1]),
                            parseFloat(itemArr[2]),
                            parseInt(itemArr[3])
                        ],
                        function (err) {

                            if (err) throw err;

                        })

                });

                console.log(
                    "\n========================================================================\n" +
                    dataArr.length + " records successfully  added to --products-- table." +
                    "\n========================================================================\n"
                );

                connection.end();

            });

        });

    }

}

function viewProducts() {

    connection.query(
        "SELECT products.product_id," +
        "products.product_name," +
        "departments.department_name," +
        "products.product_price," +
        "products.stock_quantity " +
        "FROM products " +
        "JOIN departments " +
        "ON products.department_id = departments.department_id " +
        "ORDER BY products.product_name",
        function (err, res) {

            if (err) throw err;

            var tbl = new Table;

            res.forEach(function (item) {

                tbl.cell("Product ID: ", item.product_id);
                tbl.cell("Product Name: ", item.product_name);
                tbl.cell("Department Name: ", item.department_name);
                tbl.cell("Product Price: ", item.product_price, Table.number(2));
                tbl.cell("Product Stock: ", item.stock_quantity, Table.number(2));
                tbl.newRow();
            });

            console.log(
                "\n========================================================================\n" +
                "This is the list of the current selling products in store: \n\n" +
                tbl.toString() +
                "\n========================================================================\n");

            connection.end();

        })

}

function veiwLowInventory(qty) {
    connection.query(
        "SELECT products.product_id," +
        "products.product_name," +
        "departments.department_name," +
        "products.product_price," +
        "products.stock_quantity " +
        "FROM products " +
        "JOIN departments " +
        "ON products.department_id = departments.department_id " +
        "WHERE products.stock_quantity < ? " +
        "ORDER BY products.product_name",
        [qty],
        function (err, res) {

            if (err) throw err;

            if (res.length == 0) {

                console.log(
                    "\n========================================================================\n" +
                    "There are not any products which stock is lower than the indicated value. \n" +
                    "\n========================================================================\n");

                connection.end();

            } else {

                var tbl = new Table;

                res.forEach(function (item) {

                    tbl.cell("Product ID: ", item.product_id);
                    tbl.cell("Product Name: ", item.product_name);
                    tbl.cell("Department Name: ", item.department_name);
                    tbl.cell("Product Price: ", item.product_price, Table.number(2));
                    tbl.cell("Product Stock: ", item.stock_quantity, Table.number(2));
                    tbl.newRow();
                });

                console.log(
                    "\n========================================================================\n" +
                    "This is the list of the products with a stock lower than the \n" +
                    "indicated value: \n\n" +
                    tbl.toString() +
                    "\n========================================================================\n");

                connection.end();

            }

        })

}

function addInventory(name, id, qty) {

    connection.query(
        "UPDATE products " +
        "SET ? + stock_quantity " +
        "WHERE ?",
        [{
                stock_quantity: qty
            },
            {
                product_id: id
            }
        ],
        function (err, res) {

            if (err) throw err;

            console.log(
                "\n========================================================================\n" +
                qty + " units successfully added to -" + name + "- stock. \n" +
                "\n========================================================================\n");

            connection.end();
        }

    )

}

function addNewProduct(name, dep, price, stock) {

    connection.query(
        "INSERT INTO products " +
        "SET ?", {
            product_name: name,
            department_id: dep,
            product_price: price,
            stock_quantity: stock
        },
        function (err, res) {

            if (err) throw err;

            console.log(
                "\n========================================================================\n" +
                "-" + name + "- product successfully added to -products- table. \n" +
                "\n========================================================================\n");

            connection.end();

        })

}
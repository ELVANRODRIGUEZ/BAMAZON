var fs = require("fs");
var mysql = require("mysql");
var inquirer = require("inquirer");
var path = require("path");

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

                    veiwLowInventory();

                    break;

                case "Add to Inventory":

                    addInventory();

                    break;

                case "Add New Product":

                    addNewProduct();

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
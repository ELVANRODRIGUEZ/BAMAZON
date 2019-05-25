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

inquirer.prompt([{
    message: "Do you want to load .csv content to bamazon database?",
    type: "list",
    choices: ["Yes", "No"],
    name: "loadCSV"
}]).then(function (res) {

    if (res.loadCSV == "Yes") {
        selTableToLoad();
    }

});

function selTableToLoad() {

    inquirer.prompt([{
        message: "Select the table you want to load data to",
        type: "list",
        choices: ["departments", "products"],
        name: "selectedTable"
    }]).then(function (res) {

        var selTable = res.selectedTable;

        switch (selTable) {

            case "departments":


                addDepartments();

                break;

            case "products":

                addProducts();

                break;

        }
    });
}

function addDepartments() {

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
            "\n==================================================\n" +
            dataArr.length + " records successfully  added to 'departments' table." +
            "\n==================================================\n"
        );

        connection.end();

    });

}

function addProducts() {

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
            "\n==================================================\n" +
            dataArr.length + " records successfully  added to 'products' table." +
            "\n==================================================\n"
        );

        connection.end();

    });

}
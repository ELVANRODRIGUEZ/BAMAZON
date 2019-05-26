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
        message: "Please enter your name.",
        name: "supName"
    }, ]).then(function (res) {

        inquirer.prompt([{
            type: "list",
            message: "Hi " + res.supName + ". Please select what you want to do:",
            choices: ["View Product Sales by Department", "Create New Department"],
            name: "supChoice"
        }]).then(function (res) {

            if (res.supChoice == "Create New Department") {

                connection.query(
                    "SELECT department_id, department_name FROM departments ORDER BY department_name",
                    function (err, data) {

                        if (err) throw err;

                        var tbl = new Table;

                        data.forEach(function (item) {

                            tbl.cell("Department Id:", item.department_id);
                            tbl.cell("Department Name:", item.department_name);
                            tbl.newRow();

                        });

                        console.log(
                            "\n========================================================================\n" +
                            "OK. These are the current departments. \n\n" +
                            tbl.toString() +
                            "\n========================================================================\n");

                        addNewDepartment();

                    });

            } else {



            }

        });

    });

}

function addNewDepartment() {

    var departmentName;
    var departmentCost;

    inquirer.prompt([{
            type: "input",
            message: "Please enter the name of the new department",
            name: "depName"
        },
        {
            type: "input",
            message: "Please enter the overhead cost of the new department",
            name: "depCost"
        }
    ]).then(function (res) {

        if (!res.depName || !res.depCost) return addNewDepartment();

        departmentName = res.depName;
        departmentCost = res.depCost;

        inquirer.prompt([{
            type: "list",
            message: "Are you sure you want to want to add =" + res.depName + "= as new department?",
            choices: ["Yes", "No"],
            name: "makeSure"
        }]).then(function (res) {

            if (res.makeSure == "Yes") {

                var query;

                query = "INSERT INTO departments ";
                query += "SET ?";

                connection.query(
                    "INSERT INTO departments SET ?", {
                        department_name: departmentName,
                        department_overHeadCosts: departmentCost
                    },
                    function (err, data) {

                        if (err) throw err;

                        console.log(
                            "\n========================================================================\n" +
                            "A new =" + departmentName + "= department has been successfully added. \n" +
                            "\n========================================================================\n");

                        connection.end();
                    })

            } else {

                return start();

            }

        })

    })

}

function buyProduct(product, qty) {

    product = parseInt(product);
    qty = parseInt(qty);

    var query;

    query = "UPDATE products ";
    query += "SET ";
    query += "  stock_quantity = ";
    query += "IF (stock_quantity > ?, "
    query += "(stock_quantity - ?), stock_quantity)";
    query += "WHERE ?";

    connection.query(query, [qty, qty, {
        product_id: product
    }], function (err, data) {

        if (err) throw err;
        // console.log(data);

        if (data.changedRows == 0) {

            console.log(
                "\n========================================================================\n" +
                "DEAR COSTUMER: We are sorry we don't have enough stock for the indicated \n" +
                "product. Would yo be interested in another product or trying a different \n" +
                "quantity of the same one?" +
                "\n========================================================================\n");

            return start();

            // connection.end();

        } else {

            retrieveInvoice(product, qty);

        }

    })

}

function retrieveInvoice(product, qty) {

    var query;

    query = "SELECT ";
    query += "product_name,";
    query += "product_price,";
    query += "product_price * ? as 'purchase_total' ";
    query += "FROM products ";
    query += "WHERE ?";

    connection.query(query, [qty, {
        product_id: product
    }], function (err, data) {

        if (err) throw err;


        var tbl = new Table;

        // console.log(data); 

        data.forEach(function (item) {
            tbl.cell("Product:", item.product_name);
            tbl.cell("Unit Price:", item.product_price);
            tbl.cell("Purchase Total:", item.purchase_total);
            tbl.newRow();
            // console.log(item.product_name);
            // console.log(item.product_price);
            // console.log(item.purchase_total);
        })

        console.log(
            "\n========================================================================\n" +
            "DEAR COSTUMER: Your product(s) will be sent to you over the next 3 \n" +
            "bussines days. We hope to see you back again shortly. It will always \n" +
            "be our pleasure to have you! \n\n" +
            "INVOICE: " +
            "\n------------------------------------------------------------------------\n\n" +
            tbl.toString() +
            "\n========================================================================\n");

        // connection.end();

        storePurchase(product, qty);

    });


}

function storePurchase(product, qty) {

    var query;
    var time = new Date();

    console.log(time);

    query = "INSERT INTO purchases ";
    query += "SET ?";

    connection.query(query, {
        product_id: product,
        quantity: qty,
        purchase_time: time
    }, function (err, data) {

        if (err) throw err;

        connection.end();

    })

}
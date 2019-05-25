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

var productsArr = [];
// var selectedProd;

start();



function start() {

    connection.query(
        "SELECT product_id, " +
        "product_name " +
        "FROM products " +
        "ORDER BY product_name",
        function (err, data) {

            if (err) throw err;

            data.forEach(function (value, item) {

                productsArr.push(value.product_name + " id:" + value.product_id);

            });


            inquirer.prompt([{
                type: "list",
                message: "Please choose the product you want to purchase:",
                choices: productsArr,
                name: "productToBuy"
            }, {
                type: "input",
                message: "Please type the quantity you want to purchase:",
                name: "productQuantity"
            }]).then(function (res) {

                var selectedProd = res.productToBuy;
                selectedProd = parseInt(selectedProd.slice((selectedProd.indexOf(":") + 1), (selectedProd.length + 1)));

                var selectedQuantity = parseInt(res.productQuantity);

                if (!selectedQuantity || typeof(selectedQuantity) != "number") {
                    console.log(
                        "\n========================================================================\n" +
                        "ERROR: You did not indicate the product quantity. Please try again." +
                        "\n========================================================================\n")
                    return start();
                }

                console.log(
                    "\n========================================================================\n" +
                    "You want to by " + selectedQuantity + " of product with id:" + selectedProd + "\n========================================================================\n");

                connection.end();

            });

        });

}
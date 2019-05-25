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

                if (!selectedQuantity || typeof (selectedQuantity) != "number") {
                    console.log(
                        "\n========================================================================\n" +
                        "ERROR: You did not indicate the product quantity. Please try again." +
                        "\n========================================================================\n")
                    return start();
                }

                console.log(
                    "\n========================================================================\n" +
                    "You want to by " + selectedQuantity + " of product with id:" + selectedProd + "\n========================================================================\n");

                buyProduct(selectedProd, selectedQuantity);

            });

        });

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

        connection.end();

    });


}
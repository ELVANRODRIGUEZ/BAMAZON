var mysql = require("mysql");
var inquirer = require("inquirer");
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
            choices: ["View Product Sales by Department", "Create New Department", "View Product Sales"],
            name: "supChoice"
        }]).then(function (res) {

            switch (res.supChoice) {

                case "View Product Sales by Department":

                    var query;

                    query = "SELECT ";
                    query += "departments.department_id, ";
                    query += "departments.department_name, ";
                    query += "departments.department_overHeadCosts, ";
                    query += "SUM(products.product_price * purchases.quantity) AS 'department_total_sales', ";
                    query += "((products.product_price * purchases.quantity) - departments.department_overHeadCosts) ";
                    query += "AS 'department_total_profits' ";
                    query += "FROM departments ";
                    query += "LEFT JOIN products ";
                    query += "ON departments.department_id = products.department_id ";
                    query += "LEFT JOIN purchases ";
                    query += "ON purchases.product_id = products.product_id ";
                    query += "GROUP BY departments.department_id";

                    connection.query(query, function (err, data) {

                        if (err) throw err;

                        var tbl = new Table;

                        data.forEach(function (item) {

                            var profit = item.department_total_profits;
                            var sales = item.department_total_sales;

                            if (!item.department_total_sales) {
                                sales = 0;
                            }

                            if (!item.department_total_profits) {
                                profit = item.department_overHeadCosts * (-1);
                            }

                            tbl.cell("Department Id:", item.department_id);
                            tbl.cell("Department Name:", item.department_name);
                            tbl.cell("Department Overhead Cost:", item.department_overHeadCosts, Table.number(2));
                            tbl.cell("Department Total Sales:", sales, Table.number(2));
                            tbl.cell("Department Total Profits:", profit, Table.number(2));
                            tbl.newRow();

                            // ==========================================================
                            // This will totalize the 3 columns according with the manual specifications from "easy-table" NPM package.
                            tbl.total("Department Overhead Cost:", {
                                printer: Table.aggr.printer('COST TOT: ', currency),
                                reduce: Table.aggr.total,
                                init: 0
                            });
                            tbl.total("Department Total Sales:", {
                                printer: Table.aggr.printer('SALES TOT: ', currency),
                                reduce: Table.aggr.total,
                                init: 0
                            });
                            tbl.total("Department Total Profits:", {
                                printer: Table.aggr.printer('PROFITS TOT: ', currency),
                                reduce: Table.aggr.total,
                                init: 0
                            });
                            // ==========================================================

                        });

                        // ==========================================================
                        // "easy-table" NPM packages definition for "currency" totaling conversion function.
                        function currency(val, width) {
                            var str = val.toFixed(2)
                            return width ? Table.padLeft(str, width) : str
                        }
                        // ==========================================================

                        console.log(
                            "\n========================================================================\n" +
                            "This is the current profit status for the different departments: \n\n" +
                            tbl.toString() +
                            "\n========================================================================\n");

                        connection.end();

                    });

                    break;

                case "Create New Department":

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
                                "OK. These are the current departments: \n\n" +
                                tbl.toString() +
                                "\n========================================================================\n");

                            addNewDepartment();

                        });

                    break;

                case "View Product Sales":

                    var query;

                    query = "SELECT ";
                    query += "products.product_name,";
                    query += "departments.department_name,";
                    query += "SUM(purchases.quantity) AS 'total_product_sold',"
                    query += "products.product_price * SUM(purchases.quantity) AS 'total_product_gross_revenue' ";
                    query += "FROM products ";
                    query += "LEFT JOIN departments ";
                    query += "ON products.department_id = departments.department_id ";
                    query += "RIGHT JOIN purchases ";
                    query += "ON purchases.product_id = products.product_id ";
                    query += "GROUP BY products.product_name";

                    connection.query(query, function (err, data) {

                        if (err) throw err;

                        var tbl = new Table;

                        data.forEach(function (item) {

                            var prodSold = item.total_product_sold;
                            var prodRev = item.total_product_gross_revenue;

                            if (!item.total_product_gross_revenue) {
                                prodRev = 0;
                            }

                            if (!item.total_product_sold) {
                                prodSold = 0;
                            }

                            tbl.cell("Product Name:", item.product_name);
                            tbl.cell("Department Name:", item.department_name);
                            tbl.cell("Product Total Sold:", prodSold, Table.number(2));
                            tbl.cell("Product Total Gross Revenue:", prodRev, Table.number(2));
                            tbl.newRow();

                            // ==========================================================
                            // This will totalize the 2 columns according with the manual specifications from "easy-table" NPM package.
                            tbl.total("Product Total Sold:", {
                                printer: Table.aggr.printer('PTS TOT: ', currency),
                                reduce: Table.aggr.total,
                                init: 0
                            });
                            tbl.total("Product Total Gross Revenue:", {
                                printer: Table.aggr.printer('PTGR TOT: ', currency),
                                reduce: Table.aggr.total,
                                init: 0
                            });
                            // ==========================================================

                        });

                        // ==========================================================
                        // "easy-table" NPM packages definition for "currency" totaling conversion function.
                        function currency(val, width) {
                            var str = val.toFixed(2)
                            return width ? Table.padLeft(str, width) : str
                        }
                        // ==========================================================

                        console.log(
                            "\n========================================================================\n" +
                            "These are the total sales broken down by individual products: \n\n" +
                            tbl.toString() +
                            "\n========================================================================\n");

                        connection.end();

                    });

                    break;

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
            message: "Are you sure you want to want to add -" + res.depName + "- as new department?",
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
                            "A new -" + departmentName + "- department has been successfully added. \n" +
                            "\n========================================================================\n");

                        connection.end();
                    })

            } else {

                return start();

            }

        })

    })

}
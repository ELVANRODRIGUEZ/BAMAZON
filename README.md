# BAMAZON

## Description
"Bamazon" is node app that simulates a tiny department sotore database operation. It consists in 3 interfaces to interact with, each one of which is programmed in an individual Javascript file than keeps a connection with a Mysql database using "mysql" npm package. Those files/interfaces are:

* Bamazon_manager
* Bamazon_supervisor
* Bamazon_customer

## Bamazon_manager
After requiring name, it allows the following tasks:

1. View products the store has for sale in all of its departments.
2. View the same products but with a "low inventory" filter that is asked for input.
3. Add more stock for the any of the products in the store.
4. Add new products for which the manager will have to specify name, price, correspondant department and initial stock.
5. Reset store to its original state kept in the included .csv files. All purchases will be deleted and a set of initial departments and products will be added. All tables will be droped and recreated.

## Bamazon_supervisor
After requiring name, it allows the following tasks:

1. View sales by department and comparing them with its internal costs to indicated the profits according to the purchases.
2. Create new departmens for which the supervisor will have to indicate the name and overhead costs.
3. View sales by product.

## Bamazon_customer
It will showcase all the availabe products. The customer will be able to select any of them and select the quantity to buy after that. If there is enough stock to make the purchase, it will carry on; if there isn't, a message will make the customer know for him/her to either select other product or the same one but input a differente quantity. The customer is limited to make one purchase at a time.

###Notes:
All input is validated so it doesn't carry on if is either missing or incorrect data type is input. All tables are shown as tables in the CL using "easy-table" npm package. The sales tables are totalized.
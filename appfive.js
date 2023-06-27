const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const { open } = require("sqlite");

const path = require("path");
const app = express();
app.use(express.json());

const dataBasePath = path.join(__dirname, "assignmenttwo.db");

let dataBase = null;

// SQLite database configuration
const db = new sqlite3.Database("assignmenttwo.db");

// Create the customers table if it doesn't exist
const createTableQuery = `CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
)`;

db.run(createTableQuery, (error) => {
  if (error) {
    console.error("Error creating table:", error);
    db.close();
  } else {
    console.log("Table created successfully!");
    insertData();
  }
});

// Function to insert data into the customers table
function insertData() {
  const customersEmail = [
    {
      email: "ram11@yopmail.com",
      name: "ram",
    },
  ];

  customersEmail.forEach((customer) => {
    const { email, name } = customer;
    const selectQuery = "SELECT * FROM customers WHERE email = ?";
    db.get(selectQuery, email, (error, row) => {
      if (error) {
        console.error("Error selecting data:", error);
      } else {
        if (row) {
          // Email already exists, update the name
          const updateQuery = "UPDATE customers SET name = ? WHERE email = ?";
          db.run(updateQuery, [name, email], (error) => {
            if (error) {
              console.error("Error updating data:", error);
            } else {
              console.log("Name updated successfully!");
            }
          });
        } else {
          // Email doesn't exist, insert new record
          const insertQuery =
            "INSERT INTO customers (name, email) VALUES (?, ?)";
          db.run(insertQuery, [name, email], (error) => {
            if (error) {
              console.error("Error inserting data:", error);
            } else {
              console.log("Data inserted successfully!");
            }
          });
        }
      }
    });
  });

  console.log("Data inserted successfully!");
  db.close();
}

const initializeDBAndServer = async () => {
  try {
    dataBase = await open({
      filename: dataBasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server started running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/", async (request, response) => {
  const sqlQuery = `SELECT * FROM customers;`;
  const result = await dataBase.all(sqlQuery);
  response.send(result);
});

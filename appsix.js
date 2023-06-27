const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const port = 3000;
const dataBasePath = path.join(__dirname, "assignmentthree.db");

// Middleware
app.use(express.json());

let dataBase = null;

const initializeDBAndServer = async () => {
  try {
    dataBase = await open({
      filename: dataBasePath,
      driver: sqlite3.Database,
    });

    // Create a Customers table if it doesn't exist
    await dataBase.run(`CREATE TABLE IF NOT EXISTS Customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone_number TEXT NOT NULL UNIQUE
    )`);

    console.log("Database connection established successfully!");

    app.listen(port, () => {
      console.log(`Server started running at http://localhost:${port}/`);
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/", async (req, res) => {
  const sqlQuery = `SELECT * FROM customers;`;
  const result = await dataBase.all(sqlQuery);
  res.send(result);
});

// Add a customer
app.post("/customers", async (req, res) => {
  const { phoneNumber } = req.body;

  // Validate input params
  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    const dataBase = await open({
      filename: dataBasePath,
      driver: sqlite3.Database,
    });

    // Insert the customer into the database
    await dataBase.run("INSERT INTO Customers (phone_number) VALUES (?)", [
      phoneNumber,
    ]);

    return res.status(201).json({ message: "Customer added successfully" });
  } catch (error) {
    // Check for duplicate entry error
    if (error.errno === 19) {
      return res.status(409).json({ error: "Phone number already exists" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

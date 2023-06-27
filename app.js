const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());

const dataBasePath = path.join(__dirname, "assignment.db");

let dataBase = null;

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
  const sqlQuery = `
    SELECT c.customerId, c.name, GROUP_CONCAT(s.subjectName, ', ') AS subjects
    FROM customers c
    JOIN subject_student_mapping m ON c.customerId = m.customerId
    JOIN subjects s ON m.subjectId = s.subjectId
    GROUP BY c.customerId, c.name
    ORDER BY c.customerId ASC;`;

  const sqlQueryResult = await dataBase.all(sqlQuery);
  response.send(sqlQueryResult);
});

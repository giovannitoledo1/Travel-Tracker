import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

// Dynamically switch between localhost and server IP
// You must set the environment variable in the console.
// Example: set NODE_ENV=production

const dbHost =
  process.env.NODE_ENV === "development"
    ? process.env.DB_HOST_SERVER
    : process.env.DB_HOST_LOCAL;

console.log("dbHost", dbHost);

const db = new pg.Client({
  user: process.env.DB_USER,
  host: dbHost,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  connectionTimeoutMillis: 10000,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getVisitedCountries() {
  try {
    const res = await db.query("SELECT * FROM visited_countries");
    return res;
  } catch (err) {
    console.log("Error retrieving data: ", err);
    return [];
  }
}

app.get("/", async (req, res) => {
  // //Write your code here.
  const visitedCountries = await getVisitedCountries();
  let countries = [];
  visitedCountries.rows.forEach((country) => {
    countries.push(country.country_code);
  });

  console.log("Visited Countries: ", visitedCountries.rows);

  res.render("index.ejs", { countries: countries, total: countries.length });
  db.end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

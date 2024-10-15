import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

// Dynamically switch between localhost and server IP
// You must set the environment variable in the console.
// Example: command line: set NODE_ENV=production powershell: $env:NODE_ENV="development"

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
  // db.end();
});

// handle submissions from index.js
app.post("/add", async (req, res) => {
  const countryName = req.body["country"];
  console.log("Country Name: ", countryName);
  try {
    const lookupResult = await db.query(
      "SELECT country_code FROM world_countries WHERE country_name ~*  $1;",
      [`\\m${countryName}\\M`]
    );

    if (lookupResult.rows.length != 0) {
      const data = lookupResult.rows[0];
      const countryCode = data.country_code;

      const visitedCheck = await db.query(
        "SELECT * FROM visited_countries WHERE country_code = $1",
        [countryCode]
      );

      if (visitedCheck.rows.length === 0) {
        await db.query(
          "INSERT INTO visited_countries (country_code) VALUES ($1)",
          [countryCode]
        );
        res.redirect("/");
      } else {
        const vistedCountries = await getVisitedCountries();
        let countries = vistedCountries.rows.map((row) => row.country_code);
        res.render("index.ejs", {
          countries: countries,
          total: countries.length,
          error: "This country has already been added to your visited list.",
        });
      }
    } else {
      const visitedCountries = await getVisitedCountries();
      let countries = visitedCountries.rows.map((row) => row.country_code);
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country name does not exist, try again.",
      });
    }
  } catch (err) {
    console.log("Error inserting data: ", err);
    res.render("An error occured while adding the coutry.");
  }
});

// Close the database connection only when the server is shutting down (optional)
process.on("SIGINT", () => {
  console.log("Closing database connection");
  db.end();
  process.exit();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

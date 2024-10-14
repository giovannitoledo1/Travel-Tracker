import express from "express";
import bodyParser from "body-parser";
import pg from "pg";



const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "123456",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getVisitedCountries() {
  try{
    const res = await db.query("SELECT * FROM visited_countries");
    return res;
  } catch(err){
    console.log("Error retrieving data: " ,err);
    return [];
  }
};


app.get("/", async (req, res) => {
  // //Write your code here.
  const visitedCountries = await getVisitedCountries();
  let countries = [];
  visitedCountries.rows.forEach((country) => {
    countries.push(country.country_code);
  });


  console.log("Visited Countries: ", visitedCountries.rows);

  res.render("index.ejs", { countries: countries, total: countries.length});
  db.end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

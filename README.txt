Overview:
The Travel Tracker Application is a web-based tool that allows users to keep track of countries they have visited by interacting with a PostgreSQL database. The application offers an easy-to-use interface where users can enter country names, and the system will record them in a "visited countries" list. The app prevents duplicate entries and provides real-time feedback if a country is not found in the database or has already been added.

Features:
Add New Countries: Users can input a country they have visited. The system checks if the country exists in the world countries database and records it if it has not been added already.
Partial Name Matching: Users can enter part of a country name (e.g., "Tanzania" for "Tanzania, United Republic of"), and the app will find and match the correct country name.
Real-Time Feedback: Users receive immediate feedback on the status of their submission. The app notifies users if the country name does not exist or if the country has already been added.
Preserve State: Even when errors occur (e.g., a duplicate entry or an invalid country), the list of visited countries and the total number of visited countries remain visible.
Libraries Used:
Express.js:

Express is used as the primary framework for building the web server and handling HTTP requests.
It provides an easy way to define routes and manage middleware like body parsers and static file serving.
pg (node-postgres):

This library is used to interact with the PostgreSQL database, allowing the application to execute SQL queries for selecting, inserting, and managing country data.
The queries are parameterized to prevent SQL injection.
EJS (Embedded JavaScript):

EJS is used as the templating engine to dynamically render the HTML pages with server-side data, including error messages, visited countries, and total counts.
It allows for easy insertion of variables and lists directly into the HTML.
body-parser:

This middleware is used to parse the form data submitted by the user, making the country name available for the backend to process.
dotenv:

dotenv is used for loading environment variables from a .env file, allowing secure configuration of sensitive information like database credentials without hardcoding them into the codebase.
Techniques Used:
Database Interaction:

PostgreSQL is used as the database to store country information and track the user's visited countries.
The application performs SQL queries for both retrieving country codes from the countries table and inserting new entries into the visited_countries table.
Regular Expressions for Word Boundaries:

The application uses PostgreSQL’s regular expressions (~*) with word boundaries (\m and \M) to ensure partial input from users matches full country names without accidentally matching part of another country's name (e.g., ensuring "India" does not match "Indian Ocean Territory").
Error Handling and User Feedback:

All potential errors, such as duplicate entries or non-existent countries, are caught and handled gracefully. Feedback is provided to the user without breaking the flow of the application.
Even when errors occur, the list of visited countries and the total count are preserved and displayed on the page.
Parameterization of SQL Queries:

All SQL queries are parameterized using $1, $2, etc., to safely insert user-provided data into queries, protecting the application from SQL injection attacks.
Environment Configuration:

Sensitive configuration data, such as the database host, user, and password, are stored securely in a .env file, and the dotenv library is used to load these into the application during runtime.
How to Run the Program:
Prerequisites:

Node.js installed on your machine.
PostgreSQL database set up with the necessary tables (countries and visited_countries).
A .env file containing your database credentials.
Setup Instructions:

Clone the repository and navigate to the project folder.
Install the required libraries by running:
bash
Copy code
npm install
Set up your .env file with the following variables:
makefile
Copy code
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST_LOCAL=localhost
DB_HOST_SERVER=your_server_ip
DB_PORT=5432
DB_NAME=your_database_name
Start the application using Nodemon:
bash
Copy code
npx nodemon index.js
Access the Application:

Open your browser and go to http://localhost:3000.
Use the form to input a country name. The system will add the country to your list if it exists and has not been added yet.
Notes:
Make sure that the countries table in your PostgreSQL database contains valid country names and their corresponding country codes.
The list of countries in the countries table must be comprehensive, as the application relies on this data to validate user input.

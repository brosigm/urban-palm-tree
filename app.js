const express = require('express');

const app = express();
app.use(express.json());

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS checkplaces (
    id SERIAL PRIMARY KEY,
    location TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    user_id INTEGER NOT NULL,
    link TEXT
  )
`;

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };
    response.send(status);
});

const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})


app.get("/checkplaces", async (request, response) => {
    const { rows } = await pool.query('SELECT * FROM checkplaces');
    response.send(rows);
});

app.post("/checkplaces", async (request, response) => {
    const { location, date, time, user_id, link } = request.body;
    const query = {
        text: 'INSERT INTO checkplaces(location, date, time, user_id, link) VALUES($1, $2, $3, $4, $5)',
        values: [location, date, time, user_id, link],
    };
    await pool.query(query);
    response.send("Data Inserted Successfully");
});

app.get("/checkplaces/:id", async (request, response) => {
    const { id } = request.params;
    const { rows } = await pool.query('SELECT * FROM checkplaces WHERE id = $1', [id]);
    response.send(rows);
});




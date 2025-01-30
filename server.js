const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;

app.get("/people", async (req, res) => {
    let sql = "SELECT * FROM people;";
    try {
        let result = await db.query(sql);
        res.send(result);
    } catch (error) {
        res.send("error:", error);
    }
});

app.get("/people/:id", async (req, res) => {
    let personId = req.params.id;
    let sql = "SELECT firstname, lastname FROM people WHERE id=?;";
    try {
        let result = await db.query(sql, [personId]);
        res.send(result);
    } catch (error) {
        res.status(404).send("error:", error);
    }
})

app.post("/people", async (req, res) => {
    let person = req.body;
    console.log(person);

    let sql = "INSERT INTO people (firstname, lastname) values(?,?)";
    try {
        let result = await db.query(sql, [person.firstname, person.lastname]);
        res.send(result);
    } catch (error) {
        res.send(error.massage);
    }
})

app.delete("/people/:id", async (req, res) => {
    let personId = req.params.id;
    let sql = "DELETE FROM people WHERE id=?;";
    try {
        let result = await db.query(sql, [personId]);
        res.send(result);
    } catch (error) {
        res.send("error:", error);
    }
})

app.listen(port, () => {
    console.log("Server running on port " + port);
})

module.exports = app;
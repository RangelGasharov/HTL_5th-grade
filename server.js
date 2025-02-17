const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

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
        res.send("error:", error);
    }
})

app.post("/people", async (req, res) => {
    let person = req.body;
    let sql = "INSERT INTO people (firstname, lastname) VALUES(?,?)";
    try {
        let result = await db.query(sql, [person.firstname, person.lastname]);
        res.send(result);
    } catch (error) {
        res.send(error.message);
    }
})

app.put("/people/:id", async (req, res) => {
    let person = req.body;
    let id = req.params.id;
    let sql = "UPDATE people SET firstname=?, lastname=? WHERE id=?;";
    try {
        let result = await db.query(sql, [person.firstname, person.lastname, id]);
        res.send(result);
    } catch (error) {
        res.send(error.message);
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

app.post('/register', async (req, res) => {
    const { username, userpassword } = req.body;
    const hashedPassword = await bcrypt.hash(userpassword, 10);
    let sql = "INSERT INTO users (username, userpassword) values (?,?)";
    try {
        let result = await db.query(sql, [username, hashedPassword]);
        res.send({ message: 'User registered successfully', result });
    } catch (error) {
        res.send(error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, userpassword } = req.body;
        let sql = "SELECT * FROM users WHERE username=?";
        try {
            const user = await db.query(sql, [username]);
            if (!user) {
                return res.status(401).json({ error: 'Authentication failed' });
            }
            const passwordMatch = await bcrypt.compare(userpassword, user[0].userpassword);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Wrong password' });
            }
            const token = jwt.sign({ id: user[0].id, name: username }, process.env.TOKEN_SECRET, { expiresIn: '1h', });
            res.json({ token });
        } catch (error) {
            res.status(404).send(error.massage);
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get("/users", async (req, res) => {
    let sql = "SELECT * FROM users;";
    try {
        let result = await db.query(sql);
        res.send(result);
    } catch (error) {
        res.send("error:", error);
    }
});

app.listen(port, () => {
    console.log("Server running on port " + port);
})

module.exports = app;
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;

const data = [
    { name: "Anna", age: 38 },
    { name: "Hugo", age: 21 },
    { name: "Henrich", age: 31 },
    { name: "Franz", age: 22 },
    { name: "Lisa", age: 45 },
    { name: "George", age: 36 }
];

app.get("/people", (req, res) => {
    res.send(data);
});

app.get("/people/:id", (req, res) => {
    let id = req.params.id;
    res.send(data[id]);
})

app.post("/people", (req, res) => {
    data.push(req.body);
    res.send(req.body);
})

app.delete("/people/:id", (req, res) => {
    let id = req.params.id;
    data.splice(id, 1);
})

app.listen(port, () => {
    console.log("Server running on port " + port);
})
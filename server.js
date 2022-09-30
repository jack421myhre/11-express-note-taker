const express = require("express");
const { fstat } = require("fs");
const path = require("path");
const { readAndAppend } = require("./helpers/fsUtils");

const uuid = require("./helpers/uuid");
const PORT = process.env.PORT || 3001;
const app = express();

// This updates the list of notes on the front end once the user submits a new one.
const refreshDataOnSave = () => {
    app.get("/api/notes", (req, res) => {
        res.sendFile(path.join(__dirname, "/db/db.json"));
    });
};

// MIDDLEWARE
app.use(express.json());
app.use(express.static("public"));

// GET Route for homepage
app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
    res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// API notes POST and GET
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.post("/api/notes", (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(newNote, "./db/db.json");
        refreshDataOnSave();
        const response = {
            status: "SUCCESS",
            body: newNote,
        };
        res.json(response);
    } else {
        res.json("ERROR");
    }
});

app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

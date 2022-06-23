const express = require("express");
const fs = require("fs");
const path = require("path");
const { animals } = require("./data/animals.json");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
const PORT = process.env.PORT || 3001;

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
  }
  personalityTraitsArray.forEach((trait) => {
    filteredResults = filteredResults.filter((animal) => {
      return animal.personalityTraits.indexOf(trait) !== -1;
    });
  });
  if (query.diet) {
    filteredResults = filteredResults.filter((animal) => {
      return animal.diet === query.diet;
    });
  }
  if (query.species) {
    filteredResults = filteredResults.filter((animal) => {
      return animal.species === query.species;
    });
  }
  if (query.name) {
    filteredResults = filteredResults.filter((animal) => {
      return animal.name === query.name;
    });
  }
  return filteredResults;
}

function findByID(id, animalsArray) {
  const result = animalsArray.filter((animal) => {
    return animal.id === id;
  })[0];
  return result;
}

function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(__dirname, "./data/animals.json"),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  return animal;
}

app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get("/api/animals/:id", (req, res) => {
  let results = findByID(req.params.id, animals);
  if (results) {
    res.json(results);
  } else {
    res.sendStatus(404);
  }
});

app.post("/api/animals", (req, res) => {
  req.body.id = animals.length.toString();
  const newAnimal = createNewAnimal(req.body, animals);
  res.json(newAnimal);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/animals.html"));
});

app.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/zookeepers.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`API server is now on port ${PORT}`);
});

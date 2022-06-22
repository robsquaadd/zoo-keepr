const express = require("express");
const { animals } = require("./data/animals.json");
const app = express();
const PORT = process.env.PORT || 3001;

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  let filteredResults = animalsArray;
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
  return filteredResults;
}

app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`API server is now on port ${PORT}`);
});

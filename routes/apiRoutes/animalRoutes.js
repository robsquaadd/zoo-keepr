const {
  createNewAnimal,
  filterByQuery,
  findByID,
  validateAnimal,
} = require("../../lib/animals");

const animals = require("../../data/animals.json");
const router = require("express").Router();

router.get("/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

router.get("/animals/:id", (req, res) => {
  let results = findByID(req.params.id, animals);
  if (results) {
    res.json(results);
  } else {
    res.sendStatus(404);
  }
});

router.post("/animals", (req, res) => {
  req.body.id = animals.length.toString();

  if (!validateAnimal(req.body)) {
    res.status(400).send("The animal is not properly formatted.");
  } else {
    const newAnimal = createNewAnimal(req.body, animals);
    res.json(newAnimal);
  }
});

module.exports = router;

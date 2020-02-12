const Clarifai = require("clarifai");
const app = new Clarifai.App({
  apiKey: "be72afc2aa8c400a9d782eb850e35d7c"
});

const handleImageUrlApi = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json("something wrong"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      return res.json(entries[0]);
    })
    .catch(err => res.status(400).json("error to count"));
};

module.exports = { handleImage, handleImageUrlApi };

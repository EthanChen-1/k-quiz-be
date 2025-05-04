const express = require("express");
const app = express();
const port = 5174;

app.use(express.json());

app.post("/artist", (req, res) => {
  console.log(req.body);
  res.set("Access-Control-Allow-Origin", "http://localhost:5173");
  res.status(200).json({
    artist: {
      name: "TWICE",
      gender: "female",
      tags: ["Ballad", "Pop"],
      song: { name: "Strategy(Feat. Megan The Stallion)" },
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

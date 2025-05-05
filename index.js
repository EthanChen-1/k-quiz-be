require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5174;

app.use(express.json());

app.post("/artist", async (req, res) => {
  try {
    const token_response = await fetch(process.env.TOKEN_URI, {
      method: process.env.TOKEN_METHOD,
      body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    });

    if (!token_response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const token_json = await token_response.json();

    const artist_response = await fetch(
      process.env.SPOTIFY_API_URL +
        `?q=Kpop+${req.body.gender}+${req.body.genre}&type=artist&market=US&limit=1&offset=0`,
      {
        method: process.env.SPOTIFY_API_METHOD,
        headers: {
          Authorization: `${token_json.token_type} ${token_json.access_token}`,
        },
      }
    );

    const artist_json = await artist_response.json();
    console.log(artist_json.artists.items[0]);
  } catch (error) {
    console.error(error.message);
    res.status(error.status);
  }

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

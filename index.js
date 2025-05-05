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
      process.env.ARTIST_API_URL +
        `?q=Kpop+${req.body.gender}+${
          req.body.genre + "group"
        }&type=artist&market=US&limit=1&offset=0`,
      {
        method: process.env.ARTIST_API_METHOD,
        headers: {
          Authorization: `${token_json.token_type} ${token_json.access_token}`,
        },
      }
    );

    const artist_json = await artist_response.json();

    const artist_name = artist_json.artists.items[0].name;
    const artist_id = artist_json.artists.items[0].uri.split(":")[2];

    const top_track_response = await fetch(
      process.env.TOP_TRACKS_URL + `/${artist_id}/top-tracks`,
      {
        method: process.env.TOP_TRACKS_METHOD,
        headers: {
          Authorization: `${token_json.token_type} ${token_json.access_token}`,
        },
      }
    );

    const top_tracks_json = await top_track_response.json();

    const album_name = top_tracks_json.tracks[0].album.name;

    res.status(200).json({
      artist: {
        name: artist_name,
        gender: req.body.gender,
        tags: ["ballad", "k-pop"],
        song: { name: album_name },
      },
    });
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

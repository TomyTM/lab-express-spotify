const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");

var SpotifyWebApi = require("spotify-web-api-node");

// Remember to paste here your credentials
var clientId = "c105840d6cdc49bb8c510d5f339d9dd3",
  clientSecret = "c028a12c00b54b808778c12eb7a5b19d";

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
hbs.registerPartials(__dirname + "/views/partial");

// Controladoras

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/getArtist", (req, res, next) => {
  const queryArtist = req.query.artist;
  console.log(queryArtist);
  spotifyApi.searchArtists(queryArtist)
    .then(data =>  {
      console.log(data.body.artists.items);
      res.render("artist", data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch(err => {
      console.log(err)
      // ----> 'HERE WE CAPTURE THE ERROR'
    });
});

app.listen(3000, () => {
  console.log("My first app listening on port 3000!");
});
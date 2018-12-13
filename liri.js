var Spotify = require('node-spotify-api');
var axios = require('axios');
var chalk = require('chalk');

var log = console.log;

var keys = require('./keys')
var spotify = new Spotify(keys.spotify);

// * `spotify-this-song`

//    * `movie-this`

var action = process.argv[2];
log(action);

switch (action) {
    case ("concert-this"):
        concertThis();
        break;
    case ("spotify-this-song"):
        spotifyThisSong();
        break;
    case ("movie-this"):
        movieThis();
        break;
    default:
        log("enter your choices atleast");
}



function spotifyThisSong() {
    var songSearch = process.argv.slice(3).join(" ");
    spotify
        .search({
            type: 'track',
            query: songSearch
        })
        .then(function (response) {
            var results = response.tracks.items[0];
            var artist = results.artists[0].name;
            var songName = results.name;
            var songLink = results.external_urls.spotify;
            var album = results.album.name;

            //Need: artist(s), song's name, preview link of song, album//
            console.log("************");
            console.log("Artist: " + artist);
            console.log("Song: " + songName);
            console.log("Song Link: " + songLink);
            console.log("Album: " + album);
            console.log("************");

        })
        .catch(function (err) {
            console.log(err);
        });
}

function concertThis() {
    var band = process.argv.slice(3).join(" ");
    axios.get("https://app.swaggerhub.com/apis/Bandsintown/PublicAPI/3.0.0" + band + "/events?app_id=5fd1b4db4b5d87de54d26c2c0a66a70c")
        //     // var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=";
        .then(function (result) {
            console.log(result)
            // var results = JSON.parse(result);
            // console.log(results);
        })
        .catch(function (error) {
            console.log("where is the error", error)
        })
}


function movieThis() {
    var movie = process.argv.slice(3).join(" ");
    axios.get("https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=3fbf992f")
        // ("http: //www.omdbapi.com/?t=Game of Thrones&Season=1&apikey=")
        // var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=";
        .then(function (result) {
            var data = result.data;
            log("************");
            log(chalk.red.bgWhite("Title:   "), data.Title,
                "\nIMDB Rating:           ", data.imdbRating,
                "\nRotten Tomatoes Rating:", data.Ratings[1].Value,
                "\nCountry:    ", data.Country,
                "\nLanguage:   ", data.Language,
                "\nPlot:       ", data.Plot,
                "\nActors:     ", data.Actors)
            log("************");
            // var results = JSON.parse(result)[0];
            // console.log(results);
        })
        .catch(function (error) {
            console.log("where is the error", error)
        })
}


// * Title of the movie.
//    * Year the movie came out.
//    * IMDB Rating of the movie.
//    * Rotten Tomatoes Rating of the movie.
//    * Country where the movie was produced.
//    * Language of the movie.
//    * Plot of the movie.
//    * Actors in the movie.
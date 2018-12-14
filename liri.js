var Spotify = require('node-spotify-api');
var axios = require('axios');
var dotenv = require('dotenv').config();
var moment = require('moment');

var fs = require('fs');

var chalk = require('chalk');

var log = console.log;

var keys = require('./keys')
var spotify = new Spotify(keys.spotify);

var parameter = process.argv.slice(3).join(" ");


// * `spotify-this-song`

//    * `movie-this`

var action = process.argv[2];
log(action);

switch (action) {
    case ("concert-this"):
        concertThis();
        logAction();
        break;
    case ("spotify-this-song"):
        spotifyThisSong();
        logAction();
        break;
    case ("movie-this"):
        movieThis();
        logAction();
        break;
    case ("do-what-it-says"):
        doIt();
        logAction();
        break;
    default:
        log("problem with switch1");
}



function spotifyThisSong(song) {

    if (parameter) {
        var songSearch = parameter;
    } else if ((!parameter) && (action === "spotify-this-song")) {
        var songSearch = "The Sign Ace of Base";
    } else {
        songSearch = song;
    }

    console.log("songsearch", songSearch)
    spotify
        .search({
            type: 'track',
            query: songSearch
        })
        .then(function (response) {
            // console.log(response)
            for (var i = 0; i < 5; i++) {
                var results = response.tracks.items[i];
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
            }


        })
        .catch(function (err) {
            console.log(err);
        });
}

function concertThis(band) {
    if (parameter) {
        var bandSearch = parameter;
    } else {
        bandSearch = band;
    }
    axios.get("https://rest.bandsintown.com/artists/" + bandSearch + `/events?app_id=${keys.band.app_id}`)
        .then(function (result) {
            for (var i = 0; i < 5; i++) {
                // log(result.data)
                var results = result.data[i].venue;
                // log("results", results);
                console.log("************");
                console.log("Country:" + results.country +
                    "\nCity:" + results.city +
                    "\nVenue Location:" + results.name +
                    "\nDate:" + moment(result.data.datetime).format("MM/DD/YYYY"))
                console.log("************");
            }

            // result.data.map(item => {
            //     var venue = item.venue;
            //     // log(result.data)

            // });

        })
        .catch(function (error) {
            console.log("where is the error", error)
        })
}


function movieThis(movie) {
    if (parameter) {
        var movieSearch = parameter;
    } else if ((!parameter) && (action === "movie-this")) {
        var movieSearch = "Mr. Nobody";
    } else {
        movieSearch = movie;
    }
    axios.get("https://www.omdbapi.com/?t=" + movieSearch + `&y=&plot=short&apikey=${keys.omdb.apikey}`)
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


        })
        .catch(function (error) {
            console.log("where is the error", error)
        })
}

function doIt() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        var randomAction = data.split(',')[0];
        var randomSearch = data.split(',')[1];
        console.log(randomAction);
        console.log(randomSearch);

        switch (randomAction) {
            case ("concert-this"):
                concertThis(randomSearch);
                break;
            case ("spotify-this-song"):
                console.log("randomSearch", randomSearch)
                spotifyThisSong(randomSearch);
                break;
            case ("movie-this"):
                movieThis(randomSearch);
                break;
            default:
                log("enter your choices atleast2");
        }
    })

}

function logAction() {
    var log = action + " " + parameter + "\n ";
    fs.appendFile("log.txt", log, function (err) {

        // If an error was experienced we will log it.
        if (err) {
            console.log(err);
        }

        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
            console.log("Content Added!");
        }

    });
}
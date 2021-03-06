var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/mongoSocialScraper", { useNewUrlParser: true });

// If deployed, use the deployed database. Otherwise use the local database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoSocialScraper";

mongoose.connect(MONGODB_URI);






// Routes

// Scrape keto
// A GET route for scraping a recipe website
app.get("/scrape/keto", function (req, res) {
    axios.get("https://www.ditchthecarbs.com/category/slow-cooker-instant-pot/").then(function (response) {
        var $ = cheerio.load(response.data);
        var timeStamp = Date.now();
        var results = [];
        $("article").each(function (i, element) {
            var result = {};
            result.title = $(element).find("a.entry-title-link").text();
            result.link = $(element).find("a.entry-title-link").attr("href");
            result.img = $(element).find("img").attr("src");
            result.category = "Keto";
            result.batchId = timeStamp;
            results.push(result);
        });
        res.send(results);
    })
});

// Scrape vegan
// A GET route for scraping a recipe website
app.get("/scrape/vegan", function (req, res) {
    axios.get("https://www.shape.com/topics/vegan-recipes").then(function (response) {
        var $ = cheerio.load(response.data);
        var results = [];
        $(".taxonomy-content-item").each(function (i, element) {
            var result = {};
            result.link = $(element).find("a.taxonomy-content-item__link").attr("href");
            result.title = $(element).find("h5").text();
            result.img = $(element).find("img").attr("src");
            result.description = $(element).find(".taxonomy-content-item__description").text();
            result.category = "Vegan";
            results.push(result);
        });
        res.send(results);
    })
});

// Scrape Food.com
// A GET route for scraping a recipe website
app.get("/scrape/popular", function (req, res) {
    axios.get("https://www.food.com/ideas/most-saved-recipes-6799?c=667794").then(function (response) {
        var $ = cheerio.load(response.data);
        var results = [];
        $(".smart-card").each(function (i, element) {
            var result = {};
            result.title = $(element).find("h2.title").text().trim();
            result.link = $(element).find("h2.title").find("a").attr("href");
            result.img = $(element).find(".smart-photo-inner").find("img").attr("data-src");
            // console.log("result.img: ", result.img);
            result.category = "Popular";
            results.push(result);
        });
        res.send(results);
    })
});

// db.getCollection('').find({}).sort({_id:-1}) 
// Route for getting all Recipes from the db
app.get("/recipes", function (req, res) {
    // Grab every document in the Recipes collection
    db.Recipe.find({}).sort({_id:-1})
        .then(function (dbRecipe) {
            // If we were able to successfully find Recipes, send them back to the client
            res.json(dbRecipe);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for checking if reipe alrady is saved
app.get("/recipes/title", function (req, res) {
    // console.log("HERE", req.params.title);
    console.log("HERE", req.body.title);

    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Recipe.findOne({ title: req.params.title })
        .then(function (dbRecipe) {
            console.log("dbRecipe: ", dbRecipe);
            // If we were able to successfully find a Recipe with the given id, send it back to the client
            res.json(dbRecipe);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route to save a recipe to the db
app.post("/recipes/save", function (req, res) {

    console.log("req.body: ", req.body);
    db.Recipe.create(req.body)
        .then(function (dbRecipe) {
            // View the added result in the console
            console.log(dbRecipe);
            res.send(dbRecipe);
        })
        .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
        });
});



// Route for grabbing a specific Recipe by id, populate it with it's note
app.get("/recipes/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Recipe.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbRecipe) {
            // If we were able to successfully find an Recipe with the given id, send it back to the client
            res.json(dbRecipe);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Note by id
app.get("/notes/:id", function (req, res) {
    db.Note.findOne({ _id: req.params.id })
        .then(function (dbNote) {
            // If we were able to successfully find an Note with the given id, send it back to the client
            res.json(dbNote);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


// // Route for saving a Recipe's associated Note
// app.post("/recipes/:id", function (req, res) {
//     db.Note.create(req.body)
//         .then(function (dbNote) {
//             // If we were able to successfully create a note, send it back to the client
//             res.json(dbNote);
//         })
//         .catch(function (err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// // Route for finding a Recipe's associated Note
// app.get("/recipes/:id/notes", function (req, res) {
//     var recipeid = req.params.id;
//     db.Note.find({ recipeid: { recipeid } })
//         .then(function (dbNotes) {
//             console.log("TESTING");
//             res.json(dbNotes);
//         })
//         .catch(function (err) {
//             // If an error occurred, send it to the client
//             res.json(err);
//         });
// });

// Route for saving/updating a Recipe's associated Note
app.post("/recipes/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Recipe with an `_id` equal to `req.params.id`. Update the Recipe to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Recipe.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbRecipe) {
            // If we were able to successfully update an Recipe, send it back to the client
            res.json(dbRecipe);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});



// Route for clearing database
app.post("/clear", function (req, res) {
    db.Recipe.deleteMany({
    }).then(function (dbNote) {
        return dbNote;
    }).catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
    });

    db.Note.deleteMany({
    }).then(function (dbNote) {
        return dbNote;
    }).catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
    res.send("Deleted");
    res.end();
});


// // Start the server
// app.listen(PORT, function () {
//     console.log("App running on port " + PORT + "!");
// });


app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

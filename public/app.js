$(document).ready(function () {

  var articlesDiv = $("#articles");
  var contentTitleDiv = $('#content-title');
  var selectDiv = $('<div id="select-div">');
  var pageState = 0;
  var pageStateDiv = $('#page-state');
  pageStateDiv.text(pageState);

  var progressStateDiv = $('<div id="progress-state">');
  progressStateDiv.text(" ");


  var refreshContent = function (pageState, categoryName, scrapeURL) {
    if (pageState == 0) {
      selectDiv.empty();
      selectDiv.html("<h3>" + categoryName + "</h3><br>Instructions: select a topic in the left menu.");
      contentTitleDiv.prepend(selectDiv);
    } else if (pageState == 1 || pageState == 2 || pageState == 3) {
      var scrapeButton = $('<button class="scrape-button btn btn-primary">');
      scrapeButton.val(scrapeURL);
      scrapeButton.text("Scrape this");
      selectDiv.empty();
      selectDiv.html("<h3>" + categoryName + "</h3><br>");
      selectDiv.append(scrapeButton);
      contentTitleDiv.prepend(selectDiv);
      contentTitleDiv.append(progressStateDiv);
    }
  };

  var initializeContent = function (pageState) {
    if (pageState === 0) {
      selectDiv.text("Instructions: select a topic in the left menu.");
      contentTitleDiv.prepend(selectDiv);
      // $(this).addClass("active");
      $("#menu li:first-child a").addClass("active");
    }
  };

  initializeContent(0);

  // Click Handler for left nav
  $('.content-link').on("click", function (event) {
    console.log("Clicky left nav");

    $(".content-link.active").removeClass("active");
    $(this).addClass("active");

    $(".scrape-button").remove();
    $("#articles").empty();

    // $('nav').find("a.content-link");
    var state = $(this).attr("data-pageState");
    pageState = state;
    var categoryName = $(this).attr("data-categoryName");
    var scrapeURL = $(this).attr("data-scrapeURL");
    pageStateDiv.html(pageState + " " + categoryName + " " + scrapeURL);
    progressStateDiv.removeClass("alert", "alert-warning", "alert-success");
    progressStateDiv.text(" ");
    refreshContent(pageState, categoryName, scrapeURL);
  });

  // Click handler for scrape button
  contentTitleDiv.on("click", ".scrape-button", function (event) {
    console.log("Clicky scrape button");
    progressStateDiv.addClass("alert");
    progressStateDiv.text("Scraping in progress...");

    var scrapeURL = $(this).val();

    // disable button
    $(this).addClass("disabled");
    $(this).attr("disabled", "disabled");

    $.getJSON(scrapeURL, function (data, status) {
      if (data.length > 0) {
        progressStateDiv.addClass("alert-success");
        progressStateDiv.text("Success! Scraping complete!");
        console.log("data: ", data);
        console.log("data.length: ", data.length);
        console.log("Status: ", status);
        if (data[0].batchId) {
          console.log("batchId: ", data[0].batchId);
        }
        // Call function to display the db results of this scrape
        displayScrapedRecipesFromDb(data[0].batchId);
      } else {
        console.log("Error: ", status);
      }
    });
  });

  // This function displays the newly scraped articles from the db
  var displayScrapedRecipesFromDb = function (batchId) {
    progressStateDiv.text("Success! Scraping complete! Retrieving articles from our database!");
    articlesDiv.empty();

    var queryURL = "/recipes/" + batchId;
    console.log("queryURL: ", queryURL);

    // Grab the articles from the db as a json
    $.getJSON(queryURL, function (data) {
      if (data.length > 0) {
        console.log("data: ", data);
        progressStateDiv.text("Success! Here are your database results!");

        articlesDiv.empty();
        for (let i = 0; i < data.length; i++) {
          // console.log("data: ", data[i]);
          var articleWrap = $('<div class="art">');
          // console.log("data[i].id", data[i]._id);
          articleWrap.attr("data-id", data[i]._id);
          var articleTitle = data[i].title;
          var articleLink = data[i].link;
          var articleImg = data[i].img;

          articleWrap.html("<h6><a href='#'>" + articleTitle + "</a></h6>" + "<a href='" + articleLink + "' target='_blank'>Link</a>" + "<img src='" + articleImg + "'>" + "<br><button class='notes-button btn btn-primary' id='" + data[i]._id + "'>NOTES</button>");
          articlesDiv.append(articleWrap);
        }

      } else {
        progressStateDiv.removeClass("alert-success");
        progressStateDiv.addClass("alert-warning");
        progressStateDiv.text("No results from database, something went wrong...");
      }
    });

  };

  // Click handler for recipe NOTES button:
  articlesDiv.on("click", ".notes-button", function (event) {
    var recipeId = $(this).attr("id");
    console.log("notes-button clicky");
    console.log("recipeId: ", recipeId);
  });







  // var selectMenuOptionState;
  // // Initialize SelectMenu
  // $(function () {
  //   $("#sites").selectmenu();
  // });
  // $('#sites').on('selectmenuchange', function () {
  //   var v = $(this).val();
  //   selectMenuOptionState = $(this).val();
  //   console.log("v: ", $(this).val());
  //   if (v) {
  //     // Grab the articles as a json
  //     $.getJSON(v, function (data) {
  //       if (data) {
  //         // Clear the div
  //         articlesDiv.empty();
  //         // For each one
  //         for (var i = 0; i < data.length; i++) {
  //           // Display the apropos information on the page
  //           // articlesDiv.append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br><a href='" + data[i].link + "' target='_blank'>Link</a>" + "<br /></p>");
  //           articlesDiv.append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br></p>");
  //         }
  //       }
  //     });
  //   }
  // });
  // // Grab the articles as a json
  // $.getJSON("/articles", function (data) {
  //   // For each one
  //   for (var i = 0; i < data.length; i++) {
  //     // Display the apropos information on the page
  //     $("#articles").append("<p data-id='" + data[i]._id + "'>" + "<a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a>" + "<br /></p>");
  //   }
  // });


  // // Whenever someone clicks a p tag
  // $(document).on("click", "p", function () {
  //   // Empty the notes from the note section
  //   $("#notes").empty();
  //   // Save the id from the p tag
  //   var thisId = $(this).attr("data-id");
  //   // Now make an ajax call for the Article
  //   $.ajax({
  //     method: "GET",
  //     // url: "/articles/" + thisId
  //     url: selectMenuOptionState + "/" + thisId
  //   })
  //     // With that done, add the note information to the page
  //     .then(function (data) {
  //       console.log(data);
  //       // The title of the article
  //       $("#notes").append("<h2>" + data.title + "</h2>");
  //       // An input to enter a new title
  //       $("#notes").append("<input id='titleinput' name='title' >");
  //       // A textarea to add a new note body
  //       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
  //       // A button to submit a new note, with the id of the article saved to it
  //       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  //       // If there's a note in the article
  //       if (data.note) {
  //         // Place the title of the note in the title input
  //         $("#titleinput").val(data.note.title);
  //         // Place the body of the note in the body textarea
  //         $("#bodyinput").val(data.note.body);
  //       }
  //     });
  // });

  // // When you click the savenote button
  // $(document).on("click", "#savenote", function () {
  //   // Grab the id associated with the article from the submit button
  //   var thisId = $(this).attr("data-id");
  //   // Run a POST request to change the note, using what's entered in the inputs
  //   $.ajax({
  //     method: "POST",
  //     url: "/articles/" + thisId,
  //     data: {
  //       // Value taken from title input
  //       title: $("#titleinput").val(),
  //       // Value taken from note textarea
  //       body: $("#bodyinput").val()
  //     }
  //   })
  //     // With that done
  //     .then(function (data) {
  //       // Log the response
  //       console.log(data);
  //       // Empty the notes section
  //       $("#notes").empty();
  //     });
  //   // Also, remove the values entered in the input and textarea for note entry
  //   $("#titleinput").val("");
  //   $("#bodyinput").val("");
  // });
});
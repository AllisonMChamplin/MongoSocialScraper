$(document).ready(function () {

  // Globals
  var articlesDiv = $("#articles");
  var contentTitleDiv = $('#content-title');
  var selectDiv = $('<div id="select-div">');
  var pageStateDiv = $('#page-state');

  var contentSwapDiv = $('#content-swap');
  var subHeaderDiv = $('<div class="sub-header">');

  var jumboDiv = $(".jumbotron");

  var progressStateDiv = $('<div id="progress-state" class="alert alert-info" role="alert">');
  progressStateDiv.text(" ");


  var pageState = 0;
  var sitesArray = [["Keto", "Description", "/scrape/keto"]];

  // Click handler for nav
  $('.nav-link').on("click", function (event) {
    console.log("Clicky nav");
    $(".nav-link.active").removeClass("active");
    $(this).addClass("active");
    var state = $(this).attr("data-pageState");
    var categoryName = $(this).attr("data-categoryName");
    pageState = state;
    console.log("pageState: ", pageState);
    refreshContentHeader(pageState, categoryName);
  });

  var refreshContentHeader = function (pageState, categoryName) {
    console.log("refreshing");
    console.log("pageState: ", pageState);
    selectDiv.empty();

    if (pageState == 1) {
      console.log("pageState 1 stuff");
      jumboDiv.slideUp("fast");
      subHeaderDiv.empty();
      subHeaderDiv.append("<h2>" + categoryName + "</h2>");
      subHeaderDiv.hide().appendTo(contentSwapDiv).slideDown(500);
      refreshContentMain1(pageState);
    } else if (pageState == 2) {
      console.log("pageState 2 stuff");
      jumboDiv.slideUp("fast");
      subHeaderDiv.empty();
      subHeaderDiv.append("<h2>" + categoryName + "</h2>");
      subHeaderDiv.hide().appendTo(contentSwapDiv).slideDown(500);
      refreshContentMain2(pageState);
    }
  };

  // Display scrape page stuff
  var refreshContentMain1 = function (pageState) {
    selectDiv.slideUp("fast");
    selectDiv.empty();
    // selectDiv.append("<h3>How it Works</h3>");
    // selectDiv.append("<p>Click on the button to scrape new recipes!</p>");

    var scrapeButton = $('<button class="scrape-button btn btn-success">');
    scrapeButton.val(sitesArray[0][2]);
    scrapeButton.text("Scrape New Recipes");
    selectDiv.append(scrapeButton);

    selectDiv.slideDown("fast");
  }

  // Display saved page stuff
  var refreshContentMain2 = function (pageState) {
    selectDiv.slideUp("fast");
    selectDiv.empty();
    selectDiv.text("pageState 2 stuff");
    selectDiv.slideDown("fast");
  }

  // Initialize App
  var initializeContent = function (pageState) {
    contentTitleDiv.prepend(selectDiv);
    subHeaderDiv.hide();
    selectDiv.empty();
    selectDiv.text("Homepage content.");
    jumboDiv.slideDown("fast");
    subHeaderDiv.hide();
    $(".nav-item:first-child a").addClass("active");
  };
  initializeContent(0);


  // Click handler for scrape button
  contentTitleDiv.on("click", ".scrape-button", function (event) {
    console.log("Clicky scrape button");
    console.log("val: ", $(this).val());
    var button = $(".scrape-button");
    progressStateDiv.addClass("alert-info");
    progressStateDiv.text("Scraping in progress...");
    progressStateDiv.hide().appendTo(contentTitleDiv).slideDown(500);

    var scrapeURL = $(this).val();

    // disable button
    $(this).addClass("disabled");
    $(this).attr("disabled", "disabled");

    $.getJSON(scrapeURL, function (data, status) {
      if (data.length > 0) {
        progressStateDiv.addClass("alert-success");
        progressStateDiv.text("Success! Scraping complete, we grabbed " + data.length + " results.");
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
          var articleWrap = $('<div class="art clearfix">');
          // console.log("data[i].id", data[i]._id);
          articleWrap.attr("data-id", data[i]._id);
          var articleTitle = data[i].title;
          var articleLink = data[i].link;
          var articleImg = data[i].img;

          articleWrap.html("<img src='" + articleImg + "'>" + "<h6><a href='#'>" + articleTitle + "</a></h6>" + "<a href='" + articleLink + "' target='_blank'>Link</a>" + "<br><button class='notes-button btn btn-primary' id='" + data[i]._id + "'>NOTES</button>");
          articlesDiv.append(articleWrap);
        }

      } else {
        progressStateDiv.removeClass("alert-success");
        progressStateDiv.addClass("alert-warning");
        progressStateDiv.text("No results from database, something went wrong...");
      }
    });

  };



});
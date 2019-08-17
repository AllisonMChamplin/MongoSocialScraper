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

        articlesDiv.empty();
        for (let i = 0; i < data.length; i++) {
          var articleWrap = $('<div class="card">');
          var articleTitle = data[i].title;
          var articleLink = data[i].link;
          var articleImg = data[i].img;
          
          var saveButton = $("<button class='save-recipe'>");
          saveButton.attr("data-articleTitle", articleTitle);
          saveButton.attr("data-articleLink", articleLink);
          saveButton.attr("data-articleImg", articleImg);

          articleWrap.html("<div class='card-body'><h5 class='card-title'>" + articleTitle + "</h5>" + "<a href='" + articleLink + "' target='_blank'>Link</a><img src='" + articleImg + "'>" + "<button class='save-recipe btn btn-primary' data-articleTitle='" + articleTitle + "' data-articleLink='" + articleLink + "' data-articleImg='" + articleImg + "'>Save Recipe</button>" + "</div>");
          articlesDiv.append(articleWrap);
        }
        
      } else {
        console.log("Error: ", status);
      }
    });

  });

  // Click handler for scrape button
  $("#main").on("click", ".save-recipe", function (event) {
    console.log("save clicky");
  });




});
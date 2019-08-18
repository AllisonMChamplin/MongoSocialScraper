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
    selectDiv.empty();
    articlesDiv.empty();
    refreshContentHeader(pageState, categoryName);
  });

  var refreshContentHeader = function (pageState, categoryName) {
    console.log("refreshing");
    console.log("pageState: ", pageState);
    progressStateDiv.removeClass("alert-success alert-info alert-warning");
    progressStateDiv.empty();
    progressStateDiv.hide();
    if (pageState == 1) {
      console.log("pageState 1 stuff");
      jumboDiv.hide();
      subHeaderDiv.empty();
      subHeaderDiv.append("<h2>" + categoryName + "</h2>");
      subHeaderDiv.hide().appendTo(contentSwapDiv).slideDown(500);
      refreshContentMain1();
    } else if (pageState == 2) {
      console.log("pageState 2 stuff");
      jumboDiv.hide();
      subHeaderDiv.empty();
      subHeaderDiv.append("<h2>" + categoryName + "</h2>");
      subHeaderDiv.hide().appendTo(contentSwapDiv).slideDown(500);
      refreshContentMain2(pageState);
    }
  };

  // Display scrape page stuff
  var refreshContentMain1 = function () {
    console.log("refreshContentMain1: ");
    var scrapeButton = $('<button class="scrape-button btn btn-success">');
    scrapeButton.val(sitesArray[0][2]);
    scrapeButton.text("Scrape New Recipes");
    selectDiv.append(scrapeButton);
    selectDiv.slideDown("fast");
  }

  // Display saved page stuff
  var refreshContentMain2 = function (pageState) {
    selectDiv.empty();
    displaySavedRecipes();
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
    articlesDiv.empty();
    var button = $(".scrape-button");
    progressStateDiv.addClass("alert-info");
    progressStateDiv.text("Scraping in progress...");
    progressStateDiv.hide().appendTo(contentTitleDiv).slideDown(500);
    var scrapeURL = $(this).val();

    $.getJSON(scrapeURL, function (data, status) {
      if (data.length > 0) {
        progressStateDiv.addClass("alert-success");
        progressStateDiv.text("Success! Scraping complete, we grabbed " + data.length + " results.");
        console.log("data: ", data);
        console.log("data.length: ", data.length);
        console.log("Status: ", status);
        // Call function to display the results of this scrape
        displayScrapedRecipes(data);
      } else {
        console.log("Error: ", status);
      }
    });
  });

  var displayScrapedRecipes = function (data) {
    console.log("here: ", data);
    for (let i = 0; i < data.length; i++) {
      var title = data[i].title;
      var img = data[i].img;
      var link = data[i].link;
      var titleHeader = $('<h4 class="recipe-title">');
      titleHeader.append(title);
      var articleWrapDiv = $('<div class="articleWrapDiv">');
      var saveButton = $('<button class="save-button btn btn-primary">');
      saveButton.attr("data-title", title);
      saveButton.attr("data-img", img);
      saveButton.attr("data-link", link);
      saveButton.text("Save Recipe");
      // var notesButton = $('<button class="notes-button btn btn-primary">');
      // notesButton.text("Make a Note");
      articleWrapDiv.html('<h4 class="recipe-title">' + title + '</h4>' + '<img src="' + img + '" />' + '<a href="' + link + '" target="_blank">View Recipe</a>');
      articleWrapDiv.append(saveButton);
      articlesDiv.append(articleWrapDiv);
    }
  };

  var displaySavedRecipes = function (data) {
    console.log("here: ", data);
    articlesDiv.empty();
    var queryURL = "/recipes";
    $.getJSON(queryURL, function (data) {
      console.log("data.length: ", data.length);
      if (data.length > 0) {
        console.log("data: ", data);
        for (let i = 0; i < data.length; i++) {
          var title = data[i].title;
          var img = data[i].img;
          var link = data[i].link;
          var id = data[i]._id;
          var titleHeader = $('<h4 class="recipe-title">');
          titleHeader.append(title);
          var articleWrapDiv = $('<div class="articleWrapDiv">');
          var notesButton = $('<button class="notes-button btn btn-primary" id="' + id + '">');
          notesButton.attr("data-title", title);
          notesButton.attr("data-img", img);
          notesButton.attr("data-link", link);
          notesButton.attr("data-id", id);
          notesButton.text("Make a Note");
          articleWrapDiv.html('<h4 class="recipe-title">' + title + '</h4>' + '<img src="' + img + '" />' + '<a href="' + link + '" target="_blank">View Recipe</a>');
          articleWrapDiv.append(notesButton);
          articlesDiv.append(articleWrapDiv);
        }
      }
    });
  }

  // Click handler for save button
  $('#articles').on("click", ".save-button", function (event) {
    console.log("Save button clicky");
    var button = $(this);
    var title = $(this).attr("data-title");
    var img = $(this).attr("data-img");
    var link = $(this).attr("data-link");
    // Run a POST request to save the recipe
    $.ajax({
      method: "POST",
      url: "/recipes/save",
      data: {
        title: title,
        img: img,
        link: link
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        button.text("Saved!");
        button.attr("disabled", "disabled");
      });
  });

  // Click handler for notes button
  $('#articles').on("click", ".notes-button", function (event) {
    console.log("Notes button clicky");
    var recipeDiv = $(this).parent();
    var titleinput = $('<input id="titleinput">');
    var bodyinput = $('<input id="bodyinput">');
    var id = $(this).attr("id");
    var notesavebutton = $('<button class="notes-save-button" id="' + id + '">Save Note</button>');
    recipeDiv.append(titleinput, bodyinput, notesavebutton);
  });


  // Click handler for save note button
  $('#articles').on("click", ".notes-save-button", function (event) {
    console.log("Notes save button clicky");
    var button = $(this);
    var id = $(this).attr("id");
    var title = $("#titleinput").val();
    var body = $("#bodyinput").val();
    // Run a POST request to add a note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/recipes/" + id,
      data: {
        title: title,
        body: body
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        button.text("Saved note!");
        button.attr("disabled", "disabled");
      });
    // recipeDiv.append();
  });
});

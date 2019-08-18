$(document).ready(function () {

  const jumboFluidDiv = $(".jumbotron-fluid");
  let jumboPicArray = ["carrots.jpg", "spices.jpg", "food-prep.jpg", "straws.jpg"];
  let random = Math.floor(Math.random() * 4) + 1;
  console.log("Random: ", random);
  jumboFluidDiv.addClass("home" + random);


  // Globals
  var jumboDiv = $(".jumbotron");
  var articlesDiv = $("#articles");
  var contentTitleDiv = $('#content-title');
  var selectDiv = $('<div id="select-div">');
  var pageStateDiv = $('#page-state');
  var contentSwapDiv = $('#content-swap');
  var subHeaderDiv = $('<div class="sub-header">');
  var progressStateDiv = $('<div id="progress-state" class="alert alert-info" role="alert">');
  progressStateDiv.text(" ");
  var pageState = 0;
  var sitesArray = [["Keto", "Description", "/scrape/keto"], ["Vegan", "Description", "/scrape/vegan"], ["Vegetarian-Keto", "Description", "/scrape/vegetarian-keto"]];

  var keto = sitesArray[0][2];
  var vegan = sitesArray[1][2];
  var vegetarianKeto = sitesArray[2][2];

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
    let random = (Math.floor(Math.random() * 4) + 1);

    subHeaderDiv.removeClass();
    subHeaderDiv.addClass("sub-header sub-header" + random);

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
    var scrapeButtonKeto = $('<button class="scrape-button btn btn-primary" id="scrape-keto" style="margin-right: 20px;">');
    scrapeButtonKeto.val(keto);
    scrapeButtonKeto.text("Scrape Keto Recipes");
    var scrapeButtonVegan = $('<button class="scrape-button btn btn-primary" id="scrape-vegan" style="margin-right: 20px;">');
    scrapeButtonVegan.val(vegan);
    scrapeButtonVegan.text("Scrape Vegan Recipes");
    var scrapeButtonVegetarianKeto = $('<button class="scrape-button btn btn-primary" id="scrape-vegetarian-keto" style="margin-right: 20px;">');
    scrapeButtonVegetarianKeto.val(vegetarianKeto);
    scrapeButtonVegetarianKeto.text("Scrape Vegetarian-Keto Recipes");
    selectDiv.append(scrapeButtonKeto, scrapeButtonVegan, scrapeButtonVegetarianKeto);
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
    selectDiv.hide();
    // selectDiv.text("Homepage content.");
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
    progressStateDiv.addClass("alert-info");
    progressStateDiv.text("Scraping in progress...");
    progressStateDiv.hide().appendTo(contentTitleDiv).slideDown(500);
    var buttonId = $(this).attr("id");
    console.log("buttonId: ", buttonId);

    var scrapeURL = $(this).val();
    console.log("scrapeURL: ", scrapeURL);

    $.getJSON(scrapeURL, function (data, status) {
      console.log("data: ", data);
      if (data.length > 0) {
        progressStateDiv.addClass("alert-success");
        progressStateDiv.text("Success! Scraping complete, we grabbed " + data.length + " results.");
        console.log("data: ", data);
        console.log("data.length: ", data.length);
        console.log("Status: ", status);
        // Call function to display the results of this scrape
        displayScrapedRecipes(data, buttonId);
      } else {
        console.log("Error: ", status);
      }
    });
  });

  var displayScrapedRecipes = function (data, buttonId) {

    articlesDiv.empty();

    if (buttonId == "scrape-keto") {
      var tag = "Keto";
    } else if (buttonId == "scrape-vegan") {
      var tag = "Vegan";
    } else if (buttonId == "scrape-vegetarian-keto") {
      var tag = "Vegetarian-Keto";
    }

    for (let i = 0; i < data.length; i++) {
      let title = data[i].title;
      if (title != "") {
        let img = data[i].img;
        let link = data[i].link;
        let description = data[i].description;
        let card = $('<div class="card">');
        let cardImg = $('<img class="card-img-top">');
        cardImg.attr("src", img);
        cardImg.attr("alt", title);
        let cardBody = $('<div class="card-body">');
        let cardTitle = $('<h5 class="card-title">');
        cardTitle.text(title);
        let cardFooter = $('<div class="card-footer">');
        let cardUpdated = $('<small class="text-muted">');
        cardFooter.append(cardUpdated);
        cardBody.append(cardTitle);
        if (description) {
          let cardDescription = $('<p class="card-text">');
          cardDescription.text(data[i].description);
          cardBody.append(cardDescription);
        }
        let cardListGroup = $('<ul class="list-group  list-group-flush">');
        let cardListItemLink = $('<li class="list-group-item">');
        let cardLink = $('<a class="card-link" target="_blank">');
        cardLink.attr("href", link);
        cardLink.text("View Recipe");
        cardListItemLink.append(cardLink);
        cardUpdated.append('Tags: <span class="keto badge badge-info">' + tag + '</span>');
        cardListGroup.append(cardListItemLink);
        let saveButton = $('<button class="save-button btn btn-primary">');
        saveButton.attr("data-title", title);
        saveButton.attr("data-img", img);
        saveButton.attr("data-link", link);
        saveButton.attr("data-tag", tag);
        saveButton.text("Save Recipe");
        cardBody.append(saveButton);
        card.append(cardImg, cardBody, cardListGroup, cardFooter);
        articlesDiv.append(card);
      }
    }
  }

  // Click handler for save button
  $('#articles').on("click", ".save-button", function (event) {
    console.log("Save button clicky");
    var button = $(this);
    var title = $(this).attr("data-title");
    var img = $(this).attr("data-img");
    var link = $(this).attr("data-link");
    var tag = $(this).attr("data-tag");
    // Run a POST request to save the recipe
    $.ajax({
      method: "POST",
      url: "/recipes/save",
      data: {
        title: title,
        img: img,
        link: link,
        tag: tag
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

  var displaySavedRecipes = function () {
    articlesDiv.empty();
    var queryURL = "/recipes";
    $.getJSON(queryURL, function (data) {
      console.log("data.length: ", data.length);
      console.log("data: ", data);
      if (data.length == 0) {
        articlesDiv.html("<p>There are no saved recipes.</p>");
      } else {
        for (let i = 0; i < data.length; i++) {
          var title = data[i].title;
          var img = data[i].img;
          var link = data[i].link;
          var id = data[i]._id;
          var tag = data[i].tag;
          var description = data[i].description;
          var tag = data[i].tag;

          let card = $('<div class="card">');
          let cardImg = $('<img class="card-img-top">');
          cardImg.attr("src", img);
          cardImg.attr("alt", title);
          let cardBody = $('<div class="card-body">');

          let cardTitle = $('<h5 class="card-title">');
          cardTitle.text(title);

          let cardFooter = $('<div class="card-footer">');
          let cardUpdated = $('<small class="text-muted">');
          cardUpdated.append('Tags: <span class="keto badge badge-info">' + tag + '</span>');
          cardFooter.append(cardUpdated);

          cardBody.append(cardTitle);
          if (description) {
            let cardDescription = $('<p class="card-text">');
            cardDescription.text(data[i].description);
            cardBody.append(cardDescription);
          }
          let cardListGroup = $('<ul class="list-group  list-group-flush">');
          let cardListItemLink = $('<li class="list-group-item">');
          let cardLink = $('<a class="card-link" target="_blank">');
          cardLink.attr("href", link);
          cardLink.text("View Recipe");
          cardListItemLink.append(cardLink);
          cardListGroup.append(cardListItemLink);

          let notesButton = $('<button class="btn">');
          notesButton.attr("id", id);
          notesButton.attr("data-title", title);
          notesButton.attr("data-img", img);
          notesButton.attr("data-link", link);
          if (data[i].note) {
            console.log("Yes there's a note");
            notesButton.addClass("btn-success");
            notesButton.addClass("notes-view-button");
            notesButton.attr("data-noteid", data[i].note);
            notesButton.text("View Note");
          } else {
            notesButton.addClass("notes-button");
            notesButton.addClass("btn-primary");
            notesButton.text("Make a Note");
          }
          card.append(cardImg, cardBody, cardListGroup, cardFooter, notesButton);
          articlesDiv.append(card);

        }
      }
    });
  }

  // Click handler for Make a Note button
  $('#articles').on("click", ".notes-button", function (event) {
    console.log("Notes button clicky");
    var recipeDiv = $(this).parent();
    var id = $(this).attr("id");
    var noteWrapper = $('<div class="note">');
    let noteText = $('<p class="card-text">');
    noteText.text("Recipe notes:");
    var titleinput = $('<input id="titleinput" class="form-control" type="text">');
    var bodyinput = $('<input id="bodyinput" class="form-control" type="text">');
    $(this).attr("disabled", "disabled");
    var notesavebutton = $('<button class="notes-save-button btn btn-primary" id="' + id + '">Save Note</button>');
    noteWrapper.append(noteText, titleinput, bodyinput, notesavebutton);
    recipeDiv.append(noteWrapper);
  });

  // Click handler for View Note button
  $('#articles').on("click", ".notes-view-button", function (event) {
    console.log("Notes view button clicky");
    $(this).attr("disabled", "disabled");

    var recipeDiv = $(this).parent();
    var noteDiv = $('<div class="note-display">');
    var noteId = $(this).attr("data-noteid");

    // Grab the notes from the db as a json
    var queryURL = "/notes/" + noteId;
    console.log("queryURL: ", queryURL);
    $.getJSON(queryURL, function (data) {
      console.log("data", data);
      if (data) {
        console.log("Notes data: ", data);
        var note = $('<div class="note">');

        var noteTitle = data.title;
        let noteTitleP = $('<p>' + noteTitle + '</p>');
        // noteTitleP.text(noteTitle);

        var noteBody = data.body;
        let noteBodyP = $('<p>' + noteBody + '</p>');

        let noteText = $('<p class="card-text">Recipe notes:</p>');
        // noteText.text("Recipe notes:");
        // noteBodyP.text(noteBody);
        note.append(noteText, noteTitleP, noteBodyP);
        recipeDiv.append(note);
      } else {
        console.log("No data", data);
      }
    });
    // recipeDiv.append(noteDiv);
  });

  // Click handler for save note button
  $('#articles').on("click", ".notes-save-button", function (event) {
    console.log("Notes save button clicky");
    var parent = $(this).parent();
    var button = $(this);
    var id = $(this).attr("id");
    var title = $("#titleinput").val();
    var body = $("#bodyinput").val();
    var data = { title: title, body: body, recipeid: id };
    console.log("data: ", data);

    // Run a POST request to add a note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/recipes/" + id,
      data: data
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log("postdata: ", data);
        button.text("Saved note!");
        button.attr("disabled", "disabled");
        parent.children("input").attr("disabled", "disabled");
        parent.children("input").attr("id", "disabledInput");
      });
  });


});

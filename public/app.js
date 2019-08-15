$(document).ready(function () {

  var articlesDiv = $("#articles");
  var contentTitleDiv = $('#content-title');

  var selectDiv = $('<div id="select-div">');

  var pageState = 0;
  var pageStateDiv = $('#page-state');
  pageStateDiv.text(pageState);

  $(function () {
    $("#menu").menu(
      {
        classes: {
          "ui-menu": "unstyled"
        }
      }
    );
  });

  $(function () {
    $("#dialog").dialog();
  });

  var refreshContent = function (pageState, categoryName, scrapeURL) {
    if (pageState == 0) {
      selectDiv.text("Instructions: select a topic in the left menu.");
      contentTitleDiv.prepend(selectDiv);
    } else if (pageState == 1 || pageState == 2 || pageState == 3) {
      var scrapeButton = $('<button class="scrape-button btn btn-primary">');
      scrapeButton.val(scrapeURL);
      scrapeButton.text("Scrape this");
      selectDiv.empty();
      selectDiv.html("<h3>" + categoryName + "</h3><br>");
      selectDiv.append(scrapeButton);
      contentTitleDiv.prepend(selectDiv);
    }
  };

  var initializeContent = function (pageState) {
    if (pageState === 0) {
      selectDiv.text("Instructions: select a topic in the left menu.");
      contentTitleDiv.prepend(selectDiv);
    }
  };

  initializeContent(0);

  // Click Handlers
  $('.content-link').on("click", function (event) {

    $(".content-link.active").removeClass("active");

    $(this).addClass("active");


    $('nav').find("a.content-link")
    $(this).addClass("active");
    var state = $(this).attr("data-pageState");
    pageState = state;
    var categoryName = $(this).attr("data-categoryName");
    var scrapeURL = $(this).attr("data-scrapeURL");
    pageStateDiv.html(pageState + " " + categoryName + " " + scrapeURL);
    refreshContent(pageState, categoryName, scrapeURL);
  });

  contentTitleDiv.on("click", ".scrape-button", function (event) {
    console.log("Clicky");

    var scrapeURL = $(this).val();

    // disable button
    $(this).addClass("disabled");
    $(this).attr("disabled", "disabled");

    $.getJSON(scrapeURL, function (json) {
      if (json) {
        console.log("json: ", json);

        // articlesDiv.empty();
        // for (let i = 0; i < json.length; i++) {
        //   // console.log("json: ", json[i]);
        //   var articleWrap = $('<div class="art">');
        //   var articleTitle = json[i].title;
        //   var articleLink = json[i].link;
        //   var articleImg = json[i].img;

        //   articleWrap.html("<h6><a href='#'>" + articleTitle + "</a></h6>" + "<a href='" + articleLink + "' target='_blank'>Link</a>" + "<img src='" + articleImg + "'>");

        //   articlesDiv.append(articleWrap);
        // }
      }
    });

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


  // Whenever someone clicks a p tag
  $(document).on("click", "p", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      // url: "/articles/" + thisId
      url: selectMenuOptionState + "/" + thisId
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });

  // When you click the savenote button
  $(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

});
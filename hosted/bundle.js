"use strict";

var handleGamer = function handleGamer(e) {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  if ($("#gamerName").val() == '' || $("#gamerRecommend").val() == 0 || $("#gamerReview").val() == '') {
    handleError("All fields are required.");
    return false;
  } else if (document.querySelectorAll('.gamer').length >= 6) {
    handleError("Upgrade to premium to continue posting.");
    return false;
  }

  sendAjax('POST', $("#gamerForm").attr("action"), $("#gamerForm").serialize(), function () {
    loadGamersFromServer();
  });

  return false;
};

var handleSearch = function handleSearch(e) {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  if ($("#gamerName").val() == '') {
    handleError("Please enter a game title to search.");
    return false;
  }

  sendAjax('POST', $("#searchForm").attr("action"), $("#searchForm").serialize(), function () {
    loadGamersFromServer();
  });

  return false;
};

var handleUserSearch = function handleUserSearch(e) {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  if ($("#gamerName").val() == '') {
    handleError("Please enter a username to search.");
    return false;
  }

  sendAjax('POST', $("#searchUserForm").attr("action"), $("#searchUserForm").serialize(), function () {
    loadGamersFromServer();
  });

  return false;
};

var GamerForm = function GamerForm(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "form",
      { id: "gamerForm",
        name: "gamerForm",
        onSubmit: handleGamer,
        action: "/review",
        method: "POST",
        className: "gamerForm"
      },
      React.createElement("input", { id: "gamerName", type: "text", name: "name", placeholder: "Game Title" }),
      React.createElement(
        "select",
        { id: "gamerRecommend", type: "select", name: "recommend" },
        React.createElement(
          "option",
          { value: "0" },
          "Recommend"
        ),
        React.createElement(
          "option",
          { value: "yes" },
          "Yes"
        ),
        React.createElement(
          "option",
          { value: "no" },
          "No"
        )
      ),
      React.createElement("textarea", { id: "gamerReview", type: "text", name: "review", rows: "5", cols: "50", placeholder: "Review..." }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "makeGamerSubmit", type: "submit", value: "Post Review" })
    )
  );
};

var PassChangeForm = function PassChangeForm(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "form",
      { id: "changePassForm",
        name: "changePassForm",
        onSubmit: passChange,
        action: "/changePass",
        method: "POST",
        className: "changePassForm"
      },
      React.createElement(
        "div",
        { className: "input-item" },
        React.createElement("input", { id: "currentPass", type: "password", name: "currentPass", placeholder: "Current password" }),
        React.createElement(
          "label",
          { className: "input-label", htmlFor: "currentPass" },
          "Current Password: "
        )
      ),
      React.createElement(
        "div",
        { className: "input-item" },
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "New password" }),
        React.createElement(
          "label",
          { className: "input-label", htmlFor: "pass" },
          "New Password: "
        )
      ),
      React.createElement(
        "div",
        { className: "input-item" },
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "Retype password" }),
        React.createElement(
          "label",
          { className: "input-label", htmlFor: "pass2" },
          "Retype New Password: "
        )
      ),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "Change Password" })
    )
  );
};

var SearchForm = function SearchForm(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "form",
      { id: "searchForm",
        name: "searchForm",
        onSubmit: handleSearch,
        action: "/getReviews",
        method: "POST",
        className: "searchForm"
      },
      React.createElement("input", { id: "gamerName", type: "text", name: "name", placeholder: "Game Title" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "searchGamerSubmit", type: "submit", value: "Search" })
    )
  );
};

var SearchUserForm = function SearchUserForm(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "form",
      { id: "searchUserForm",
        name: "searchUserForm",
        onSubmit: handleUserSearch,
        action: "/getReviews",
        method: "POST",
        className: "searchUserForm"
      },
      React.createElement("input", { id: "gamerName", type: "text", name: "name", placeholder: "Username" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "searchGamerSubmit", type: "submit", value: "Search" })
    )
  );
};

var GamerList = function GamerList(props) {
  if (props.gamers.length === 0) {
    return React.createElement(
      "div",
      { className: "gamerList" },
      React.createElement(
        "h3",
        { className: "emptyGamer" },
        "No reviews posted"
      )
    );
  }

  var gamerNodes = props.gamers.map(function (gamer) {
    return React.createElement(
      "div",
      { key: gamer._id, className: "gamer" },
      React.createElement("img", { src: "/assets/img/gamerface.jpeg", alt: "gamer face", className: "gamerFace" }),
      React.createElement(
        "h3",
        { className: "gamerName" },
        " ",
        gamer.name,
        " "
      ),
      React.createElement(
        "h3",
        { className: "gamerRecommend" },
        " Recommended: ",
        gamer.recommend,
        " "
      ),
      React.createElement(
        "h3",
        { className: "gamerReview" },
        " ",
        gamer.review,
        " "
      ),
      React.createElement(
        "button",
        { onclick: "/deleteReview" },
        "Delete"
      )
    );
  });

  return React.createElement(
    "div",
    { classname: "gamerList" },
    gamerNodes
  );
};

var loadGamersFromServer = function loadGamersFromServer() {
  var URL = window.location.href;
  URL = URL.substr(URL.length - 4);

  // Home page
  if (URL == "home") {
    sendAjax('GET', '/getRecentGamers', null, function (data) {
      ReactDOM.render(React.createElement(GamerList, { gamers: data.gamers }), document.querySelector("#gamers"));
    });
    // Account page
  } else if (URL == "ount") {
    sendAjax('GET', '/getGamers', null, function (data) {
      ReactDOM.render(React.createElement(GamerList, { gamers: data.gamers }), document.querySelector("#gamers"));
    });
    // Search page
  } else if (URL == "arch") {
    sendAjax('GET', '/getReviews', null, function (data) {
      ReactDOM.render(React.createElement(GamerList, { gamers: data.gamers }), document.querySelector("#gamers"));
    });
  }
};

var setup = function setup(csrf) {
  var URL = window.location.href;
  URL = URL.substr(URL.length - 4);

  // Account page
  if (URL == "ount") {
    ReactDOM.render(React.createElement(PassChangeForm, { csrf: csrf }), document.querySelector("#passChangeSection"));
    ReactDOM.render(React.createElement(GamerForm, { csrf: csrf }), document.querySelector("#makeGamer"));
    loadGamersFromServer();
  }

  // Search page
  if (URL == "arch") {
    ReactDOM.render(React.createElement(SearchForm, { csrf: csrf }), document.querySelector("#searchGamer"));
    loadGamersFromServer();
  }

  // If account, home or search page
  if (URL == "ount" || URL == "home" || URL == "arch") {
    ReactDOM.render(React.createElement(GamerList, { gamers: [] }), document.querySelector("#gamers"));
    loadGamersFromServer();
  }
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

var CheckGamer = function CheckGamer(props) {
  if (props.gamers.length === 0) {
    return true;
  }
  return false;
};

var passChange = function passChange(e) {
  e.preventDefault();

  if ($("#pass").val() == '' || $("#pass2").val() == '' || $("#currentPass").val() == '') {
    handleError("All fields required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("The new passwords don't match");
    return false;
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), function (result) {
    handleError(result.message);
  }, function (xhr, status, error) {
    var messageObj = JSON.parse(xhr.responseText);
    handleError(messageObj.error);
  });

  return false;
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#gamerMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#gamerMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

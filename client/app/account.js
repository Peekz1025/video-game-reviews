let number = 0;
let csurfToken;


const handleGamer = (e) => {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  if ($("#gamerName").val() == '' || $("#gamerRecommend").val() == 0 || $("#gamerReview").val() == '') {
    handleError("All fields are required.");
    return false;
  }
  else if (document.querySelectorAll('.gamer').length >= 6) {
    handleError("Upgrade to premium to continue posting.");
    return false;
  }

  sendAjax('POST', $("#gamerForm").attr("action"), $("#gamerForm").serialize(), function () {
    loadGamersFromServer();
  });

  return false;
};

const handleSearch = (e) => {
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

const handleUserSearch = (e) => {
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

const handleDelete = (e) => {
  e.preventDefault();

  $("#gamerMessage").animate({ width: 'hide' }, 350);

  sendAjax('POST', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {
    console.log("hi!");
    loadGamersFromServer();
  });

  return false;
};

const GamerForm = (props) => {
  return (
    <div>
      <form id="gamerForm"
        name="gamerForm"
        onSubmit={handleGamer}
        action="/review"
        method="POST"
        className="gamerForm"
      >
        <input id="gamerName" type="text" name="name" placeholder="Game Title" />

        <select id="gamerRecommend" type="select" name="recommend">
          <option value="0">Recommend</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <textarea id="gamerReview" type="text" name="review" rows="5" cols="50" placeholder="Review..." />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeGamerSubmit" type="submit" value="Post Review" />
      </form>
    </div>
  );
};

const UpdateAccountForm = (props) => {
  return (
    <div id="updateAccountBox" >
      <form id="changePassForm"
        name="changePassForm"
        onSubmit={passChange}
        action="/changePass"
        method="POST"
        className="changePassForm"
      >
        <div id="boxContainer">
          <div id="box">
            <div className="input-item">
                <input id="currentPass" type="password" name ="currentPass" placeholder="Current password"/>
                <label className="input-label" htmlFor="currentPass"></label>
            </div>

            <div className="input-item">
                <input id="pass" type="password" name ="pass" placeholder="New password"/>
                <label className="input-label" htmlFor="pass"></label>
            </div>

            <div className="input-item">
                <input id="pass2" type="password" name ="pass2" placeholder="Retype password"/>
                <label className="input-label" htmlFor="pass2"></label>
            </div>

            <input type="hidden" name="_csrf" value={props.csrf} />
            <input id="submitCard" type="submit" value="Change Password"/>
          </div>
        </div>
          </form>
      
      <div id="boxContainer">
        <div id="box">
          <input id="creditcardboxes" type="text" placeholder="Credit Card Name" disabled></input>
          <input id="creditcardboxes" type="text" placeholder="Credit Card Number" disabled></input>
          <input id="creditcardboxes" type="text" placeholder="CVV" disabled></input>
          <input id="creditcardboxes" type="text" placeholder="Exp Date" disabled></input>
          <button id="submitCard" disabled>Submit</button>
          <input type="hidden" name="_csrf" value={props.csrf} />
        </div>
      </div>
      
    </div>
  );
};

const SearchForm = (props) => {
  return (
    <div>
      <form id="searchForm"
        name="searchForm"
        onSubmit={handleSearch}
        action="/getReviews"
        method="POST"
        className="searchForm"
      >
        <input id="gamerName" type="text" name="name" placeholder="Game Title" />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="searchGamerSubmit" type="submit" value="Search" />
      </form>
    </div>
  );
};

const SearchUserForm = (props) => {
  return (
    <div>
      <form id="searchUserForm"
        name="searchUserForm"
        onSubmit={handleUserSearch}
        action="/getReviews"
        method="POST"
        className="searchUserForm"
      >
        <input id="gamerName" type="text" name="name" placeholder="Username" />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="searchGamerSubmit" type="submit" value="Search" />
      </form>
    </div>
  );
};

const GamerList = function (props) {
  if (props.gamers.length === 0) {
    return (
      <div className="gamerList">
        <h3 className="emptyGamer">No reviews posted</h3>
      </div>
    );
  }
  
  let number = 0;

  const gamerNodes = props.gamers.map(function (gamer) {
    number += 1;
    return (
      <div key={gamer._id} className="gamer">
        <img src="/assets/img/gamerface.jpeg" alt="gamer face" className="gamerFace" />
        <h3 className="gamerName"> {gamer.name} </h3>
        <h3 className="gamerRecommend"> Recommended: {gamer.recommend} </h3>
        <h3 className="gamerReview"> {gamer.review} </h3>
        
        <form id={"delForm" + number} onSubmit={handleDelete} name="delForm" action="/deleteReview" method="POST">
          <input type="hidden" name="_csrf" value={csurfToken}/>
          <input name="gamerid" type="hidden" value={gamer._id}/>
          <button id="submitCard" type="submit" title="Delete Review">Delete Review</button>
        </form>
        
      </div>
    );
  });

  return (
    <div classname="gamerList">
      {gamerNodes}
    </div>
  );
};

const loadGamersFromServer = () => {
  let URL = window.location.href;
  URL = URL.substr(URL.length - 4);

  // Home page
  if (URL == "home") {
    sendAjax('GET', '/getRecentGamers', null, (data) => {
      ReactDOM.render(
        <GamerList gamers={data.gamers} />, document.querySelector("#gamers")
      );
    });
    // Account page
  } else if (URL == "ount") {
    sendAjax('GET', '/getGamers', null, (data) => {
      ReactDOM.render(
        <GamerList gamers={data.gamers} />, document.querySelector("#gamers")
      );
    });
    // Search page
  } else if (URL == "arch") {
    sendAjax('GET', '/getReviews', null, (data) => {
      ReactDOM.render(
        <GamerList gamers={data.gamers} />, document.querySelector("#gamers")
      );
    });
  }
};

const setup = function (csrf) {
  let URL = window.location.href;
  URL = URL.substr(URL.length - 4);

  // Account page
  if (URL == "ount") {
    ReactDOM.render(
      <GamerForm csrf={csrf} />, document.querySelector("#makeGamer")
    );
    ReactDOM.render(
      <UpdateAccountForm csrf={csrf} />, document.querySelector("#passChangeSection")
    );
    loadGamersFromServer();
  }

  // Search page
  if (URL == "arch") {
    ReactDOM.render(
      <SearchForm csrf={csrf} />, document.querySelector("#searchGamer")
    );
    loadGamersFromServer();
  }

  // If account, home or search page
  if (URL == "ount" || URL == "home" || URL == "arch") {
    ReactDOM.render(
      <GamerList gamers={[]} />, document.querySelector("#gamers")
    );
    loadGamersFromServer();
  }
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    csurfToken = result.csrfToken;
    setup(result.csrfToken);
  });
};

const CheckGamer = function (props) {
  if (props.gamers.length === 0) {
    return true;
  }
  return false;
};

const passChange = (e) =>{
    e.preventDefault();
    
    if( $("#pass").val() == '' || $("#pass2").val() == '' || $("#currentPass").val() == '') {
        handleError("All fields required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("The new passwords don't match");
        return false;
    }
    
    sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(),
    (result)=>{
        handleError(result.message);
    }, 
    (xhr, status, error) =>{
        var messageObj = JSON.parse(xhr.responseText);
        handleError(messageObj.error);
    });
    
    return false;
};

$(document).ready(function () {
  getToken();
});
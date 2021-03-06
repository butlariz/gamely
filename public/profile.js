var PROFILE_ID = findProfileId();

$(document).ready(function(){
  loadNameProfile();

  // Carregar postagens
  database.ref("posts/" + PROFILE_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        $(".input-list").prepend(`
          <li>
            <div data-task-id=${childKey} />
              <span>${childData.text}</span>
              <footer>
              <button data-btn-id="btn-${childKey}"> <i class="far fa-trash-alt"></i>  </button>
              <button data-edit-id="edit-${childKey}" value="change"> <i class="fas fa-pencil-alt"></i> </button>
              </footer>
            </div>
          </li>`);
        $(`button[data-btn-id="btn-${childKey}"]`).click(function(){
          database.ref("posts/" + PROFILE_ID + "/" + childKey).remove();
          $(this).parent().remove();
        })
      editPost(childKey);
    });
  });
});

function findProfileId() {
  if (window.location.search.match(/\&profile=(.*)&/)) {
    return window.location.search.match(/\&profile=(.*)&/)[1]
  } else {
    return window.location.search.match(/\?id=(.*?)&/)[1];
  }
}

//Carregar nome 
function loadNameProfile(){
  database.ref("games/" + PROFILE_ID).once('value')
  .then(function(snapshot) {
    if (snapshot.val() != null) {
      var username = (snapshot.val().name);  
      var textDescription = (snapshot.val().description);
      $("#profile-name").text(username);
      $("#profile-description").text(textDescription);
    } else {
      database.ref("users/" + PROFILE_ID).once('value')
      .then(function(snapshot) {
        var username = (snapshot.val().name);  
        $("#profile-name").text(username);
        loadAnotherUsers()
      });
    }
  });

  //Carregar bottão follow ou unfollow
  if (USER_ID != PROFILE_ID) {
    console.log("é diferente");
    database.ref("followers/" + PROFILE_ID).once('value')
    .then(function(snapshot) {
      var allFollowers = [];
      var userFollow;
      var btnProfile = $(".profile-button");
      if (snapshot.val() == null) {
        btnProfile.text("+ Follow");
        btnProfile.addClass("follow");
        loadButton();
      } else {
        allFollowers.push(snapshot.val().follower);
        console.log("seguidores: " + allFollowers);
        $.each(allFollowers, function(index, followerID){
          if(followerID == USER_ID) {
            btnProfile.text("- Unfollow");
            btnProfile.addClass("unfollow");
            loadButton();
          } else { 
            btnProfile.text("+ Follow");
            btnProfile.addClass("follow");
            loadButton();
          }
        });
      }
    });
  }
}

function loadButton(){
  if ($(".follow")[0]){
    console.log("botao follow existe")
    // Botão Follow
    $(".follow").click(function() {
      console.log("cliquei em seguir")
      event.preventDefault();
      var userFollowers = database.ref("followers/" + PROFILE_ID).push({
        follower: USER_ID
      });
      $(this).text("- Unfollow");
      $(this).addClass("unfollow");
      $(this).removeClass("follow")
    });
  }
  if ($(".unfollow")[0]){
    // Botão Unfollow 
    $(".unfollow").click(function() {
      event.preventDefault();
      var userFollowers = database.ref("followers/" + PROFILE_ID).remove();
      $(this).text("+ Follow");
      $(this).addClass("follow");
      $(this).removeClass("unfollow")
    });
  }
}

$(".publish").click(function(event){
  event.preventDefault();
  var newPost = $(".publish-input").val();
  console.log(newTagGame);
  if (newTagGame != "") {
    var postFromDB = database.ref("posts/" + USER_ID).push({
      text: newPost,
    });
  } else {
    var postFromDB = database.ref("posts/" + USER_ID).push({
      text: newPost
    });
  }
  $(".input-list").prepend(`
  <li>
    <div data-post-id="${postFromDB.key}">
      <span id="span-post-${postFromDB.key}">${newPost}</span>
      <footer>
      <button data-btn-id="btn-${postFromDB.key}"> <i class="far fa-trash-alt"></i> </button>
      <button data-edit-id="edit-${postFromDB.key}" value="change"> <i class="fas fa-pencil-alt"></i> </button>
      </footer>
    </div>
  </li>`);


  $(`button[data-btn-id="btn-${postFromDB.key}"]`).click(function(){
    database.ref("posts/" + USER_ID + "/" + postFromDB.key).remove();
    $(this).parent().remove();
  });

  editPost(postFromDB.key);
});

// Chamar outros perfis cadastrados
function loadAnotherUsers(){
  $(".other-profiles").append("<h2>Encontre outros jogadores: </h2>");
  database.ref("users/").once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var otherUsersID = childSnapshot.key;
        var otherUsersNames = childSnapshot.val().name;
        var url = window.location.href + 'profile=' + otherUsersID;
        $(".other-profiles").append("<li><a href='" + url + "'>" + otherUsersNames + "</a></li>");
    });
  });
}
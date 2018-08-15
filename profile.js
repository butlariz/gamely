var PROFILE_ID = findProfileId();

$(document).ready(function(){
  console.log(USER_ID);
  console.log(PROFILE_ID)
  loadNameProfile();
  loadButton();

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
              <footer><button data-btn-id="btn-${childKey}"> Delete </button></footer>
            </div>
          </li>`);
        $(`button[data-btn-id="btn-${childKey}"]`).click(function(){
          database.ref("posts/" + PROFILE_ID + "/" + childKey).remove();
          $(this).parent().remove();
        })
    });
  });

  // Testes outros perfis
  $(".isa").click(function() {
    window.location = window.location.href + 'profile=' + 'gAlDnXkmPtXqfqZcAzZRZBkWRnJ2';
  });

  $(".lari").click(function() {
    window.location = window.location.href + 'profile=' + 'kn5DOxGCXPWcu9mUyO86uDqbe642';
  });
});

function findProfileId() {
  if (window.location.search.match(/\&profile=(.*)/)) {
    return window.location.search.match(/\&profile=(.*)/)[1]
  } else {
    return window.location.search.match(/\?id=(.*?)&/)[1];
  }
}

//Carregar nome 
function loadNameProfile(){
  database.ref("users/" + PROFILE_ID).once('value')
  .then(function(snapshot) {
    var username = (snapshot.val().name) || "Anonymous"
    console.log(username);
    $("#profile-name").text(username);
  });

  //Carregar bottão follow ou unfollow
  database.ref("followers/" + PROFILE_ID).once('value')
  .then(function(snapshot) {
    var allFollowers = [];
    var userFollow;
    var btnProfile = $(".profile-button");
    allFollowers.push(snapshot.val().follower);
    console.log(allFollowers);
    $.each(allFollowers, function(index, followerID){
      if(followerID == USER_ID) {
        btnProfile.text("- Unfollow");
        btnProfile.addClass("unfollow");
      } else { 
        btnProfile.text("+ Follow");
        btnProfile.addClass("follow");
      }
    });
  });
}

function loadButton(){
  console.log("função loadButton");
  if ($(".follow")[0]){
    // Botão Follow
    $(".follow").click(function() {
      event.preventDefault();
      console.log("entrou no follow");
      var userFollowers = database.ref("followers/" + PROFILE_ID).set({
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
      console.log("entrou no unfollow");
      var userFollowers = database.ref("followers/" + PROFILE_ID).remove({
        follower: USER_ID
      });
      $(this).text("+ Follow");
      $(this).addClass("follow");
      $(this).removeClass("unfollow")
    });
  }
}
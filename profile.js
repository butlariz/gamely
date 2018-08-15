var PROFILE_ID = findProfileId();

$(document).ready(function(){
  console.log(USER_ID);
  console.log(PROFILE_ID)
  loadNameProfile();

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
      allFollowers.push(snapshot.val().follower);
      console.log(allFollowers);
      $.each(allFollowers, function(index, followerID){
        if(followerID == USER_ID) {
          $(".profile-button").text("- Unfollow");
        }
      });
    });
  }

  // Botão Seguir
  $(".profile-button").click(function() {
    event.preventDefault();
    var userFollowers = database.ref("followers/" + PROFILE_ID).set({
      follower: USER_ID
    });
    $(this).text("- Unfollow");
  });

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
var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*?)&/)[1];
console.log(USER_ID)
var PROFILE_ID = findProfileId();

$(document).ready(function(){
  console.log(USER_ID);
  console.log(PROFILE_ID)
  loadNameProfile();
  loadNameUser();

  //Carregar nome 
  function loadNameProfile(){
    database.ref("users/" + PROFILE_ID).once('value')
    .then(function(snapshot) {
      var username = (snapshot.val().name) || "Anonymous"
      console.log(username);
      $("#profile-name").text(username);
    });
  }

  function loadNameUser(){
    database.ref("users/" + USER_ID).once('value')
    .then(function(snapshot) {
      var username = (snapshot.val().name) || "Anonymous"
      console.log(username);
      $(".a-user-profile").text(username);
    });
  }

  // Carregar postagens
  database.ref("posts/" + PROFILE_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        $(".input-list").append(`
          <li>
            <div data-task-id=${childKey} />
              <span>${childData.text}</span>
              <button data-btn-id="btn-${childKey}"> Delete </button>
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

  // Links do menu
  $(".a-home").click(function() {
    window.location = "home.html?id=" + USER_ID + "&";
  });

  $(".a-user-profile").click(function() {
    window.location = "profile.html?id=" + USER_ID + "&";
  });

});

function findProfileId() {
  if (window.location.search.match(/\&profile=(.*)/)) {
    return window.location.search.match(/\&profile=(.*)/)[1]
  } else {
    return window.location.search.match(/\?id=(.*?)&/)[1];
  }
}
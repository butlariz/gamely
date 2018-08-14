var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function(){
  console.log(USER_ID);

  //Carregar nome 
  database.ref("users/" + USER_ID).once('value')
  .then(function(snapshot) {
    var username = (snapshot.val().name) || "Anonymous"
    console.log(username);
    $("#profile-name").text(username)
  });

  // Carregar postagens
  database.ref("posts/" + USER_ID).once('value')
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
          database.ref("posts/" + USER_ID + "/" + childKey).remove();
          $(this).parent().remove();
        })
    });
  });

  $(".isa").click(function() {
    window.location = window.location.href + '&friend=' + 'gAlDnXkmPtXqfqZcAzZRZBkWRnJ2';
  });

  $(".lari").click(function() {
    window.location = window.location.href + '&friend=' + 'kn5DOxGCXPWcu9mUyO86uDqbe642';
  })
});
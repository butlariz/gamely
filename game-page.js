var PROFILE_ID = findProfileId();

$(document).ready(function(){
  console.log(USER_ID);
  console.log(PROFILE_ID);
  loadNameProfile();
  // loadButton();

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
  if (window.location.search.match(/\&profile=(.*)/)) {
    return window.location.search.match(/\&profile=(.*)/)[1]
  } else {
    return window.location.search.match(/\?id=(.*?)&/)[1];
  }
}

//Carregar nome 
function loadNameProfile(){
  database.ref("games/" + PROFILE_ID).once('value')
  .then(function(snapshot) {
    var username = (snapshot.val().name);
    var textDescription = (snapshot.val().description);
    console.log(textDescription);
    $("#profile-name").text(username);
    $("#profile-description").text(textDescription );
  });

  //Carregar bottão follow ou unfollow
  // database.ref("followers/" + PROFILE_ID).once('value')
  // .then(function(snapshot) {
  //   var allFollowers = [];
  //   var userFollow;
  //   var btnProfile = $(".profile-button");
  //   allFollowers.push(snapshot.val().follower);
  //   console.log(allFollowers);
  //   $.each(allFollowers, function(index, followerID){
  //     if(followerID == USER_ID) {
  //       btnProfile.text("- Unfollow");
  //       btnProfile.addClass("unfollow");
  //     } else { 
  //       btnProfile.text("+ Follow");
  //       btnProfile.addClass("follow");
  //     }
  //   });
  // });
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

$(".publish").click(function(event){
  event.preventDefault();
  var newPost = $(".publish-input").val();
  var postFromDB = database.ref("posts/" + USER_ID).push({
    text: newPost
  });
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
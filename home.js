var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function(){

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
          console.log("clicou")
          database.ref("posts/" + USER_ID + "/" + childKey).remove();
          $(this).parent().remove();
        })
    });
 
  });

  $(".publish").click(function(event){
    event.preventDefault();
    var newPost = $(".publish-input").val();
    var taskFromDB = database.ref("posts/" + USER_ID).push({
      text: newPost
    });
    $(".input-list").append(`
    <li>
    <div data-task-id=${taskFromDB.key} />
      <span>${newPost}</span>
      <button data-btn-id="btn-${taskFromDB.key}"> Delete </button>
    </div>
  </li>`);
    $(`button[data-btn-id="btn-${taskFromDB.key}"]`).click(function(){
      console.log("clicou")
      database.ref("posts/" + USER_ID + "/" + taskFromDB.key).remove();
      $(this).parent().remove();
    });

  });

  // $(".input-list").append("<li>"+newEureka+"</li>");
  
  
});
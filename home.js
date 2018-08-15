// var database = firebase.database();
// var USER_ID = window.location.search.match(/\?id=(.*)&/)[1];

$(document).ready(function(){
  database.ref("posts/" + USER_ID).once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        $(".input-list").prepend(`
          <li>
            <div data-task-id=${childKey} />
              <span id="span-post-${childKey}">${childData.text}</span>
              <footer>
              <button data-btn-id="btn-${childKey}"> <i class="far fa-trash-alt"></i> </button>
              <button data-edit-id="edit-${childKey}" value="change"> <i class="fas fa-pencil-alt"></i> </button>
              </footer>
            </div>
          </li>`);
        $(`button[data-btn-id="btn-${childKey}"]`).click(function(){
          database.ref("posts/" + USER_ID + "/" + childKey).remove();
          $(this).parent().remove();
        })
      editPost(childKey);
    });
  });

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

  function editPost(idPost) {
    // Função botão editar
    $('button[data-edit-id="edit-' + idPost + '"]').click(function(){
      var spanEdit = $('#span-post-' + idPost)[0];
      var btnEdit = $(this)[0];
        if (btnEdit.value === "change") {
          spanEdit.setAttribute("contenteditable","true");
          spanEdit.setAttribute("style","border:1px solid #ababab");
          btnEdit.value = "save";
          btnEdit.innerHTML = '<i class="far fa-save"></i>';
        } else if (btnEdit.value === "save"){
          spanEdit.removeAttribute("contenteditable");
          spanEdit.removeAttribute("style");
          btnEdit.value = "change";
          btnEdit.innerHTML = '<i class="fas fa-pencil-alt"></i>';
            // colocar texto no banco de dados
          btnEdit.click(function(){
            var newPost = spanEdit.val();
            var postFromDB = database.ref("posts/" + USER_ID + "/" + idPost).updates({
              text: newPost
            });
          })
        }
        return false;    
    });
  }
});
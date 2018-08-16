$(document).ready(function(){
  database.ref("posts/").once('value')
    .then(function(snapshot) {
      snapshot.forEach(function(snapshotID) {
        console.log(snapshotID.val())
        snapshotID.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          if(childData.type == "public") {
            $(".input-list").prepend(`
              <li>
                <div data-post-id=${childKey} />
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
        }
      });
    });
  });

  $(".publish").click(function(event){
    event.preventDefault();
    var filterType = $('input[name=filter]:checked').val(); 
    var newPost = $(".publish-input").val();
    if (!filterType) {
      alert("Selecione um filtro para a sua postagem");
    } else {
      var postFromDB = database.ref("posts/" + USER_ID).push({
        text: newPost,
        type: filterType
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

      // newPost.val("");
      $(`button[data-btn-id="btn-${postFromDB.key}"]`).click(function(){
        database.ref("posts/" + USER_ID + "/" + postFromDB.key).remove();
        $(`[data-post-id="${postFromDB.key}"]`).parent().remove();
      });

      editPost(postFromDB.key);
    }
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
          btnEdit.innerHTML = "<i class='far fa-save'></i>";
        } else if (btnEdit.value === "save"){
          spanEdit.removeAttribute("contenteditable");
          spanEdit.removeAttribute("style");
          btnEdit.value = "change";
          btnEdit.innerHTML = "<i class='fas fa-pencil-alt'></i>";
          //   colocar texto no banco de dados
            // btnEdit.click(function(){
            var newPost = spanEdit.textContent;
            var postFromDB = database.ref("posts/" + USER_ID + "/" + idPost).update({
              text: newPost
            });
          // })
        }
        return false;
    });
  }
});
var database = firebase.database();
var USER_ID = window.location.search.match(/\?id=(.*?)&/)[1];

$(document).ready(function(){
  loadNameUser();
});

//Carregar nome 
function loadNameUser(){
  database.ref("users/" + USER_ID).once('value')
  .then(function(snapshot) {
    var username = (snapshot.val().name) || "Anonymous"
    $(".a-user-profile").text("Olá, " + username);
  });
}

// Função botão editar
function editPost(idPost) {
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

// Links do menu
$(".a-home").click(function() {
  window.location = "home.html?id=" + USER_ID + "&";
});

$(".a-user-profile").click(function() {
  window.location = "profile.html?id=" + USER_ID + "&";
});
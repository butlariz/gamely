$(document).ready(function(){
  $(".sign-game-button").click(function(event){
    event.preventDefault();
    var newEmail = $(".sign-game-email").val();
    var newPassword = $(".sign-game-password").val();
    // Dados para cadastrar no banco
    var newName = $(".sign-game-name").val();
    var newCnpj = $(".sign-game-cnpj").val();
    var newDescription = $(".sign-game-description").val();
    // função de cadastro
    firebase.auth().createUserWithEmailAndPassword(newEmail, newPassword)
    .then(function(response){
      firebase.database().ref("games/" + response.user.uid).set({
        email: newEmail,
        name: newName,
        cnpj: newCnpj,
        description: newDescription
      });
      $("form").append("<span class='message'> Cadastrado com sucesso! </span>");
      // window.location = "home.html?id=" + response.user.uid + "&";
    })
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        $("form").append("<span class='message'>" + errorMessage + "</span>");
      });
  });

  $(".log-game-button").click(function(event){
    event.preventDefault();
    var email = $(".sign-game-email").val();
    var password = $(".sign-game-password").val();
    // função de login
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(response){
      window.location = "home.html?id=" + response.user.uid + "&";
    })
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        $("form").append("<span class='message'>" + errorMessage + "</span>");
      });
  });
});

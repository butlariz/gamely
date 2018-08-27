$(document).ready(function(){
  $(".sign-up-button").click(function(event){
    event.preventDefault();
    var newName = $(".sign-up-name").val();
    var newEmail = $(".sign-up-email").val();
    var newPassword = $(".sign-up-password").val();
    // função de cadastro
    firebase.auth().createUserWithEmailAndPassword(newEmail, newPassword)
    .then(function(response){
      firebase.database().ref("users/" + response.user.uid).set({
        email: newEmail,
        name: newName
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

  $(".log-in-button").click(function(event){
    event.preventDefault();
    var email = $(".sign-up-email").val();
    var password = $(".sign-up-password").val();
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

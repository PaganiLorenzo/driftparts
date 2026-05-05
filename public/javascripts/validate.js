function validateForm() {
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;

    if (password != confirm) {
      document.getElementById("password_error").innerHTML = "passowrd does not match";
      return false;
    }
    if (password.length < 8) {
      document.getElementById("password_error").innerHTML = "minimum 8 characters";
      return false;
    }
    else
      return true;
  }

function checkEmail(){
  
}

  
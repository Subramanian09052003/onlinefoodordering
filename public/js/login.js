function login(e) {
  e.preventDefault();

  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  if (username.length <= 0 || password.length <= 0) {
    return false;
  }
  let body = "username=" + username + "&password=" + password;
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {      
      if(this.status == 200) {
        sessionStorage.setItem("status", "loggedIn");
      displayLogInButtons();
      window.location.href = "/pages/menu.html";
      return true;
      }
      else {
        document.getElementById("failure-message").style.display = "flex";
      setTimeout(function () {
        document.getElementById("failure-message").style.display = "none";
      }, 3000);
      return false;
      }
    } 
  };
  xhttp.open("POST", "/login");
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(body);
}

function logout() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/logout");
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      sessionStorage.removeItem("status");
      displayLogInButtons();
      window.location.href = "/pages/home.html";
    }
  };
  xhttp.send();
}

function displayLogInButtons() {
  if (sessionStorage.getItem("status") != null) {
    document.getElementsByClassName("unauthenticated")[0].style.display =
      "none";
    document.getElementsByClassName("unauthenticated")[1].style.display =
      "none";
    document.getElementsByClassName("authenticated")[0].style.display = "block";
  } else {
    document.getElementsByClassName("unauthenticated")[0].style.display =
      "block";
    document.getElementsByClassName("unauthenticated")[1].style.display =
      "block";
    document.getElementsByClassName("authenticated")[0].style.display = "none";
  }
}

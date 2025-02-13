const baseURL = "http://smallproject.maudxd.online/API";
const extension = "php";

let id = 0;

function login() {
    id = 0;

    let username = document.getElementById("userField").value;
    let password = document.getElementById("passField").value;

    let credentials = { username: username, password: password };
    let jsonPayload = JSON.stringify(credentials);

    let URL = baseURL + "/Login." + extension;

    let request = new XMLHttpRequest();
    request.open("POST", URL, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObj = JSON.parse(request.responseText);
                id = jsonObj.userID;

                if (id < 1) {
                    let errormsg = jsonObj.error;
                    document.getElementById("error-message").innerHTML = errormsg;
                    return;
                }
                else {
                    document.getElementById("error-message").innerHTML = "Logged in!";
                    window.location.href = "contacts.html";
                    return;
                }
            }
        };
        request.send(jsonPayload);
    }
    catch (error) {
        document.getElementById("error-message").innerHTML = error.message;
    }
}

function register() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let credentials = { username: username, password: password };
    let jsonPayload = JSON.stringify(credentials);

    let URL = baseURL + "/CreateAccount." + extension;

    let request = new XMLHttpRequest();
    request.open("POST", URL, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObj = JSON.parse(request.responseText);
                id = jsonObj.userID;

                if (id < 1) {
                    let errormsg = jsonObj.error;
                    document.getElementById("error-message").innerHTML = errormsg;
                    return;
                }
                else {
                    document.getElementById("error-message").innerHTML = "Account created!";
                    window.location.href = "index.html";
                    return;
                }
            }
        };
        request.send(jsonPayload);
    }
    catch (error) {
        document.getElementById("error-message").innerHTML = error.message;
    }
}
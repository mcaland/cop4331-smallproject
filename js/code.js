const baseURL = "http://smallproject.maudxd.online/API";
const extension = "php";

let id = 0;
let contactID = 0;

function cache_id_as_cookie()
{
    document.cookie = "userID=" + id + ", contactID" + contactID;
}

function clear_cookie()
{
    document.cookie = "";
}

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
                    cache_id_as_cookie();
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

function search()
{
    id = parseInt(document.cookie.split(",")[0].split("=")[1]);
    let searchRequest = { userID: id, search: document.getElementById("searchInput").value };
    let jsonPayload = JSON.stringify(searchRequest);

    let URL = baseURL + "/SearchContact." + extension;

    let request = new XMLHttpRequest();
    request.open("POST", URL, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObj = JSON.parse(request.responseText);
                document.getElementById("contactsTableBody").innerHTML = "";

                for (let i = 0; i < jsonObj.length; i++)
                {
                    document.getElementById("contactsTableBody").innerHTML += "<tr id=\"" + jsonObj[i].split(" ")[0] + "\"> <td>" + jsonObj[i].split(" ")[1] + "</td> <td>" + jsonObj[i].split(" ")[2] + "</td> <td>" + jsonObj[i].split(" ")[3] + "</td> <td><button class=\"btn btn-primary mb-3\" data-bs-toggle=\"modal\" data-bs-target=\"#editContactModal\" onclick=\"load_contact(this.parentNode.id);\">Edit</button><td>";
                }
            }
        };
        request.send(jsonPayload);
    }
    catch (error) {
        document.getElementById("error-message").innerHTML = error.message;
    }
}

function add_contact()
{
    id = parseInt(document.cookie.split(",")[0].split("=")[1]);
    let addRequest = { userID: id, name: document.getElementById("name").value, email: document.getElementById("email").value, phoneNum: document.getElementById("phone").value };
    let jsonPayload = JSON.stringify(addRequest);

    let URL = baseURL + "/AddContact." + extension;

    let request = new XMLHttpRequest();
    request.open("POST", URL, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObj = JSON.parse(request.responseText);
                document.getElementById("contactsTableBody").innerHTML = "";

                // TODO: error on modal if it doesn't add

                search(); // update list just in case
                return;
            }
        };
        request.send(jsonPayload);
    }
    catch (error) {
        document.getElementById("error-message").innerHTML = error.message;
    }
}

function load_contact(parentID)
{
    contactID = parentID;
    cache_id_as_cookie();
}

function edit_contact()
{
    let contactID = id = parseInt(document.cookie.split(",")[1].split("=")[1]);;
    let editRequest = { contactID: contactID, newName: document.getElementById("editName").value, newEmail: document.getElementById("editEmail").value, newPhoneNum: document.getElementById("editPhone").value };
    let jsonPayload = JSON.stringify(editRequest);

    let URL = baseURL + "/ModifyContact." + extension;

    let request = new XMLHttpRequest();
    request.open("POST", URL, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObj = JSON.parse(request.responseText);
                document.getElementById("contactsTableBody").innerHTML = "";

                // TODO: error on modal if it doesn't edit

                search(); // update list just in case
                return;
            }
        };
        request.send(jsonPayload);
    }
    catch (error) {
        document.getElementById("error-message").innerHTML = error.message;
    }
}
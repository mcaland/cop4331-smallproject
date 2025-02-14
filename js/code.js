const baseURL = "http://smallproject.maudxd.online/API";
const extension = "php";

let id = 0;
let contactID = 0;

function cache_id_as_cookie()
{
    document.cookie = "userID=" + id;
    document.cookie =  "contactID=" + contactID;
}

function clear_cookie()
{
    document.cookie = "userID=" + -1;
    document.cookie = "contactID=" + -1;
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
    id = parseInt(document.cookie.split(";")[0].split("=")[1].trim());
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

                for (let i = 0; i < jsonObj.results.length; i++)
                {
                    let row = document.getElementById("contactsTableBody").insertRow()
                    row.id = parseInt(jsonObj.results[i].split(";")[0].trim());

                    let nameCell = row.insertCell(0);
                    let emailCell = row.insertCell(1);
                    let phoneCell = row.insertCell(2);
                    let actionCell = row.insertCell(3);

                    nameCell.innerHTML = jsonObj.results[i].split(";")[1].trim();
                    emailCell.innerHTML = jsonObj.results[i].split(";")[2].trim();
                    phoneCell.innerHTML = jsonObj.results[i].split(";")[3].trim();

                    let params = "'" + jsonObj.results[i].split(";")[1].trim().trim() + "', '" + jsonObj.results[i].split(";")[2].trim() + "', '" + jsonObj.results[i].split(";")[3].trim() + "'";

                    actionCell.innerHTML += "<button class=\"btn btn-primary mb-3\" data-bs-toggle=\"modal\" data-bs-target=\"#editContactModal\" onclick=\"load_edit_contact(" + params + ");\">Edit</button>\n" + "<button class=\"btn btn-primary mb-3\" style=\"background-color: red;\" data-bs-toggle=\"modal\" onclick=\"delete_wrapper(" + params + ");\">Delete</button>";
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
    id = parseInt(document.cookie.split(";")[0].split("=")[1].trim());
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

                document.getElementById("name").value = "";
                document.getElementById("email").value = "";
                document.getElementById("phone").value = "";

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

function load_edit_contact(name, email, phone)
{
    document.getElementById("editName").value = name;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPhone").value = phone;

    let URL = baseURL + "/SearchContact." + extension;

    let request = new XMLHttpRequest();
    request.open("POST", URL, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObj = JSON.parse(request.responseText);

                contactID = -1;

                for (let i = 0; i < jsonObj.results.length; i++)
                {
                    if (jsonObj.results[i].split(";")[1].trim() == name && jsonObj.results[i].split(";")[2].trim() == email && jsonObj.results[i].split(";")[3].trim() == phone)
                    {
                        contactID = parseInt(jsonObj.results[i].split(";")[0].trim());
                    }
                }

                cache_id_as_cookie();
            }
        };
        request.send(jsonPayload);
    }
    catch (error) {
        document.getElementById("error-message").innerHTML = error.message;
    }

    document.getElementById("editContactForm").setAttribute("onsubmit", "load_contact(" + name + ", " + email + ", " + phone + ", " + "'edit'" + ");");
}

// TODO: change function name
function load_contact(name, email, phone, action)
{
    let searchRequest = { userID: id, search: name };
    let jsonPayload = JSON.stringify(searchRequest);

    let URL = baseURL + "/SearchContact." + extension;

    let request = new XMLHttpRequest();
    request.open("POST", URL, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObj = JSON.parse(request.responseText);

                contactID = -1;

                for (let i = 0; i < jsonObj.results.length; i++)
                {
                    if (jsonObj.results[i].split(";")[1].trim() == name && jsonObj.results[i].split(";")[2].trim() == email && jsonObj.results[i].split(";")[3].trim() == phone)
                    {
                        contactID = parseInt(jsonObj.results[i].split(";")[0].trim());

                        console.log(action);

                        if (action == "delete")
                        {
                            delete_contact();
                        }
                        else if (action == "edit")
                        {
                            edit_contact();
                        }
                    }
                }

                cache_id_as_cookie();
            }
        };
        request.send(jsonPayload);
    }
    catch (error) {
        document.getElementById("error-message").innerHTML = error.message;
    }
}

function edit_contact()
{
    //contactID = parseInt(document.cookie.split(";")[1].split("=")[1].trim());
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

function delete_contact()
{
    //contactID = parseInt(document.cookie.split(";")[1].split("=")[1].trim());
    let deleteRequest = { contactID: contactID };
    let jsonPayload = JSON.stringify(deleteRequest);

    let URL = baseURL + "/DeleteContact." + extension;

    let request = new XMLHttpRequest();
    request.open("POST", URL, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObj = JSON.parse(request.responseText);

                // TODO: error on modal if it doesn't delete

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

function delete_wrapper(name, email, phone)
{
    load_contact(name, email, phone, "delete");
}
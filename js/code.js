const baseURL = "http://smallproject.maudxd.online/API";
const extension = "php";

let id = 0;
let contactID = 0;

function cache_id_as_cookie() {
    document.cookie = "userID=" + id + "; path=/";
    document.cookie = "contactID=" + contactID + "; path=/";
}

function clear_cookie() {
    document.cookie = "userID=-1; path=/";
    document.cookie = "contactID=-1; path=/";
}

function fetch_userID_from_cookie() {
    let userID = 0;
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("userID=")) {
            userID = parseInt(cookie.split("=")[1]);
            break;
        }
    }
    return userID;
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
                    document.getElementById("errorModalBody").innerText = jsonObj.error || "Invalid username or password.";
                    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
                    errorModal.show();
                    return;
                } else {
                    localStorage.setItem("username", username);
                    cache_id_as_cookie();
                    window.location.href = "contacts.html";
                }
            }
        };
        request.send(jsonPayload);
    } catch (error) {
        document.getElementById("errorModalBody").innerText = error.message;
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
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
                    document.getElementById("errorModalBody").innerText = jsonObj.error || "Username already exists.";
                    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
                    errorModal.show();
                    return;
                } else {
                    let popup = document.getElementById("success-popup");
                    popup.classList.remove("d-none");
                    setTimeout(() => { window.location.href = "index.html"; }, 2000);
                }
            }
        };
        request.send(jsonPayload);
    } catch (error) {
        document.getElementById("errorModalBody").innerText = error.message;
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
    }
}

function search() {
    id = fetch_userID_from_cookie();

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

                for (let i = 0; i < jsonObj.results.length; i++) {
                    let row = document.getElementById("contactsTableBody").insertRow();
                    let nameCell = row.insertCell(0);

                    let contactID = jsonObj.results[i].split(";")[0].trim();
                    let name = jsonObj.results[i].split(";")[1].trim();
                    let email = jsonObj.results[i].split(";")[2].trim();
                    let phone = jsonObj.results[i].split(";")[3].trim();

                    nameCell.innerHTML = `<button class="contact-name-btn" onclick="viewContact('${contactID}', '${name}', '${email}', '${phone}')">${name}</button>`;
                }
            }
        };
        request.send(jsonPayload);
    } catch (error) {
        document.getElementById("error-message").innerHTML = error.message;
    }
}

function viewContact(contactID, name, email, phone) {
    document.getElementById("viewName").innerText = name;
    document.getElementById("viewEmail").innerText = email;
    document.getElementById("viewPhone").innerText = phone;

    document.getElementById("editContactButton").onclick = () => load_contact(contactID, "edit");
    document.getElementById("deleteContactButton").onclick = () => delete_contact(contactID);

    let viewModal = new bootstrap.Modal(document.getElementById("viewContactModal"));
    viewModal.show();
}

function load_contact(contactID, action) {
    if (!contactID || contactID === -1) {
        alert("Error: No contact selected.");
        return;
    }

    if (action === "delete") {
        delete_contact(contactID);
    } else if (action === "edit") {
        document.getElementById("editName").value = document.getElementById("viewName").innerText;
        document.getElementById("editEmail").value = document.getElementById("viewEmail").innerText;
        document.getElementById("editPhone").value = document.getElementById("viewPhone").innerText;

        document.getElementById("editContactForm").onsubmit = function () {
            edit_contact(contactID);
            return false;
        };

        let editModal = new bootstrap.Modal(document.getElementById("editContactModal"));
        editModal.show();
    }
}

function edit_contact(contactID) {
    if (!contactID || contactID === -1) {
        alert("Error: No contact selected.");
        return;
    }

    let editRequest = {
        contactID: contactID,
        newName: document.getElementById("editName").value,
        newEmail: document.getElementById("editEmail").value,
        newPhoneNum: document.getElementById("editPhone").value
    };

    let jsonPayload = JSON.stringify(editRequest);
    let URL = baseURL + "/ModifyContact." + extension;

    let request = new XMLHttpRequest();
    request.open("POST", URL, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                search();
                // Close the Edit Contact Modal
                let editModal = bootstrap.Modal.getInstance(document.getElementById("editContactModal"));
                if (editModal) editModal.hide();

                // Close the View Contact Modal
                let viewModal = bootstrap.Modal.getInstance(document.getElementById("viewContactModal"));
                if (viewModal) viewModal.hide();
            }
        };
        request.send(jsonPayload);
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
}

function delete_contact(contactID) {
    if (!contactID || contactID === -1) {
        alert("Error: No contact selected.");
        return;
    }

    let deleteRequest = { contactID: contactID };
    let jsonPayload = JSON.stringify(deleteRequest);
    let URL = baseURL + "/DeleteContact." + extension;

    let request = new XMLHttpRequest();
    request.open("POST", URL, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // 1) Hide the modal
                const viewModal = bootstrap.Modal.getInstance(document.getElementById("viewContactModal"));
                if (viewModal) {
                  viewModal.hide();
                }

                // 2) Refresh the contacts list
                search();
            }
        };
        request.send(jsonPayload);
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
}

function add_contact() {
    id = fetch_userID_from_cookie();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();

    if (!name || !email || !phone) {
        alert("Please fill in all fields.");
        return;
    }

    let addRequest = {
        userID: id,
        name: name,
        email: email,
        phoneNum: phone
    };

    let jsonPayload = JSON.stringify(addRequest);
    let URL = baseURL + "/AddContact." + extension;

    let request = new XMLHttpRequest();
    request.open("POST", URL, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObj = JSON.parse(request.responseText);

                if (jsonObj.error) {
                    alert("Error: " + jsonObj.error);
                    return;
                }

                // Clear input fields after successful addition
                document.getElementById("name").value = "";
                document.getElementById("email").value = "";
                document.getElementById("phone").value = "";

                // Close modal
                let addModal = bootstrap.Modal.getInstance(document.getElementById("addContactModal"));
                addModal.hide();

                // Refresh contact list
                search();
            }
        };
        request.send(jsonPayload);
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
}

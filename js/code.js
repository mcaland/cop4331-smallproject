const baseURL = "http://smallproject.maudxd.online/API"
const extension = "php"

let id = 0;
let username = "";
let password = "";

function login()
{
    id = 0;

    username = document.getElementById("userField").value;
    password = document.getElementById("passField").value;

    let credentials = {username:username, password:password};
    let jsonPayload = JSON.stringify(credentials);

    let URL = baseURL + "/Login." + extension;

    let request = new XMLHttpRequest();
    request.open("POST", URL, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        request.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObj = JSON.parse(request.responseText);
                id = jsonObj.userID;

                document.getElementById("loginStatusTest").innerHTML = request.responseText;

                // if (id < 1)
                // {
                //     document.getElementById("loginStatusTest").innerHTML = "Login error";
                //     return;
                // }
                // else
                // {
                //     document.getElementById("loginStatusTest").innerHTML = "Successful login with ID " + id;
                //     return;
                // }
            }
        };
        request.send(jsonPayload);
    }
    catch (error)
    {
        document.getElementById("loginStatusTest").innerHTML = error.message;
    }
}
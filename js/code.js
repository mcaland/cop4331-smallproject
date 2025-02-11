const baseURL = "http://smallproject.maudxd.online/API"
const extension = "php"

let id = 0;
let user = "";
let pass = "";

function login()
{
    id = 0;

    user = document.getElementById("userField").value;
    pass = document.getElementById("passField").value;

    let credentials = {user:user, pass:pass};
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

                if (id < 1)
                {
                    document.getElementById("loginStatusTest").innerHTML = "Login error";
                }
                else
                {
                    document.getElementById("loginStatusTest").innerHTML = "Successful login with ID " + id;
                }

                window.location.href = "index.html";
            }
        }
        request.send(jsonPayload);
    }
    catch (error)
    {
        document.getElementById("loginStatusTest").innerHTML = error.message;
    }
}
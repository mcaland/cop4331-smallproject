<?php

// Retrieve our data and insert to variables
$inData = getRequestInfo();

// Need to retreive data for creating a new contact: Username, Password, phone number, email
$userID = $inData["userID"];
$name = $inData["name"];
$email = $inData["email"];
$phoneNum = $inData["phoneNum"];

// Connect to database and checking connection
$conn = new mysqli("localhost", "admin", "Password!", "SmallProj");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT into Contacts (userID,name,email,phoneNum) VALUES(?,?,?,?) RETURNING contactID");
    $stmt->bind_param("isss", $userID, $name, $email, $phoneNum);
    $stmt->execute();
    $result = $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $contactID = $row["contactID"];
        returnWithInfo($contactID);
    } else {
        returnWithError("Error Creating Contact");
    }
}

// FUNCTIONS
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithInfo($contactID)
{
    $retValue = '{"contactID":"' . $contactID . '","error":""}';
    sendResultInfoAsJson($retValue);
}

function returnWithError($err)
{
    $retValue = '{"contactID":0,"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

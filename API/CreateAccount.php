<?php

$inData = getRequestInfo();

$username = $inData["username"];
$password = $inData["password"];
$userID = 0;

// Connect to the database
$conn = new mysqli("localhost", "admin", "Password!", "SmallProj");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Check if the username is already taken
    $stmt = $conn->prepare("SELECT userID FROM Users WHERE username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    // Return an error if the username is already taken
    if ($row = $result->fetch_assoc()) {
        returnWithError("Username Already Taken");
    }

    $stmt->close();

    // Add the new user to the database
    $stmt = $conn->prepare("INSERT INTO Users (username, password) VALUES (?, ?) RETURNING userID, username");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    // Return the new user ID
    if ($row = $result->fetch_assoc()) {
        returnWithInfo($row['userID'], $row['username']);
    } else {
        returnWithError("Error Creating Account");
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"userID":0,"username":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($userID, $username)
{
    $retValue = '{"userID":' . $userID . ',"username":"' . $username . '","error":""}';
    sendResultInfoAsJson($retValue);
}

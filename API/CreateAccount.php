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
    // Add the new user to the database
    $stmt = $conn->prepare("INSERT INTO Users (username, password) VALUES (?, ?)");
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

function returnWithInfo($username, $userID)
{
    $retValue = '{"userID":' . $userID . ',"username":"' . $username . '","error":""}';
    sendResultInfoAsJson($retValue);
}

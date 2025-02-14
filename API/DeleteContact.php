<?php

// Retrieve data
$inData = getRequestInfo();
// Just need to retrive the contactID for deleteing a contact
$contactID = $inData["contactID"];

// Connect to database and checking connection
$conn = new mysqli("localhost", "admin", "Password!", "SmallProj");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Make the querry DELETE the contact by using the contactID
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE contactID = ?");
    $stmt->bind_param("i", $contactID);
    $stmt->execute();

    // Check to see if one or more rows were actually deleted
    if ($stmt->affected_rows > 0) {
        returnWithError("");
    } else { // If not, there was no contact with contactID
        returnWithError("No contact found with that contactID.");
    }
    $stmt->close();
    $conn->close();
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

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

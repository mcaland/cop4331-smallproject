<?php

$inData = getRequestInfo();

$userID = $inData["userID"];
$search = $inData["search"];

$searchResults = "";
$searchCount = 0;

// Connect to the database
$conn = new mysqli("localhost", "admin", "Password!", "SmallProj");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Get the contact information for any contacts that have matching userID and similar to the search term
    $stmt = $conn->prepare("select contactID, name, email, phoneNum from Contacts where name like ? or email like ? or phoneNum like ? and userID=?");
    $search = "%" . $search . "%";
    $stmt->bind_param("ssss", $search, $search, $search, $userID);
    $stmt->execute();

    $result = $stmt->get_result();

    // Get all matching contacts and add them to the search results
    while ($row = $result->fetch_assoc()) {
        if ($searchCount > 0) {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '"' . $row["contactID"] . " " . $row["name"] . " " . $row["email"] . " " . $row["phoneNum"] . '"';
    }

    if ($searchCount == 0) {
        returnWithError("No Contacts Found");
    } else {
        returnWithInfo($searchResults);
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
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
    $retValue = '{"results":[' . $searchResults . '],"error":""}';
    sendResultInfoAsJson($retValue);
}

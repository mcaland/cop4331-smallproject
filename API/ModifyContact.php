<?php

$inData = getRequestInfo();

$contactID = $inData["contactID"];
$newName = $inData["newName"];
$newEmail = $inData["newEmail"];
$newPhoneNum = $inData["newPhoneNum"];

$conn = new mysqli("localhost", "admin", "Password!", "SmallProj");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("update Contacts set name=?, email=?, phoneNum=? where contactID=?");
    $stmt->bind_param("sssi", $newName, $newEmail, $newPhoneNum, $contactID);
    $stmt->execute();
    $stmt->close();

    $stmt = $conn->prepare("select contactID from Contacts where contactID=?");
    $stmt->bind_param("i", $contactID);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        returnWithInfo($contactID);
    } else {
        returnWithError("No Contact Found");
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
    $retValue = '{"contactID":0, "error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($contactID)
{
    $retValue = '{"contactID":' . $contactID . ', "error":""}';
    sendResultInfoAsJson($retValue);
}

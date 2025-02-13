<?php

// Retrieve our data and insert to variables
$inData = getRequestInfo();

// Need to retreive data for creating a new contact: Username, Password, phone number, email
$userID = $inData["userID"];
$name = $inData["name"];
$email = $inData["email"];
$phoneNum = $inData["phoneNum"];

// Connect to database and checking connection
$conn = new mysqli("localhost", "admin","Password!", "SmallProj");

if ($conn->connect_error) {
    returnWithError($conn -> connect_error); 
} else{
    $stmt = $conn->prepare("INSERT into Contacts (userID,name,email,phoneNum) VALUES(?,?,?,?)");
    $stmt->bind_param("isss", $userID, $name, $email, $phoneNum);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    returnWithError("");
}

// FUNCTIONS
function getRequestInfo(){
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultAsJson($obj){
    header('Content-type: application/json');
	echo $obj;
}

function returnWithError($err){
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

?>
<?php

// Retrieve data
$userID = $inData["userID"];

// Just need to retrive the userID for deleteing a contact
$userID = $inData["userID"];

// Connect to database and checking connection
$conn = new mysqli("localhost", "admin","Password!", "SmallProj");

if ($conn->connect_error) {
    returnWithError($conn -> connect_error); 
} else{
    // Make the querry DELETE the contact by using the userID
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE userID = ?");
    $stmt->bind_param("i", $userID);
    $stmt->execute();

    // Check to see if one or more rows were actually deleted
    if($stmt->affected_rows > 0){
        $stmt->close();
        $conn->close();
        returnWithError("");
    }else{ // If not, there was no contact with userID
        returnWithError("No contact found with that userID.");
    }
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
<?php

	$inData = getRequestInfo();

	$passwordLocation="/home/david/SQLPassword.txt";
        $passwordFile=fopen($passwordLocation, "r") or die("unable to open file!");
        $sqlpassword=trim(fread($passwordFile, filesize($passwordLocation)));
        fclose($passwordFile);

	$sql="INSERT INTO users (username, password_hash, password_salt) ".
		"VALUES (?, ?, ?)";
	$conn= new mysqli("localhost", "root", $sqlpassword, "poosdsmall");

	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
		return;
	}

	$prepared=$conn->prepare($sql);
	$prepared->bind_param("sss", $username, $passwordHash, $passwordSalt);

	$username=$inData["username"];
	$passwordHash=$inData["password_hash"];
	$passwordSalt=$inData["password_salt"];

	$prepared->execute();
	$conn->close();


	function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $error ) {
		$retValue='{"user_id":0, "username":"", "password_hash":"", "Error": "'.$error.'"}';
		return sendResultInfoAsJson($retValue);
	}

	function returnWithInfo( $id, $username, $password_hash )
	{
 		$retValue = '{"user_id":' . $id . ',"username":"' . $username . '","password_hash":"' . $password_hash . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>

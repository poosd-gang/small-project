<?php

	$inData = getRequestInfo();

	$passwordLocation="/home/david/SQLPassword.txt";
        $passwordFile=fopen($passwordLocation, "r") or die("unable to open file!");
        $sqlpassword=trim(fread($passwordFile, filesize($passwordLocation)));
        fclose($passwordFile);

	//$sql="SELECT * FROM users WHERE username='".$usernameGiven."'";
	$sql="INSERT INTO contacts (user_id, first_name, last_name, phone, address, birthdate, corgo_pic_url) ".
		"VALUES (?, ?, ?, ?, ?, ?, ?)";
	$conn= new mysqli("localhost", "root", $sqlpassword, "poosdsmall");

	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
		return;
	}

	$prepared=$conn->prepare($sql);
	$prepared->bind_param("sssssss", $userId, $firstName, $lastName, $phone, $address, $birthdate, $corgoPicUrl);

	$userId=$inData["user_id"];
	$firstName=$inData["first_name"];
	$lastName=$inData["last_name"];
	$phone=$inData["phone"];
	$address=$inData["address"];
	$birthdate=$inData["birthdate"];
	$corgoPicUrl=$inData["corgo_pic_url"];

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

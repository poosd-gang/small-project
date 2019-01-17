<?php

	$inData = getRequestInfo();

	$passwordLocation="/home/david/SQLPassword.txt";
        $passwordFile=fopen($passwordLocation, "r") or die("unable to open file!");
        $sqlpassword=trim(fread($passwordFile, filesize($passwordLocation)));
        fclose($passwordFile);

	$usernameGiven="demo";//$inData["login"];
	$sql="select * from users limit 1";//"SELECT * FROM users WHERE username='demo'";
	$conn= new mysqli("localhost", "root", $sqlpassword, "poosdsmall");
	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
		return;
	}
	$result=$conn->query($sql);
	if ($result->num_rows > 0) {
		$row=$result->fetch_assoc();
		$username=$row["username"];
		$userId=$row["user_id"];
		$passwordHash=$row["password_hash"];
		$conn->close();
		returnWithInfo($userId, $username, $passwordHash);
	}
	else {
		$conn->close();
		returnWithError($usernameGiven);
	}

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

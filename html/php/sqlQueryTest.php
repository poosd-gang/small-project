<?php
	$sql="SELECT * FROM users";

	$passwordLocation="/home/david/SQLPassword.txt";
	$passwordFile=fopen($passwordLocation, "r") or die("unable to open file!");
	$sqlpassword=trim(fread($passwordFile, filesize($passwordLocation)));
	fclose($passwordFile);

	$conn= new mysqli("localhost", "root", $sqlpassword, "poosdsmall");
	$result=$conn->query($sql);
	$row=$result->fetch_assoc();
	$username=$row["username"];
	$userId=$row["user_id"];
	$passwordHash=$row["password_hash"];
	returnWithInfo($userId, $username, $passwordHash);

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err ) {
		$retValue='{"user_id":0, "username":"", "password_hash":""}';
		return sendResultInfoAsJson($retValue);
	}

	function returnWithInfo( $id, $username, $password_hash )
	{
 		$retValue = '{"user_id":' . $id . ',"username":"' . $username . '","password_hash":"' . $password_hash . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>

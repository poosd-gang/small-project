<?php

	$inData = getRequestInfo();

	$passwordLocation="/home/david/SQLPassword.txt";
        $passwordFile=fopen($passwordLocation, "r") or die("unable to open file!");
        $sqlpassword=trim(fread($passwordFile, filesize($passwordLocation)));
        fclose($passwordFile);


	$sql="SELECT * FROM contacts WHERE user_id=?";
	$conn= new mysqli("localhost", "root", $sqlpassword, "poosdsmall");

	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
		return;
	}


	$prepared=$conn->prepare($sql);
	$prepared->bind_param("s", $userId);

	$userId=$inData["user_id"];

	$prepared->execute();
	//$prepared->bind_result($result);
	$returned=$prepared->get_result();
	$data=$returned->fetch_all();
	//$result=prepared->get_result();
	//$conn->close();

	//Echo(sizeof($data));
	//Echo($data);
	//Echo("asdf");

	returnArray($data);

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

	function returnArray($array) {
		$retValue='[';
		$length=sizeof($array);
		//Echo("Length: ".$length);
		$i=0;

		while ($i<$length) {
			$object=$array[$i];
			//Echo($object[0]);
			$retValue=$retValue.'{"contact_id": '.$object[0].', "user_id": '.$object[1]
			.', "first_name": "'.$object[2].'"'
			.', "last_name": "'.$object[3].'"'
			.', "phone": "'.$object[4].'"'
			.', "email": "'.$object[5].'"'
			.', "address": "'.$object[6].'"'
			.', "birthdate": "'.$object[7].'"'
			.', "corgo_pic_url": "'.$object[8].'" }';

			if ($i+1<$length)
				$retValue = $retValue.", ";

			$i++;
		}
		$retValue=$retValue . ']';
		//Echo($retValue);

		sendResultInfoAsJson($retValue);

	}

?>

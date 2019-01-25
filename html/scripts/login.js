var APIRoot = "http://104.248.122.148";
var fileExtension = ".php";
var userId = 0;
var username = '', password = '';

function doLogin()
{
	var login = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    var hash = md5(pass);
    alert(hash);

    var jsonPayload = '{"login" : "' + login + '", "password" : "' + pass + '"}';
	var url = APIRoot + '/php/login' + fileExtension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
        xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );
		userId = jsonObject.id;


		username = jsonObject.username;
        password = jsonObject.password;

        if (username == "")
        {
            document.getElementById("success").style.visibility = 'hidden';
            document.getElementById("fail").style.visibility = 'visible';
        }
        else
        {
            document.getElementById("success").style.visibility = 'visible';
            document.getElementById("fail").style.visibility = 'hidden';
        }


	}
	catch(err)
	{
		alert(err.message);
	}

}

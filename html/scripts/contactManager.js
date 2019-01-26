var userInfo = new Object();
var APIRoot = "http://104.248.122.148/php";
var fileExtension = ".php";
var userId = 0;
var firstName = '', lastName = '';

function validateInput()
{
    var userIDValue = document.getElementById("userID").value;
    var firstNameValue = document.getElementById("firstNameInput").value;
    var lastNameValue = document.getElementById("lastNameInput").value;
    var phoneValue = document.getElementById("phoneInput").value;
    var addressValue = document.getElementById("addressInput").value;
    var birthdateValue = document.getElementById("birthdateInput").value;
    var corgiImageUrl = fetchCorgiImageURL();
    var fieldsFilled = false;
    if (firstNameValue.length() > 0 || lastNameValue.length() > 0 || phoneValue.length() > 0 || addressValue.length() > 0 || birthdateValue.length() > 0)
        fieldsFilled = true;
}
function addContact() {

}
function fetchCorgiImageURL() {
    var corgiAPIUrl = 'https://api.woofbot.io/v1/breeds/corgi/image';
    var xhr = new XMLHttpRequest();
    xhr.open("GET", corgiAPIUrl, true);
    //xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    var corgiImageUrl = "";
    try
    {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var jsonObject = JSON.parse(xhr.responseText);
                corgiImageUrl += jsonObject.response.url;
                console.log(corgiImageUrl);
                return corgiImageUrl;
            }
          };
          xhr.send();
    }
    catch(err)
    {
        return 'err';
    } 

}

function setCarouselImage() {
    console.log("im in here");
    var image = document.getElementById("image1");
    var downloadingImage = new Image();
    downloadingImage.onload = function() {
        image.src = this.src;
    }
    var url = await fetchCorgiImageURL();
    console.log(url);
    downloadingImage.src = url;
    console.log(downloadingImage);
}

function fetchUserSalts(userName) {
    var url = APIRoot + '/userGetSalt' + fileExtension;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    var jsonSendObj = new Object();
    jsonSendObj.username = userName;
    var jsonPayload = JSON.stringify(jsonSendObj);
    try
    {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200)
            {
                var jsonArray = JSON.parse(xhr.responseText);
                return jsonArray;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        return 'err';
    }
}

function createUser() {
    var url = APIRoot + '/userAdd' + fileExtension;
    var newUserName = document.getElementById("newUserName");
    var newPassword = document.getElementById("newPassword");
    var salt = Math.random().toString(36).substring(0, 5) + Math.random().toString(36).substring(5, 10);
    newPassword += salt;
    var passwordHash = md5(newPassword);

    var userSalts = fetchUserSalts(newUserName);
    if (userSalts.length > 0)
    {
        document.getElementById("userAddErrorAlert").show();
        return;
    }

    var jsonSendObj = new Object();
    jsonSendObj.username = newUserName;
    jsonSendObj.password_hash = passwordHash;
    jsonSendObj.password_salt = salt;
    var jsonPayload = JSON.stringify(jsonSendObj);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var jsonObject = JSON.parse(xhr.responseText);
            }
          };
          xhr.send(jsonPayload);
    }
    catch(err)
    {
        return 'err';
    }
}

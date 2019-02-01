var userInfo = new Object();
// var APIRoot = "http://104.248.122.148";
var APIRoot = "https://cors-anywhere.herokuapp.com/http://104.248.122.148";
var falseRoot = "http://127.0.0.1:3000"
var fileExtension = ".php";
var userId = 0;
var username = '';
var password = '';
var corgiGlobalUrl = '';
var individualContact = null;

$(document).ready(function() {
    // individualContact = new Object();
    // individualContact.contact_id = 1;
} );

function setUserDisplay()
{
    var userInfo = window.name.split(",");
    username = userInfo[0];
    userId = userInfo[1];
    console.log(username);
    document.getElementById("userDisplay").innerHTML = username;
}

function fetchCorgiImageURL(callback)
{
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
                callback(corgiImageUrl);
            }
          };
          xhr.send();
    }
    catch(err)
    {
        alert(err.message);
        return 'err';
    }
}

function addContact(jsonSendObj)
{
    var url = APIRoot + '/php/contactAdd' + fileExtension;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    var jsonPayload = JSON.stringify(jsonSendObj);
    try
    {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200)
            {
                alert("success add");
                // document.getElementById("contactAddSuccessAlert").style.display = "block";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        alert(err.message);
        return 'err';
    }
}

function validateAddContactInput(corgiImageURL)
{
    formData = new FormData(document.getElementById("addContactForm"));
    formData.append("corgi_pic_url", corgiImageURL);
    var firstNameValue = document.getElementById("firstNameNew").value;
    var lastNameValue = document.getElementById("lastNameNew").value;
    var phoneValue = document.getElementById("phoneNew").value;
    var emailValue = document.getElementById("emailNew").value;
    var addressValue = document.getElementById("addressNew").value;
    var birthdateValue = document.getElementById("birthdateNew").value;

    var fieldsFilled = false;
    if (firstNameValue.length > 0 || lastNameValue.length > 0 || phoneValue.length > 0 || addressValue.length > 0 || birthdateValue.length > 0)
        fieldsFilled = true;

    if (fieldsFilled === false)
    {
        alert("inv input");
        // document.getElementById("invalidInputAlert").style.display = "block";
        return;
    }
    var jsonSendObject = new Object();

    jsonSendObject.user_id = userId;
    jsonSendObject.first_name = firstNameValue;
    jsonSendObject.last_name = lastNameValue;
    jsonSendObject.phone = phoneValue;
    jsonSendObject.email = emailValue;
    jsonSendObject.address = addressValue;
    jsonSendObject.birthdate = birthdateValue;
    jsonSendObject.corgo_pic_url = corgiImageURL;

    addContact(jsonSendObject);
}

function submitCreateContact(event)
{
    event.preventDefault();
    fetchCorgiImageURL(validateAddContactInput);
}

function editContact(jsonSendObj)
{
    var url = APIRoot + '/php/contactEdit' + fileExtension;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    var jsonPayload = JSON.stringify(jsonSendObj);
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                alert("success edit");
                // document.getElementById("contactEditSuccessAlert").style.display = "block";
                window.location.reload();
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        alert(err.message);
        return 'err';
    }
}

function validateEditContactInput(event)
{
    event.preventDefault();

    // formData = new FormData(document.getElementById("editContactForm"));
    // formData.append("corgi_pic_url", individualContact.corgo_pic_url);
    var firstNameValue = document.getElementById("firstNameEdit").value;
    var lastNameValue = document.getElementById("lastNameEdit").value;
    var phoneValue = document.getElementById("phoneEdit").value;
    var emailValue = document.getElementById("emailEdit").value;
    var addressValue = document.getElementById("addressEdit").value;
    var birthdateValue = document.getElementById("birthdateEdit").value;

    var fieldsFilled = false;
    if (firstNameValue.length > 0 || lastNameValue.length > 0 || phoneValue.length > 0 || addressValue.length > 0 || birthdateValue.length > 0)
        fieldsFilled = true;

    if (fieldsFilled === false)
    {
        alert("inv edit");
        // document.getElementById("invalidEditAlert").style.display = "block";
        return;
    }
    var jsonSendObject = new Object();
    jsonSendObject.contact_id = individualContact.contact_id;
    jsonSendObject.first_name = firstNameValue;
    jsonSendObject.last_name = lastNameValue;
    jsonSendObject.phone = phoneValue;
    jsonSendObject.email = emailValue;
    jsonSendObject.address = addressValue;
    jsonSendObject.birthdate = birthdateValue;
    jsonSendObject.corgo_pic_url = individualContact.corgo_pic_url;

    editContact(jsonSendObject);
}

function setCarouselImage(corgiImageUrl)
{
    console.log("im in here");
    var image = document.getElementById("image1");
    image.src = corgiImageUrl;
}

function setCarousel()
{
    fetchCorgiImageURL(setCarouselImage);
}

function updateTable(dataArray)
{
    // This needs to be in the HTML file script instead of the current datatable call

    // Changing data here
    var table = $('#table_id').DataTable();
    table.clear();
    table.rows.add(dataArray);
    table.draw();
}

function searchContacts()
{
    var jsonSendObject = new Object();
    jsonSendObject.user_id = userId;
    jsonSendObject.search_text = document.getElementById("searchContactsInput");
    var url = APIRoot + '/php/contactFilter' + fileExtension;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    var jsonPayload = JSON.stringify(jsonSendObject);
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                var jsonArray = JSON.parse(xhr.responseText);
                updateTable(jsonArray);
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        alert(err.message);
        return 'err';
    }
}

function initTable(jsonArray)
{
    console.log(jsonArray);
    return jsonArray;
}

function fetchAllContacts()
{
    var jsonSendObject = new Object();
    jsonSendObject.user_id = userId;
    var url = APIRoot + '/php/contactGetAll' + fileExtension;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    var jsonPayload = JSON.stringify(jsonSendObject);
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                var jsonArray = JSON.parse(xhr.responseText);
                initTable(jsonArray);
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        alert(err.message);
    }
}

function deleteContact(event)
{
    event.preventDefault();
    var jsonSendObject = new Object();
    jsonSendObject.contact_id = individualContact.contact_id;
    var url = APIRoot + '/php/contactDelete' + fileExtension;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    var jsonPayload = JSON.stringify(jsonSendObject);
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                alert("delete success");
                // document.getElementById("contactDeleteSuccess");
                document.getElementById("contactInfo").style.display = "none";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        alert(err.message);
        return 'err';
    }
}

function fetchContactInfo()
{
    var table = $('#table_id').DataTable();

    $('#table_id tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        individualContact = data;
        document.getElementById("nameView").value = data.first_name + " " + data.last_name;
        document.getElementById("phoneView").value = data.phone;
        document.getElementById("emailView").value = data.email;
        document.getElementById("addressView").value = data.address;
        document.getElementById("birthdateView").value = data.birthdate;
        document.getElementById("corgoPicView").src = data.corgo_pic_url;
        document.getElementById("contactInfo").style.display = "block";
    } );
}

function fetchUserSalts(userName, callback)
{
    var url = APIRoot + '/php/userGetSalt' + fileExtension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    var jsonSendObject = new Object();
    jsonSendObject.username = userName;
    var jsonPayload = JSON.stringify(jsonSendObject);
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                var jsonArray = JSON.parse(xhr.responseText);
                callback(jsonArray);
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        alert(err.message);
        return 'err';
    }
}

function createUser(userSalts)
{
    var url = APIRoot + '/php/userAdd' + fileExtension;
    var newUserName = document.getElementById("newUserName").value;
    console.log(newUserName);
    var newPassword = document.getElementById("newPassword").value;
    console.log(newPassword);
    var salt = Math.random().toString(36).substring(0, 5) + Math.random().toString(36).substring(5, 10);
    newPassword += salt;
    var passwordHash = md5(newPassword);

    if (userSalts.length > 0)
    {
        alert("user add error");
        // document.getElementById("userAddErrorAlert").style.display = "block";
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
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                //var jsonObject = JSON.parse(xhr.responseText);
                //toggle modal
            }
          };
          xhr.send(jsonPayload);
    }
    catch(err)
    {
        alert(err.message);
        return 'err';
    }
}

function loginUser(userSalts)
{
    var url = APIRoot + '/php/login' + fileExtension;
    var userName = document.getElementById("username").value;
    var passWord = document.getElementById("password").value;

    if (userSalts.length === 0)
    {
        alert("user login bad");
        // document.getElementById("userLoginErrorAlert").style.display = "block";
        return;
    }
    salt = userSalts[0];
    passWord += salt;
    var passwordHash = md5(passWord);

    var jsonSendObj = new Object();
    jsonSendObj.username = userName;
    jsonSendObj.password_hash = passwordHash;
    var jsonPayload = JSON.stringify(jsonSendObj);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        //disable login button here
        // document.getElementById("loginButton").disabled = true;
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                console.log(xhr.responseText);
                var jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.username === '')
                {
                    alert('Username/password combination incorrect. Please try again.');
                }
                else if (jsonObject.username !== '')
                {
                    username = jsonObject.username;
                    console.log(jsonObject.username);
                    userId = jsonObject.user_id;
                    password = jsonObject.password_hash;
                    window.name = username + "," + userId;
                    console.log(window.name);
                    window.location = falseRoot + '/home.html';
                }
                //enable login button here
                // document.getElementById("loginButton").disabled = false;
            }
          };
          xhr.send(jsonPayload);
    }
    catch(err)
    {
        alert(err.message);
        return 'err';
    }
}

function submitCreateUser(event)
{
    event.preventDefault();
    fetchUserSalts(document.getElementById("newUserName").value, createUser);
}

function submitLoginUser(event)
{
    event.preventDefault();
    fetchUserSalts(document.getElementById("username").value, loginUser);
}

function signOut()
{
    username = '';
    userId = 0;
    window.location=falseRoot + '/index.html';
}

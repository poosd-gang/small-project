var APIRoot = "http://corgoconnect.com/php";
var webRoot = "http://corgoconnect.com";
// Testing on local: comment the two lines above and uncomment the two lines below
// var APIRoot = "https://cors-anywhere.herokuapp.com/http://corgoconnect.com/php";
// var webRoot = "http://127.0.0.1:3000";
var fileExtension = ".php";
var userInfo = new Object();
var userId = 0;
var username = '';
var password = '';
var corgiGlobalUrl = '';
var individualContact = null;

$(document).ready(function() {
    var currentUrl = window.location.href;
    if (currentUrl.indexOf("home") >= 0 && window.name === '')
        window.location = webRoot + "/index.html";
} );

$(function(){
    $("[data-hide]").on("click", function(){
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });
});

function setUserDisplay()
{
    var userInfo = window.name.split(",");
    username = userInfo[0];
    userId = userInfo[1];
    document.getElementById("userDisplay").innerHTML = username;
}

function fetchCorgiImageURL(callback)
{
    var corgiAPIUrl = 'https://api.woofbot.io/v1/breeds/corgi/image';
    var xhr = new XMLHttpRequest();
    xhr.open("GET", corgiAPIUrl, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    var corgiImageUrl = "";
    try
    {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200)
            {
                var jsonObject = JSON.parse(xhr.responseText);
                corgiImageUrl += jsonObject.response.url;
                callback(corgiImageUrl);
            }
            else if (this.status != 200)
            {
                $('.alert').hide();
                document.getElementById("genericErrorMessage").innerHTML = "Unable to retrieve corgi image.";
                $("#genericErrorAlert").show();
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
    var url = APIRoot + '/contactAdd' + fileExtension;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    var jsonPayload = JSON.stringify(jsonSendObj);
    try
    {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200)
            {
                $('.alert').hide();
                $("#addContact").modal("hide");
                if (document.getElementById("searchContactsInput").value.length != 0)
                    searchContacts();
                else
                    fetchAllContacts('update');
                $("#contactAddSuccessAlert").show();
                clearAddContactModal();
            }
            else if (this.status != 200)
            {
                $('.alert').hide();
                $("#addContact").modal("hide");
                document.getElementById("genericErrorMessage").innerHTML = "Unable to add contact.";
                $("#genericErrorAlert").show();
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
    var firstNameValue = document.getElementById("firstNameNew").value.trim();
    var lastNameValue = document.getElementById("lastNameNew").value.trim();
    var phoneValue = document.getElementById("phoneNew").value.trim();
    var emailValue = document.getElementById("emailNew").value.trim();
    var addressValue = document.getElementById("addressNew").value.trim();
    var birthdateValue = document.getElementById("birthdateNew").value.trim();

    var fieldsFilled = false;
    if (firstNameValue.length > 0 || lastNameValue.length > 0)
        fieldsFilled = true;

    if (fieldsFilled === false)
    {
        $('.alert').hide();
        $("#invalidAddContactAlert").show();
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

function clearAddContactModal()
{
    document.getElementById("firstNameNew").value = '';
    document.getElementById("lastNameNew").value = '';
    document.getElementById("phoneNew").value = '';
    document.getElementById("emailNew").value = '';
    document.getElementById("addressNew").value = '';
    document.getElementById("birthdateNew").value = '';
}

function fillEditContactData()
{
    document.getElementById("firstNameEdit").value = individualContact.first_name;
    document.getElementById("lastNameEdit").value = individualContact.last_name;
    document.getElementById("phoneEdit").value = individualContact.phone;
    document.getElementById("emailEdit").value = individualContact.email;
    document.getElementById("addressEdit").value = individualContact.address;
    document.getElementById("birthdateEdit").value = individualContact.birthdate;
}

function editContact(jsonSendObj)
{
    var url = APIRoot + '/contactEdit' + fileExtension;
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
                $('.alert').hide();
                fetchContactInfo(jsonSendObj);
                $("#editContact").modal("hide");
                if (document.getElementById("searchContactsInput").value.trim().length != 0)
                    searchContacts();
                else
                    fetchAllContacts('update');
                $("#contactEditSuccessAlert").show();
            }
            else if (this.status != 200)
            {
                $('.alert').hide();
                $("#editContact").modal("hide");
                document.getElementById("genericErrorMessage").innerHTML = "Unable to edit contact.";
                $("#genericErrorAlert").show();
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

    var firstNameValue = document.getElementById("firstNameEdit").value.trim();
    var lastNameValue = document.getElementById("lastNameEdit").value.trim();
    var phoneValue = document.getElementById("phoneEdit").value.trim();
    var emailValue = document.getElementById("emailEdit").value.trim();
    var addressValue = document.getElementById("addressEdit").value.trim();
    var birthdateValue = document.getElementById("birthdateEdit").value.trim();

    var fieldsFilled = false;
    if (firstNameValue.length > 0 || lastNameValue.length > 0)
        fieldsFilled = true;

    if (fieldsFilled === false)
    {
        $('.alert').hide();
        $("#invalidEditContactAlert").show();
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
    jsonSendObject.search_text = document.getElementById("searchContactsInput").value.trim();
    var url = APIRoot + '/contactFilter' + fileExtension;
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
            else if (this.status != 200)
            {
                $('.alert').hide();
                document.getElementById("genericErrorMessage").innerHTML = "Unable to search contacts.";
                $("#genericErrorAlert").show();
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
    $('#table_id').DataTable( {
        //ajax:           "data/sample.txt",
        data: jsonArray,
        columns: [
            {
                data : "first_name"
            },
            {
               data : "last_name"
           },
        ],
        // deferRender:    true,
        searching:      false
    } );
}

function fetchAllContacts(fetchType)
{
    var jsonSendObject = new Object();
    jsonSendObject.user_id = userId;
    var url = APIRoot + '/contactGetAll' + fileExtension;
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
                if (fetchType === 'create')
                    initTable(jsonArray);
                else if (fetchType === 'update')
                    updateTable(jsonArray);
            }
            else if (this.status !== 200)
            {
                $('.alert').hide();
                document.getElementById("genericErrorMessage").innerHTML = "Unable to get all contacts.";
                $("#genericErrorAlert").show();
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
    var url = APIRoot + '/contactDelete' + fileExtension;
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
                $('.alert').hide();
                document.getElementById("contactInfo").style.display = "none";
                $("#deleteContact").modal("hide");
                if (document.getElementById("searchContactsInput").value.length != 0)
                    searchContacts();
                else
                    fetchAllContacts('update');
                $("#contactDeleteSuccessAlert").show();
            }
            else if (this.status != 200)
            {
                $('.alert').hide();
                $("#deleteContact").modal("hide");
                document.getElementById("genericErrorMessage").innerHTML = "Unable to delete contact.";
                $("#genericErrorAlert").show();
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

function fetchContactInfo(data)
{
    individualContact = data;
    document.getElementById("nameView").value = data.first_name + " " + data.last_name;
    document.getElementById("phoneView").value = data.phone;
    document.getElementById("emailView").value = data.email;
    document.getElementById("addressView").value = data.address;
    document.getElementById("birthdateView").value = data.birthdate;
    document.getElementById("corgoPicView").src = data.corgo_pic_url;
    document.getElementById("contactInfo").style.display = "block";
}

function fetchUserSalts(userName, callback)
{
    var url = APIRoot + '/userGetSalt' + fileExtension;

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
    var url = APIRoot + '/userAdd' + fileExtension;
    var newUserName = document.getElementById("newUserName").value;
    var newPassword = document.getElementById("newPassword").value;
    var salt = Math.random().toString(36).substring(0, 5) + Math.random().toString(36).substring(5, 10);
    newPassword += salt;
    var passwordHash = md5(newPassword);

    if (userSalts.length > 0)
    {
        $('.alert').hide();
        $("#invalidCreateUserAlert").show();
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
                $('.alert').hide();
                $("#registerNewUser").modal("hide");
                $("#createUserSuccessAlert").show();
            }
            else if (this.status != 200)
            {
                $('.alert').hide();
                $("#genericErrorRegisterAlert").show();
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
    var url = APIRoot + '/login' + fileExtension;
    var userName = document.getElementById("username").value.trim();
    var passWord = document.getElementById("password").value.trim();

    if (userSalts.length === 0)
    {
        $('.alert').hide();
        $("#invalidLoginAlert").show();
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
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                var jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.username === '')
                {
                    $('.alert').hide();
                    $("#invalidLoginAlert").show();
                }
                else if (jsonObject.username !== '')
                {
                    username = jsonObject.username;
                    userId = jsonObject.user_id;
                    password = jsonObject.password_hash;
                    window.name = username + "," + userId;
                    window.location.href = webRoot + '/home.html';
                }
            }
            else if (this.status != 200)
            {
                $('.alert').hide();
                $("#genericErrorLoginAlert").show();
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
    window.name = '';
    window.location.href = webRoot + '/index.html';
}

function hideDOMAlert() {
    $('.alert').hide();
}

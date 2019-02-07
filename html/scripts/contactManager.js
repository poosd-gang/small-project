// var APIRoot = "http://corgoconnect.com/php";
// var webRoot = "http://corgoconnect.com";
// Testing on local: comment the two lines above and uncomment the two lines below
var APIRoot = "https://cors-anywhere.herokuapp.com/http://corgoconnect.com/php";
var webRoot = "http://127.0.0.1:60413";
var fileExtension = ".php";
var userInfo = new Object();
var userId = 0;
var username = '';
var password = '';
var corgiGlobalUrl = '';
var individualContact = null;

// Ensures that user cannot get to home before login
$(document).ready(function() {
    var currentUrl = window.location.href;
    if (currentUrl.indexOf("home") >= 0 && window.name === '')
        window.location = webRoot + "/index.html";
} );

// Creates hide attribute for alerts
$(function(){
    $("[data-hide]").on("click", function(){
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });
});

// Sets user display information in navbar
function setUserDisplay()
{
    var userInfo = window.name.split(",");
    username = userInfo[0];
    userId = userInfo[1];
    document.getElementById("userDisplay").innerHTML = username;
}

// Gets a random image URL from a corgi image API
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

// Sends new contact information to website API
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

// Validates new contact information
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

// Begins the process of adding a contact by first getting the image URL
function submitCreateContact(event)
{
    event.preventDefault();
    fetchCorgiImageURL(validateAddContactInput);
}

// Clears the add contact modal information upon hiding
function clearAddContactModal()
{
    document.getElementById("firstNameNew").value = '';
    document.getElementById("lastNameNew").value = '';
    document.getElementById("phoneNew").value = '';
    document.getElementById("emailNew").value = '';
    document.getElementById("addressNew").value = '';
    document.getElementById("birthdateNew").value = '';
}

// Transfers currently selected contact information to edit contact modal
function fillEditContactData()
{
    document.getElementById("firstNameEdit").value = individualContact.first_name;
    document.getElementById("lastNameEdit").value = individualContact.last_name;
    document.getElementById("phoneEdit").value = individualContact.phone;
    document.getElementById("emailEdit").value = individualContact.email;
    document.getElementById("addressEdit").value = individualContact.address;
    document.getElementById("birthdateEdit").value = individualContact.birthdate;
}

// Sends modified contact information to website API
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

// Validates modified data for editing a contact
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

// Resets rows of the contacts table with new information
function updateTable(dataArray)
{
    // This needs to be in the HTML file script instead of the current datatable call

    // Changing data here
    var table = $('#table_id').DataTable();
    table.clear();
    table.rows.add(dataArray);
    table.draw();
}

// Sends search input to website API and returns search results
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

// Initializes table for the first tiem with necessary settings and data
function initTable(jsonArray)
{
    $('#table_id').DataTable( {
        data: jsonArray,
        columns: [
            {
                data : "first_name"
            },
            {
               data : "last_name"
           },
        ],
        searching: false,
        scrollY: "415px",
        scrollCollapse: true
    } );
}

// Gets all contacts for a user from the website API. This function either sends the data to the table to be initialized or updated
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

// Deletes a contact from the website API by sending the contact id
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

// Loads contact view panel with selected contact information and stores it into a variable
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

// Gets salt(s) for a username from the website API
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

// Validates a new user and sends new user information to website API.
function createUser(userSalts)
{
    var url = APIRoot + '/userAdd' + fileExtension;
    var newUserName = document.getElementById("newUserName").value.trim();
    var newPassword = document.getElementById("newPassword").value.trim();

    if (newUserName.length === 0 || newPassword.length === 0)
    {
        $('.alert').hide();
        $("#invalidCreateUserAlert").show();
        return;
    }

    var salt = Math.random().toString(36).substring(0, 5) + Math.random().toString(36).substring(5, 10);
    newPassword += salt;
    var passwordHash = md5(newPassword);

    if (userSalts.length > 0)
    {
        $('.alert').hide();
        $("#duplicateUserNameAlert").show();
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

// Validates login information and sends login information to website API.
// Returns valid user ID along with original info if successful.
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

// Begins process of creating a new user by first getting any user salts for the new username
function submitCreateUser(event)
{
    event.preventDefault();

    if (document.getElementById("newUserName").value.length === 0)
    {
        $('.alert').hide();
        $("#invalidCreateUserAlert").show();
        return;
    }

    fetchUserSalts(document.getElementById("newUserName").value, createUser);
}

// Begins process of logging in by first getting any user salts for username
function submitLoginUser(event)
{
    event.preventDefault();

    if (document.getElementById("username").value.length === 0)
    {
        $('.alert').hide();
        $("#invalidLoginAlert").show();
        return;
    }

    fetchUserSalts(document.getElementById("username").value, loginUser);
}

// Signs out user by deleting resetting local user information and redirects to login page.
function signOut()
{
    username = '';
    userId = 0;
    window.name = '';
    window.location.href = webRoot + '/index.html';
}

var userInfo = new Object();
var APIRoot = "http://104.248.122.148";
var fileExtension = ".php";
var userId = 0;
var username = '';
var password = '';
var corgiGlobalUrl = '';
var individualContact = null;

$(document).ready( function() {
    if (userId === 0)
        window.location = APIRoot + '/index.html';
});

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
    if (firstNameValue.length() > 0 || lastNameValue.length() > 0 || phoneValue.length() > 0 || addressValue.length() > 0 || birthdateValue.length() > 0)
        fieldsFilled = true;

    if (fieldsFilled === false)
    {
        alert("inv input");
        // document.getElementById("invalidInputAlert").style.display = "block";
        return;
    }

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
    var url = APIRoot + '/php/contactAdd' + fileExtension;
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
    if (firstNameValue.length() > 0 || lastNameValue.length() > 0 || phoneValue.length() > 0 || addressValue.length() > 0 || birthdateValue.length() > 0)
        fieldsFilled = true;

    if (fieldsFilled === false)
    {
        alert("inv edit");
        // document.getElementById("invalidEditAlert").style.display = "block";
        return;
    }

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
    // $(document).ready(function() {
    //     $('#table_id').DataTable( {
    //         data:           dataArray,
    //         columnDefs: [
    //             {
    //                 "data" : function ( row, type, val, meta ) {
    //                     var dataVal = '';
    //                     if (row.first_name != '' && row.last_name != '')
    //                         dataVal = row.first_name + ' ' + row.last_name;

    //                     else if (row.first_name != '')
    //                         dataVal = row.first_name;
    //                     else if (row.last_name != '')
    //                         dataVal = row.last_name;
    //                     else if (row.phone != '')
    //                         dataVal = row.phone;
    //                     else if (row.email != '')
    //                         dataVal = row.email;
    //                     else if (row.address != '')
    //                         dataVal = row.address;
    //                     else if (row.birthdate != '')
    //                         dataVal = row.birthdate;

    //                     return dataVal;
    //                   }
    //             }
    //         ],
    //         deferRender:    true,
    //         searching:      false,
    //         scrollY:        200,
    //         scrollCollapse: true,
    //         scroller:       true
    //     } );
    // } );

    // Changing data here
    var table = $('#table_id').DataTable();
    table.clear();
    table.rows.add(dataArray);
    table.draw();
}

function searchContacts()
{
    var jsonSendObj = new Object();
    jsonSendObject.user_id = userId;
    jsonSendObj.search_text = document.getElementById("searchContactsInput");
    var url = APIRoot + '/php/contactFilter' + fileExtension;
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

function fetchAllContacts()
{
    var jsonSendObj = new Object();
    jsonSendObject.user_id = userId;
    var url = APIRoot + '/php/contactGetAll' + fileExtension;
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
                var jsonArray = JSON.parse(xhr.responseText);
                updateTable(jsonArray);
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        alert(err.message);
    }
}

function deleteContact()
{
    var jsonSendObj = new Object();
    jsonSendObject.contact_id = individualContact.contact_id;
    var url = APIRoot + '/php/contactDelete' + fileExtension;
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
        document.getElementById("firstNameView").innerHTML = data.first_name;
        document.getElementById("lastNameView").innerHTML = data.last_name;
        document.getElementById("phoneView").innerHTML = data.phone;
        document.getElementById("emailView").innerHTML = data.email;
        document.getElementById("addressView").innerHTML = data.address;
        document.getElementById("birthdateView").innerHTML = data.birthdate;
        document.getElementById("corgoPic").src = data.corgo_pic_url;
        document.getElementById("contactInfo").style.display = "block";
    } );
}

function fetchUserSalts(userName, callback)
{
    var url = APIRoot + '/php/userGetSalt' + fileExtension;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    var jsonSendObj = new Object();
    jsonSendObj.username = userName;
    var jsonPayload = JSON.stringify(jsonSendObj);
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
    var newUserName = document.getElementById("newUserName");
    var newPassword = document.getElementById("newPassword");
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
                var jsonObject = JSON.parse(xhr.responseText);
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
    var userName = document.getElementById("username");
    var password = document.getElementById("password");

    if (userSalts.length === 0)
    {
        alert("user login bad");
        // document.getElementById("userLoginErrorAlert").style.display = "block";
        return;
    }
    salt = userSalts[0];
    newPassword += salt;
    var passwordHash = md5(password);

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
                var jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.username === '')
                {
                    alert('Username/password combination incorrect. Please try again.');
                }
                else if (jsonObject.username !== '')
                {
                    username = jsonObject.username;
                    userId = jsonObject.user_id;
                    password = jsonObject.password_hash;
                    window.location(APIROOT + '/home.html')
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
    fetchUserSalts(document.getElementById("newUserName"), createUser);
}

function submitLoginUser()
{
    fetchUserSalts(document.getElementById("username"), loginUser);
}

function signOut()
{
    username = '';
    userId = 0;
    window.location(APIRoot);
}

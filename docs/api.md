# Corgo Connect API

---
## `POST /php/contactAdd.php`

Creates a new contact.

### Sample Call

```json
{
  "user_id": 1,
  "first_name": "ContactFN",
  "last_name": "ContactLN",
  "phone": "555-867-5309",
  "email": "blahblah@gmail.com",
  "address": "1 Infinite Loop",
  "birthdate": "1/12/2018",
  "corgo_pic_url": "wumbogames.github.io"
}
```

---
## `POST /php/contactFilter.php`

Searches through contacts based on the given filter text.

### Sample Call

```json
{
  "user_id": 1,
  "search_text": "Corg"
}
```

---
## `POST /php/userGetSalt.php`

Gets the salt for a given user so the front end can correctly hash the password that was entered in the UI.
This returns an array of all salts for all users whose username match the given one. If there are no
users with the given username, then this call returns an empty array.

### Sample Call

```json
{
  "username": "demo"
}
```

---
## `POST /php/contactDelete.php`

Deletes the contact with the specified contact_id.

### Sample Call

```json
{
  "contact_id": 6
}
```

---
## `POST /php/contactGetAll.php`

Gets all contacts that are owned by a given user.

### Sample Call

```json
{
  "user_id": 1
}
```

---
## `POST /php/contactEdit.php`

Updates the field of the contact with the given id

### Sample Call

```json
{
  "contact_id": 2,
  "first_name": "newFirstName",
  "last_name": "newLastName",
  "phone": "123-456-7891",
  "email": "newEmail@gmail.com",
  "address": "newAddress",
  "birthdate": "Jan 1 1000",
  "corgo_pic_url": "http://blah.png"
}
```

---
## `POST /php/login.php`

Gets the first user with the valid username/password_hash combination.

### Sample Call

```json
{
  "username": "root",
  "password_hash": "qwerty"
}
```

---
## `POST /php/userAdd.php`

Adds a user with the given username/password/salt. Assumes that the front end has already checked to make sure
that there doesn't exist a user with this username yet by calling userGetSalt(username) and making sure that
that returns an empty array. If two people simultaneously create users with the same username, then that's really too bad.
Oh well...

### Sample Call

```json
{
  "username": "user123",
  "password_hash": "somePasswordHash",
  "password_salt": "saltysalt"
}
```


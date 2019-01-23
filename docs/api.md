# Corgo Connect API

## `POST /php/login.php`

Logs in the user.

### Sample Call

```json
{
	"username": "example",
	"password_hash" : "example"
}
```

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

Deletes the contact with the specified contact_id.

### Sample Call

```json
{
  "contact_id": 6
}
```

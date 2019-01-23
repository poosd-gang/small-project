# Database Docs

We're using mysql database.

Got two tables so far in database `poosdsmall`.

## Users Table
```
mysql> DESCRIBE users;
+---------------+------------------+------+-----+---------+----------------+
| Field         | Type             | Null | Key | Default | Extra          |
+---------------+------------------+------+-----+---------+----------------+
| user_id       | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
| username      | varchar(150)     | YES  |     | NULL    |                |
| password_hash | varchar(150)     | YES  |     | NULL    |                |
| password_salt | varchar(150)     | YES  |     | NULL    |                |
+---------------+------------------+------+-----+---------+----------------+
4 rows in set (0.00 sec)
```

## Contacts Table
```
mysql> DESCRIBE contacts;
+---------------+------------------+------+-----+---------+----------------+
| Field         | Type             | Null | Key | Default | Extra          |
+---------------+------------------+------+-----+---------+----------------+
| contact_id    | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
| user_id       | int(10) unsigned | NO   |     | NULL    |                |
| first_name    | varchar(150)     | YES  |     | NULL    |                |
| last_name     | varchar(150)     | YES  |     | NULL    |                |
| phone         | varchar(150)     | YES  |     | NULL    |                |
| email         | varchar(150)     | YES  |     | NULL    |                |
| address       | varchar(150)     | YES  |     | NULL    |                |
| birthdate     | varchar(150)     | YES  |     | NULL    |                |
| corgo_pic_url | varchar(512)     | YES  |     | NULL    |                |
+---------------+------------------+------+-----+---------+----------------+
9 rows in set (0.00 sec)
```

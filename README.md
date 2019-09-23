# spider-back-end
This is the back-end repository for the Build Sprint Project: Spider Graph

### User Schema

Users in the database conform to the following object structure:

```js
{
  username: "name", // String, required
  password: "password",  // String, required
}
```

###Endpoints for the user

| Method  |      URL           |     Description                |
| ------- | ------------------ |------------------------------- | 
| POST    | /api/auth/register | Creates a new user and returns an id of newly created user |
| POST    | /api/auth/login    | Returns the token for the user |


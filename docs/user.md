# User Api Spec

## Register User
Endpoint: POST /api/users/register

Request:
```json
{
    "username": "test",
    "password": "test",
    "name": "test",
}
```

Response Body (Success):
```json
{
    "data": {
        "username": "test",
        "name": "test",
    }
}
```

Response Body (Failed):
```json
{
    "message": "username already exists",
    "errors": {
        "username": "already exists"
    }
}
```

## Login User
Endpoint: POST /api/users/login

Request:
```json
{
    "username": "test",
    "password": "test",
}
```

Response Body (Success):
```json
{
    "data": {
        "username": "test",
        "name": "test",
        "token": "_token_generated_"
    }
}
```

Response Body (Failed):
```json
{
    "message": "username or password invalid",
    "errors": {
        "username": "username or password invalid"
    }
}
```

## Get User
Endpoint: GET /api/users/current
Headers:
- Authorization: Bearer _token_generated_

Response Body (Success):
```json
{
    "data": {
        "username": "test",
        "name": "test",
    }
}
```

Response Body (Failed):
```json
{
    "message": "Unauthorized",
    "errors": {
        "token": "Unauthorized token"
    }
}
```

## Update User
Endpoint: PATCH /api/users/current
Headers:
- Authorization: Bearer _token_generated_

Request:
```json
{
    "password": "test",
    "name": "test",
}

Response Body (Success):
```json
{
    "data": {
        "name": "test",
    }
}
```

Response Body (Failed):
```json
{
    "message": "Unauthorized",
    "errors": {
        "token": "Unauthorized token"
    }
}
```

## Logout User
Endpoint: POST /api/users/logout
Headers:
- Authorization: Bearer _token_generated_

Request:
```json
{
    "password": "test",
    "name": "test",
}

# Contact API Spec

## Create Contact
Endpoint: POST /api/contacts
Headers: 
- Authorization: Bearer token

Request Body:
```json
{
    "first_name": "test",
    "last_name": "test",
    "email": "test",
    "phone": "test",
}
```

Response Body (Success):
```json
{
    "data": {
        "first_name": "test",
        "last_name": "test",
        "email": "test",
        "phone": "test",
    }
}
```

## Get Contact
Endpoint: GET /api/contacts/:contactId
Headers: 
- Authorization: Bearer token

Response Body (Success):
```json
{
    "data": {
        "first_name": "test",
        "last_name": "test",
        "email": "test",
        "phone": "test",
    }
}
```

## Update Contact
Endpoint: PATCH /api/contacts/:contactId
Headers: 
- Authorization: Bearer token

Request Body:
```json
{
    "first_name": "test",
    "last_name": "test",
    "email": "test",
    "phone": "test",
}
```

Response Body (Success):
```json
{
    "data": {
        "first_name": "test",
        "last_name": "test",
        "email": "test",
        "phone": "test",
    }
}
```

## Remove Contact
Endpoint: DELETE /api/contacts/:contactId
Headers: 
- Authorization: Bearer token

Response Body (Success):
```json
{
    "message": "Contact has been deleted",
    "data": {
        "first_name": "test",
        "last_name": "test",
    }
}
```

## Search Contact
Endpoint: GET /api/contacts
Headers: 
- Authorization: Bearer token

Query Params:
- name: string, find by first_name or last_name
- email: string, find by email 
- phone: string, find by phone
- page:  number, default 1
- limit: number, default 10

Response Body (Success):
```json
{
    "data": [
        {
            "first_name": "test",
            "last_name": "test",
            "email": "test",
            "phone": "test",
        },
        ...
    ],
    "paging": {
        "current_page": 1,
        "pages": 1,
        "size": 1
    }
}
```
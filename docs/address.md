# Address API Spec

## Create Address
Endpoint: POST /api/contacts/:contactId/addresses
Headers: 
- Authorization: Bearer token

Request Body:
```json
{
    "street": "test",
    "city": "test",
    "province": "test",
    "country": "test",
    "postal_code": "test",
}
```

Response Body (Success):
```json
{
    "data": {
        "street": "test",
        "city": "test",
        "province": "test",
        "country": "test",
        "postal_code": "test",
    }
}
```

## Get Address
Endpoint: GET /api/contacts/:contactId/addresses/:addressId
Headers: 
- Authorization: Bearer token

Response Body (Success):
```json
{
    "data": {
        "street": "test",
        "city": "test",
        "province": "test",
        "country": "test",
        "postal_code": "test",
    }
}
```

## Update Address
Endpoint: PUT /api/contacts/:contactId/addresses/:addressId
Headers: 
- Authorization: Bearer token

Request Body:
```json
{
    "street": "test",
    "city": "test",
    "province": "test",
    "country": "test",
    "postal_code": "test",
}
```

Response Body (Success):
```json
{
    "data": {
        "street": "test",
        "city": "test",
        "province": "test",
        "country": "test",
        "postal_code": "test",
    }
}
```

## Remove Address
Endpoint: DELETE /api/contacts/:contactId/addresses/:addressId
Headers: 
- Authorization: Bearer token

Response Body (Success):
```json
{
    "message": "OK",
}
```

## List Address
Endpoint: GET /api/contacts/:contactId/addresses
Headers: 
- Authorization: Bearer token

Response Body (Success):
```json
{
    "data": [
        {
            "street": "Street 1",
            "city": "test",
            "province": "test",
            "country": "test",
            "postal_code": "1234",
        },
        {
            "street": "Street 2",
            "city": "test",
            "province": "test",
            "country": "test",
            "postal_code": "1234",
        },
    ]
}
```
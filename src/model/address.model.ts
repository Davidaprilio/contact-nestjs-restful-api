export class AddressResponse {
    id: number
    street?: string
    city?: string
    province?: string
    postal_code: string
    country: string
}

export class CreateAddressRequest {
    contact_id: number
    street?: string
    city?: string
    province?: string
    postal_code: string
    country: string
}

export class UpdateAddressRequest {
    id: number
    contact_id: number
    street?: string
    city?: string
    province?: string
    postal_code: string
    country: string
}

export class GetAddressRequest {
    contact_id: number
    address_id: number
}

export class RemoveAddressRequest {
    contact_id: number
    address_id: number
}
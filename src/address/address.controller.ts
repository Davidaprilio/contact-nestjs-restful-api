import { Controller, Post, Get, Delete, Put, Body, Param, ParseIntPipe } from "@nestjs/common";
import { User } from "@prisma/client";
import { Auth } from "../common/auth.decorator";
import { WebResponse } from "../model/web.model";
import { AddressService } from "./address.service";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, RemoveAddressRequest, UpdateAddressRequest } from "../model/address.model";

@Controller('/api/contacts/:contactId/addresses')
export class AddressController {
    constructor(private addressService: AddressService) {}

    @Post()
    async create(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Body() request: CreateAddressRequest,
    ): Promise<WebResponse<AddressResponse>> {
        request.contact_id = contactId
        const address = await this.addressService.create(user, request);
        return {
            message: 'OK',
            data: address
        }
    }


    @Get('/:addressId')
    async get(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Param('addressId', ParseIntPipe) addressId: number
    ): Promise<WebResponse<AddressResponse>> {
        const request: GetAddressRequest = {
            address_id: addressId,
            contact_id: contactId
        }
        const address = await this.addressService.get(user, request);

        return {
            message: 'OK',
            data: address
        }
    }

    @Put('/:addressId')
    async update(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Param('addressId', ParseIntPipe) addressId: number,
        @Body() request: UpdateAddressRequest,
    ): Promise<WebResponse<AddressResponse>> {
        request.id = addressId
        request.contact_id = contactId
        const address = await this.addressService.update(user, request);

        return {
            message: 'OK',
            data: address
        }
    }


    @Delete('/:addressId')
    async remove(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Param('addressId', ParseIntPipe) addressId: number,
    ): Promise<WebResponse<boolean>> {
        const request: RemoveAddressRequest = {
            address_id: addressId,
            contact_id: contactId
        }
        await this.addressService.remove(user, request);

        return {
            message: 'OK',
            data: true
        }
    }
    

    @Get()
    async list(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
    ): Promise<WebResponse<AddressResponse[]>> {
        const addresses = await this.addressService.list(user, contactId);

        return {
            message: 'OK',
            data: addresses
        }
    }
}
import { Controller, Post, Get, Delete, Put, Body, HttpCode, HttpStatus, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { User } from "@prisma/client";
import { Auth } from "../common/auth.decorator";
import { ContactResponse, CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "../model/contact.model";
import { WebResponse } from "../model/web.model";

@Controller('/api/contacts')
export class ContactController {
    constructor(private contactService: ContactService) {}


    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Auth() user: User,
        @Body() request: CreateContactRequest
    ): Promise<WebResponse<ContactResponse>> {
        const contact = await this.contactService.create(user, request);

        return {
            message: 'contact created',
            data: contact
        }
    }

    @Get('/:contactId')
    @HttpCode(HttpStatus.OK)
    async get(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number
    ): Promise<WebResponse<ContactResponse>> {
        const contact = await this.contactService.get(user, contactId);

        return {
            message: 'OK',
            data: contact
        }
    }

    @Put('/:contactId')
    @HttpCode(HttpStatus.OK)
    async update(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Body() request: UpdateContactRequest
    ): Promise<WebResponse<ContactResponse>> {
        request.id = contactId;
        const contact = await this.contactService.update(user, request);

        return {
            message: 'OK',
            data: contact
        }
    }

    @Delete('/:contactId')
    @HttpCode(HttpStatus.OK)
    async remove(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
    ): Promise<WebResponse<boolean>> {
        await this.contactService.delete(user, contactId);
        return {
            message: 'OK',
            data: true
        }
    }


    @Get('/')
    @HttpCode(HttpStatus.OK)
    async search(
        @Auth() user: User,
        @Query('name') name?: string,
        @Query('email') email?: string,
        @Query('phone') phone?: string,
        @Query('page', new ParseIntPipe({optional: true})) page?: number,
        @Query('size', new ParseIntPipe({optional: true})) size?: number
    ): Promise<WebResponse<ContactResponse[]>> {
        const req: SearchContactRequest = {
            name,
            email,
            phone,
            page,
            size
        }
        return await this.contactService.search(user, req);
    }
}
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import {
    ContactResponse,
    CreateContactRequest,
    SearchContactRequest,
    UpdateContactRequest,
} from 'src/model/contact.model';
import { Contact, Prisma, User } from '@prisma/client';
import { ContactValidation } from './contact.validation';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { WebResponse } from 'src/model/web.model';

@Injectable()
export class ContactService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private prismaService: PrismaService,
    ) {}

    async create(
        user: User,
        request: CreateContactRequest,
    ): Promise<ContactResponse> {
        this.logger.debug('create new contact', {
            request,
        });

        this.validationService.validate(ContactValidation.CREATE, request);

        const contact = await this.prismaService.contact.create({
            data: {
                ...request,
                user_id: user.id,
            },
        });

        return contact;
    }

    async getContactMustExist(
        userId: number,
        contactId: number,
    ): Promise<Contact> {
        const contact = await this.prismaService.contact.findFirst({
            where: {
                id: contactId,
                user_id: userId,
            },
        });

        if (!contact) {
            throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
        }

        return contact;
    }

    async get(user: User, contactId: number): Promise<ContactResponse> {
        return await this.getContactMustExist(user.id, contactId);
    }

    async update(
        user: User,
        request: UpdateContactRequest,
    ): Promise<ContactResponse> {
        this.logger.debug('update contact', {
            request,
        });

        this.validationService.validate(ContactValidation.UPDATE, request);

        let contact = await this.getContactMustExist(user.id, request.id);
        contact = await this.prismaService.contact.update({
            where: {
                id: contact.id,
                user_id: user.id,
            },
            data: request,
        });

        return contact;
    }

    async delete(user: User, contactId: number): Promise<ContactResponse> {
        this.logger.debug('remove contact', {
            request: {
                contactId,
                user,
            },
        });

        const contact = await this.getContactMustExist(user.id, contactId);
        await this.prismaService.contact.delete({
            where: {
                id: contact.id,
                user_id: user.id,
            },
        });

        return contact;
    }

    async search(
        user: User,
        request: SearchContactRequest,
    ): Promise<WebResponse<ContactResponse[]>> {
        const searchReq: SearchContactRequest = this.validationService.validate(
            ContactValidation.SEARCH,
            request,
        );

        const filters = [];

        if (searchReq.name) {
            filters.push({
                OR: [
                    { first_name: { contains: searchReq.name } },
                    { last_name: { contains: searchReq.name } },
                ],
            });
        }

        if (searchReq.email) {
            filters.push({ email: { contains: searchReq.email } });
        }

        if (searchReq.phone) {
            filters.push({ phone: { contains: searchReq.phone } });
        }

        const skip = (searchReq.page - 1) * searchReq.size;

        const contacts = await this.prismaService.contact.findMany({
            where: {
                user_id: user.id,
                AND: filters,
            },
            take: searchReq.size,
            skip: skip,
        });

        const total = await this.prismaService.contact.count({
            where: {
                user_id: user.id,
                AND: filters,
            },
        })

        return {
            message: 'OK',
            data: contacts,
            paging: {
                current_page: searchReq.page,
                pages: Math.ceil(total / searchReq.size),
                size: searchReq.size,
            }
        };
    }
}

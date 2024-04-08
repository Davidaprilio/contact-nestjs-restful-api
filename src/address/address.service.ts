import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { Address, Prisma, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { AddressResponse, CreateAddressRequest, GetAddressRequest, RemoveAddressRequest, UpdateAddressRequest } from '../model/address.model';
import { AddressValidation } from './address.validation';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class AddressService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private prismaService: PrismaService,
        private contactService: ContactService,
    ) {}


    async create(
        user: User,
        request: CreateAddressRequest,
    ): Promise<AddressResponse> {
        this.logger.debug('create new address', {
            request,
        })

        this.validationService.validate(
            AddressValidation.CREATE, 
            request
        )

        await this.contactService.getContactMustExist(user.id, request.contact_id)

        const address = await this.prismaService.address.create({
            data: request
        })

        return address;
    }

    async getAddressMustExist(
        contact_id: number,
        address_id: number
    ): Promise<Address> {
        const address = await this.prismaService.address.findUnique({
            where: {
                id: address_id,
                contact_id: contact_id
            }
        })

        if (!address) {
            throw new HttpException('Address not found', HttpStatus.NOT_FOUND)
        }

        return address
    }


    async get(
        user: User,
        request: GetAddressRequest,
    ): Promise<AddressResponse> {
        this.logger.debug('get address', {
            request,
        })

        this.validationService.validate(
            AddressValidation.GET,
            request
        )

        await this.contactService.getContactMustExist(user.id, request.contact_id)

        return await this.getAddressMustExist(request.contact_id, request.address_id)
    }


    async update(
        user: User,
        request: UpdateAddressRequest,
    ): Promise<AddressResponse> {
        this.logger.debug('update address', {
            request,
        })
        
        this.validationService.validate(
            AddressValidation.UPDATE,
            request
        )

        await this.contactService.getContactMustExist(
            user.id, 
            request.contact_id
        )

        let address = await this.getAddressMustExist(
            request.contact_id, 
            request.id
        )

        address = await this.prismaService.address.update({
            where: {
                id: address.id
            },
            data: request
        })

        return address
    }


    async remove(
        user: User,
        request: RemoveAddressRequest,
    ): Promise<AddressResponse> {
        this.logger.debug('remove address', {
            request,
        })

        this.validationService.validate(
            AddressValidation.REMOVE,
            request
        )

        await this.contactService.getContactMustExist(
            user.id,
            request.contact_id
        )

        const address = await this.getAddressMustExist(
            request.contact_id,
            request.address_id
        )

        return await this.prismaService.address.delete({
            where: {
                id: address.id
            }
        })
    }
    

    async list(
        user: User,
        contactId: number
    ): Promise<AddressResponse[]> {

        await this.contactService.getContactMustExist(user.id, contactId)

        return await this.prismaService.address.findMany({
            where: {
                contact_id: contactId
            }
        })
    }
}
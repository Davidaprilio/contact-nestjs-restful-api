import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) {}

    async deleteAll() {
        await this.deleteAddresses();
        await this.deleteContacts();
        await this.deleteUser();
    }

    async deleteUser() {
        await this.prismaService.user.deleteMany({
            where: {
                username: 'test',
            },
        });
    }

    async deleteContacts() {
        await this.prismaService.contact.deleteMany({
            where: {
                user: {
                    username: 'test',
                },
            },
        });
    }

    async deleteAddresses() {
        await this.prismaService.address.deleteMany({
            where: {
                contact: {
                    user: {
                        username: 'test',
                    },
                },
            },
        });
    }

    async createUser() {
        return await this.prismaService.user.create({
            data: {
                name: 'Test',
                username: 'test',
                password: await bcrypt.hash('password', 10),
                token: 'test',
            },
        });
    }

    async createContact(userId: number) {
        return await this.prismaService.contact.create({
            data: {
                first_name: 'test',
                last_name: 'test',
                email: 'test@example.com',
                phone: '08123456789',
                user_id: userId,
            },
        });
    }

    async createAddress(contactId: number) {
        return await this.prismaService.address.create({
            data: {
                contact_id: contactId,
                street: 'street test',
                city: 'city test',
                province: 'province test',
                country: 'country test',
                postal_code: '1234',
            },
        });
    }

    async getContacts() {
        const user = await this.prismaService.user.findFirst({
            where: {
                username: 'test',
            },
        });
        if (!user) return [];
        return await this.prismaService.contact.findMany({
            where: {
                user_id: user.id,
            },
        });
    }

    async getAddresses() {
        return await this.prismaService.address.findMany({
            where: {
                contact: {
                    user: {
                        username: 'test',
                    },
                },
            },
        });
    }
}

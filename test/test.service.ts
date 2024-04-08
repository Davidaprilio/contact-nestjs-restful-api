import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {

    constructor(
        private prismaService: PrismaService,
    ) {}

    async deleteUser() {
        await this.prismaService.user.deleteMany({
            where: {
                username: 'test'
            }
        })
    }

    async deleteContacts() {
        const user = await this.prismaService.user.findFirst({
            where: {
                username: 'test'
            }
        })
        if (!user) return
        await this.prismaService.contact.deleteMany({
            where: {
                user_id: user.id
            }
        })
    }


    async createUser() {
        return await this.prismaService.user.create({
            data: {
                name: 'Test',
                username: 'test',
                password: await bcrypt.hash('password', 10),
                token: 'test'
            }
        })
    }


    async createContact(userId: number) {
        return await this.prismaService.contact.create({
            data: {
                first_name: 'test',
                last_name: 'test',
                email: 'test@example.com',
                phone: '08123456789',
                user_id: userId
            }
        })
    }


    async getContacts() {
        const user = await this.prismaService.user.findFirst({
            where: {
                username: 'test'
            }
        })
        if (!user) return []
        return await this.prismaService.contact.findMany({
            where: {
                user_id: user.id
            }
        })
    }

}
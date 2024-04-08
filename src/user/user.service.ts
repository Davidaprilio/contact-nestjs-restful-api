import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserResponse } from '../model/user.model';
import { UserValidation } from './user.validation';
import * as bycrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private prismaService: PrismaService,
    ) {}

    async register(request: RegisterUserRequest): Promise<UserResponse> {
        this.logger.debug('Register new user', {
            request,
        });

        const registerUserRequest = this.validationService.validate(
            UserValidation.REGISTER,
            request,
        );

        const totalUsers = await this.prismaService.user.count({
            where: {
                username: registerUserRequest.username,
            }
        })

        if (totalUsers > 0) {
            throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
        }

        registerUserRequest.password = await bycrypt.hash(registerUserRequest.password, 10);

        const user = await this.prismaService.user.create({
            data: registerUserRequest
        })

        return {
            id: user.id,
            username: user.username,
            name: user.name,
        };
    }


    async login(request: LoginUserRequest): Promise<UserResponse> {
        this.logger.debug('Login user', {
            request,
        });

        const loginUserRequest = this.validationService.validate(
            UserValidation.LOGIN,
            request,
        )

        const user = await this.prismaService.user.findUnique({
            where: {
                username: loginUserRequest.username
            }
        })

        const failedMessage = 'Username or password is incorrect';
        if (user == null) {
            throw new HttpException(failedMessage, HttpStatus.UNAUTHORIZED);
        }

        const isMatch = await bycrypt.compare(loginUserRequest.password, user.password);
        if (!isMatch) {
            throw new HttpException(failedMessage, HttpStatus.UNAUTHORIZED);
        }

        const uuid = randomUUID();
        await this.prismaService.user.update({
            where: { id: user.id },
            data: { token: uuid }
        })

        return {
            id: user.id,
            username: user.username,
            name: user.name,
            token: uuid,
        }
    }


    async current(user: User): Promise<UserResponse> {
        return {
            id: user.id,
            username: user.username,
            name: user.name,
        }
    }


    async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
        this.logger.debug('update user', {
            request,
        })

        this.validationService.validate(
            UserValidation.UPDATE,
            request,
        )

        if (request.password)
            user.password = await bycrypt.hash(request.password, 10);
    
        if (request.name)
            user.name = request.name


        const updatedUser = await this.prismaService.user.update({
            where: { id: user.id },
            data: user
        })

        return {
            id: updatedUser.id,
            username: updatedUser.username,
            name: updatedUser.name,
        }
    }
    
    async logout(user: User): Promise<boolean> {
        try {
            await this.prismaService.user.update({
                where: { id: user.id },
                data: { token: null }
            })
            return true; 
        } catch (error) {
            return false; 
        }
    }
    
}

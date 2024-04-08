import { UserService } from "./user.service";
import { WebResponse } from "../model/web.model";
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserResponse } from "../model/user.model";
import { Post, Get, Delete, Patch, Body, HttpCode, Controller, HttpStatus } from "@nestjs/common";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";

@Controller('/api/users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() request: RegisterUserRequest,
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.register(request);

        return {
            message: 'user created',
            data: result,
        }
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() request: LoginUserRequest,
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.login(request);

        return {
            message: 'authenticated',
            data: result,
        }
    }

    @Get('/current')
    @HttpCode(HttpStatus.OK)
    async current(@Auth() user: User): Promise<WebResponse<UserResponse>> {
        
        const result = await this.userService.current(user);

        return {
            message: 'OK',
            data: result,
        }
    }

    @Patch('/current')
    @HttpCode(HttpStatus.OK)
    async update(
        @Auth() user: User,
        @Body() request: UpdateUserRequest,
    ): Promise<WebResponse<UserResponse>> {
        const result = await this.userService.update(user, request);
        return {
            message: 'OK',
            data: result,
        }
    }


    @Delete('/logout')
    @HttpCode(HttpStatus.OK)
    async logout(
        @Auth() user: User,
    ): Promise<WebResponse<boolean>> {
        const isLoggout = await this.userService.logout(user);

        return {
            message: 'OK',
            data: isLoggout,
        }
    }
}
import { Injectable, Inject, NestMiddleware } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private prismaService: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    async use(req: any, res: any, next: (error?: Error | any) => void) {
        const token = req.headers['authorization'] as string;
        
        if (token) {
            const user = await this.prismaService.user.findFirst({
                where: {
                    token: token.replace('Bearer ', '')
                }
            });

            if (user) {
                req.user = user;
            }
        }

        next();
    }
}
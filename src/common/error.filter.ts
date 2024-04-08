import { ExceptionFilter,HttpStatus, HttpException, Catch, ArgumentsHost } from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();

        if (exception instanceof HttpException) {
            response.status(exception.getStatus()).json({
                message: 'Request Error',
                error: exception.getResponse(),
            });
        } else if (exception instanceof ZodError) {
            response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
                message: "Validation error",
                errors: exception.errors,
            });
        } else {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Internal server error",
                error: exception.message
            });
        }
    }

}
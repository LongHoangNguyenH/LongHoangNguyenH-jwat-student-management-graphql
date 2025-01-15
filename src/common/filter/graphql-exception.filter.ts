import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { ErrorResponse } from '../error/response.error';
import { GraphQLError } from 'graphql';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      const errorResponse: ErrorResponse = {
        errorCode: status,
        devMessage: exception.message,
        data: {
          routeParam: request.url,
          body: request.body,
          timestamp: new Date().toISOString(),
        },
      };
      response.status(status).json(errorResponse);
    } else if (host.getType<GqlContextType>() === 'graphql') {
      return new GraphQLError(exception.message, {
        extensions: {
          errorCode: exception.getResponse()['error'] || 'Internal Server Error',
          devMessage: exception.message || 'Internal Server Error',
          data: GqlArgumentsHost.create(host).getArgs(),
        },
      });
    }
  }
}

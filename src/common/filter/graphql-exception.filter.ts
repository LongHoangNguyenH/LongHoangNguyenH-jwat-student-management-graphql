import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpAdapterHost } from '@nestjs/core';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { ErrorResponse } from '../error/response.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() === 'http') {
      const { httpAdapter } = this.httpAdapterHost;
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      httpAdapter
        .status(response, status)
        .json(
          new ErrorResponse(
            exception instanceof HttpException ? exception.name : 'InternalServerError',
            exception instanceof HttpException ? exception.message : 'Internal server error',
            request.body,
          ),
        );
    } else if (host.getType<GqlContextType>() === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      const ctx = gqlHost.getContext();
      const response = ctx.res;

      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';

      if (exception instanceof HttpException) {
        status = exception.getStatus();
        message = exception.message;
      }

      response.status(status).json({
        errors: [
          {
            message,
            locations: [
              {
                line: 2,
                column: 3,
              },
            ],
            path: gqlHost.getInfo().path,
            extensions: {
              code: status === HttpStatus.INTERNAL_SERVER_ERROR ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST',
              stacktrace: exception instanceof Error ? exception.stack : null,
            },
          },
        ],
        data: null,
      });
    }
  }
}

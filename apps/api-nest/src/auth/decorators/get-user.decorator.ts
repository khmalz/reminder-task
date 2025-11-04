import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { JwtPayload } from 'src/types/jwt-payload';

export const GetUser = createParamDecorator((data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
   const request = ctx.switchToHttp().getRequest<Request>();

   if (!data) {
      return request.user;
   }

   return request.user[data];
});

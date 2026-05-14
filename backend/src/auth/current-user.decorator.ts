import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PublicUser } from 'src/users/users.service';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session?.user;
  },
);

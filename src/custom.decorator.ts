import { createParamDecorator } from '@nestjs/common';
import { User } from './models/User';

export const CurrentUser = createParamDecorator((data, req) => {
  return req.user;
});

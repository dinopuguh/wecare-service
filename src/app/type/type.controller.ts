import { Controller, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { CreateTypeDto } from './dto/create-type.dto';
import { TypeService } from './type.service';
import { AuthGuard } from '@nestjs/passport';

@Crud({
  model: {
    type: CreateTypeDto,
  },
  routes: {
    exclude: ['createManyBase'],
    createOneBase: {
      decorators: [UseGuards(AuthGuard('jwt')), ApiBearerAuth()],
    },
    deleteOneBase: {
      decorators: [UseGuards(AuthGuard('jwt')), ApiBearerAuth()],
      returnDeleted: true,
    },
    updateOneBase: {
      decorators: [UseGuards(AuthGuard('jwt')), ApiBearerAuth()],
    },
    replaceOneBase: {
      decorators: [UseGuards(AuthGuard('jwt')), ApiBearerAuth()],
    },
  },
})
@ApiUseTags('type')
@Controller('type')
export class TypeController {
  constructor(private readonly service: TypeService) {}
}

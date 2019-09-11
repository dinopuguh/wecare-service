import { Controller, UseGuards } from '@nestjs/common';
import { WecarePointService } from './wecare-point.service';
import { Crud } from '@nestjsx/crud';
import { WecarePoint } from '../../models/WecarePoint';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Crud({
  model: {
    type: WecarePoint,
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase'],
    createOneBase: {
      decorators: [UseGuards(AuthGuard('jwt')), ApiBearerAuth()],
    },
    updateOneBase: {
      decorators: [UseGuards(AuthGuard('jwt')), ApiBearerAuth()],
    },
    deleteOneBase: {
      decorators: [UseGuards(AuthGuard('jwt')), ApiBearerAuth()],
    },
  },
})
@Controller('wecare-point')
export class WecarePointController {
  constructor(private readonly service: WecarePointService) {}
}

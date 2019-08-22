import {
  Controller,
  UseGuards,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Donation } from '../../models/Donation';
import { AuthGuard } from '@nestjs/passport';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create';
import { CurrentUser } from '../../custom.decorator';
import { ICreateDonation } from './interfaces/create-donation.interface';

@Crud({
  model: {
    type: Donation,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'deleteOneBase'],
    deleteOneBase: {
      decorators: [UseGuards(AuthGuard('jwt')), ApiBearerAuth()],
      returnDeleted: true,
    },
  },
  query: {
    join: {
      user: {
        allow: ['id', 'name', 'email', 'phone'],
      },
    },
  },
})
@ApiUseTags('donation')
@Controller('donation')
export class DonationController {
  constructor(private readonly service: DonationService) {}
}

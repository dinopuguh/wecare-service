import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiImplicitParam, ApiBearerAuth } from '@nestjs/swagger';
import { TypeService } from './type.service';
import { Type } from '../../models/Type';
import { CreateTypeDto } from './dto/create.dto';
import { IService } from '../../interfaces/IService';
import { AuthGuard } from '@nestjs/passport';

@ApiUseTags('type')
@Controller('type')
export class TypeController implements IService {
  constructor(private readonly typeService: TypeService) {}

  @Get()
  findAll(): Promise<Type[]> {
    return this.typeService.findAll();
  }

  @Get(':id')
  @ApiImplicitParam({ name: 'id', type: 'string' })
  findById(@Param() id: string): Promise<Type> {
    return this.typeService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() type: CreateTypeDto): Promise<Type> {
    return this.typeService.create(type);
  }
}

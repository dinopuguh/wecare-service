import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../../models/Category';
import { ApiUseTags, ApiImplicitParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create.dto';
import { AuthGuard } from '@nestjs/passport';
import { Crud } from '@nestjsx/crud';

@Crud({
  model: {
    type: CreateCategoryDto,
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
@ApiUseTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}
}

import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../../models/Category';
import { ApiUseTags, ApiImplicitParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create.dto';
import { AuthGuard } from '@nestjs/passport';
import { IService } from 'src/interfaces/IService';

@ApiUseTags('category')
@Controller('category')
export class CategoryController implements IService {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiImplicitParam({ name: 'id', type: 'string' })
  findById(@Param() id: string): Promise<Category> {
    return this.categoryService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() category: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(category);
  }
}

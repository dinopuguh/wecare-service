import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Type } from '../../models/Type';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TypeService extends TypeOrmCrudService<Type> {
  constructor(@InjectRepository(Type) repo) {
    super(repo);
  }
}

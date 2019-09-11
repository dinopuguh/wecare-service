import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WecarePoint } from '../../models/WecarePoint';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class WecarePointService extends TypeOrmCrudService<WecarePoint> {
  constructor(@InjectRepository(WecarePoint) repo) {
    super(repo);
  }
}

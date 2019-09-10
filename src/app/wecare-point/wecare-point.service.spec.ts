import { Test, TestingModule } from '@nestjs/testing';
import { WecarePointService } from './wecare-point.service';

describe('WecarePointService', () => {
  let service: WecarePointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WecarePointService],
    }).compile();

    service = module.get<WecarePointService>(WecarePointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { WecarePointController } from './wecare-point.controller';

describe('WecarePoint Controller', () => {
  let controller: WecarePointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WecarePointController],
    }).compile();

    controller = module.get<WecarePointController>(WecarePointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

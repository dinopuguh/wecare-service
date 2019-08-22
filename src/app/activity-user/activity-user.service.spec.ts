import { Test, TestingModule } from '@nestjs/testing';
import { ActivityUserService } from './activity-user.service';

describe('ActivityUserService', () => {
  let service: ActivityUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityUserService],
    }).compile();

    service = module.get<ActivityUserService>(ActivityUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

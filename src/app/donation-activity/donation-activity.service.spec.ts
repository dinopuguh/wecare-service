import { Test, TestingModule } from '@nestjs/testing';
import { DonationActivityService } from './donation-activity.service';

describe('DonationActivityService', () => {
  let service: DonationActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonationActivityService],
    }).compile();

    service = module.get<DonationActivityService>(DonationActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

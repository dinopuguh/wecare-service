import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class VerifyDonationDto {
  @IsNotEmpty()
  @ApiModelProperty()
  activityId: number;

  @IsNotEmpty()
  @ApiModelProperty()
  userId: number;
}

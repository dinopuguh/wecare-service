import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateDonationDto {
  @IsNotEmpty()
  @ApiModelProperty()
  amount: number;

  // @IsNotEmpty()
  // @ApiModelProperty()
  // transferValidation: string;

  @IsNotEmpty()
  @ApiModelProperty()
  activityId: number;
}

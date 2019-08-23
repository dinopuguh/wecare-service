import { IsNotEmpty, IsDate, IsDateString, IsNumber } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class AddDonationDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiModelProperty()
  amount: number;

  @IsNotEmpty()
  @ApiModelProperty()
  transferValidation: string;
}

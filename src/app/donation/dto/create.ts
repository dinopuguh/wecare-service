import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDonationDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiModelProperty()
  amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty()
  transferValidation: string;
}

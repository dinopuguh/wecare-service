import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UsePointDto {
  @IsNotEmpty()
  @ApiModelProperty()
  amount: number;
}

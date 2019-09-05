import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class AbsentActivityDto {
  @IsNotEmpty()
  @ApiModelProperty()
  userId: number;
}

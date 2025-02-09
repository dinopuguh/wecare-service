import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DoneActivityDto {
  @IsNotEmpty()
  @ApiModelProperty()
  reportText: string;
}

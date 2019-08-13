import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateTypeDto {
  @IsNotEmpty()
  @ApiModelProperty()
  name: string;
}

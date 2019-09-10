import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class PresenceActivityDto {
  @IsNotEmpty()
  @ApiModelProperty()
  userIds: number[];
}

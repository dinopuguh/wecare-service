import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class CreateLocationDto {
  @IsNotEmpty()
  @ApiModelProperty()
  city: string;

  @IsNotEmpty()
  @ApiModelProperty()
  address: string;

  @ApiModelPropertyOptional()
  latitude: number;

  @ApiModelPropertyOptional()
  longitude: number;

  @IsNotEmpty()
  @ApiModelProperty()
  start: string;

  @IsNotEmpty()
  @ApiModelProperty()
  end: string;

  @IsNotEmpty()
  @ApiModelProperty()
  description: string;

  @ApiModelPropertyOptional()
  capacity: number;

  @IsNotEmpty()
  @ApiModelProperty()
  activityId: number;
}

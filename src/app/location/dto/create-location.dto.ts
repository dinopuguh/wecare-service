import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @IsNotEmpty()
  @ApiModelProperty()
  city: string;

  @IsNotEmpty()
  @ApiModelProperty()
  address: string;

  @IsNotEmpty()
  @ApiModelProperty()
  latitude: number;

  @IsNotEmpty()
  @ApiModelProperty()
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

  // @IsNotEmpty()
  // @ApiModelProperty()
  // licensePhoto: string;

  // @IsNotEmpty()
  // @ApiModelProperty()
  // locationPhoto: string;

  @IsNotEmpty()
  @ApiModelProperty()
  activityId: number;
}

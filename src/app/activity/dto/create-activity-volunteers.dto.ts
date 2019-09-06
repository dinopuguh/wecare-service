import { IsNotEmpty, IsDateString, IsNumberString } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class CreateActivityVolunteersDto {
  @IsNotEmpty()
  @ApiModelProperty()
  name: string;

  @IsNotEmpty()
  @ApiModelProperty()
  start: string;

  @IsNotEmpty()
  @ApiModelProperty()
  end: string;

  @IsNotEmpty()
  @ApiModelProperty()
  registerDeadline: string;

  @IsNotEmpty()
  @ApiModelProperty()
  description: string;

  @IsNotEmpty()
  @ApiModelProperty()
  volunteerTasks: string;

  @IsNotEmpty()
  @ApiModelProperty()
  volunteerEquipments: string;

  @IsNotEmpty()
  @ApiModelProperty()
  volunteerRequirements: string;

  @IsNotEmpty()
  @ApiModelProperty()
  briefs: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiModelPropertyOptional()
  minVolunteers: number;

  @ApiModelPropertyOptional()
  donationTarget: number;

  @IsNotEmpty()
  @ApiModelProperty()
  categoryId: number;

  @IsNotEmpty()
  @ApiModelProperty()
  city: string;

  @IsNotEmpty()
  @ApiModelProperty()
  address: string;

  // @ApiModelPropertyOptional()
  // latitude: number;

  // @ApiModelPropertyOptional()
  // longitude: number;
}

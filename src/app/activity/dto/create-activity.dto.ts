import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class CreateActivityDto {
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

  @ApiModelPropertyOptional()
  volunteerTasks: string;

  @ApiModelPropertyOptional()
  volunteerEquipments: string;

  @ApiModelPropertyOptional()
  volunteerRequirements: string;

  @ApiModelPropertyOptional()
  briefs: string;

  @ApiModelPropertyOptional()
  minVolunteers: number;

  @ApiModelPropertyOptional()
  donationTarget: number;

  @ApiModelPropertyOptional()
  area: string;

  @ApiModelPropertyOptional()
  maxParticipants: number;

  @IsNotEmpty()
  @ApiModelProperty()
  categoryId: number;

  @IsNotEmpty()
  @ApiModelProperty()
  typeId: number;

  @ApiModelPropertyOptional()
  city: string;

  @ApiModelPropertyOptional()
  address: string;

  @ApiModelPropertyOptional()
  latitude: number;

  @ApiModelPropertyOptional()
  longitude: number;
}

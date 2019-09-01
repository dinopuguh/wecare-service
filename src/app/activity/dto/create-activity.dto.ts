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

  @ApiModelPropertyOptional()
  minVolunteers: number;

  @ApiModelPropertyOptional()
  donationTarget: number;

  @ApiModelPropertyOptional()
  volunteersTotal: number;

  @ApiModelPropertyOptional()
  donationsTotal: number;

  @IsNotEmpty()
  @ApiModelProperty()
  area: string;

  @IsNotEmpty()
  @ApiModelProperty()
  maxParticipants: number;

  @IsNotEmpty()
  @ApiModelProperty()
  categoryId: number;

  @IsNotEmpty()
  @ApiModelProperty()
  typeId: number;
}

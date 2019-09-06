import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class CreateActivityLocationDto {
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
  area: string;

  @ApiModelPropertyOptional()
  maxParticipants: number;

  @IsNotEmpty()
  @ApiModelProperty()
  volunteersTotal: number;

  @ApiModelPropertyOptional()
  preparedByFacilitator: string;

  @ApiModelPropertyOptional()
  activityPlan: string;

  @ApiModelPropertyOptional()
  locationRequirement: string;

  @ApiModelPropertyOptional()
  additionalInformation: string;

  @IsNotEmpty()
  @ApiModelProperty()
  categoryId: number;
}

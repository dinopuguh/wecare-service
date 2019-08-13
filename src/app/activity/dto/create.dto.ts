import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Category } from 'src/models/Category';

export class CreateActivityDto {
  @IsNotEmpty()
  @ApiModelProperty()
  name: string;

  @IsNotEmpty()
  @ApiModelProperty()
  photo: string;

  @IsNotEmpty()
  @ApiModelProperty()
  start: string;

  @IsNotEmpty()
  @ApiModelProperty()
  end: string;

  @IsNotEmpty()
  @ApiModelProperty()
  register_deadline: string;

  @IsNotEmpty()
  @ApiModelProperty()
  description: string;

  @IsNotEmpty()
  @ApiModelProperty()
  volunteer_tasks: string;

  @IsNotEmpty()
  @ApiModelProperty()
  volunteer_equipments: string;

  @IsNotEmpty()
  @ApiModelProperty()
  volunteer_requirements: string;

  @IsNotEmpty()
  @ApiModelProperty()
  briefs: string;

  @ApiModelPropertyOptional()
  min_volunteers: number;

  @ApiModelPropertyOptional()
  donation_target: number;

  @ApiModelPropertyOptional()
  volunteers_total: number;

  @ApiModelPropertyOptional()
  donations_total: number;

  @IsNotEmpty()
  @ApiModelProperty()
  area: string;

  @IsNotEmpty()
  @ApiModelProperty()
  max_participants: number;

  @IsNotEmpty()
  @ApiModelProperty()
  category: string;

  @IsNotEmpty()
  @ApiModelProperty()
  type: string;
}

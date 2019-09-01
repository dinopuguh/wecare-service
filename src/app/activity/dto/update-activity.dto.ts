import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class UpdateActivityDto {
  @ApiModelPropertyOptional()
  name?: string;

  @ApiModelPropertyOptional()
  start?: string;

  @ApiModelPropertyOptional()
  end?: string;

  @ApiModelPropertyOptional()
  registerDeadline?: string;

  @ApiModelPropertyOptional()
  description?: string;

  @ApiModelPropertyOptional()
  volunteerTasks?: string;

  @ApiModelPropertyOptional()
  volunteerEquipments?: string;

  @ApiModelPropertyOptional()
  volunteerRequirements?: string;

  @ApiModelPropertyOptional()
  briefs?: string;

  @ApiModelPropertyOptional()
  minVolunteers?: number;

  @ApiModelPropertyOptional()
  donationTarget?: number;

  @ApiModelPropertyOptional()
  area?: string;

  @ApiModelPropertyOptional()
  maxParticipants?: number;

  @ApiModelPropertyOptional()
  categoryId?: number;

  @ApiModelPropertyOptional()
  typeId?: number;
}

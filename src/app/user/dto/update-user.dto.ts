import { IsEmail, Length, IsPhoneNumber } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @ApiModelPropertyOptional()
  email?: string;

  @IsPhoneNumber('ID')
  @ApiModelPropertyOptional()
  phone?: string;

  @Length(8)
  @ApiModelPropertyOptional()
  password?: string;

  @ApiModelPropertyOptional()
  name?: string;

  @ApiModelPropertyOptional()
  gender?: string;

  @ApiModelPropertyOptional()
  age?: number;

  @ApiModelPropertyOptional()
  profession?: string;

  @ApiModelPropertyOptional()
  domicile?: string;

  @ApiModelPropertyOptional()
  description?: string;

  @ApiModelPropertyOptional()
  expertises?: string;

  @ApiModelPropertyOptional()
  relevanceIssues?: string;
}

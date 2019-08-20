import {
  IsEmail,
  IsNotEmpty,
  Length,
  IsPhoneNumber,
  IsMobilePhone,
} from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiModelProperty()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('ID')
  @ApiModelProperty()
  phone: string;

  @IsNotEmpty()
  @Length(8)
  @ApiModelProperty()
  password: string;

  @IsNotEmpty()
  @ApiModelProperty()
  name: string;

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

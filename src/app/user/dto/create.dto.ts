import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiModelProperty()
  email: string;

  @IsNotEmpty()
  @ApiModelProperty()
  username: string;

  @IsNotEmpty()
  @Length(8)
  @ApiModelProperty()
  password: string;

  @IsNotEmpty()
  @ApiModelProperty()
  name: string;

  @ApiModelPropertyOptional()
  phone: string;

  @ApiModelPropertyOptional()
  gender: string;

  @ApiModelPropertyOptional()
  age: number;

  @ApiModelPropertyOptional()
  profession: string;

  @ApiModelPropertyOptional()
  domicile: string;

  @ApiModelPropertyOptional()
  description: string;

  @ApiModelPropertyOptional()
  expertises: string;

  @ApiModelPropertyOptional()
  relevance_issues: string;
}

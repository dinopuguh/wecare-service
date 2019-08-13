import { IsNotEmpty, Length, IsPhoneNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @IsNotEmpty()
  // @IsPhoneNumber('ID')
  @ApiModelProperty()
  phone: string;

  @IsNotEmpty()
  @ApiModelProperty()
  password: string;
}

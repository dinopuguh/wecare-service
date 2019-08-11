import { IsNotEmpty, Length } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @IsNotEmpty()
  @ApiModelProperty()
  username: string;

  @IsNotEmpty()
  @Length(8)
  @ApiModelProperty()
  password: string;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class WecarePoint {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @Column('int')
  point: number;
}

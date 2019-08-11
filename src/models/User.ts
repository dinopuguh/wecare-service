import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  Unique,
} from 'typeorm';
import * as crypto from 'crypto';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
@Unique(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  gender: string;

  @Column('int', { nullable: true })
  age: number;

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true })
  domicile: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('int', { nullable: true, default: 0 })
  wecare_point: number;

  @Column('text', { nullable: true })
  expertises: string;

  @Column('text', { nullable: true })
  relevance_issues: string;
}

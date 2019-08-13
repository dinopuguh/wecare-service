import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Activity } from './Activity';

@Entity()
@Unique(['phone', 'email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  gender: string;

  @Column('int', { nullable: true })
  age: number;

  @Column({ nullable: true })
  profession?: string;

  @Column({ nullable: true })
  domicile?: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('int', { nullable: true, default: 0 })
  wecare_point: number;

  @Column('text', { nullable: true })
  expertises?: string;

  @Column('text', { nullable: true })
  relevance_issues?: string;

  @OneToMany(type => Activity, activity => activity.campaigner)
  activities: Activity[];
}

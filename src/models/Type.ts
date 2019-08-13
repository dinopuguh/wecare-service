import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { Activity } from './Activity';

@Entity()
export class Type {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(type => Activity, activity => activity.type)
  activities: Activity[];
}

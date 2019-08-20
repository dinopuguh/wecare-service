import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Activity } from './Activity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Activity, activity => activity.category)
  activities: Activity[];
}

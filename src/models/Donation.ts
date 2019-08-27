import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Activity } from './Activity';
import { User } from './User';

@Entity()
export class Donation {
  @PrimaryGeneratedColumn()
  id: number;

  activityId: number;
  userId: number;

  @Column('int')
  amount: number;

  @Column()
  transferValidation: string;

  @Column({ default: false })
  isVerified: boolean;

  @ManyToOne(type => Activity, activity => activity.donations)
  activity: Activity;

  @ManyToOne(type => User, user => user.donations)
  user: User;
}

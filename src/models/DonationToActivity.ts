import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  Column,
} from 'typeorm';
import { Activity } from './Activity';
import { User } from './User';

@Entity()
export class DonationToActivity {
  @PrimaryGeneratedColumn()
  id: number;

  userId: number;
  activityId: number;

  @Column('int')
  amount: number;

  @Column()
  transferValidation: string;

  @Column({ default: false })
  isVerified: boolean;

  @ManyToOne(type => User, user => user.donatedActivities)
  user: User;

  @ManyToOne(type => Activity, activity => activity.donations)
  activity: Activity;
}

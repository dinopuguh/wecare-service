import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Activity } from './Activity';
import { User } from './User';

@Entity()
export class ActivityToUser {
  @PrimaryGeneratedColumn()
  id: number;

  activityId: number;
  userId: number;

  @Column({ default: false })
  isVerified?: boolean;

  @ManyToOne(type => Activity)
  activity: Activity;

  @ManyToOne(type => User, user => user.followedActivities)
  user: User;
}

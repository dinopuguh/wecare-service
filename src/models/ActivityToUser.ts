import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Activity } from './Activity';
import { User } from './User';

@Entity()
export class ActivityToUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  activityId: number;

  @Column('int')
  userId: number;

  @Column({ default: false })
  isPresent?: boolean;

  @ManyToOne(type => Activity, activity => activity.volunteers)
  activity: Activity;

  @ManyToOne(type => User, user => user.followedActivities)
  user: User;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Activity } from './Activity';
import { Location } from './Location';
import { ActivityToUser } from './ActivityToUser';
import { DonationToActivity } from './DonationToActivity';

@Entity()
@Unique(['phone', 'email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
  wecarePoint: number;

  @Column('text', { nullable: true })
  expertises?: string;

  @Column('text', { nullable: true })
  relevanceIssues?: string;

  @OneToMany(type => Activity, activity => activity.campaigner)
  activities: Activity[];

  @OneToMany(type => Location, location => location.user)
  locations: Location[];

  @ManyToMany(type => Activity)
  @JoinTable()
  bookmarks: Activity[];

  @OneToMany(
    type => DonationToActivity,
    donationToActivity => donationToActivity.user,
  )
  donatedActivities: DonationToActivity[];

  @OneToMany(type => ActivityToUser, activityToUser => activityToUser.user)
  followedActivities: ActivityToUser[];
}

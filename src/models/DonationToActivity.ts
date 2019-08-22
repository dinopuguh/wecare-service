import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  Column,
} from 'typeorm';
import { Donation } from './Donation';
import { Activity } from './Activity';

@Entity()
export class DonationToActivity {
  @PrimaryGeneratedColumn()
  id: number;

  donationId: number;
  activityId: number;

  @Column({ default: false })
  isVerified?: boolean;

  @ManyToOne(type => Donation)
  donation: Donation;

  @ManyToOne(type => Activity, activity => activity.donations)
  activity: Activity;
}

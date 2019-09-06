import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './Category';
import { User } from './User';
import { Type } from './Type';
import { Location } from './Location';
import { ActivityToUser } from './ActivityToUser';
import { Donation } from './Donation';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  categoryId: number;

  @Column('int')
  campaignerId: number;

  @Column('int')
  typeId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  photo: string;

  @Column('timestamp')
  start: Date;

  @Column('timestamp')
  end: Date;

  @Column('timestamp')
  registerDeadline: Date;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  volunteerTasks: string;

  @Column('text', { nullable: true })
  volunteerEquipments: string;

  @Column('text', { nullable: true })
  volunteerRequirements: string;

  @Column('text', { nullable: true })
  briefs: string;

  @Column('int', { nullable: true, default: 0 })
  minVolunteers: number;

  @Column('int', { nullable: true, default: 0 })
  donationTarget: number;

  @Column('int', { nullable: true, default: 0 })
  volunteersTotal: number;

  @Column('int', { default: 0 })
  donationsTotal: number;

  @Column({ default: false })
  cashedDown: boolean;

  @Column('text', { nullable: true })
  area: string;

  @Column('int', { default: 0 })
  maxParticipants: number;

  @Column('text', { nullable: true })
  reportText: string;

  @Column('text', { nullable: true })
  reportImage: string;

  @Column('boolean', { default: false })
  isDone: boolean;

  @ManyToOne(type => Category, category => category.activities)
  category: Category;

  @ManyToOne(type => User, user => user.activities)
  campaigner: User;

  @ManyToOne(type => Type, type => type.activities)
  type: Type;

  @ManyToMany(type => Location, { persistence: true })
  @JoinTable()
  locations: Location[];

  @OneToMany(type => Donation, donation => donation.activity)
  donations: Donation[];

  @OneToMany(type => ActivityToUser, activityToUser => activityToUser.activity)
  volunteers: ActivityToUser[];
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './Category';
import { User } from './User';
import { Type } from './Type';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  photo: string;

  @Column('timestamp')
  start: Date;

  @Column('timestamp')
  end: Date;

  @Column('timestamp')
  registerDeadline: Date;

  @Column('text')
  description: string;

  @Column('text')
  volunteerTasks: string;

  @Column('text')
  volunteerEquipments: string;

  @Column('text')
  volunteerRequirements: string;

  @Column('text')
  briefs: string;

  @Column('int', { nullable: true, default: 0 })
  minVolunteers: number;

  @Column('int', { nullable: true, default: 0 })
  donationTarget: number;

  @Column('int', { nullable: true, default: 0 })
  volunteersTotal: number;

  @Column('int', { nullable: true, default: 0 })
  donationsTotal: number;

  @Column({ nullable: true, default: false })
  cashedDown: boolean;

  @Column('text', { nullable: true })
  area: string;

  @Column('int', { nullable: true, default: 0 })
  maxParticipants: number;

  @Column('text', { nullable: true })
  reportText: string;

  @Column('text', { nullable: true })
  reportImage: string;

  @Column('boolean', { default: false })
  isDone: boolean;

  @ManyToOne(type => Category, category => category.activities)
  category: Category;

  @Column()
  categoryId: number;

  @ManyToOne(type => User, user => user.activities)
  campaigner: User;

  @Column()
  campaignerId: number;

  @ManyToOne(type => Type, type => type.activities)
  type: Type;

  @Column()
  typeId: number;
}

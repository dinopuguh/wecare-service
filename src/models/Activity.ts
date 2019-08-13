import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './Category';
import { User } from './User';
import { Type } from './Type';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  photo: string;

  @Column('timestamp')
  start: Date;

  @Column('timestamp')
  end: Date;

  @Column('timestamp')
  register_deadline: Date;

  @Column('text')
  description: string;

  @Column('text')
  volunteer_tasks: string;

  @Column('text')
  volunteer_equipments: string;

  @Column('text')
  volunteer_requirements: string;

  @Column('text')
  briefs: string;

  @Column('int', { nullable: true, default: 0 })
  min_volunteers: number;

  @Column('int', { nullable: true, default: 0 })
  donation_target: number;

  @Column('int', { nullable: true, default: 0 })
  volunteers_total: number;

  @Column('int', { nullable: true, default: 0 })
  donations_total: number;

  @Column({ nullable: true, default: false })
  cashed_down: boolean;

  @Column('text', { nullable: true })
  area: string;

  @Column('int', { nullable: true, default: 0 })
  max_participants: number;

  @Column('text', { nullable: true })
  report_text: string;

  @Column('text', { nullable: true })
  report_image: string;

  @ManyToOne(type => Category, category => category.activities)
  category: Category;

  @ManyToOne(type => User, user => user.activities)
  campaigner: User;

  @ManyToOne(type => Type, type => type.activities)
  type: Type;
}

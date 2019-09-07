import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Activity } from './Activity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column('float', { nullable: true })
  latitude: number;

  @Column('float', { nullable: true })
  longitude: number;

  @Column('timestamp', { nullable: true })
  start: Date;

  @Column('timestamp', { nullable: true })
  end: Date;

  @Column('text', { nullable: true })
  description: string;

  @Column('int', { nullable: true })
  capacity: number;

  @Column({ nullable: true })
  licensePhoto: string;

  @Column({ nullable: true })
  locationPhoto: string;

  @Column({ default: false })
  isApproved: boolean;

  @ManyToOne(type => User, user => user.locations)
  user: User;
}

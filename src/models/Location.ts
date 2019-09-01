import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

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

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column('timestamp')
  start: Date;

  @Column('timestamp')
  end: Date;

  @Column('text')
  description: string;

  @Column()
  licensePhoto: string;

  @Column()
  locationPhoto: string;

  @Column({ default: false })
  isApproved: boolean;

  @ManyToOne(type => User, user => user.locations)
  user: User;
}

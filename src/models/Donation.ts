import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Donation {
  @PrimaryGeneratedColumn()
  id: number;

  userId: number;

  @Column()
  amount: number;

  @Column()
  transferValidation: string;

  @ManyToOne(type => User, user => user.donations)
  user: User;
}

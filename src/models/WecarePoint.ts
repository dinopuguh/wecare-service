import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WecarePoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int')
  point: number;
}

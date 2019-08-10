import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  photo: string;

  @Column()
  gender: string;

  @Column('int')
  age: number;

  @Column()
  profession: string;

  @Column()
  domicile: string;

  @Column('text')
  description: string;

  @Column('int')
  wecare_point: number;

  @Column('text')
  expertises: string;

  @Column('text')
  relevance_issues: string;
}

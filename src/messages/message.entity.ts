import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Message {

  @ObjectIdColumn()
  id: string;

  @Column()
  content: string;

  @Column()
  status: string;

  @CreateDateColumn()
  date: Date;
}

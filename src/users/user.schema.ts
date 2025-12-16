import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId; // MongoDB _id

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  status: string;
}

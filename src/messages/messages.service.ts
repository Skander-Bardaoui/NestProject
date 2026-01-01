import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {

  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  async create(content: string, status: string): Promise<Message> {
    const message = this.messageRepo.create({
      content,
      status,
      date: new Date(),
    });
    return this.messageRepo.save(message);
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepo.find();
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity'; // <-- your TypeORM entity
import { AdminUsersController } from './admin-users.controller';
import { ClientUsersController } from './client-users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [
    UsersController,
    AdminUsersController,
    ClientUsersController
  ],
  providers: [UsersService],
})
export class UsersModule {}

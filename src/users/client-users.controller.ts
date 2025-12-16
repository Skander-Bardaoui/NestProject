import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleFilterInterceptor } from './interceptors/role-filter.interceptor';

@Controller('client/users')
@UseInterceptors(RoleFilterInterceptor)
export class ClientUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return this.usersService.findAll();
  }
}

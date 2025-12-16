import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleFilterInterceptor } from './interceptors/role-filter.interceptor';

@Controller('admin/users')
@UseInterceptors(RoleFilterInterceptor)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }
}

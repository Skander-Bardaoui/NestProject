import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // -------------------
  // Basic CRUD
  // -------------------
  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  // -------------------
  // Advanced Queries
  // -------------------

  // 1. Users inactive 6 months
  @Get('inactive/six-months')
  findInactive6Months() {
    return this.usersService.findInactive6Months();
  }

  // 2. Users by email domain
  @Get('email-domain')
  findByEmailDomain(@Query('domain') domain: string) {
    return this.usersService.findByEmailDomain(domain);
  }

  // 3. Users created last 7 days
  @Get('created/last-7-days')
  findCreatedLast7Days() {
    return this.usersService.findCreatedLast7Days();
  }

  // 4. Count by role
  @Get('count-by-role')
  countByRole() {
    return this.usersService.countByRole();
  }

  // 5. Users created between dates
  @Get('created-between')
  findBetweenDates(@Query('start') start: string, @Query('end') end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.usersService.findBetweenDates(startDate, endDate);
  }

  // 6. Most recent users
  @Get('most-recent')
  findMostRecent(@Query('limit') limit: string) {
    return this.usersService.findMostRecent(Number(limit) || 5);
  }

  // 7. Average days between creation & update
  @Get('avg-days')
  avgDaysBetweenCreateUpdate() {
    return this.usersService.avgDaysBetweenCreateUpdate();
  }

  // -------------------
  // Pagination & Sorting
  // -------------------
  @Get('paginated')
  findPaginated(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sortBy') sortBy: string,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Query('multiSort') multiSort?: string,
  ) {
    const multiSortArr = multiSort ? multiSort.split(',') : [];
    return this.usersService.findPaginated(
      Number(page) || 1,
      Number(limit) || 10,
      sortBy || 'createdAt',
      order,
      multiSortArr,
    );
  }

  // -------------------
  // Bulk / special updates
  // -------------------

  // 1. Disable inactive users (>1 year)
  @Put('disable-inactive')
  disableInactiveUsers() {
    return this.usersService.disableInactiveUsers();
  }

  // 2. Bulk update role by email domain
  @Put('update-role-by-domain')
  updateRoleByEmailDomain(
    @Query('domain') domain: string,
    @Query('role') role: 'admin' | 'client',
  ) {
    return this.usersService.updateRoleByEmailDomain(domain, role);
  }
}

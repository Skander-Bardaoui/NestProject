import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // -------------------
  // Basic CRUD
  // -------------------
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id: new ObjectId(id) });
  }

  async create(dto: CreateUserDto): Promise<User> {
    // Vérifier doublon email
    const existing = await this.userRepository.findOneBy({ email: dto.email });
    if (existing) throw new Error('Email already exists');

    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: new ObjectId(id) });
    if (!user) return null;

    // journalisation des modifications
    console.log('Before update:', user);
    Object.assign(user, dto);
    const updatedUser = await this.userRepository.save(user);
    console.log('After update:', updatedUser);

    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete({ id: new ObjectId(id) });
    if ('raw' in result && result.raw?.deletedCount !== undefined) {
      return result.raw.deletedCount > 0;
    }
    return false;
  }

  // -------------------
  // Advanced Queries
  // -------------------

  // Users not updated in last 6 months
  async findInactive6Months(): Promise<User[]> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return this.userRepository.find({
      where: { updatedAt: MoreThan(sixMonthsAgo) }, // MoreThan = updated after; use LessThan for before
    });
  }

  // Users by email domain
  async findByEmailDomain(domain: string): Promise<User[]> {
    return this.userRepository.find({
      where: { email: { $regex: `@${domain}$`, $options: 'i' } } as any, // TS + TypeORM workaround
    });
  }

  // Users created in last 7 days
  async findCreatedLast7Days(): Promise<User[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.userRepository.find({
      where: { createdAt: MoreThan(sevenDaysAgo) },
    });
  }

  // Count users by role
  async countByRole(): Promise<Record<string, number>> {
    const users = await this.userRepository.find();
    const result: Record<string, number> = {};
    users.forEach(u => {
      result[u.role] = (result[u.role] || 0) + 1;
    });
    return result;
  }

  // Users created between two dates
  async findBetweenDates(date1: Date, date2: Date): Promise<User[]> {
    return this.userRepository.find({
      where: { createdAt: Between(date1, date2) },
    });
  }

  // Most recent users by createdAt
  async findMostRecent(limit = 5): Promise<User[]> {
    return this.userRepository.find({ order: { createdAt: 'DESC' }, take: limit });
  }

  // Average days between creation and last update
  async avgDaysBetweenCreateUpdate(): Promise<number> {
    const users = await this.userRepository.find();
    const totalDays = users.reduce((acc, u) => {
      const diff = u.updatedAt.getTime() - u.createdAt.getTime();
      return acc + diff / (1000 * 60 * 60 * 24);
    }, 0);
    return users.length ? totalDays / users.length : 0;
  }

  // -------------------
  // Pagination & Sorting
  // -------------------
  async findPaginated(
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
    multiSort?: string[],
  ): Promise<User[]> {
    const skip = (page - 1) * limit;
    let orderObj: any = { [sortBy]: order };
    if (multiSort && multiSort.length) {
      multiSort.forEach(field => (orderObj[field] = order));
    }
    return this.userRepository.find({ order: orderObj, skip, take: limit });
  }

  // -------------------
  // Bulk / special updates
  // -------------------

  // Disable inactive users (>1 year)
  async disableInactiveUsers(): Promise<void> {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const users = await this.userRepository.find({ where: { updatedAt: MoreThan(oneYearAgo) } });
    for (const user of users) {
      (user as any).disabled = true; // Add `disabled` field in entity if needed
      await this.userRepository.save(user);
    }
  }

  // Bulk update role for a specific email domain
  async updateRoleByEmailDomain(domain: string, newRole: 'admin' | 'client'): Promise<void> {
    const users = await this.findByEmailDomain(domain);
    for (const user of users) {
      user.role = newRole;
      await this.userRepository.save(user);
    }
  }
}

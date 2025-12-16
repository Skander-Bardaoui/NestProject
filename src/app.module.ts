import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://skonbardaoui_db_user:T9p7jnIV4vR0K1jl@newdb.jq557s8.mongodb.net/hr_management?retryWrites=true&w=majority',
      database: 'hr_management',
      synchronize: true,
      logging: true,
      autoLoadEntities: true,  
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

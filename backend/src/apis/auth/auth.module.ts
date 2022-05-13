import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtRefreshStrategy } from 'src/common/auth/jwt-refresh.strategy';
import { User } from '../users/entities/users.entity';
import { UserService } from '../users/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
//import 'dotenv/config';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])], //
  providers: [
    AuthResolver, //
    AuthService,
    UserService,
    JwtRefreshStrategy,
  ],
  //controllers: [],
})
export class AuthModule {}

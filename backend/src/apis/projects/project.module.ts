import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectAddress } from '../projectAddress/entities/projectAddress.entity';
import { User } from '../users/entities/users.entity';
import { UserService } from '../users/user.service';
import { Project } from './entities/project.entity';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectAddress, User])],
  providers: [ProjectService, ProjectResolver, UserService],
})
export class ProjectModule {}

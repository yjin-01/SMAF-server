import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectAddress } from '../projectAddress/entities/projectAddress.entity';
import { Project } from './entities/project.entity';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectAddress])],
  providers: [ProjectService, ProjectResolver],
})
export class ProjectModule {}

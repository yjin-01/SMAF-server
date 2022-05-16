import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessCategory } from './entities/processCategory.entity';

@Injectable()
export class ProcessCategoryService {
  constructor(
    @InjectRepository(ProcessCategory)
    private readonly processCategoryRepository: Repository<ProcessCategory>,
  ) {}
  // 전체 조회

  // 프로젝트ID로 조회
  async find({ projectId }) {
    const categoryies = await this.processCategoryRepository
      .createQueryBuilder('processCategory')
      .orderBy('processCategory.createAt', 'ASC')
      .leftJoinAndSelect('processCategory.project', 'project')
      .where('project.projectId = :projectID', { projectId: projectId })
      .getMany;

    return categoryies;
  }

  // 생성
  async create({ processName, project }) {
    const category = await this.processCategoryRepository.save({
      processName,
      project,
    });

    return category;
  }
}

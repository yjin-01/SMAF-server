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
      .where('processCategory.project = :projectId', { projectId: projectId })
      .orderBy('processCategory.createAt', 'ASC')
      .leftJoinAndSelect('processCategory.project', 'project')
      .getMany();
    console.log(categoryies);

    return categoryies;
  }

  //카테고리ID로 조회
  async findOne({ processCategoryId }) {
    const category = await this.processCategoryRepository
      .createQueryBuilder('processCategory')
      .where('processCategory.processCategoryId = :processCategoryId', {
        processCategoryId: processCategoryId,
      })
      .orderBy('processCategory.createAt', 'ASC')
      .leftJoinAndSelect('processCategory.project', 'project')
      .getMany();
    console.log(category);
    return category;
  }
  // 생성
  async create({ processName, projectId }) {
    const category = await this.processCategoryRepository.save({
      processName,
      project: { projectId: projectId },
    });

    return category;
  }

  // 수정
  async update({ processName, projectId }) {
    const category = await this.processCategoryRepository.findOne({
      where: { project: projectId },
    });
    const newCategory = {
      ...category,
      processName,
    };

    return await this.processCategoryRepository.save(newCategory);
  }

  // 삭제

  async delete({ processCategoryId }) {
    const result = await this.processCategoryRepository.delete({
      processCategoryId,
    });

    return result.affected ? true : false;
  }
}

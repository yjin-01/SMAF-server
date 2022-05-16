import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessCategory } from './entities/processCategory.entity';

@Injectable()
export class ProcessCategoryService {
  constructor(
    @InjectRepository(ProcessCategory)
    private readonly processCategory: Repository<ProcessCategory>,
  ) {}
}

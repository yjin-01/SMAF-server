import { Resolver } from '@nestjs/graphql';
import { ProcessCategoryService } from './processCategory.service';

@Resolver()
export class ProcessCategoryResolver {
  constructor(
    private readonly processCategoryService: ProcessCategoryService,
  ) {}
}

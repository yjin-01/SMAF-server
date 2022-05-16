import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProcessCategory } from './entities/processCategory.entity';
import { ProcessCategoryService } from './processCategory.service';

@Resolver()
export class ProcessCategoryResolver {
  constructor(
    private readonly processCategoryService: ProcessCategoryService,
  ) {}
  // 카테고리 조회
  @Query(() => [ProcessCategory])
  async fetchProcessCategories(
    @Args('projectId') projectId: string, //
  ) {
    return await this.processCategoryService.find({ projectId });
  }

  // 카테고리 생성
}

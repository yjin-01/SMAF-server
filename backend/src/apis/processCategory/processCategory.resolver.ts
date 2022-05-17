import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { ProcessCategory } from './entities/processCategory.entity';
import { ProcessCategoryService } from './processCategory.service';

@Resolver()
export class ProcessCategoryResolver {
  constructor(
    private readonly processCategoryService: ProcessCategoryService,
  ) {}
  // 카테고리 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProcessCategory])
  async fetchProcessCategories(
    @Args('projectId') projectId: string, //
  ) {
    return await this.processCategoryService.find({ projectId });
  }

  // 카테고리 조회(categoryId 사용)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProcessCategory])
  async fetchprocessCategory(
    @Args('processCategoryId') processCategoryId: string, //
  ) {
    return await this.processCategoryService.findOne({ processCategoryId });
  }

  // 카테고리 생성
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ProcessCategory)
  async createProcessCategory(
    @Args('processName') processName: string, //
    @Args('projectId') projectId: string,
  ) {
    return await this.processCategoryService.create({ processName, projectId });
  }

  // 카테고리 수정
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ProcessCategory)
  async updateProcessCategory(
    @Args('processName') processName: string, //
    @Args('projectId') projectId: string,
  ) {
    return await this.processCategoryService.update({ processName, projectId });
  }

  // 카테고리 삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteProcessCategory(
    @Args('processCategoryId') processCategoryId: string,
  ) {
    return await this.processCategoryService.delete({ processCategoryId });
  }
}

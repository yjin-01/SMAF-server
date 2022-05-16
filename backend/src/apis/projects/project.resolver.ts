import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { createProjectInput } from './dto/createProject.input';
import { UpdateProjectInput } from './dto/updateProject.input';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

@Resolver()
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService, //
  ) {}

  // 프로젝트 전체 목록 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Project])
  async fetchProjectsAll() {
    return await this.projectService.findAll();
  }

  // 프로젝트 목록 조회(회원별)
  // @UseGuards(GqlAuthAccessGuard)
  // @Query(() => [Project])
  // async fetchProjects(
  //   @Args('email') email: string, //
  // ) {
  //   return await this.projectService.findEmailAll({ email });
  // }

  // 프로젝트 조회

  // 프로젝트 생성
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Project)
  createProject(
    @Args('createProjectInput') createProjectInput: createProjectInput,
  ) {
    return this.projectService.create({ createProjectInput });
  }

  // 프로젝트 수정
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Project)
  updateProject(
    @Args('projectId') projectId: string,
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
  ) {
    return this.projectService.update({ projectId, updateProjectInput });
  }

  // 프로젝트 삭제

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteProject(
    @Args('projectId') projectId: string, //
  ) {
    return this.projectService.delete({ projectId });
  }
}

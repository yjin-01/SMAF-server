import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.parm';
import { CreateProjectInput } from './dto/createProject.input';
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

  // 프로젝트 조회(projectId)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Project)
  async fetchProject(
    @Args('projectId') projectId: string, //
  ) {
    return this.projectService.findOne({ projectId });
  }

  // 프로젝트 생성
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Project)
  createProject(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
  ) {
    return this.projectService.create({
      createProjectInput,
      email: currentUser.email,
    });
  }

  // 프로젝트 수정
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Project)
  updateProject(
    @Args('projectId') projectId: string,
    //@Args('projectAddressId') projectAddressId: string,
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
  ) {
    return this.projectService.update({
      projectId,
      updateProjectInput,
    });
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

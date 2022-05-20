import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.parm';

import { ProjectParticipant } from './entities/projectParticipant.entity';
import { ProjectParticipantService } from './projectParticipant.service';

@Resolver()
export class ProjectParticipantResolver {
  constructor(
    private readonly projectParticipantService: ProjectParticipantService,
  ) {}

  // 프로젝트별 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProjectParticipant])
  async fetchParticipatingUser(
    @Args('projectId') projectId: string, //
  ) {
    return await this.projectParticipantService.findParticipatingUser({
      projectId,
    });
  }

  // 회원별 조회(전체 출력)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProjectParticipant])
  async fetchParticipatingProject(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return await this.projectParticipantService.findParticipatingProject({
      userId: currentUser.id,
    });
  }

  //회원의 진행중인 프로젝트 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProjectParticipant])
  async fetchActivatedProject(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    const result = await this.projectParticipantService.findActivatedProject({
      userId: currentUser.id,
    });
    console.log('🔴🔴🔴🔴', result);
    return result;
  }

  // 회원의 끝난 프로젝트 조회

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProjectParticipant])
  async fetchInactivatedProject(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return await this.projectParticipantService.findInactivatedProject({
      userId: currentUser.id,
    });
  }

  // 참여회원 생성
  @Mutation(() => ProjectParticipant)
  async createParticipant(
    @Args('email') email: string, //
    @Args('projecId') projectId: string,
  ) {
    return await this.projectParticipantService.create({
      email,
      projectId,
      position: '팀원',
    });
  }

  // 참여회원 수정
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ProjectParticipant)
  async updateParticipant(
    @Args('isActivated') isActivated: boolean, //
    @Args('projectParticipantId') projectParticipantId: string,
  ) {
    return await this.projectParticipantService.update({
      isActivated,
      projectParticipantId,
    });
  }

  // 참여회원 삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteParticipant(
    @Args('projectParticipantId') projectParticipantId: string, //
  ) {
    return await this.projectParticipantService.delete({
      projectParticipantId,
    });
  }
}

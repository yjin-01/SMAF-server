import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/users.entity';

import { ProjectParticipant } from './entities/projectParticipant.entity';

@Injectable()
export class ProjectParticipantService {
  constructor(
    @InjectRepository(ProjectParticipant)
    private readonly projectParticipantRepository: Repository<ProjectParticipant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}
  // projectId로 조회
  async findProject({ projectId }) {
    const participants = await this.projectParticipantRepository
      .createQueryBuilder('projectParticipant')
      .where('projectParticipant.project = :project', { project: projectId })
      .orderBy('projectParticipant.createdAt', 'ASC')
      .leftJoinAndSelect('projectParticipant.project', 'project')
      .leftJoinAndSelect('projectParticipant.user', 'user')
      .getMany();

    return participants;
  }

  // userId로 조회
  async findUser({ userId }) {
    const projects = await this.projectParticipantRepository
      .createQueryBuilder('projectParticipant')
      .where('projectParticipant.user = :user', { user: userId })
      .orderBy('projectParticipant.createdAt', 'ASC')
      .leftJoinAndSelect('projectParticipant.project', 'project')
      .leftJoinAndSelect('projectParticipant.user', 'user')
      .getMany();

    console.log(projects);
    return projects;
  }

  // 생성
  async create({ position, email, projectId }) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) throw new BadRequestException('회원이 아닙니다!');

    const project = await this.projectRepository.findOne({
      where: { projectId: projectId },
    });

    if (!project)
      throw new BadRequestException('일치하는 프로젝트가 없습니다.');

    const participant = await this.projectParticipantRepository.save({
      position,
      user: user,
      project: project,
    });

    return participant;
  }

  // 수정
  async update({ isActivated, projectParticipantId }) {
    const participant = await this.projectParticipantRepository
      .createQueryBuilder('projectParticipant')
      .where(
        'projectParticipant.projectParticipantId = :projectParticipantId',
        { projectParticipantId },
      )
      .leftJoinAndSelect('projectParticipant.project', 'project')
      .leftJoinAndSelect('projectParticipant.user', 'user')
      .getOne();

    if (!participant)
      throw new BadRequestException(
        '프로젝트 참여회원 중 일치하는 회원이 없습니다.',
      );

    const newParticipant = {
      ...participant,
      isActivated,
    };

    return await this.projectParticipantRepository.save(newParticipant);
  }

  // 삭제
  async delete({ projectParticipantId }) {
    const result = await this.projectParticipantRepository.delete({
      projectParticipantId,
    });
    return result.affected ? true : false;
  }
}

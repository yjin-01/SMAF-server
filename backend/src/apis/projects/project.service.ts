import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { ProjectAddress } from '../projectAddress/entities/projectAddress.entity';
import {
  PARTICIPANT_POSITION_ENUM,
  ProjectParticipant,
} from '../projectParticipants/entities/projectParticipant.entity';
import { ProjectParticipantService } from '../projectParticipants/projectParticipant.service';
import { User } from '../users/entities/users.entity';
import { UserService } from '../users/user.service';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectAddress)
    private readonly projectAddressRepository: Repository<ProjectAddress>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProjectParticipant)
    private readonly participantRepository: Repository<ProjectParticipant>,
    private readonly connection: Connection,
  ) {}
  //전체 목록 조회
  async findAll() {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .orderBy('project.createAt', 'ASC')
      .leftJoinAndSelect('project.address', 'projectAddress')
      .getMany();
    return projects;
  }

  // 회원이메일로 조회(모든 프로젝트)
  async findEmailAll({ email }) {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.email = :email', { email: email })
      .orderBy('project.createAt', 'ASC')
      .leftJoinAndSelect('project.address', 'projectAddress')
      .getMany();
    if (!projects)
      throw new BadRequestException('해당하는 프로젝트가 없습니다.😢');
    return projects;
  }
  // 회원이메일로 조회(진행중인 프로젝트)
  async findEmailTrue({ email }) {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.email = :email', { email: email })
      .andWhere('project.status = :status', { status: true })
      .orderBy('project.createAt', 'ASC')
      .leftJoinAndSelect('project.address', 'projectAddress')
      .getMany();

    if (!projects)
      throw new BadRequestException('진행중인 프로젝트가 없습니다.😢');
  }

  // 회원이메일로 조회(완료된 프로젝트)
  async findEmailFalse({ email }) {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.email = :email', { email: email })
      .andWhere('project.status = :status', { status: false })
      .orderBy('project.createAt', 'ASC')
      .leftJoinAndSelect('project.address', 'projectAddress')
      .getMany();

    if (!projects)
      throw new BadRequestException('완료된 프로젝트가 없습니다.😢');
  }

  // 프로젝트ID로 조회
  async findOne({ projectId }) {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.projectId = :projectId', { projectId })
      .leftJoinAndSelect('project.address', 'projectAddress')
      .getOne();

    if (!project)
      throw new BadRequestException('해당하는 프로젝트가 없습니다.😢');

    return project;
  }

  // 생성
  async create({ createProjectInput, email }) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');

    // 티켓 차감(Transaction 사용 예정)
    try {
      const { projectAddress, ...rest } = createProjectInput;

      const address = this.projectAddressRepository.create({
        ...projectAddress,
      });
      await queryRunner.manager.save(address);

      const project = this.projectRepository.create({
        ...rest,
        email,
        address,
      });

      const saveProject = await queryRunner.manager.save(project);

      const user = await queryRunner.manager.findOne(
        User,
        { email },
        { lock: { mode: 'pessimistic_write' } },
      );

      const createProject = this.userRepository.create({
        ...user,
        projectTicket: user.projectTicket - 1,
      });

      const newUser = await queryRunner.manager.save(createProject);

      console.log('🍄🍄🍄🍄', saveProject[0]);

      console.log('⭐️⭐️⭐️⭐️', newUser);

      const projectParticipant = this.participantRepository.create({
        position: PARTICIPANT_POSITION_ENUM.LEADER,
        project: { ...saveProject, address: projectAddress },
        user: newUser,
      });
      console.log('⭐️⭐️⭐️⭐️', projectParticipant);

      await queryRunner.manager.save(projectParticipant);

      await queryRunner.commitTransaction();

      return saveProject;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // 수정

  async update({ projectId, updateProjectInput, projectAddressId }) {
    const { projectAddress, ...rest } = updateProjectInput;
    const oldAddress = this.projectAddressRepository.findOne({
      where: { address: projectAddressId },
    });

    const newAddress = {
      ...oldAddress,
      ...projectAddress,
    };
    const updateAddress = this.projectAddressRepository.save(newAddress);
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.projectId = :projectId', { projectId })
      .leftJoinAndSelect('project.address', 'projectAddress')
      .getOne();

    const newProject = {
      ...project,
      ...rest,
      address: updateAddress,
    };

    return await this.projectRepository.save(newProject);
  }

  // 삭제
  async delete({ projectId }) {
    const result = await this.projectRepository.softDelete({
      projectId: projectId,
    }); // 다양한 조건으로 삭제 가능
    return result.affected ? true : false;
  }
}

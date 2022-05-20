import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectAddress } from '../projectAddress/entities/projectAddress.entity';
import { UserService } from '../users/user.service';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectAddress)
    private readonly projectAddressRepository: Repository<ProjectAddress>,

    private readonly userService: UserService,
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
    try {
      // 티켓 차감(Transaction 사용 예정)
      const user = await this.userService.updateTicket({ email });

      const { projectAddress, ...rest } = createProjectInput;
      const address = await this.projectAddressRepository.save({
        ...projectAddress,
      });

      const project = await this.projectRepository.save({
        ...rest,
        address: address,
      });
      return project;
    } catch {
      throw new InternalServerErrorException('프로젝트 생성 실패');
    }
  }

  // 수정
  async update({ projectId, updateProjectInput }) {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.projectId = :projectId', { projectId })
      .leftJoinAndSelect('project.address', 'projectAddress')
      .getOne();

    const newProject = {
      ...project,
      ...updateProjectInput,
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

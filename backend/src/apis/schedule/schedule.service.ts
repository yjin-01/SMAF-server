import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessCategory } from '../processCategory/entities/processCategory.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/users.entity';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProcessCategory)
    private readonly processCategoryRepository: Repository<ProcessCategory>,
  ) {}
  // 전체조회
  async findAll() {
    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.processCategory', 'processCategory')
      .leftJoinAndSelect('schedule.project', 'project')
      .leftJoinAndSelect('schedule.user', 'user')
      .getMany();
    console.log(schedules);

    return schedules;
  }

  // categoryId로 조회
  async findCategory({ processCategoryId }) {
    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.processCategory', 'processCategory')
      .leftJoinAndSelect('schedule.project', 'project')
      .leftJoinAndSelect('schedule.user', 'user')
      .where(
        'schedule.processCategory.processCategoryId = :processCategoryId',
        { processCategoryId },
      )
      .orderBy('schedule.createAt', 'DESC')
      .getMany();
    return schedules;
  }

  // projectId로 조회
  async findProject({ projectId }) {
    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.processCategory', 'processCategory')
      .leftJoinAndSelect('schedule.project', 'project')
      .leftJoinAndSelect('schedule.user', 'user')
      .orderBy('schedule.createAt', 'DESC')
      .where('schedule.project.projectId = :projectId', { projectId })
      .getMany();

    return schedules;
  }

  // scheduleId로 조회
  async find({ scheduleId }) {
    const schedule = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.scheduleId = :scheduleId', { scheduleId })
      .leftJoinAndSelect('schedule.processCategory', 'processCategory')
      .leftJoinAndSelect('schedule.project', 'project')
      .leftJoinAndSelect('schedule.user', 'user')
      .getOne();

    return schedule;
  }

  // 생성
  async create({ createScheduleInput, userId }) {
    const { processCategoryId, projectId, ...rest } = createScheduleInput;

    const user = await this.UserRepository.findOne({ where: { userId } });
    console.log('⭐️⭐️⭐️⭐️', user);
    const processCategory = await this.processCategoryRepository.findOne({
      where: { processCategoryId },
    });
    const project = await this.projectRepository.findOne({
      where: { projectId },
    });
    const schedule = await this.scheduleRepository.save({
      ...rest,
      processCategory: processCategory,
      user: user,
      project: project,
    });
    console.log(schedule);

    return schedule;
  }

  // 수정
  async update({ scheduleId, updateScheduleInput }) {
    const { processCategoryId, ...rest } = updateScheduleInput;
    const schedule = await this.scheduleRepository.findOne({
      where: { scheduleId: scheduleId },
    });

    const processCategory = await this.processCategoryRepository.findOne({
      where: { processCategoryId },
    });

    const newSchedule = {
      ...schedule,
      ...rest,
      processCategory: processCategory,
    };
    const result = await this.scheduleRepository.save(newSchedule);
    console.log(result);

    return result;
  }

  // 삭제
  async delete({ scheduleId }) {
    const result = await this.scheduleRepository.delete({
      scheduleId: scheduleId,
    });

    return result.affected ? true : false;
  }
}

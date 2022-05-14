import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .getMany();
    console.log(users);
    return users;
  }

  async findOne({ userId }) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId = :userId', { userId: userId })
      .getMany();
    console.log(user);
    return user;
  }

  async findEmailAll({ email }) {
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new BadRequestException('일치하는 이메일이 없습니다😢');
    return user;
    // const users = await this.userRepository
    //   .createQueryBuilder('user')
    //   .where('user.email = :email', { email: email })
    //   .getMany();
    // console.log(users);
    // return users;
  }

  async create({ createUserInput }) {
    const { email, ...rest } = createUserInput;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new BadRequestException('이미 등록된 이메일입니다.');
    return await this.userRepository.save({ ...createUserInput });
  }

  async update({ email, password }) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new BadRequestException('일치하는 이메일이 존재하지 않습니다.');
    const newUser = {
      ...user,
      password,
    };
    return await this.userRepository.save(newUser);
  }

  async delete({ email }) {
    const result = await this.userRepository.softDelete({ email });
    return result.affected ? true : false;
  }

  // 회원 삭제 복구(만약 신고기능 넣을 시 활용가능할 듯)
  async restore({ userId }) {
    const result = await this.userRepository.restore({ userId });
    return result.affected ? true : false;
  }
}

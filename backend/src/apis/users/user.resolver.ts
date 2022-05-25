import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { createUserInput } from './dto/createUser.input';
import { User } from './entities/users.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.parm';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // 전체 회원 목록 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [User])
  fetchUsers() {
    return this.userService.findAll();
  }

  // 전체 회원 목록 조회
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchLoginUser(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    console.log(currentUser.email);
    return this.userService.findEmailAll({ email: currentUser.email });
  }

  // 회원아이디로 회원 찾기
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUser(
    @Args('userId') userId: string, //
  ) {
    return this.userService.findOne({ userId });
  }

  // 회원이메일로 찾기
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [User])
  fetchUserEmail(
    // @Args('email') email: string,
    @Args('userormail') userOremail: string,
  ) {
    // return this.userService.findEmailAll({ email });
    return this.userService.findAny({ userOremail });
  }

  // 회원 가입
  @Mutation(() => User)
  async createUser(
    @Args('createUserInput')
    createUserInput: createUserInput, //
  ) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    createUserInput.password = hashedPassword;
    console.log(hashedPassword);
    return this.userService.create({ createUserInput });
  }

  // 회원 비밀번호 변경
  @Mutation(() => String)
  async updatePassword(
    @Args('email') email: string,
    @Args('password') password: string, //
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.update({
      email,
      password: hashedPassword,
    });
    return '비밀번호 변경 완료';
  }

  // 회원 삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(
    @Args('email') email: string, //
  ) {
    return this.userService.delete({ email });
  }
}

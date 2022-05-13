import { Injectable, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserInput } from './dto/createUser.input';
import { User } from './entities/users.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // 전체 회원 목록 조회
  @Query(() => [User])
  fetchUsers() {
    return this.userService.findAll();
  }

  // 회원아이디로 회원 찾기
  @Query(() => [User])
  fetchUser(
    @Args('userId') userId: string, //
  ) {
    return this.userService.findOne({ userId });
  }

  // 회원이메일로 찾기
  @Query(() => User)
  fetchUserEmail(
    @Args('email') email: string, //
  ) {
    return this.userService.findEmailAll({ email });
  }

  // 회원 가입
  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: createUserInput, //
  ) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    createUserInput.password = hashedPassword;
    console.log(hashedPassword);
    return this.userService.create({ createUserInput });
  }

  // @UseGuards()
  // @Mutation(() => User)
  // async updateUSer(
  //   @CurrentUser() currentUser: any,
  //   @Args('password') password: string, //
  // ) {}
}

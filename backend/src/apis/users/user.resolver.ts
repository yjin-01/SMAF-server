import { Injectable } from '@nestjs/common';
import { Mutation, Resolver, Query } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';

@Resolver()
export class UserResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Query(() => String)
  fetchUsers() {
    return 'bbb';
  }
  @Mutation(() => String)
  createUser() {
    return 'aaa';
  }
}

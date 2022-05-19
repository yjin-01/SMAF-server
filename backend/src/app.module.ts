import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './apis/users/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './apis/projects/project.module';
import { QuestionBoardModule } from './apis/questionBoards/questionboards.module';
import { QuestionCommentModule } from './apis/questionComments/questionComment.module';
import { ProcessCategoryModule } from './apis/processCategory/processCategory.module';
import { FileModule } from './apis/file/file.module';
import { PaymentModule } from './apis/payment/payment.module';
import { ScheduleModule } from './apis/schedule/schedule.module';
import { ProjectParticipantModule } from './apis/projectParticipants/projectParticipant.module';

@Module({
  imports: [
    AuthModule,
    FileModule,
    PaymentModule,
    ProjectParticipantModule,
    ProcessCategoryModule,
    ProjectModule,
    QuestionBoardModule,
    QuestionCommentModule,
    ScheduleModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.SQLHOST,
      username: 'root',
      password: process.env.SQLHOSTPASSWORD,
      database: 'teamdatabase',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        origin: process.env.CORSADDRESS,
        credentials: true,
      },
    }),

    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://team-redis:6379',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

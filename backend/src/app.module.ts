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
import { QuestionBoard } from './apis/questionBoards/entities/questionBoard.entity';
import { QuestionComment } from './apis/questionComments/entities/questionComment.entity';

@Module({
  imports: [
    AuthModule,
    ProjectModule,
    QuestionBoard,
    QuestionComment,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '10.99.144.4',
      username: 'root',
      password: 'root',
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
        origin: '*',
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

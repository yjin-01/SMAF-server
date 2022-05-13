import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './apis/users/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionBodardModule } from './apis/questionBoards/questionboards.module';

@Module({
  imports: [
    QuestionBodardModule, //
    UserModule, //
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'team-database',
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
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

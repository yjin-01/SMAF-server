import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './apis/users/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    UserModule,
    AuthModule,
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

    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://team-redis:6379',
      isGlobal: true,
    }),
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './typeorm/database.module';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, GraphqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessCategory } from './entities/processCategory.entity';
import { ProcessCategoryResolver } from './processCategory.resolver';
import { ProcessCategoryService } from './processCategory.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessCategory])],
  providers: [
    ProcessCategoryResolver,
    ProcessCategoryService, //
  ],
})
export class ProcessCategoryModule {}

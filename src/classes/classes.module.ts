import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesResolver } from './classes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { StudentEntity } from 'src/students/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassEntity, StudentEntity])],
  providers: [ClassesResolver, ClassesService],
})
export class ClassesModule {}

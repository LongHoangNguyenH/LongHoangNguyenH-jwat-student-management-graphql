import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsResolver } from './students.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from './entities/student.entity';
import { ClassEntity } from 'src/classes/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity, ClassEntity])],
  providers: [StudentsResolver, StudentsService],
})
export class StudentsModule {}

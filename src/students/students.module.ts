import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsResolver } from './students.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from './entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity])],
  providers: [StudentsResolver, StudentsService],
})
export class StudentsModule {}

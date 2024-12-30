import { Resolver } from '@nestjs/graphql';
import { StudentsService } from './students.service';
import { StudentEntity } from './entities/student.entity';

@Resolver(() => StudentEntity)
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) {}
}

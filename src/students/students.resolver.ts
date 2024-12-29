import { Resolver } from '@nestjs/graphql';
import { StudentsService } from './students.service';
import { Student } from './entities/student.entity';

@Resolver(() => Student)
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) {}
}

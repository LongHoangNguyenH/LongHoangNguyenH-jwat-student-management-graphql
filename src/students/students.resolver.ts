import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentsService } from './students.service';
import { StudentEntity } from './entities/student.entity';
import { CreateStudentInput } from './dto/create-student.input';

@Resolver(() => StudentEntity)
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) {}

  @Mutation(() => StudentEntity)
  createStudent(@Args('createStudentInput') createStudentInput: CreateStudentInput) {
    return this.studentsService.createStudent(createStudentInput);
  }

  @Query(() => StudentEntity)
  findOneStudent(@Args('id') id: string) {
    return this.studentsService.findOneStudent(id);
  }

  @Query(() => [StudentEntity])
  findAllStudent() {
    return this.studentsService.findAllStudent();
  }
}

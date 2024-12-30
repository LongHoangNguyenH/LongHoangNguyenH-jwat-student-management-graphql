import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentsService } from './students.service';
import { StudentEntity } from './entities/student.entity';
import { CreateStudentInput } from './dto/create-student.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UpdateStudentInput } from './dto/update-student.input';
import { DeleteMessage } from 'src/common/message/deleteMessage.response';

@Resolver(() => StudentEntity)
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) {}

  @Mutation(() => StudentEntity)
  createStudent(@Args('createStudentInput') createStudentInput: CreateStudentInput) {
    return this.studentsService.createStudent(createStudentInput);
  }

  @Query(() => StudentEntity)
  findOneStudent(@Args('id', ParseUUIDPipe) id: string) {
    return this.studentsService.findOneStudent(id);
  }

  @Query(() => [StudentEntity])
  findAllStudent() {
    return this.studentsService.findAllStudent();
  }

  @Query(() => [StudentEntity])
  findByClassname(@Args('className') className: string) {
    return this.studentsService.findByClassname(className);
  }

  @Query(() => [StudentEntity])
  findLIKEByStudentName(@Args('studentName') studentName: string) {
    return this.studentsService.findLIKEByName(studentName);
  }

  @Mutation(() => StudentEntity)
  updateStudent(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateStudentInput') updateStudentInput: UpdateStudentInput,
  ) {
    return this.studentsService.updateStudent(id, updateStudentInput);
  }

  @Mutation(() => DeleteMessage)
  async removeStudents(@Args('id', ParseUUIDPipe) id: string) {
    return await this.studentsService.removeStudent(id);
  }
}

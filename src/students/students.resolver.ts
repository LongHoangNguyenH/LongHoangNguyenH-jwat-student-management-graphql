import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentsService } from './students.service';
import { StudentEntity } from './entities/student.entity';
import { CreateStudentInput } from './dto/create-student.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { UpdateStudentInput } from './dto/update-student.input';
import { DeleteMessage } from 'src/common/message/deleteMessage.response';
import { Roles } from 'src/common/decorator/role-decorator.decorator';
import { ADMIN, PRINCIPAL, TEACHER } from 'src/common/guard/role';

@Resolver(() => StudentEntity)
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) {}

  @Mutation(() => StudentEntity)
  @Roles(ADMIN, TEACHER)
  createStudent(@Args('createStudentInput') createStudentInput: CreateStudentInput) {
    return this.studentsService.createStudent(createStudentInput);
  }

  @Query(() => StudentEntity)
  @Roles(ADMIN, TEACHER, PRINCIPAL)
  findOneStudent(@Args('id', ParseUUIDPipe) id: string) {
    return this.studentsService.findOneStudent(id);
  }

  @Query(() => [StudentEntity])
  @Roles(ADMIN, TEACHER, PRINCIPAL)
  findAllStudent() {
    return this.studentsService.findAllStudent();
  }

  @Query(() => [StudentEntity])
  @Roles(ADMIN, TEACHER, PRINCIPAL)
  findByClassname(@Args('className') className: string) {
    return this.studentsService.findByClassname(className);
  }

  @Query(() => [StudentEntity])
  @Roles(ADMIN, TEACHER, PRINCIPAL)
  findLIKEByStudentName(@Args('studentName') studentName: string) {
    return this.studentsService.findLIKEByName(studentName);
  }

  @Mutation(() => StudentEntity)
  @Roles(ADMIN, TEACHER)
  updateStudent(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateStudentInput') updateStudentInput: UpdateStudentInput,
  ) {
    return this.studentsService.updateStudent(id, updateStudentInput);
  }

  @Mutation(() => DeleteMessage)
  @Roles(ADMIN, TEACHER)
  async removeStudents(@Args('id', ParseUUIDPipe) id: string) {
    return await this.studentsService.removeStudent(id);
  }
}

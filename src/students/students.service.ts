import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentInput } from './dto/create-student.input';
import { DataSource, Repository } from 'typeorm';
import { StudentEntity } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { STUDENT_EXISTS } from 'src/common/error/constants.error';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentsRepository: Repository<StudentEntity>,
    private readonly datasource: DataSource,
  ) {}
  async createStudent(createStudentInput: CreateStudentInput) {
    const existingStudent = await this.studentsRepository.findOne({
      where: { studentName: createStudentInput.studentName },
    });
    if (existingStudent) {
      throw new BadRequestException(STUDENT_EXISTS);
    }
    const newStudent = new StudentEntity(uuid(), createStudentInput.studentName, createStudentInput.classId);
    return await this.studentsRepository.save(newStudent);
  }

  async findOneStudent(id: string) {
    return await this.datasource
      .getRepository(StudentEntity)
      .createQueryBuilder('student')
      .where('student.id = :id', { id })
      .getOne();
  }

  async findAllStudent() {
    return await this.datasource.getRepository(StudentEntity).createQueryBuilder('student').getMany();
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentInput } from './dto/create-student.input';
import { DataSource, Repository } from 'typeorm';
import { StudentEntity } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CLASS_NOT_FOUND, STUDENT_EXISTS } from 'src/common/error/constants.error';
import { v4 as uuid } from 'uuid';
import { ClassEntity } from 'src/classes/entities/class.entity';

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
    const newStudent = new StudentEntity(
      uuid(),
      createStudentInput.studentName.toLowerCase(),
      createStudentInput.classId,
    );
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

  async findByClassname(className: string) {
    const existingClass = await this.datasource
      .getRepository(ClassEntity)
      .createQueryBuilder('classes')
      .where('classes.className = :className', { className })
      .getOne();
    console.log(existingClass);
    if (!existingClass) {
      throw new BadRequestException(CLASS_NOT_FOUND);
    }
    const searched = await this.datasource
      .getRepository(StudentEntity)
      .createQueryBuilder('students')
      .leftJoin('students.classId', 'Student_with_Class')
      .where('Student_with_Class.className = :className', { className })
      .getMany();
    console.log(searched);
    return searched;
  }

  findLIKEByName(studentName: string) {
    return this.datasource
      .getRepository(StudentEntity)
      .createQueryBuilder('students')
      .where('students.studentName LIKE :studentName', { studentName: `%${studentName.toLowerCase()}%` })
      .getMany();
  }
}

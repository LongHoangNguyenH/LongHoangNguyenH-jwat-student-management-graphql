import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentInput } from './dto/create-student.input';
import { DataSource, Repository } from 'typeorm';
import { StudentEntity } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CLASS_NOT_FOUND, STUDENT_EXISTS, STUDENT_NOT_FOUND } from 'src/common/error/constants.error';
import { v4 as uuid } from 'uuid';
import { ClassEntity } from 'src/classes/entities/class.entity';
import { UpdateStudentInput } from './dto/update-student.input';
import { DeleteMessage } from 'src/common/message/deleteMessage.response';

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
    const newStudent = this.studentsRepository.create({
      id: uuid(),
      studentName: createStudentInput.studentName,
      classId: createStudentInput.classId,
    });
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
    const data = await this.datasource
      .getRepository(StudentEntity)
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.classId', 'class')
      .getMany();

    const result = data.map(student => ({
      id: student.id,
      studentName: student.studentName,
      classId: student.classId['id'],
      className: student.classId['className'],
    }));
    return result;
  }

  async findByClassname(className: string) {
    className = className.toLowerCase();
    const existingClass = await this.datasource
      .getRepository(ClassEntity)
      .createQueryBuilder('classes')
      .where('classes.className = :className', { className })
      .getOne();
    if (!existingClass) {
      throw new BadRequestException(CLASS_NOT_FOUND);
    }
    const data = await this.datasource
      .getRepository(StudentEntity)
      .createQueryBuilder('students')
      .leftJoinAndSelect('students.classId', 'Student_with_Class')
      .where('Student_with_Class.className = :className', { className })
      .getMany();
    return data.map(student => ({
      id: student.id,
      studentName: student.studentName,
      classId: student.classId['id'],
      className: student.classId['className'],
    }));
  }

  async findLIKEByName(studentName: string) {
    studentName = studentName.toLowerCase();
    const data = await this.datasource
      .getRepository(StudentEntity)
      .createQueryBuilder('students')
      .leftJoinAndSelect('students.classId', 'Student_with_Class')
      .where('students.studentName LIKE :studentName', { studentName: `%${studentName.toLowerCase()}%` })
      .getMany();
    return data.map(student => ({
      id: student.id,
      studentName: student.studentName,
      classId: student.classId['id'],
      className: student.classId['className'],
    }));
  }

  async updateStudent(id: string, updateStudentInput: UpdateStudentInput) {
    const existingStudent = await this.studentsRepository.findOne({ where: { id } });
    if (!existingStudent) {
      throw new BadRequestException(STUDENT_NOT_FOUND);
    }

    if (updateStudentInput.studentName == '') {
      updateStudentInput.studentName = existingStudent.studentName;
    } else if (updateStudentInput.classId == '') {
      updateStudentInput.classId = existingStudent.classId;
    }
    Object.assign(existingStudent, updateStudentInput);
    return this.studentsRepository.save(existingStudent);
  }

  async removeStudent(id: string) {
    const existingStudent = await this.studentsRepository.findOne({ where: { id }, relations: ['classId'] });
    if (!existingStudent) {
      throw new BadRequestException(STUDENT_NOT_FOUND);
    }
    await this.studentsRepository.remove(existingStudent);
    return new DeleteMessage('Student deleted successfully');
  }
}

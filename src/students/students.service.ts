import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentInput } from './dto/create-student.input';
import { DataSource, Repository } from 'typeorm';
import { StudentEntity } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { STUDENT_EXISTS, STUDENT_NOT_FOUND } from 'src/common/error/constants.error';
import { v4 as uuid } from 'uuid';
import { ClassEntity } from 'src/classes/entities/class.entity';
import { UpdateStudentInput } from './dto/update-student.input';
import { DeleteMessage } from 'src/common/message/deleteMessage.response';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentsRepository: Repository<StudentEntity>,
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
    private readonly datasource: DataSource,
  ) {}
  async createStudent(createStudentInput: CreateStudentInput) {
    const existingStudent = await this.studentsRepository.findOne({
      where: { studentName: createStudentInput.studentName.toLowerCase() },
    });
    if (existingStudent) {
      throw new BadRequestException(STUDENT_EXISTS);
    }
    const newStudent = this.studentsRepository.create({
      id: uuid(),
      studentName: createStudentInput.studentName.toLowerCase(),
      classId: createStudentInput.classId,
    });
    return await this.studentsRepository.save(newStudent);
  }

  async findOneStudent(id: string) {
    const data = await this.datasource
      .getRepository(StudentEntity)
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.classId', 'class')
      .where('student.id = :id', { id })
      .getOne();
    const result = {
      id: data.id,
      studentName: data.studentName,
      classId: data.classId['id'],
      className: data.classId['className'],
    };
    return result;
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
    const students = await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.classId', 'class')
      .getMany();
    const result = students.map(student => ({
      id: student.id,
      studentName: student.studentName,
      classId: student.classId['id'],
      className: student.classId['className'],
    }));
    console.log('result', result);
    const final = [];
    result.forEach(element => {
      if (element.className.toLowerCase() == className) {
        final.push(element);
      }
    });
    return final;
  }

  async findLIKEByName(studentName: string) {
    studentName = studentName.toLowerCase();
    const students = await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.classId', 'class')
      .getMany();
    const result = students.map(student => ({
      id: student.id,
      studentName: student.studentName,
      classId: student.classId['id'],
      className: student.classId['className'],
    }));
    console.log('result', result);
    const final = [];
    result.forEach(element => {
      if (element.studentName.toLowerCase().includes(studentName)) {
        final.push(element);
      }
    });
    return final;
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

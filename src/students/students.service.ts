import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentInput } from './dto/create-student.input';
import { DataSource, ILike, Repository } from 'typeorm';
import { StudentEntity } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CLASS_NOT_FOUND, STUDENT_EXISTS, STUDENT_NOT_FOUND } from 'src/common/error/constants.error';
import { v4 as uuid } from 'uuid';
import { ClassEntity } from 'src/classes/entities/class.entity';
import { UpdateStudentInput } from './dto/update-student.input';

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
    const existingClass = await this.classRepository.findOne({
      where: { id: createStudentInput.classId },
    });
    if (!existingClass) {
      throw new BadRequestException(CLASS_NOT_FOUND);
    }
    const existingStudent = await this.studentsRepository.findOne({
      where: { studentName: createStudentInput.studentName.toLowerCase() },
    });
    if (existingStudent) {
      throw new BadRequestException(STUDENT_EXISTS);
    }
    const newStudent = this.studentsRepository.create({
      id: uuid(),
      studentName: createStudentInput.studentName.toLowerCase(),
      cls: {
        id: createStudentInput.classId,
      },
    });
    return await this.studentsRepository.save(newStudent);
  }

  async findOneStudent(id: string) {
    const student = await this.studentsRepository.findOne({ where: { id } });
    if (!student) {
      throw new BadRequestException(STUDENT_NOT_FOUND);
    }
    return student;
  }

  async findAllStudent() {
    return await this.studentsRepository.find({ order: { studentName: 'ASC' } });
  }

  async findByClassname(className: string) {
    className = className.toLowerCase();
    const existingClass = await this.classRepository.find({ where: { className } });
    if (!existingClass) {
      throw new BadRequestException(CLASS_NOT_FOUND);
    }
    return await this.studentsRepository.find({
      where: {
        cls: {
          className: className,
        },
      },
      order: { studentName: 'ASC' },
    });
  }

  async findLIKEByName(studentName: string) {
    studentName = studentName.toLowerCase();
    return this.studentsRepository.find({
      where: {
        studentName: ILike(`%${studentName}%`),
      },
    });
  }

  async updateStudent(id: string, updateStudentInput: UpdateStudentInput) {
    const existingStudent = await this.studentsRepository.findOne({ where: { id } });
    if (!existingStudent) {
      throw new BadRequestException(STUDENT_NOT_FOUND);
    }
    if (updateStudentInput.classId == '') {
      updateStudentInput.classId = existingStudent.cls.id;
    }
    if (updateStudentInput.studentName == '') {
      updateStudentInput.studentName = existingStudent.studentName;
    }
    Object.assign(existingStudent, updateStudentInput);
    return this.studentsRepository.save(existingStudent);
  }

  async removeStudent(id: string) {
    const existingStudent = await this.studentsRepository.findOne({ where: { id } });
    if (!existingStudent) {
      throw new BadRequestException(STUDENT_NOT_FOUND);
    }
    await this.studentsRepository.remove(existingStudent);
    return existingStudent;
  }
}

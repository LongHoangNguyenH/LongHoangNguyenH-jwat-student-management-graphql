import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassInput } from './dto/create-class.input';
import { ClassEntity } from './entities/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CLASS_EXISTS, CLASS_EXISTS_STUDENT, CLASS_NOT_FOUND } from 'src/common/error/constants.error';
import { v4 as uuidv4 } from 'uuid';
import { UpdateClassInput } from './dto/update-class.input';
import { StudentEntity } from 'src/students/entities/student.entity';
@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classesRepository: Repository<ClassEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentsRepository: Repository<StudentEntity>,
    private readonly datasource: DataSource,
  ) {}

  async createClass(args: CreateClassInput): Promise<ClassEntity> {
    const existingClass = await this.classesRepository.findOne({
      where: { className: args.className.toLowerCase() },
    });
    if (existingClass) {
      throw new BadRequestException(CLASS_EXISTS);
    }
    const newClass = this.classesRepository.create({
      id: uuidv4(),
      className: args.className.toLowerCase(),
    });

    return await this.classesRepository.save(newClass);
  }

  async findOneClass(id: string): Promise<ClassEntity> {
    return await this.classesRepository.findOne({ where: { id } });
  }

  async findAllClasses(): Promise<ClassEntity[]> {
    return await this.classesRepository.find({ order: { className: 'ASC' } });
  }

  async updateClass(id: string, updateClassInput: UpdateClassInput) {
    const currentClass = await this.classesRepository.findOne({ where: { id } });
    if (!currentClass) {
      throw new BadRequestException(CLASS_NOT_FOUND);
    }
    if (updateClassInput.className == '') {
      updateClassInput.className = currentClass.className;
    } else {
      currentClass.className = updateClassInput.className;
    }
    return this.datasource.getRepository(ClassEntity).save(currentClass);
  }

  async removeClass(id: string) {
    const currentClass = await this.classesRepository.findOne({ where: { id } });
    if (!currentClass) {
      throw new BadRequestException(CLASS_NOT_FOUND);
    }
    const IsstudentsInClass = await this.studentsRepository.findOne({
      where: { cls: { id } },
    });
    if (IsstudentsInClass) {
      throw new BadRequestException(CLASS_EXISTS_STUDENT);
    }
    await this.classesRepository.delete(id);
    return currentClass;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassInput } from './dto/create-class.input';
import { ClassEntity } from './entities/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CLASS_EXISTS, CLASS_EXISTS_STUDENT, CLASS_NOT_FOUND } from 'src/common/error/constants.error';
import { v4 as uuidv4 } from 'uuid';
import { UpdateClassInput } from './dto/update-class.input';
import { StudentEntity } from 'src/students/entities/student.entity';
import { DeleteMessage } from 'src/common/message/deleteMessage.response';
@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classesRepository: Repository<ClassEntity>,
    private readonly datasource: DataSource,
  ) {}

  async create(args: CreateClassInput): Promise<ClassEntity> {
    const existingClass = await this.classesRepository.findOne({
      where: { className: args.className },
    });
    if (existingClass) {
      throw new BadRequestException(CLASS_EXISTS);
    }
    const newClass = new ClassEntity(uuidv4(), args.className.toLowerCase());

    return await this.classesRepository.save(newClass);
  }

  async findOne(id: string): Promise<ClassEntity> {
    return await this.datasource
      .getRepository(ClassEntity)
      .createQueryBuilder('class')
      .where('class.id = :id', { id })
      .getOne();
  }

  async findAll(): Promise<ClassEntity[]> {
    return await this.datasource.getRepository(ClassEntity).createQueryBuilder('class').getMany();
  }

  async update(id: string, updateClassInput: UpdateClassInput) {
    const currentClass = await this.datasource
      .getRepository(ClassEntity)
      .createQueryBuilder('class')
      .where('class.id = :id', { id })
      .getOne();

    if (!currentClass) {
      throw new BadRequestException(CLASS_NOT_FOUND);
    }
    if (updateClassInput.className == '') {
      updateClassInput.className = currentClass.className;
    }
    currentClass.className = updateClassInput.className.toLowerCase();
    return this.datasource.getRepository(ClassEntity).save(currentClass);
  }

  async remove(id: string) {
    const currentClass = await this.datasource
      .getRepository(ClassEntity)
      .createQueryBuilder('class')
      .where('class.id = :id', { id })
      .getOne();
    if (!currentClass) {
      throw new BadRequestException(CLASS_NOT_FOUND);
    }
    const studentsLengthInClass = await this.datasource
      .getRepository(StudentEntity)
      .createQueryBuilder('students')
      .where('students.classId = :id', { id: id })
      .getCount();
    if (studentsLengthInClass > 0) {
      throw new BadRequestException(CLASS_EXISTS_STUDENT);
    }
    await this.datasource
      .getRepository(ClassEntity)
      .createQueryBuilder('classes')
      .delete()
      .where('classes.id = :id', { id })
      .execute();
    return new DeleteMessage('Class deleted successfully');
  }
}

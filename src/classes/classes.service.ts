import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassInput } from './dto/create-class.input';
import { ClassEntity } from './entities/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CLASS_EXISTS } from 'src/common/error/constants.error';
import { v4 as uuidv4 } from 'uuid';
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
    const newClass = new ClassEntity(uuidv4(), args.className);

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
}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClassesService } from './classes.service';
import { ClassEntity } from './entities/class.entity';
import { CreateClassInput } from './dto/create-class.input';

@Resolver(() => ClassEntity)
export class ClassesResolver {
  constructor(private readonly classesService: ClassesService) {}

  @Mutation(() => ClassEntity)
  async create(@Args('createClassInput') createClassInput: CreateClassInput): Promise<ClassEntity> {
    return await this.classesService.create(createClassInput);
  }

  @Query(() => ClassEntity)
  async findOne(@Args('id', { type: () => String }) id: string): Promise<ClassEntity> {
    return await this.classesService.findOne(id);
  }

  @Query(() => [ClassEntity])
  async findAll(): Promise<ClassEntity[]> {
    return await this.classesService.findAll();
  }
}

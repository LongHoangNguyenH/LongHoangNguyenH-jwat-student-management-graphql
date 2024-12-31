import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClassesService } from './classes.service';
import { ClassEntity } from './entities/class.entity';
import { CreateClassInput } from './dto/create-class.input';
import { UpdateClassInput } from './dto/update-class.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { DeleteMessage } from 'src/common/message/deleteMessage.response';
import { Roles } from 'src/common/decorator/role-decorator.decorator';
import { ADMIN, PRINCIPAL, TEACHER } from 'src/common/guard/role';

@Resolver(() => ClassEntity)
export class ClassesResolver {
  constructor(private readonly classesService: ClassesService) {}

  @Mutation(() => ClassEntity)
  @Roles(ADMIN, PRINCIPAL)
  async create(@Args('createClassInput') createClassInput: CreateClassInput): Promise<ClassEntity> {
    return await this.classesService.create(createClassInput);
  }

  @Query(() => ClassEntity)
  @Roles(ADMIN, PRINCIPAL, TEACHER)
  async findOne(@Args('id', { type: () => String }, ParseUUIDPipe) id: string): Promise<ClassEntity> {
    return await this.classesService.findOne(id);
  }

  @Query(() => [ClassEntity])
  @Roles(ADMIN, PRINCIPAL, TEACHER)
  async findAll(): Promise<ClassEntity[]> {
    return await this.classesService.findAll();
  }

  @Mutation(() => ClassEntity)
  @Roles(ADMIN, PRINCIPAL)
  async update(@Args('id', ParseUUIDPipe) id: string, @Args('updateClassInput') updateClassInput: UpdateClassInput) {
    return await this.classesService.update(id, updateClassInput);
  }

  @Mutation(() => DeleteMessage)
  @Roles(ADMIN, PRINCIPAL)
  async remove(@Args('id', ParseUUIDPipe) id: string) {
    return await this.classesService.remove(id);
  }
}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClassesService } from './classes.service';
import { ClassEntity } from './entities/class.entity';
import { CreateClassInput } from './dto/create-class.input';
import { UpdateClassInput } from './dto/update-class.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { Roles } from 'src/common/decorator/role-decorator.decorator';
import { ADMIN, PRINCIPAL, TEACHER } from 'src/common/guard/role';

@Resolver(() => ClassEntity)
export class ClassesResolver {
  constructor(private readonly classesService: ClassesService) {}

  @Mutation(() => ClassEntity)
  @Roles(ADMIN, PRINCIPAL)
  async createClass(@Args('createClassInput') createClassInput: CreateClassInput): Promise<ClassEntity> {
    return await this.classesService.createClass(createClassInput);
  }

  @Query(() => ClassEntity)
  @Roles(ADMIN, PRINCIPAL, TEACHER)
  async findOneClass(@Args('id', { type: () => String }, ParseUUIDPipe) id: string): Promise<ClassEntity> {
    return await this.classesService.findOneClass(id);
  }

  @Query(() => [ClassEntity])
  @Roles(ADMIN, PRINCIPAL, TEACHER)
  async findAllClasses(): Promise<ClassEntity[]> {
    return await this.classesService.findAllClasses();
  }

  @Mutation(() => ClassEntity)
  @Roles(ADMIN, PRINCIPAL)
  async updateClass(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('updateClassInput') updateClassInput: UpdateClassInput,
  ) {
    return await this.classesService.updateClass(id, updateClassInput);
  }

  @Mutation(() => ClassEntity)
  @Roles(ADMIN, PRINCIPAL)
  async removeClass(@Args('id', ParseUUIDPipe) id: string) {
    return await this.classesService.removeClass(id);
  }
}

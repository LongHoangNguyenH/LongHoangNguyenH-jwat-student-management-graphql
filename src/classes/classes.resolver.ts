import { Resolver } from '@nestjs/graphql';
import { ClassesService } from './classes.service';
import { ClassEntity } from './entities/class.entity';

@Resolver(() => ClassEntity)
export class ClassesResolver {
  constructor(private readonly classesService: ClassesService) {}
}

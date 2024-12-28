import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('classes')
export class ClassEntity {
  @Field(() => String)
  @PrimaryColumn()
  id: string;

  @Field(() => String)
  @Column({ unique: true, nullable: false })
  className: string;
}

import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('classes')
export class ClassEntity {
  constructor(id: string, className: string) {
    this.id = id;
    this.className = className;
  }

  @Field(() => String)
  @PrimaryColumn()
  id: string;

  @Field(() => String)
  @Column({ unique: true, nullable: false })
  className: string;
}

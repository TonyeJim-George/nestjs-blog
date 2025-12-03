import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { fileTypes } from './enum/file-type.enum';

@Entity()
export class Upload {

 @PrimaryGeneratedColumn() 
 id: number;

 @Column({
  type: 'varchar',
  length: 1024,
  nullable: false,
 })
 name: string;

 @Column({
  type: 'varchar',
  length: 1024,
  nullable: false,
 })
 path: string;

 @Column({
  type: 'enum',
  enum: fileTypes,
  default: fileTypes.IMAGE,
  nullable: false,
 })
 type: string;

 @Column({
  type: 'varchar',
  length: 1024,
  nullable: false,
 })
 mime: string;

 @Column({
  type: 'varchar',
  length: 1024,
  nullable: false,
 })
 size: number;

 @CreateDateColumn()
 createdAt: Date;

 @UpdateDateColumn()
 updatedAt: Date;
}